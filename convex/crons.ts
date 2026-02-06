import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Reset monthly session counters on the 1st of each month at midnight UTC
crons.monthly(
  "reset monthly usage",
  { day: 1, hourUTC: 0, minuteUTC: 0 },
  internal.users.resetMonthlyUsage
);

export default crons;
