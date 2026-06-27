import {
  bigserial,
  bigint,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const id = () => bigserial("id", { mode: "number" }).primaryKey();

export const fk = (name: string) => bigint(name, { mode: "number" });

export const money = (name: string) => numeric(name, { precision: 14, scale: 2 });

export const decimal = (name: string) => numeric(name, { precision: 10, scale: 2 });

export const createdAt = (name = "created_at") =>
  timestamp(name, { withTimezone: true, mode: "date" }).defaultNow();
