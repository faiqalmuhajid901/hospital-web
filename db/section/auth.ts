import {
  pgTable,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, createdAt } from "./_helpers";

// =========================
// Authentication & RBAC
// =========================

export const users = pgTable(
  "users",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    username: varchar("username", {length: 255}),
    email: varchar("email", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    status : varchar("status", {length: 50}),
    role : varchar("role", {length:50}),
    phone: varchar("phone", { length: 50 }),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: "date" }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
);
