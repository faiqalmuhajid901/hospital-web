import {
  pgTable,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, money } from "./_helpers";
import { employees, doctors } from "./organization";
import { patients, visits } from "./patient";

// =========================
// Radiology
// =========================

export const radiologyTypes = pgTable(
  "radiology_types",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 100 }),
    price: money("price"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [uniqueIndex("radiology_types_code_unique").on(table.code)]
);

export const radiologyOrders = pgTable(
  "radiology_orders",
  {
    id: id(),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }),
    clinicalNote: text("clinical_note"),
    orderedAt: timestamp("ordered_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("radiology_orders_visit_id_idx").on(table.visitId),
    index("radiology_orders_doctor_id_idx").on(table.doctorId),
    index("radiology_orders_patient_id_idx").on(table.patientId),
  ]
);

export const radiologyOrderItems = pgTable(
  "radiology_order_items",
  {
    id: id(),
    radiologyOrderId: fk("radiology_order_id").references(() => radiologyOrders.id, { onDelete: "cascade" }),
    radiologyTypeId: fk("radiology_type_id").references(() => radiologyTypes.id, { onDelete: "set null" }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    index("radiology_order_items_order_id_idx").on(table.radiologyOrderId),
    index("radiology_order_items_type_id_idx").on(table.radiologyTypeId),
  ]
);

export const radiologyResults = pgTable(
  "radiology_results",
  {
    id: id(),
    radiologyOrderItemId: fk("radiology_order_item_id").references(() => radiologyOrderItems.id, { onDelete: "cascade" }),
    employeeId: fk("employee_id").references(() => employees.id, { onDelete: "set null" }),
    findings: text("findings"),
    impression: text("impression"),
    fileUrl: varchar("file_url", { length: 500 }),
    verifiedAt: timestamp("verified_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("radiology_results_order_item_id_unique").on(table.radiologyOrderItemId),
    index("radiology_results_employee_id_idx").on(table.employeeId),
  ]
);
