import { v } from "convex/values";
import { mutation } from "./_generated/server";

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