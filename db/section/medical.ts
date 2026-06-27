import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, decimal, createdAt } from "./_helpers";
import { employees, doctors } from "./organization";
import { patients, visits } from "./patient";

// =========================
// Medical records
// =========================

export const medicalRecords = pgTable(
  "medical_records",
  {
    id: id(),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "cascade" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    mainComplaint: text("main_complaint"),
    currentIllness: text("current_illness"),
    physicalExam: text("physical_exam"),
    assessment: text("assessment"),
    plan: text("plan"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("medical_records_visit_id_unique").on(table.visitId),
    index("medical_records_patient_id_idx").on(table.patientId),
    index("medical_records_doctor_id_idx").on(table.doctorId),
  ]
);

export const vitalSigns = pgTable(
  "vital_signs",
  {
    id: id(),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "cascade" }),
    employeeId: fk("employee_id").references(() => employees.id, { onDelete: "set null" }),
    temperature: decimal("temperature"),
    systolicPressure: integer("systolic_pressure"),
    diastolicPressure: integer("diastolic_pressure"),
    heartRate: integer("heart_rate"),
    respiratoryRate: integer("respiratory_rate"),
    weight: decimal("weight"),
    height: decimal("height"),
    note: text("note"),
    createdAt: createdAt(),
  },
  (table) => [
    index("vital_signs_visit_id_idx").on(table.visitId),
    index("vital_signs_employee_id_idx").on(table.employeeId),
  ]
);

export const diagnoses = pgTable(
  "diagnoses",
  {
    id: id(),
    medicalRecordId: fk("medical_record_id").references(() => medicalRecords.id, { onDelete: "cascade" }),
    icdCode: varchar("icd_code", { length: 50 }),
    diagnosisName: varchar("diagnosis_name", { length: 255 }),
    diagnosisType: varchar("diagnosis_type", { length: 50 }),
    note: text("note"),
  },
  (table) => [index("diagnoses_medical_record_id_idx").on(table.medicalRecordId)]
);
