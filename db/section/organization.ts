import {
  pgTable,
  varchar,
  text,
  date,
  time,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk } from "./_helpers";
import { users } from "./auth";

// =========================
// Organization & doctors
// =========================

export const departments = pgTable("departments", {
  id: id(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  status: varchar("status", { length: 50 }),
});

export const positions = pgTable("positions", {
  id: id(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
});

export const specializations = pgTable("specializations", {
  id: id(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
});

export const employees = pgTable(
  "employees",
  {
    id: id(),
    userId: varchar("user_id", { length: 16 }).references(() => users.id, {
  onDelete: "set null",
}),
    departmentId: fk("department_id").references(() => departments.id, { onDelete: "set null" }),
    positionId: fk("position_id").references(() => positions.id, { onDelete: "set null" }),
    employeeCode: varchar("employee_code", { length: 100 }),
    fullName: varchar("full_name", { length: 255 }),
    gender: varchar("gender", { length: 30 }),
    birthDate: date("birth_date"),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    hireDate: date("hire_date"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    uniqueIndex("employees_user_id_unique").on(table.userId),
    uniqueIndex("employees_employee_code_unique").on(table.employeeCode),
    index("employees_department_id_idx").on(table.departmentId),
    index("employees_position_id_idx").on(table.positionId),
  ]
);

export const rooms = pgTable(
  "rooms",
  {
    id: id(),
    departmentId: fk("department_id").references(() => departments.id, { onDelete: "set null" }),
    roomName: varchar("room_name", { length: 255 }),
    roomType: varchar("room_type", { length: 100 }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [index("rooms_department_id_idx").on(table.departmentId)]
);

export const beds = pgTable(
  "beds",
  {
    id: id(),
    roomId: fk("room_id").references(() => rooms.id, { onDelete: "set null" }),
    bedNumber: varchar("bed_number", { length: 100 }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [index("beds_room_id_idx").on(table.roomId)]
);

export const doctors = pgTable(
  "doctors",
  {
    id: id(),
    employeeId: fk("employee_id").references(() => employees.id, { onDelete: "set null" }),
    specializationId: fk("specialization_id").references(() => specializations.id, { onDelete: "set null" }),
    doctorCode: varchar("doctor_code", { length: 100 }),
    licenseNumber: varchar("license_number", { length: 150 }),
    profile: text("profile"),
    consultationFee: integer("consultation_fee"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    uniqueIndex("doctors_employee_id_unique").on(table.employeeId),
    uniqueIndex("doctors_doctor_code_unique").on(table.doctorCode),
    uniqueIndex("doctors_license_number_unique").on(table.licenseNumber),
    index("doctors_specialization_id_idx").on(table.specializationId),
  ]
);

export const doctorSchedules = pgTable(
  "doctor_schedules",
  {
    id: id(),
    doctorId: fk("doctor_id").references(() => doctors.id, { onDelete: "cascade" }),
    roomId: fk("room_id").references(() => rooms.id, { onDelete: "set null" }),
    dayOfWeek: varchar("day_of_week", { length: 30 }),
    startTime: time("start_time"),
    endTime: time("end_time"),
    quota: integer("quota"),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    index("doctor_schedules_doctor_id_idx").on(table.doctorId),
    index("doctor_schedules_room_id_idx").on(table.roomId),
  ]
);
