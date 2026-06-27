import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { id, fk, money } from "./_helpers";
import { patients, visits } from "./patient";

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
