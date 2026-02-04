import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Create a new group
export const createGroup = mutation({
  args: {
    sessionId: v.id("sessions"),
    columnId: v.id("columns"),
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.phase !== "grouping") {
      throw new Error("Can only create groups during grouping phase");
    }

    const groupId = await ctx.db.insert("groups", {
      sessionId: args.sessionId,
      columnId: args.columnId,
      title: args.title,
      createdBy: args.userId,
      createdAt: Date.now(),
    });

    return { groupId };
  },
});

// Update group title
export const updateGroup = mutation({
  args: {
    groupId: v.id("groups"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");

    const session = await ctx.db.get(group.sessionId);
    if (!session || session.phase !== "grouping") {
      throw new Error("Cannot edit groups outside grouping phase");
    }

    await ctx.db.patch(args.groupId, {
      title: args.title,
    });

    return { success: true };
  },
});

// Delete a group (ungroups all cards)
export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");

    const session = await ctx.db.get(group.sessionId);
    if (!session || session.phase !== "grouping") {
      throw new Error("Cannot delete groups outside grouping phase");
    }

    // Ungroup all cards in this group
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const card of cards) {
      await ctx.db.patch(card._id, { groupId: undefined });
    }

    // Delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_target", (q) => q.eq("targetId", args.groupId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.delete(args.groupId);
    return { success: true };
  },
});