import {bigint, varchar, timestamp, pgTable} from "drizzle-orm/pg-core"
import {id, createdAt} from "./_helpers"

export const sessions = pgTable("sessions", {
  id: id(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),

  lastActivity: timestamp("last_activity", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  createdAt: createdAt(),
});
  