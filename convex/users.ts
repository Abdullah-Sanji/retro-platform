import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Create or get authenticated user from Clerk
export const syncClerkUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by clerkId
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update name/email if changed
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
      });
      return { userId: existingUser._id };
    }

    // Create new authenticated user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      isAnonymous: false,
      clerkId: args.clerkId,
      subscriptionStatus: "free",
      sessionsCreatedThisMonth: 0,
      currentPeriodStart: Date.now(),
      createdAt: Date.now(),
    });

    return { userId };
  },
});

// Get current user by Clerk ID
export const getCurrentUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Create a new user (anonymous or authenticated)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by email
    if (args.email) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingUser) {
        return { userId: existingUser._id };
      }
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      isAnonymous: args.isAnonymous,
      createdAt: Date.now(),
    });

    return { userId };
  },
});

// Internal mutation to reset monthly usage counters (called by cron)
export const resetMonthlyUsage = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const now = Date.now();

    for (const user of users) {
      if (!user.isAnonymous) {
        await ctx.db.patch(user._id, {
          sessionsCreatedThisMonth: 0,
          currentPeriodStart: now,
        });
      }
    }

    return { usersReset: users.filter(u => !u.isAnonymous).length };
  },
});