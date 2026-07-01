import {pgTable, text, timestamp, boolean, varchar} from "drizzle-orm/pg-core"
import {id} from "./_helpers"


export const otp_requests = pgTable(
  "otp_requests",
  {
    id: id(),
    email: varchar("email", { length: 255 }),
    otp_hash: varchar("otp_hash", { length: 255 }).notNull(),
    expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }),
    created_at: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
);