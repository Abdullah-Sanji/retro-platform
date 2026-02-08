import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Create a new card
export const createCard = mutation({
  args: {
    sessionId: v.id("sessions"),
    columnId: v.id("columns"),
    authorId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify session is in collecting or grouping phase
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.phase !== "collecting" && session.phase !== "grouping") {
      throw new Error("Cannot add cards in current phase");
    }

    // Check participant limits for free tier
    const facilitator = await ctx.db.get(session.facilitatorId);
    if (facilitator && !facilitator.isAnonymous) {
      const subscriptionStatus = facilitator.subscriptionStatus || "free";

      // Free tier has 5 participant limit
      if (subscriptionStatus === "free") {
        const cards = await ctx.db
          .query("cards")
          .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
          .collect();

        const uniqueUsers = new Set(cards.map(card => card.authorId));

        // Check if this is a new user trying to join
        if (!uniqueUsers.has(args.authorId) && uniqueUsers.size >= 5) {
          throw new Error("This session has reached the maximum of 5 participants (Free tier limit). The facilitator needs to upgrade to Pro for unlimited participants.");
        }
      }
    }

    const now = Date.now();
    const cardId = await ctx.db.insert("cards", {
      sessionId: args.sessionId,
      columnId: args.columnId,
      authorId: args.authorId,
      text: args.text,
      createdAt: now,
      updatedAt: now,
    });

    return { cardId };
  },
});

// Update card text (author only)
export const updateCard = mutation({
  args: {
    cardId: v.id("cards"),
    userId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    // Verify user is the author
    if (card.authorId !== args.userId) {
      throw new Error("Only card author can edit");
    }

    // Verify session phase
    const session = await ctx.db.get(card.sessionId);
    if (!session || (session.phase !== "collecting" && session.phase !== "grouping")) {
      throw new Error("Cannot edit cards in current phase");
    }

    await ctx.db.patch(args.cardId, {
      text: args.text,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete card (author only)
export const deleteCard = mutation({
  args: {
    cardId: v.id("cards"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    // Verify user is the author
    if (card.authorId !== args.userId) {
      throw new Error("Only card author can delete");
    }

    // Delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_target", (q) => q.eq("targetId", args.cardId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.delete(args.cardId);
    return { success: true };
  },
});

// Move card to group (during grouping phase)
export const moveCardToGroup = mutation({
  args: {
    cardId: v.id("cards"),
    groupId: v.optional(v.id("groups")), // null to ungroup
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    const session = await ctx.db.get(card.sessionId);
    if (!session || session.phase !== "grouping") {
      throw new Error("Can only group cards during grouping phase");
    }

    // Verify group belongs to same session if provided
    if (args.groupId) {
      const group = await ctx.db.get(args.groupId);
      if (!group || group.sessionId !== card.sessionId) {
        throw new Error("Invalid group");
      }
    }

    await ctx.db.patch(args.cardId, {
      groupId: args.groupId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});