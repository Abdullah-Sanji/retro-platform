import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - supports both anonymous and authenticated users
  users: defineTable({
    name: v.string(), // Display name
    email: v.optional(v.string()), // For authenticated users
    isAnonymous: v.boolean(),
    // Authentication fields
    clerkId: v.optional(v.string()), // Clerk user ID
    // Subscription fields
    subscriptionStatus: v.optional(
      v.union(
        v.literal("free"),
        v.literal("pro")
      )
    ),
    subscriptionId: v.optional(v.string()), // Stripe subscription ID
    customerId: v.optional(v.string()), // Stripe customer ID
    // Usage tracking
    sessionsCreatedThisMonth: v.optional(v.number()),
    currentPeriodStart: v.optional(v.number()), // Timestamp
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  // Retrospective sessions
  sessions: defineTable({
    title: v.string(),
    teamName: v.string(),
    facilitatorId: v.id("users"),
    templateType: v.union(
      v.literal("start_stop_continue"),
      v.literal("mad_sad_glad"),
      v.literal("went_well_to_improve_actions"),
      v.literal("custom")
    ),
    customColumns: v.optional(v.array(v.string())), // For custom template
    shareLink: v.string(), // Unique shareable link
    phase: v.union(
      v.literal("setup"),
      v.literal("collecting"), // Adding cards
      v.literal("grouping"),
      v.literal("voting"),
      v.literal("discussion"),
      v.literal("completed")
    ),
    votesPerUser: v.number(), // Default: 3
    timerDuration: v.optional(v.number()), // Timer duration in minutes (null = no timer)
    timerEndsAt: v.optional(v.number()), // Timestamp when timer ends
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_shareLink", ["shareLink"])
    .index("by_facilitator", ["facilitatorId"])
    .index("by_active", ["isActive"]),

  // Columns for each session (generated from template)
  columns: defineTable({
    sessionId: v.id("sessions"),
    title: v.string(),
    color: v.string(), // Tailwind color class
    order: v.number(), // Display order
  }).index("by_session", ["sessionId", "order"]),

  // Cards within columns
  cards: defineTable({
    sessionId: v.id("sessions"),
    columnId: v.id("columns"),
    groupId: v.optional(v.id("groups")), // null if ungrouped
    authorId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_column", ["columnId"])
    .index("by_group", ["groupId"])
    .index("by_author", ["authorId"]),

  // Groups for organizing similar cards
  groups: defineTable({
    sessionId: v.id("sessions"),
    columnId: v.id("columns"),
    title: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_column", ["columnId"]),

  // Votes on cards or groups
  votes: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    targetType: v.union(v.literal("card"), v.literal("group")),
    targetId: v.string(), // Card or Group ID
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user_session", ["userId", "sessionId"])
    .index("by_target", ["targetId"]),

  // Action items converted from top cards/groups
  actionItems: defineTable({
    sessionId: v.id("sessions"),
    sourceType: v.union(v.literal("card"), v.literal("group")),
    sourceId: v.string(), // Original card/group ID
    title: v.string(),
    ownerId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"]),
});

/**
 * EXAMPLE DOCUMENTS:
 * 
 * User (Anonymous):
 * {
 *   _id: "jx7abc123",
 *   name: "Anonymous Panda",
 *   isAnonymous: true,
 *   createdAt: 1709481600000
 * }
 * 
 * User (Authenticated):
 * {
 *   _id: "jx7def456",
 *   name: "Jane Developer",
 *   email: "jane@example.com",
 *   isAnonymous: false,
 *   createdAt: 1709481600000
 * }
 * 
 * Session:
 * {
 *   _id: "jx8abc123",
 *   title: "Sprint 42 Retro",
 *   teamName: "Platform Team",
 *   facilitatorId: "jx7def456",
 *   templateType: "went_well_to_improve_actions",
 *   shareLink: "retro-x7k9p2",
 *   phase: "collecting",
 *   votesPerUser: 3,
 *   isActive: true,
 *   createdAt: 1709481600000,
 *   updatedAt: 1709481600000
 * }
 * 
 * Column:
 * {
 *   _id: "jx9abc123",
 *   sessionId: "jx8abc123",
 *   title: "Went Well",
 *   color: "bg-green-100",
 *   order: 0
 * }
 * 
 * Card:
 * {
 *   _id: "jxAabc123",
 *   sessionId: "jx8abc123",
 *   columnId: "jx9abc123",
 *   authorId: "jx7abc123",
 *   text: "Great collaboration on bug fixes",
 *   createdAt: 1709481700000,
 *   updatedAt: 1709481700000
 * }
 * 
 * Group:
 * {
 *   _id: "jxBabc123",
 *   sessionId: "jx8abc123",
 *   columnId: "jx9abc123",
 *   title: "Communication Wins",
 *   createdBy: "jx7def456",
 *   createdAt: 1709481800000
 * }
 * 
 * Vote:
 * {
 *   _id: "jxCabc123",
 *   sessionId: "jx8abc123",
 *   userId: "jx7abc123",
 *   targetType: "card",
 *   targetId: "jxAabc123",
 *   createdAt: 1709481900000
 * }
 * 
 * Action Item:
 * {
 *   _id: "jxDabc123",
 *   sessionId: "jx8abc123",
 *   sourceType: "card",
 *   sourceId: "jxAabc123",
 *   title: "Document pairing process",
 *   ownerId: "jx7def456",
 *   dueDate: 1710086400000,
 *   status: "open",
 *   createdAt: 1709482000000,
 *   updatedAt: 1709482000000
 * }
 */