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
// Laboratory
// =========================

export const labTests = pgTable(
  "lab_tests",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 100 }),
    category: varchar("category", { length: 100 }),
    price: money("price"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [uniqueIndex("lab_tests_code_unique").on(table.code)]
);

export const labOrders = pgTable(
  "lab_orders",
  {
    id: id(),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }),
    note: text("note"),
    orderedAt: timestamp("ordered_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("lab_orders_visit_id_idx").on(table.visitId),
    index("lab_orders_doctor_id_idx").on(table.doctorId),
    index("lab_orders_patient_id_idx").on(table.patientId),
  ]
);

export const labOrderItems = pgTable(
  "lab_order_items",
  {
    id: id(),
    labOrderId: fk("lab_order_id").references(() => labOrders.id, { onDelete: "cascade" }),
    labTestId: fk("lab_test_id").references(() => labTests.id, { onDelete: "set null" }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    index("lab_order_items_order_id_idx").on(table.labOrderId),
    index("lab_order_items_test_id_idx").on(table.labTestId),
  ]
);

export const labResults = pgTable(
  "lab_results",
  {
    id: id(),
    labOrderItemId: fk("lab_order_item_id").references(() => labOrderItems.id, { onDelete: "cascade" }),
    employeeId: fk("employee_id").references(() => employees.id, { onDelete: "set null" }),
    resultValue: varchar("result_value", { length: 255 }),
    unit: varchar("unit", { length: 50 }),
    referenceRange: varchar("reference_range", { length: 100 }),
    resultStatus: varchar("result_status", { length: 50 }),
    interpretation: text("interpretation"),
    verifiedAt: timestamp("verified_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("lab_results_order_item_id_unique").on(table.labOrderItemId),
    index("lab_results_employee_id_idx").on(table.employeeId),
  ]
);
