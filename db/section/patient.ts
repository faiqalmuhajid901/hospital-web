import {
  pgTable,
  varchar,
  text,
  timestamp,
  date,
  time,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, createdAt } from "./_helpers";
import { users } from "./auth";
import { departments, doctors, doctorSchedules } from "./organization";

// =========================
// Patients, appointments, queues, visits
// =========================

export const patients = pgTable(
  "patients",
  {
    id: id(),
    userId: fk("user_id").references(() => users.id, { onDelete: "set null" }),
    medicalRecordNumber: varchar("medical_record_number", { length: 100 }),
    nik: varchar("nik", { length: 30 }),
    fullName: varchar("full_name", { length: 255 }),
    gender: varchar("gender", { length: 30 }),
    birthDate: date("birth_date"),
    bloodType: varchar("blood_type", { length: 10 }),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 50 }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    uniqueIndex("patients_user_id_unique").on(table.userId),
    uniqueIndex("patients_mrn_unique").on(table.medicalRecordNumber),
    uniqueIndex("patients_nik_unique").on(table.nik),
  ]
);

export const appointments = pgTable(
  "appointments",
  {
    id: id(),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    doctorScheduleId: fk("doctor_schedule_id").references(() => doctorSchedules.id, { onDelete: "set null" }),
    appointmentDate: date("appointment_date"),
    appointmentTime: time("appointment_time"),
    appointmentNumber: varchar("appointment_number", { length: 100 }),
    type: varchar("type", { length: 50 }),
    status: varchar("status", { length: 50 }),
    complaintNote: text("complaint_note"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("appointments_number_unique").on(table.appointmentNumber),
    index("appointments_patient_id_idx").on(table.patientId),
    index("appointments_doctor_id_idx").on(table.doctorId),
    index("appointments_schedule_id_idx").on(table.doctorScheduleId),
    index("appointments_date_idx").on(table.appointmentDate),
  ]
);

export const queues = pgTable(
  "queues",
  {
    id: id(),
    appointmentId: fk("appointment_id").references(() => appointments.id, { onDelete: "cascade" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    queueNumber: varchar("queue_number", { length: 100 }),
    queueDate: date("queue_date"),
    status: varchar("status", { length: 50 }),
    calledAt: timestamp("called_at", { withTimezone: true, mode: "date" }),
    finishedAt: timestamp("finished_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("queues_appointment_id_unique").on(table.appointmentId),
    index("queues_patient_id_idx").on(table.patientId),
    index("queues_doctor_id_idx").on(table.doctorId),
    index("queues_date_idx").on(table.queueDate),
  ]
);

export const visits = pgTable(
  "visits",
  {
    id: id(),
    appointmentId: fk("appointment_id").references(() => appointments.id, { onDelete: "set null" }),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    departmentId: fk("department_id").references(() => departments.id, { onDelete: "set null" }),
    visitNumber: varchar("visit_number", { length: 100 }),
    visitType: varchar("visit_type", { length: 50 }),
    status: varchar("status", { length: 50 }),
    checkinTime: timestamp("checkin_time", { withTimezone: true, mode: "date" }),
    checkoutTime: timestamp("checkout_time", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("visits_appointment_id_unique").on(table.appointmentId),
    uniqueIndex("visits_number_unique").on(table.visitNumber),
    index("visits_patient_id_idx").on(table.patientId),
    index("visits_doctor_id_idx").on(table.doctorId),
    index("visits_department_id_idx").on(table.departmentId),
  ]
);
