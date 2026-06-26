import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  text,
  timestamp,
  date,
  time,
  integer,
  boolean,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Drizzle schema for Supabase/PostgreSQL
// Source ERD: Hospital project / hospital_complex_erd
// Note: enum columns from the ERD are kept as varchar because the enum values
// were not defined yet. You can replace them with pgEnum later.

const id = () => bigserial("id", { mode: "number" }).primaryKey();
const fk = (name: string) => bigint(name, { mode: "number" });
const money = (name: string) => numeric(name, { precision: 14, scale: 2 });
const decimal = (name: string) => numeric(name, { precision: 10, scale: 2 });
const createdAt = (name = "created_at") =>
  timestamp(name, { withTimezone: true, mode: "date" }).defaultNow();

// =========================
// Authentication & RBAC
// =========================

export const users = pgTable(
  "users",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    password: varchar("password", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    status: varchar("status", { length: 50 }),
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
    userId: fk("user_id").references(() => users.id, { onDelete: "set null" }),
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

// =========================
// Billing & payments
// =========================

export const paymentMethods = pgTable("payment_methods", {
  id: id(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 50 }),
  status: varchar("status", { length: 50 }),
});

export const invoices = pgTable(
  "invoices",
  {
    id: id(),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    visitId: fk("visit_id").references(() => visits.id, { onDelete: "set null" }),
    invoiceNumber: varchar("invoice_number", { length: 100 }),
    subtotal: money("subtotal"),
    discount: money("discount"),
    tax: money("tax"),
    totalAmount: money("total_amount"),
    status: varchar("status", { length: 50 }),
    issuedAt: timestamp("issued_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    uniqueIndex("invoices_number_unique").on(table.invoiceNumber),
    index("invoices_patient_id_idx").on(table.patientId),
    index("invoices_visit_id_idx").on(table.visitId),
  ]
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: id(),
    invoiceId: fk("invoice_id").references(() => invoices.id, { onDelete: "cascade" }),
    itemType: varchar("item_type", { length: 100 }),
    // Polymorphic reference to service/order/item table. No FK by design.
    referenceId: fk("reference_id"),
    description: varchar("description", { length: 255 }),
    quantity: integer("quantity"),
    price: money("price"),
    total: money("total"),
  },
  (table) => [index("invoice_items_invoice_id_idx").on(table.invoiceId)]
);

export const payments = pgTable(
  "payments",
  {
    id: id(),
    invoiceId: fk("invoice_id").references(() => invoices.id, { onDelete: "cascade" }),
    paymentMethodId: fk("payment_method_id").references(() => paymentMethods.id, { onDelete: "set null" }),
    amount: money("amount"),
    paymentReference: varchar("payment_reference", { length: 255 }),
    status: varchar("status", { length: 50 }),
    paidAt: timestamp("paid_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("payments_invoice_id_idx").on(table.invoiceId),
    index("payments_payment_method_id_idx").on(table.paymentMethodId),
  ]
);

// =========================
// Insurance
// =========================

export const insuranceProviders = pgTable(
  "insurance_providers",
  {
    id: id(),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 100 }),
    contact: varchar("contact", { length: 255 }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [uniqueIndex("insurance_providers_code_unique").on(table.code)]
);

export const patientInsurances = pgTable(
  "patient_insurances",
  {
    id: id(),
    patientId: fk("patient_id").references(() => patients.id, { onDelete: "cascade" }),
    insuranceProviderId: fk("insurance_provider_id").references(() => insuranceProviders.id, { onDelete: "set null" }),
    policyNumber: varchar("policy_number", { length: 150 }),
    memberNumber: varchar("member_number", { length: 150 }),
    status: varchar("status", { length: 50 }),
  },
  (table) => [
    index("patient_insurances_patient_id_idx").on(table.patientId),
    index("patient_insurances_provider_id_idx").on(table.insuranceProviderId),
  ]
);

export const insuranceClaims = pgTable(
  "insurance_claims",
  {
    id: id(),
    invoiceId: fk("invoice_id").references(() => invoices.id, { onDelete: "cascade" }),
    patientInsuranceId: fk("patient_insurance_id").references(() => patientInsurances.id, { onDelete: "set null" }),
    claimAmount: money("claim_amount"),
    status: varchar("status", { length: 50 }),
    note: text("note"),
    submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("insurance_claims_invoice_id_idx").on(table.invoiceId),
    index("insurance_claims_patient_insurance_id_idx").on(table.patientInsuranceId),
  ]
);

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

// =========================
// Relations
// =========================

export const usersRelations = relations(users, ({ one, many }) => ({
  employee: one(employees),
  patient: one(patients),
  userRoles: many(userRoles),
  cmsPages: many(cmsPages),
  cmsPosts: many(cmsPosts),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
  rooms: many(rooms),
  visits: many(visits),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  employees: many(employees),
}));

export const specializationsRelations = relations(specializations, ({ many }) => ({
  doctors: many(doctors),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, { fields: [employees.userId], references: [users.id] }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
  doctor: one(doctors),
  vitalSigns: many(vitalSigns),
  labResults: many(labResults),
  radiologyResults: many(radiologyResults),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  department: one(departments, { fields: [rooms.departmentId], references: [departments.id] }),
  beds: many(beds),
  doctorSchedules: many(doctorSchedules),
}));

export const bedsRelations = relations(beds, ({ one, many }) => ({
  room: one(rooms, { fields: [beds.roomId], references: [rooms.id] }),
  inpatientAdmissions: many(inpatientAdmissions),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  employee: one(employees, { fields: [doctors.employeeId], references: [employees.id] }),
  specialization: one(specializations, {
    fields: [doctors.specializationId],
    references: [specializations.id],
  }),
  schedules: many(doctorSchedules),
  appointments: many(appointments),
  queues: many(queues),
  visits: many(visits),
  medicalRecords: many(medicalRecords),
  labOrders: many(labOrders),
  radiologyOrders: many(radiologyOrders),
  prescriptions: many(prescriptions),
  inpatientAdmissions: many(inpatientAdmissions),
}));

export const doctorSchedulesRelations = relations(doctorSchedules, ({ one, many }) => ({
  doctor: one(doctors, { fields: [doctorSchedules.doctorId], references: [doctors.id] }),
  room: one(rooms, { fields: [doctorSchedules.roomId], references: [rooms.id] }),
  appointments: many(appointments),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
  queues: many(queues),
  visits: many(visits),
  medicalRecords: many(medicalRecords),
  labOrders: many(labOrders),
  radiologyOrders: many(radiologyOrders),
  prescriptions: many(prescriptions),
  invoices: many(invoices),
  patientInsurances: many(patientInsurances),
  inpatientAdmissions: many(inpatientAdmissions),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  doctorSchedule: one(doctorSchedules, {
    fields: [appointments.doctorScheduleId],
    references: [doctorSchedules.id],
  }),
  queue: one(queues),
  visit: one(visits),
}));

export const queuesRelations = relations(queues, ({ one }) => ({
  appointment: one(appointments, { fields: [queues.appointmentId], references: [appointments.id] }),
  patient: one(patients, { fields: [queues.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [queues.doctorId], references: [doctors.id] }),
}));

export const visitsRelations = relations(visits, ({ one, many }) => ({
  appointment: one(appointments, { fields: [visits.appointmentId], references: [appointments.id] }),
  patient: one(patients, { fields: [visits.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [visits.doctorId], references: [doctors.id] }),
  department: one(departments, { fields: [visits.departmentId], references: [departments.id] }),
  medicalRecord: one(medicalRecords),
  vitalSigns: many(vitalSigns),
  labOrders: many(labOrders),
  radiologyOrders: many(radiologyOrders),
  prescriptions: many(prescriptions),
  invoices: many(invoices),
  inpatientAdmission: one(inpatientAdmissions),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  visit: one(visits, { fields: [medicalRecords.visitId], references: [visits.id] }),
  patient: one(patients, { fields: [medicalRecords.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [medicalRecords.doctorId], references: [doctors.id] }),
  diagnoses: many(diagnoses),
}));

export const vitalSignsRelations = relations(vitalSigns, ({ one }) => ({
  visit: one(visits, { fields: [vitalSigns.visitId], references: [visits.id] }),
  employee: one(employees, { fields: [vitalSigns.employeeId], references: [employees.id] }),
}));

export const diagnosesRelations = relations(diagnoses, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [diagnoses.medicalRecordId],
    references: [medicalRecords.id],
  }),
}));

export const labTestsRelations = relations(labTests, ({ many }) => ({
  labOrderItems: many(labOrderItems),
}));

export const labOrdersRelations = relations(labOrders, ({ one, many }) => ({
  visit: one(visits, { fields: [labOrders.visitId], references: [visits.id] }),
  doctor: one(doctors, { fields: [labOrders.doctorId], references: [doctors.id] }),
  patient: one(patients, { fields: [labOrders.patientId], references: [patients.id] }),
  items: many(labOrderItems),
}));

export const labOrderItemsRelations = relations(labOrderItems, ({ one }) => ({
  labOrder: one(labOrders, { fields: [labOrderItems.labOrderId], references: [labOrders.id] }),
  labTest: one(labTests, { fields: [labOrderItems.labTestId], references: [labTests.id] }),
  result: one(labResults),
}));

export const labResultsRelations = relations(labResults, ({ one }) => ({
  labOrderItem: one(labOrderItems, {
    fields: [labResults.labOrderItemId],
    references: [labOrderItems.id],
  }),
  employee: one(employees, { fields: [labResults.employeeId], references: [employees.id] }),
}));

export const radiologyTypesRelations = relations(radiologyTypes, ({ many }) => ({
  radiologyOrderItems: many(radiologyOrderItems),
}));

export const radiologyOrdersRelations = relations(radiologyOrders, ({ one, many }) => ({
  visit: one(visits, { fields: [radiologyOrders.visitId], references: [visits.id] }),
  doctor: one(doctors, { fields: [radiologyOrders.doctorId], references: [doctors.id] }),
  patient: one(patients, { fields: [radiologyOrders.patientId], references: [patients.id] }),
  items: many(radiologyOrderItems),
}));

export const radiologyOrderItemsRelations = relations(radiologyOrderItems, ({ one }) => ({
  radiologyOrder: one(radiologyOrders, {
    fields: [radiologyOrderItems.radiologyOrderId],
    references: [radiologyOrders.id],
  }),
  radiologyType: one(radiologyTypes, {
    fields: [radiologyOrderItems.radiologyTypeId],
    references: [radiologyTypes.id],
  }),
  result: one(radiologyResults),
}));

export const radiologyResultsRelations = relations(radiologyResults, ({ one }) => ({
  radiologyOrderItem: one(radiologyOrderItems, {
    fields: [radiologyResults.radiologyOrderItemId],
    references: [radiologyOrderItems.id],
  }),
  employee: one(employees, { fields: [radiologyResults.employeeId], references: [employees.id] }),
}));

export const medicinesRelations = relations(medicines, ({ many }) => ({
  prescriptionItems: many(prescriptionItems),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one, many }) => ({
  visit: one(visits, { fields: [prescriptions.visitId], references: [visits.id] }),
  doctor: one(doctors, { fields: [prescriptions.doctorId], references: [doctors.id] }),
  patient: one(patients, { fields: [prescriptions.patientId], references: [patients.id] }),
  items: many(prescriptionItems),
}));

export const prescriptionItemsRelations = relations(prescriptionItems, ({ one }) => ({
  prescription: one(prescriptions, {
    fields: [prescriptionItems.prescriptionId],
    references: [prescriptions.id],
  }),
  medicine: one(medicines, { fields: [prescriptionItems.medicineId], references: [medicines.id] }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ many }) => ({
  payments: many(payments),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  patient: one(patients, { fields: [invoices.patientId], references: [patients.id] }),
  visit: one(visits, { fields: [invoices.visitId], references: [visits.id] }),
  items: many(invoiceItems),
  payments: many(payments),
  insuranceClaims: many(insuranceClaims),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  paymentMethod: one(paymentMethods, {
    fields: [payments.paymentMethodId],
    references: [paymentMethods.id],
  }),
}));

export const insuranceProvidersRelations = relations(insuranceProviders, ({ many }) => ({
  patientInsurances: many(patientInsurances),
}));

export const patientInsurancesRelations = relations(patientInsurances, ({ one, many }) => ({
  patient: one(patients, { fields: [patientInsurances.patientId], references: [patients.id] }),
  insuranceProvider: one(insuranceProviders, {
    fields: [patientInsurances.insuranceProviderId],
    references: [insuranceProviders.id],
  }),
  insuranceClaims: many(insuranceClaims),
}));

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  invoice: one(invoices, { fields: [insuranceClaims.invoiceId], references: [invoices.id] }),
  patientInsurance: one(patientInsurances, {
    fields: [insuranceClaims.patientInsuranceId],
    references: [patientInsurances.id],
  }),
}));

export const inpatientAdmissionsRelations = relations(inpatientAdmissions, ({ one }) => ({
  patient: one(patients, { fields: [inpatientAdmissions.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [inpatientAdmissions.doctorId], references: [doctors.id] }),
  bed: one(beds, { fields: [inpatientAdmissions.bedId], references: [beds.id] }),
  visit: one(visits, { fields: [inpatientAdmissions.visitId], references: [visits.id] }),
}));

export const cmsPagesRelations = relations(cmsPages, ({ one }) => ({
  creator: one(users, { fields: [cmsPages.createdBy], references: [users.id] }),
}));

export const cmsPostsRelations = relations(cmsPosts, ({ one }) => ({
  creator: one(users, { fields: [cmsPosts.createdBy], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
