import { relations } from "drizzle-orm";

import {
  users,
} from "./auth";
import {
  beds,
  departments,
  doctorSchedules,
  doctors,
  employees,
  positions,
  rooms,
  specializations,
} from "./organization";
import {
  appointments,
  patients,
  queues,
  visits,
} from "./patient";
import {
  diagnoses,
  medicalRecords,
  vitalSigns,
} from "./medical";
import {
  labOrderItems,
  labOrders,
  labResults,
  labTests,
} from "./laboratory";
import {
  radiologyOrderItems,
  radiologyOrders,
  radiologyResults,
  radiologyTypes,
} from "./radiology";
import {
  medicines,
  prescriptionItems,
  prescriptions,
} from "./pharmacy";
import {
  invoiceItems,
  invoices,
  paymentMethods,
  payments,
} from "./billing";
import {
  insuranceClaims,
  insuranceProviders,
  patientInsurances,
} from "./insurance";
import { passwordResetTokens } from "./tokenForgotPW";
import { inpatientAdmissions } from "./inpatient";
import {
  auditLogs,
  cmsPages,
  cmsPosts,
  notifications,
} from "./cms";

// =========================
// Relations
// =========================

export const usersRelations = relations(users, ({ one, many }) => ({
  employee: one(employees),
  patient: one(patients),
  cmsPages: many(cmsPages),
  passwordResetTokens: many(passwordResetTokens),
  cmsPosts: many(cmsPosts),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

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