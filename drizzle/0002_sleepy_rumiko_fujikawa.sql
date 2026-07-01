CREATE TABLE "otp_requests" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"otp_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
