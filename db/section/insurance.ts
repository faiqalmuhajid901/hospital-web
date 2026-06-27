import {
  pgTable,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, money } from "./_helpers";
import { patients } from "./patient";
import { invoices } from "./billing";

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
