import {
  bigserial,
  bigint,
  numeric,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const nanoid12 = customAlphabet(alphabet, 12);

export const prefixedId = (prefix: string) =>
  varchar("id", { length: prefix.length + 1 + 12 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => `${prefix}-${nanoid12()}`);

export const id = () => bigserial("id", { mode: "number" }).primaryKey();

export const fk = (name: string) => bigint(name, { mode: "number" });

export const money = (name: string) => numeric(name, { precision: 14, scale: 2 });

export const decimal = (name: string) => numeric(name, { precision: 10, scale: 2 });

export const createdAt = (name = "created_at") =>
  timestamp(name, { withTimezone: true, mode: "date" }).defaultNow();
