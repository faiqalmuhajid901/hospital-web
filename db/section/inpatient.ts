import {
  pgTable,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk } from "./_helpers";
import { beds, doctors } from "./organization";
import { patients, visits } from "./patient";

// =========================
// Inpatient
// =========================

export const inpatientAdmissions = pgTable(
  "inpatient_admissions",
  {
    id: id(),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    bedId: fk("bed_id").references(() => beds.id, { onDelete: "set null" }),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "set null" }),
    admittedAt: timestamp("admitted_at", { withTimezone: true, mode: "date" }),
    dischargedAt: timestamp("discharged_at", { withTimezone: true, mode: "date" }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    uniqueIndex("inpatient_admissions_visit_id_unique").on(table.visitId),
    index("inpatient_admissions_patient_id_idx").on(table.patientId),
    index("inpatient_admissions_doctor_id_idx").on(table.doctorId),
    index("inpatient_admissions_bed_id_idx").on(table.bedId),
  ]
);
