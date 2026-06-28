CREATE TABLE "permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(150),
	"module" varchar(100),
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role_id" bigint NOT NULL,
	"permission_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"role_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"username" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"status" varchar(50),
	"phone" varchar(50),
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "beds" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"room_id" bigint,
	"bed_number" varchar(100),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "doctor_schedules" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"doctor_id" bigint,
	"room_id" bigint,
	"day_of_week" varchar(30),
	"start_time" time,
	"end_time" time,
	"quota" integer,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"employee_id" bigint,
	"specialization_id" bigint,
	"doctor_code" varchar(100),
	"license_number" varchar(150),
	"profile" text,
	"consultation_fee" integer,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"department_id" bigint,
	"position_id" bigint,
	"employee_code" varchar(100),
	"full_name" varchar(255),
	"gender" varchar(30),
	"birth_date" date,
	"address" text,
	"phone" varchar(50),
	"hire_date" date,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"department_id" bigint,
	"room_name" varchar(255),
	"room_type" varchar(100),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "specializations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"patient_id" bigint,
	"doctor_id" bigint,
	"doctor_schedule_id" bigint,
	"appointment_date" date,
	"appointment_time" time,
	"appointment_number" varchar(100),
	"type" varchar(50),
	"status" varchar(50),
	"complaint_note" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"medical_record_number" varchar(100),
	"nik" varchar(30),
	"full_name" varchar(255),
	"gender" varchar(30),
	"birth_date" date,
	"blood_type" varchar(10),
	"address" text,
	"phone" varchar(50),
	"emergency_contact_name" varchar(255),
	"emergency_contact_phone" varchar(50),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "queues" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"appointment_id" bigint,
	"patient_id" bigint,
	"doctor_id" bigint,
	"queue_number" varchar(100),
	"queue_date" date,
	"status" varchar(50),
	"called_at" timestamp with time zone,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"appointment_id" bigint,
	"patient_id" bigint,
	"doctor_id" bigint,
	"department_id" bigint,
	"visit_number" varchar(100),
	"visit_type" varchar(50),
	"status" varchar(50),
	"checkin_time" timestamp with time zone,
	"checkout_time" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "diagnoses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"medical_record_id" bigint,
	"icd_code" varchar(50),
	"diagnosis_name" varchar(255),
	"diagnosis_type" varchar(50),
	"note" text
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visit_id" bigint,
	"patient_id" bigint,
	"doctor_id" bigint,
	"main_complaint" text,
	"current_illness" text,
	"physical_exam" text,
	"assessment" text,
	"plan" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vital_signs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visit_id" bigint,
	"employee_id" bigint,
	"temperature" numeric(10, 2),
	"systolic_pressure" integer,
	"diastolic_pressure" integer,
	"heart_rate" integer,
	"respiratory_rate" integer,
	"weight" numeric(10, 2),
	"height" numeric(10, 2),
	"note" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lab_order_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"lab_order_id" bigint,
	"lab_test_id" bigint,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "lab_orders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visit_id" bigint,
	"doctor_id" bigint,
	"patient_id" bigint,
	"status" varchar(50),
	"note" text,
	"ordered_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lab_results" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"lab_order_item_id" bigint,
	"employee_id" bigint,
	"result_value" varchar(255),
	"unit" varchar(50),
	"reference_range" varchar(100),
	"result_status" varchar(50),
	"interpretation" text,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lab_tests" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"code" varchar(100),
	"category" varchar(100),
	"price" numeric(14, 2),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "radiology_order_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"radiology_order_id" bigint,
	"radiology_type_id" bigint,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "radiology_orders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visit_id" bigint,
	"doctor_id" bigint,
	"patient_id" bigint,
	"status" varchar(50),
	"clinical_note" text,
	"ordered_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "radiology_results" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"radiology_order_item_id" bigint,
	"employee_id" bigint,
	"findings" text,
	"impression" text,
	"file_url" varchar(500),
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "radiology_types" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"code" varchar(100),
	"price" numeric(14, 2),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"code" varchar(100),
	"unit" varchar(50),
	"price" numeric(14, 2),
	"stock" integer,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "prescription_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"prescription_id" bigint,
	"medicine_id" bigint,
	"dosage" varchar(100),
	"frequency" varchar(100),
	"duration" varchar(100),
	"quantity" integer,
	"instruction" text
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visit_id" bigint,
	"doctor_id" bigint,
	"patient_id" bigint,
	"status" varchar(50),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"invoice_id" bigint,
	"item_type" varchar(100),
	"reference_id" bigint,
	"description" varchar(255),
	"quantity" integer,
	"price" numeric(14, 2),
	"total" numeric(14, 2)
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"patient_id" bigint,
	"visit_id" bigint,
	"invoice_number" varchar(100),
	"subtotal" numeric(14, 2),
	"discount" numeric(14, 2),
	"tax" numeric(14, 2),
	"total_amount" numeric(14, 2),
	"status" varchar(50),
	"issued_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"type" varchar(50),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"invoice_id" bigint,
	"payment_method_id" bigint,
	"amount" numeric(14, 2),
	"payment_reference" varchar(255),
	"status" varchar(50),
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "insurance_claims" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"invoice_id" bigint,
	"patient_insurance_id" bigint,
	"claim_amount" numeric(14, 2),
	"status" varchar(50),
	"note" text,
	"submitted_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insurance_providers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"code" varchar(100),
	"contact" varchar(255),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "patient_insurances" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"patient_id" bigint,
	"insurance_provider_id" bigint,
	"policy_number" varchar(150),
	"member_number" varchar(150),
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "inpatient_admissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"patient_id" bigint,
	"doctor_id" bigint,
	"bed_id" bigint,
	"visit_id" bigint,
	"admitted_at" timestamp with time zone,
	"discharged_at" timestamp with time zone,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"action" varchar(100),
	"table_name" varchar(100),
	"record_id" bigint,
	"old_data" text,
	"new_data" text,
	"ip_address" varchar(100),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cms_pages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" bigint,
	"title" varchar(255),
	"slug" varchar(255),
	"content" text,
	"status" varchar(50),
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cms_posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" bigint,
	"title" varchar(255),
	"slug" varchar(255),
	"content" text,
	"thumbnail" varchar(500),
	"status" varchar(50),
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"message" text,
	"status" varchar(50),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hospital_infos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"address" text,
	"phone" varchar(50),
	"email" varchar(255),
	"logo" varchar(500),
	"map_url" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"title" varchar(255),
	"message" text,
	"type" varchar(50),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beds" ADD CONSTRAINT "beds_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialization_id_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."specializations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_schedule_id_doctor_schedules_id_fk" FOREIGN KEY ("doctor_schedule_id") REFERENCES "public"."doctor_schedules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queues" ADD CONSTRAINT "queues_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queues" ADD CONSTRAINT "queues_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queues" ADD CONSTRAINT "queues_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_medical_record_id_medical_records_id_fk" FOREIGN KEY ("medical_record_id") REFERENCES "public"."medical_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_lab_order_id_lab_orders_id_fk" FOREIGN KEY ("lab_order_id") REFERENCES "public"."lab_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_lab_test_id_lab_tests_id_fk" FOREIGN KEY ("lab_test_id") REFERENCES "public"."lab_tests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_lab_order_item_id_lab_order_items_id_fk" FOREIGN KEY ("lab_order_item_id") REFERENCES "public"."lab_order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_order_items" ADD CONSTRAINT "radiology_order_items_radiology_order_id_radiology_orders_id_fk" FOREIGN KEY ("radiology_order_id") REFERENCES "public"."radiology_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_order_items" ADD CONSTRAINT "radiology_order_items_radiology_type_id_radiology_types_id_fk" FOREIGN KEY ("radiology_type_id") REFERENCES "public"."radiology_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_orders" ADD CONSTRAINT "radiology_orders_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_results" ADD CONSTRAINT "radiology_results_radiology_order_item_id_radiology_order_items_id_fk" FOREIGN KEY ("radiology_order_item_id") REFERENCES "public"."radiology_order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "radiology_results" ADD CONSTRAINT "radiology_results_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_prescriptions_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_patient_insurance_id_patient_insurances_id_fk" FOREIGN KEY ("patient_insurance_id") REFERENCES "public"."patient_insurances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_insurances" ADD CONSTRAINT "patient_insurances_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_insurances" ADD CONSTRAINT "patient_insurances_insurance_provider_id_insurance_providers_id_fk" FOREIGN KEY ("insurance_provider_id") REFERENCES "public"."insurance_providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inpatient_admissions" ADD CONSTRAINT "inpatient_admissions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inpatient_admissions" ADD CONSTRAINT "inpatient_admissions_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inpatient_admissions" ADD CONSTRAINT "inpatient_admissions_bed_id_beds_id_fk" FOREIGN KEY ("bed_id") REFERENCES "public"."beds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inpatient_admissions" ADD CONSTRAINT "inpatient_admissions_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_posts" ADD CONSTRAINT "cms_posts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_name_unique" ON "permissions" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "role_permissions_role_permission_unique" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_name_unique" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_unique" ON "user_roles" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_id_idx" ON "user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "beds_room_id_idx" ON "beds" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "doctor_schedules_doctor_id_idx" ON "doctor_schedules" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "doctor_schedules_room_id_idx" ON "doctor_schedules" USING btree ("room_id");--> statement-breakpoint
