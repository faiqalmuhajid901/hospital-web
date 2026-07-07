import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { createdAt, prefixedId } from "./_helpers";    

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: prefixedId("PRT"),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),

    email: varchar("email", { length: 255 }).notNull(),

    // Simpan HASH token, bukan token asli.
    // Kalau pakai SHA-256 hex, panjangnya 64 karakter.
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    usedAt: timestamp("used_at", {
      withTimezone: true,
      mode: "date",
    }),

    // IPv4 maksimal 15 karakter, IPv6 bisa sampai 45 karakter.
    ipAddress: varchar("ip_address", { length: 45 }),

    // User-Agent bisa panjang, jadi lebih aman pakai text.
    userAgent: text("user_agent"),

    // Jumlah percobaan submit password/reset pada token ini.
    attemptCount: integer("attempt_count").notNull().default(0),

    createdAt: createdAt(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    uniqueIndex("password_reset_tokens_token_hash_unique").on(table.tokenHash),
    index("password_reset_tokens_user_id_idx").on(table.userId),
    index("password_reset_tokens_email_idx").on(table.email),
    index("password_reset_tokens_expires_at_idx").on(table.expiresAt),
  ]
);