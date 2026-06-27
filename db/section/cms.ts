import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, createdAt } from "./_helpers";
import { users } from "./auth";

// =========================
// CMS, hospital info, contact, notifications, audit
// =========================

export const cmsPages = pgTable(
  "cms_pages",
  {
    id: id(),
    createdBy: fk("created_by").references(() => users.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }),
    slug: varchar("slug", { length: 255 }),
    content: text("content"),
    status: varchar("status", { length: 50 }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("cms_pages_slug_unique").on(table.slug),
    index("cms_pages_created_by_idx").on(table.createdBy),
  ]
);

export const cmsPosts = pgTable(
  "cms_posts",
  {
    id: id(),
    createdBy: fk("created_by").references(() => users.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }),
    slug: varchar("slug", { length: 255 }),
    content: text("content"),
    thumbnail: varchar("thumbnail", { length: 500 }),
    status: varchar("status", { length: 50 }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("cms_posts_slug_unique").on(table.slug),
    index("cms_posts_created_by_idx").on(table.createdBy),
  ]
);

export const hospitalInfos = pgTable("hospital_infos", {
  id: id(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  mapUrl: varchar("map_url", { length: 1000 }),
});

export const contactMessages = pgTable("contact_messages", {
  id: id(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 50 }),
  createdAt: createdAt(),
});

export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    userId: fk("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }),
    message: text("message"),
    type: varchar("type", { length: 50 }),
    isRead: boolean("is_read").default(false),
    createdAt: createdAt(),
  },
  (table) => [index("notifications_user_id_idx").on(table.userId)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    userId: fk("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }),
    tableName: varchar("table_name", { length: 100 }),
    // Polymorphic reference to changed record. No FK by design.
    recordId: fk("record_id"),
    oldData: text("old_data"),
    newData: text("new_data"),
    ipAddress: varchar("ip_address", { length: 100 }),
    createdAt: createdAt(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_table_record_idx").on(table.tableName, table.recordId),
  ]
);
