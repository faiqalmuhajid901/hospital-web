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
    password: varchar("password", { length: 255 }),
    status : varchar("status", {length: 50}),
    phone: varchar("phone", { length: 50 }),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: "date" }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
);

export const roles = pgTable(
  "roles",
  {
    id: id(),
    name: varchar("name", { length: 100 }),
    description: varchar("description", { length: 255 }),
  },
  (table) => [uniqueIndex("roles_name_unique").on(table.name)]
);

export const permissions = pgTable(
  "permissions",
  {
    id: id(),
    name: varchar("name", { length: 150 }),
    module: varchar("module", { length: 100 }),
    description: varchar("description", { length: 255 }),
  },
  (table) => [uniqueIndex("permissions_name_unique").on(table.name)]
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: id(),
    userId: fk("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: fk("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("user_roles_user_role_unique").on(table.userId, table.roleId),
    index("user_roles_user_id_idx").on(table.userId),
    index("user_roles_role_id_idx").on(table.roleId),
  ]
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: id(),
    roleId: fk("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: fk("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("role_permissions_role_permission_unique").on(table.roleId, table.permissionId),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ]
);
