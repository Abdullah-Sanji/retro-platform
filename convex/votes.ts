import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Cast a vote on a card or group
export const castVote = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    targetType: v.union(v.literal("card"), v.literal("group")),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify session is in voting phase
    if (session.phase !== "voting") {
      throw new Error("Voting is not active");
    }

    // Check if user has already voted on this target
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_session", (q) =>
        q.eq("userId", args.userId).eq("sessionId", args.sessionId)
      )
      .filter((q) => q.eq(q.field("targetId"), args.targetId))
      .first();

    if (existingVote) {
      throw new Error("Already voted on this item");
    }

    // Count user's total votes in this session
    const userVotes = await ctx.db
      .query("votes")
      .withIndex("by_user_session", (q) =>
        q.eq("userId", args.userId).eq("sessionId", args.sessionId)
      )
      .collect();

    // Check if session has vote limits (Pro tier has unlimited votes)
    const facilitator = await ctx.db.get(session.facilitatorId);
    if (facilitator && !facilitator.isAnonymous) {
      const subscriptionStatus = facilitator.subscriptionStatus || "free";

      // Pro tier has unlimited votes, free tier respects votesPerUser limit
      if (subscriptionStatus === "free" && userVotes.length >= session.votesPerUser) {
        throw new Error(`Maximum ${session.votesPerUser} votes allowed. Upgrade to Pro for unlimited votes!`);
      }
    } else {
      // For anonymous facilitators, enforce the session's votesPerUser limit
      if (userVotes.length >= session.votesPerUser) {
        throw new Error(`Maximum ${session.votesPerUser} votes allowed`);
      }
    }

    // Verify target exists
    if (args.targetType === "card") {
      const card = await ctx.db.get(args.targetId as any);
      if (!card || card.sessionId !== args.sessionId) {
        throw new Error("Invalid card");
      }
    } else {
      const group = await ctx.db.get(args.targetId as any);
      if (!group || group.sessionId !== args.sessionId) {
        throw new Error("Invalid group");
      }
    }

    const voteId = await ctx.db.insert("votes", {
      sessionId: args.sessionId,
      userId: args.userId,
      targetType: args.targetType,
      targetId: args.targetId,
      createdAt: Date.now(),
    });

    return { voteId };
  },
});

// Remove a vote
export const removeVote = mutation({
  args: {
    voteId: v.id("votes"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db.get(args.voteId);
    if (!vote) throw new Error("Vote not found");

    // Verify user owns this vote
    if (vote.userId !== args.userId) {
      throw new Error("Cannot remove another user's vote");
    }

    const session = await ctx.db.get(vote.sessionId);
    if (!session || session.phase !== "voting") {
      throw new Error("Cannot remove votes outside voting phase");
    }

    await ctx.db.delete(args.voteId);
    return { success: true };
  },
});

// Get user's remaining votes
export const getRemainingVotes = query({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    const userVotes = await ctx.db
      .query("votes")
      .withIndex("by_user_session", (q) =>
        q.eq("userId", args.userId).eq("sessionId", args.sessionId)
      )
      .collect();

    // Check if Pro tier (unlimited votes)
    const facilitator = await ctx.db.get(session.facilitatorId);
    let isUnlimited = false;

    if (facilitator && !facilitator.isAnonymous) {
      const subscriptionStatus = facilitator.subscriptionStatus || "free";
      isUnlimited = subscriptionStatus === "pro";
    }

    return {
      used: userVotes.length,
      total: isUnlimited ? Infinity : session.votesPerUser,
      remaining: isUnlimited ? Infinity : session.votesPerUser - userVotes.length,
      votes: userVotes,
      isUnlimited,
    };
  },
});

// Get vote results (sorted by count)
export const getVoteResults = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Count votes per target
    const voteCounts = new Map<string, { count: number; type: string }>();

    for (const vote of votes) {
      const current = voteCounts.get(vote.targetId) || {
        count: 0,
        type: vote.targetType,
      };
      voteCounts.set(vote.targetId, {
        count: current.count + 1,
        type: vote.targetType,
      });
    }

    // Convert to sorted array
    const results = Array.from(voteCounts.entries())
      .map(([targetId, data]) => ({
        targetId,
        targetType: data.type,
        voteCount: data.count,
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    return results;
  },
});