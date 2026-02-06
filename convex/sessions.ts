import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

// Usage limits by subscription tier
const USAGE_LIMITS = {
  free: 5,
  pro: Infinity,
  team: Infinity,
};

// Template configurations
const TEMPLATES = {
  start_stop_continue: [
    { title: "Start", color: "bg-green-100" },
    { title: "Stop", color: "bg-red-100" },
    { title: "Continue", color: "bg-blue-100" },
  ],
  mad_sad_glad: [
    { title: "Mad", color: "bg-red-100" },
    { title: "Sad", color: "bg-yellow-100" },
    { title: "Glad", color: "bg-green-100" },
  ],
  went_well_to_improve_actions: [
    { title: "Went Well", color: "bg-green-100" },
    { title: "To Improve", color: "bg-orange-100" },
    { title: "Action Items", color: "bg-purple-100" },
  ],
};

// Create a new retrospective session
export const createSession = mutation({
  args: {
    title: v.string(),
    teamName: v.string(),
    facilitatorId: v.id("users"),
    templateType: v.union(
      v.literal("start_stop_continue"),
      v.literal("mad_sad_glad"),
      v.literal("went_well_to_improve_actions"),
      v.literal("custom")
    ),
    customColumns: v.optional(v.array(v.string())),
    votesPerUser: v.optional(v.number()),
    timerDuration: v.optional(v.number()), // Timer duration in minutes
  },
  handler: async (ctx, args) => {
    const shareLink = `retro-${nanoid(8)}`;
    const now = Date.now();

    // Check usage limits
    const facilitator = await ctx.db.get(args.facilitatorId);
    if (!facilitator) throw new Error("Facilitator not found");

    if (!facilitator.isAnonymous) {
      const subscriptionStatus = facilitator.subscriptionStatus || "free";
      const limit = USAGE_LIMITS[subscriptionStatus];
      const used = facilitator.sessionsCreatedThisMonth || 0;

      if (used >= limit) {
        throw new Error(`Monthly session limit reached (${limit} sessions). Please upgrade your plan.`);
      }

      // Increment session count
      await ctx.db.patch(args.facilitatorId, {
        sessionsCreatedThisMonth: used + 1,
      });
    }

    // Don't auto-start timer - facilitator will start it manually
    const timerEndsAt = undefined;

    // Create session
    const sessionId = await ctx.db.insert("sessions", {
      title: args.title,
      teamName: args.teamName,
      facilitatorId: args.facilitatorId,
      templateType: args.templateType,
      customColumns: args.customColumns,
      shareLink,
      phase: "collecting",
      votesPerUser: args.votesPerUser ?? 3,
      timerDuration: args.timerDuration,
      timerEndsAt,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create columns based on template
    const columns =
      args.templateType === "custom" && args.customColumns
        ? args.customColumns.map((title, i) => ({
            title,
            color: `bg-${["blue", "green", "purple", "orange"][i % 4]}-100`,
          }))
        : TEMPLATES[args.templateType];

    for (let i = 0; i < columns.length; i++) {
      await ctx.db.insert("columns", {
        sessionId,
        title: columns[i].title,
        color: columns[i].color,
        order: i,
      });
    }

    return { sessionId, shareLink };
  },
});

// Get session by share link
export const getSessionByLink = query({
  args: { shareLink: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_shareLink", (q) => q.eq("shareLink", args.shareLink))
      .first();

    if (!session) return null;

    const facilitator = await ctx.db.get(session.facilitatorId);
    
    return {
      ...session,
      facilitator: facilitator ? { name: facilitator.name } : null,
    };
  },
});

// Get session details with all data
export const getSessionDetails = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    // Get columns
    const columns = await ctx.db
      .query("columns")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Get cards
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Get groups
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Get votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Get action items
    const actionItems = await ctx.db
      .query("actionItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Enrich cards with author info
    const enrichedCards = await Promise.all(
      cards.map(async (card) => {
        const author = await ctx.db.get(card.authorId);
        return {
          ...card,
          author: author ? { name: author.name, isAnonymous: author.isAnonymous } : null,
          voteCount: votes.filter(
            (v) => v.targetType === "card" && v.targetId === card._id
          ).length,
        };
      })
    );

    // Enrich groups with vote counts
    const enrichedGroups = groups.map((group) => ({
      ...group,
      voteCount: votes.filter(
        (v) => v.targetType === "group" && v.targetId === group._id
      ).length,
    }));

    return {
      session,
      columns: columns.sort((a, b) => a.order - b.order),
      cards: enrichedCards,
      groups: enrichedGroups,
      votes,
      actionItems,
    };
  },
});

// Update session phase (facilitator only)
export const updatePhase = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    phase: v.union(
      v.literal("collecting"),
      v.literal("grouping"),
      v.literal("voting"),
      v.literal("discussion"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is facilitator
    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can change phase");
    }

    await ctx.db.patch(args.sessionId, {
      phase: args.phase,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// End session (facilitator only)
export const endSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can end session");
    }

    await ctx.db.patch(args.sessionId, {
      isActive: false,
      phase: "completed",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Start timer (facilitator only)
export const startTimer = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can control timer");
    }

    if (!session.timerDuration) {
      throw new Error("Timer duration not set for this session");
    }

    const now = Date.now();
    const timerEndsAt = now + (session.timerDuration * 60 * 1000);

    await ctx.db.patch(args.sessionId, {
      timerEndsAt,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Stop timer (facilitator only)
export const stopTimer = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can control timer");
    }

    await ctx.db.patch(args.sessionId, {
      timerEndsAt: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Restart timer (facilitator only)
export const restartTimer = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.facilitatorId !== args.userId) {
      throw new Error("Only facilitator can control timer");
    }

    if (!session.timerDuration) {
      throw new Error("Timer duration not set for this session");
    }

    const now = Date.now();
    const timerEndsAt = now + (session.timerDuration * 60 * 1000);

    await ctx.db.patch(args.sessionId, {
      timerEndsAt,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Check if user can create a session based on usage limits
export const canCreateSession = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return { canCreate: false, reason: "User not found" };

    // Anonymous users can't create sessions
    if (user.isAnonymous) {
      return { canCreate: false, reason: "Please sign in to create sessions" };
    }

    const subscriptionStatus = user.subscriptionStatus || "free";
    const limit = USAGE_LIMITS[subscriptionStatus];
    const used = user.sessionsCreatedThisMonth || 0;

    if (used >= limit) {
      return {
        canCreate: false,
        reason: `You've reached your monthly limit of ${limit} sessions. Upgrade to create more!`,
        limit,
        used,
      };
    }

    return {
      canCreate: true,
      limit,
      used,
    };
  },
});

// Get user usage stats
export const getUserUsage = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const subscriptionStatus = user.subscriptionStatus || "free";
    const limit = USAGE_LIMITS[subscriptionStatus];
    const used = user.sessionsCreatedThisMonth || 0;

    return {
      subscriptionStatus,
      limit,
      used,
      remaining: limit === Infinity ? Infinity : Math.max(0, limit - used),
    };
  },
});

// Get all sessions created by a user
export const getUserSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_facilitator", (q) => q.eq("facilitatorId", args.userId))
      .order("desc")
      .collect();

    return sessions;
  },
});