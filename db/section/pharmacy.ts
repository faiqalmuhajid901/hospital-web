import {
  pgTable,
  varchar,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, money, createdAt } from "./_helpers";
import { doctors } from "./organization";
import { patients, visits } from "./patient";

// =========================
// Pharmacy / prescriptions
// =========================

export const medicines = pgTable(
  "medicines",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 100 }),
    unit: varchar("unit", { length: 50 }),
    price: money("price"),
    stock: integer("stock"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [uniqueIndex("medicines_code_unique").on(table.code)]
);

export const prescriptions = pgTable(
  "prescriptions",
  {
    id: id(),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }),
    createdAt: createdAt(),
  },
  (table) => [
    index("prescriptions_visit_id_idx").on(table.visitId),
    index("prescriptions_doctor_id_idx").on(table.doctorId),
    index("prescriptions_patient_id_idx").on(table.patientId),
  ]
);

export const prescriptionItems = pgTable(
  "prescription_items",
  {
    id: id(),
    prescriptionId: fk("prescription_id").references(() => prescriptions.id, { onDelete: "cascade" }),
    medicineId: fk("medicine_id").references(() => medicines.id, { onDelete: "set null" }),
    dosage: varchar("dosage", { length: 100 }),
    frequency: varchar("frequency", { length: 100 }),
    duration: varchar("duration", { length: 100 }),
    quantity: integer("quantity"),
    instruction: text("instruction"),
  },
  (table) => [
    index("prescription_items_prescription_id_idx").on(table.prescriptionId),
    index("prescription_items_medicine_id_idx").on(table.medicineId),
  ]
);