CREATE UNIQUE INDEX "doctors_employee_id_unique" ON "doctors" USING btree ("employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "doctors_doctor_code_unique" ON "doctors" USING btree ("doctor_code");--> statement-breakpoint
CREATE UNIQUE INDEX "doctors_license_number_unique" ON "doctors" USING btree ("license_number");--> statement-breakpoint
CREATE INDEX "doctors_specialization_id_idx" ON "doctors" USING btree ("specialization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_user_id_unique" ON "employees" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_employee_code_unique" ON "employees" USING btree ("employee_code");--> statement-breakpoint
CREATE INDEX "employees_department_id_idx" ON "employees" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "employees_position_id_idx" ON "employees" USING btree ("position_id");--> statement-breakpoint
CREATE INDEX "rooms_department_id_idx" ON "rooms" USING btree ("department_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_number_unique" ON "appointments" USING btree ("appointment_number");--> statement-breakpoint
CREATE INDEX "appointments_patient_id_idx" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointments_doctor_id_idx" ON "appointments" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "appointments_schedule_id_idx" ON "appointments" USING btree ("doctor_schedule_id");--> statement-breakpoint
CREATE INDEX "appointments_date_idx" ON "appointments" USING btree ("appointment_date");--> statement-breakpoint
CREATE UNIQUE INDEX "patients_user_id_unique" ON "patients" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "patients_mrn_unique" ON "patients" USING btree ("medical_record_number");--> statement-breakpoint
CREATE UNIQUE INDEX "patients_nik_unique" ON "patients" USING btree ("nik");--> statement-breakpoint
CREATE UNIQUE INDEX "queues_appointment_id_unique" ON "queues" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "queues_patient_id_idx" ON "queues" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "queues_doctor_id_idx" ON "queues" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "queues_date_idx" ON "queues" USING btree ("queue_date");--> statement-breakpoint
CREATE UNIQUE INDEX "visits_appointment_id_unique" ON "visits" USING btree ("appointment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "visits_number_unique" ON "visits" USING btree ("visit_number");--> statement-breakpoint
CREATE INDEX "visits_patient_id_idx" ON "visits" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "visits_doctor_id_idx" ON "visits" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "visits_department_id_idx" ON "visits" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "diagnoses_medical_record_id_idx" ON "diagnoses" USING btree ("medical_record_id");--> statement-breakpoint
CREATE UNIQUE INDEX "medical_records_visit_id_unique" ON "medical_records" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "medical_records_patient_id_idx" ON "medical_records" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "medical_records_doctor_id_idx" ON "medical_records" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "vital_signs_visit_id_idx" ON "vital_signs" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "vital_signs_employee_id_idx" ON "vital_signs" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "lab_order_items_order_id_idx" ON "lab_order_items" USING btree ("lab_order_id");--> statement-breakpoint
CREATE INDEX "lab_order_items_test_id_idx" ON "lab_order_items" USING btree ("lab_test_id");--> statement-breakpoint
CREATE INDEX "lab_orders_visit_id_idx" ON "lab_orders" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "lab_orders_doctor_id_idx" ON "lab_orders" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "lab_orders_patient_id_idx" ON "lab_orders" USING btree ("patient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lab_results_order_item_id_unique" ON "lab_results" USING btree ("lab_order_item_id");--> statement-breakpoint
CREATE INDEX "lab_results_employee_id_idx" ON "lab_results" USING btree ("employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lab_tests_code_unique" ON "lab_tests" USING btree ("code");--> statement-breakpoint
CREATE INDEX "radiology_order_items_order_id_idx" ON "radiology_order_items" USING btree ("radiology_order_id");--> statement-breakpoint
CREATE INDEX "radiology_order_items_type_id_idx" ON "radiology_order_items" USING btree ("radiology_type_id");--> statement-breakpoint
CREATE INDEX "radiology_orders_visit_id_idx" ON "radiology_orders" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "radiology_orders_doctor_id_idx" ON "radiology_orders" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "radiology_orders_patient_id_idx" ON "radiology_orders" USING btree ("patient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "radiology_results_order_item_id_unique" ON "radiology_results" USING btree ("radiology_order_item_id");--> statement-breakpoint
CREATE INDEX "radiology_results_employee_id_idx" ON "radiology_results" USING btree ("employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "radiology_types_code_unique" ON "radiology_types" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "medicines_code_unique" ON "medicines" USING btree ("code");--> statement-breakpoint
CREATE INDEX "prescription_items_prescription_id_idx" ON "prescription_items" USING btree ("prescription_id");--> statement-breakpoint
CREATE INDEX "prescription_items_medicine_id_idx" ON "prescription_items" USING btree ("medicine_id");--> statement-breakpoint
CREATE INDEX "prescriptions_visit_id_idx" ON "prescriptions" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "prescriptions_doctor_id_idx" ON "prescriptions" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "prescriptions_patient_id_idx" ON "prescriptions" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_unique" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_patient_id_idx" ON "invoices" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "invoices_visit_id_idx" ON "invoices" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_payment_method_id_idx" ON "payments" USING btree ("payment_method_id");--> statement-breakpoint
CREATE INDEX "insurance_claims_invoice_id_idx" ON "insurance_claims" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "insurance_claims_patient_insurance_id_idx" ON "insurance_claims" USING btree ("patient_insurance_id");--> statement-breakpoint
CREATE UNIQUE INDEX "insurance_providers_code_unique" ON "insurance_providers" USING btree ("code");--> statement-breakpoint
CREATE INDEX "patient_insurances_patient_id_idx" ON "patient_insurances" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "patient_insurances_provider_id_idx" ON "patient_insurances" USING btree ("insurance_provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inpatient_admissions_visit_id_unique" ON "inpatient_admissions" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "inpatient_admissions_patient_id_idx" ON "inpatient_admissions" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "inpatient_admissions_doctor_id_idx" ON "inpatient_admissions" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "inpatient_admissions_bed_id_idx" ON "inpatient_admissions" USING btree ("bed_id");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_table_record_idx" ON "audit_logs" USING btree ("table_name","record_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cms_pages_slug_unique" ON "cms_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cms_pages_created_by_idx" ON "cms_pages" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "cms_posts_slug_unique" ON "cms_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cms_posts_created_by_idx" ON "cms_posts" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");