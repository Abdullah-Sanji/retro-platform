import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Convert card/group to action item (facilitator only)
export const createActionItem = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    sourceType: v.union(v.literal("card"), v.literal("group")),
    sourceId: v.string(),
    title: v.string(),
    ownerId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is facilitator
    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can create action items");
    }

    // Verify source exists
    if (args.sourceType === "card") {
      const card = await ctx.db.get(args.sourceId as any);
      if (!card || card.sessionId !== args.sessionId) {
        throw new Error("Invalid card");
      }
    } else {
      const group = await ctx.db.get(args.sourceId as any);
      if (!group || group.sessionId !== args.sessionId) {
        throw new Error("Invalid group");
      }
    }

    const now = Date.now();
    const actionItemId = await ctx.db.insert("actionItems", {
      sessionId: args.sessionId,
      sourceType: args.sourceType,
      sourceId: args.sourceId,
      title: args.title,
      ownerId: args.ownerId,
      dueDate: args.dueDate,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    return { actionItemId };
  },
});

// Update action item
export const updateActionItem = mutation({
  args: {
    actionItemId: v.id("actionItems"),
    userId: v.id("users"),
    title: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
    status: v.optional(
      v.union(v.literal("open"), v.literal("in_progress"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    const actionItem = await ctx.db.get(args.actionItemId);
    if (!actionItem) throw new Error("Action item not found");

    const session = await ctx.db.get(actionItem.sessionId);
    if (!session) throw new Error("Session not found");

    const isFacilitatorOrOwner =
      session.facilitatorId === args.userId ||
      actionItem.ownerId === args.userId;

    // Check if user is trying to update fields other than status
    const isUpdatingOtherFields =
      args.title !== undefined ||
      args.ownerId !== undefined ||
      args.dueDate !== undefined;

    // Only facilitator or owner can update fields other than status
    if (isUpdatingOtherFields && !isFacilitatorOrOwner) {
      throw new Error("Only facilitator or owner can update action item details");
    }

    // Anyone can update just the status
    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.ownerId !== undefined) updates.ownerId = args.ownerId;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.actionItemId, updates);
    return { success: true };
  },
});

// Delete action item (facilitator only)
export const deleteActionItem = mutation({
  args: {
    actionItemId: v.id("actionItems"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const actionItem = await ctx.db.get(args.actionItemId);
    if (!actionItem) throw new Error("Action item not found");

    const session = await ctx.db.get(actionItem.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is facilitator
    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can delete action items");
    }

    await ctx.db.delete(args.actionItemId);
    return { success: true };
  },
});

// Bulk create AI-generated action items (facilitator only)
export const bulkCreateActionItems = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    items: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        priority: v.optional(v.string()),
        category: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is facilitator
    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can create action items");
    }

    const now = Date.now();
    const actionItemIds = [];

    for (const item of args.items) {
      // Create title with metadata if available
      let fullTitle = item.title;
      if (item.description) {
        fullTitle = `${item.title} - ${item.description}`;
      }

      const actionItemId = await ctx.db.insert("actionItems", {
        sessionId: args.sessionId,
        sourceType: "card",
        sourceId: "", // AI-generated, no specific source
        title: fullTitle,
        status: "open",
        createdAt: now,
        updatedAt: now,
      });
      actionItemIds.push(actionItemId);
    }

    return { actionItemIds, count: actionItemIds.length };
  },
});