// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/section/auth";

export const runtime = "nodejs";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama minimal 3 karakter.")
      .max(255, "Nama terlalu panjang.")
      .transform((value) => value.trim()),

    email: z
      .string()
      .email("Format email tidak valid.")
      .max(255, "Email terlalu panjang.")
      .trim(),

    phone: z
      .string()
      .min(10, "Nomor HP minimal 10 digit.")
      .max(20, "Nomor HP terlalu panjang.")
      .regex(/^[0-9+ -]+$/, "Nomor HP tidak valid.")
      .transform((value) => value.trim()),

    username: z
      .string()
      .min(4, "Username minimal 4 karakter.")
      .max(100, "Username terlalu panjang.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh berisi huruf, angka, dan underscore."
      )
      .transform((value) => value.toLowerCase().trim()),

    password: z.string().min(8, "Password minimal 8 karakter."),

    confirmPassword: z.string(),

    terms: z.boolean().refine((value) => value === true, {
      message: "Syarat dan Ketentuan wajib disetujui.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

type PgLikeError = {
  code?: string;
  constraint?: string;
  constraint_name?: string;
  detail?: string;
  message?: string;
};

function isPgUniqueViolation(error: unknown): error is PgLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as PgLikeError).code === "23505"
  );
}

function getConstraintName(error: PgLikeError) {
  return error.constraint ?? error.constraint_name ?? "";
}

function uniqueViolationResponse(error: PgLikeError) {
  const constraint = getConstraintName(error);
  const detail = error.detail ?? "";
  const message = error.message ?? "";

  if (
    constraint === "users_email_unique" ||
    detail.includes("(email)") ||
    message.includes("users_email_unique")
  ) {
    return NextResponse.json(
      { message: "Email sudah terdaftar." },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { message: "Data sudah digunakan." },
    { status: 409 }
  );
}

function isUserIdCollision(error: PgLikeError) {
  const constraint = getConstraintName(error);
  const message = error.message ?? "";

  return (
    constraint === "users_pkey" ||
    constraint === "users_id_unique" ||
    message.includes("users_pkey")
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data register tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const passwordHash = await bcrypt.hash(data.password, 12);

    const maxRetries = 5;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await db.transaction(async (tx) => {
          const insertedUsers = await tx
            .insert(users)
            .values({
              name: data.name,
              email: data.email,
              username: data.username,
              phone: data.phone,
              password: passwordHash,
              status: "active",
              role: "pasien",
            })
            .returning({
              id: users.id,
              name: users.name,
              email: users.email,
              username: users.username,
              phone: users.phone,
              status: users.status,
              role: users.role,
            });

          return insertedUsers[0];
        });

        return NextResponse.json(
          {
            message: "Registrasi berhasil.",
            user: result,
          },
          { status: 201 }
        );
      } catch (error) {
        if (!isPgUniqueViolation(error)) {
          throw error;
        }

        if (isUserIdCollision(error) && attempt < maxRetries) {
          continue;
        }

        return uniqueViolationResponse(error);
      }
    }

    return NextResponse.json(
      { message: "Registrasi gagal. Silakan coba lagi." },
      { status: 500 }
    );
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server.",
      },
      { status: 500 }
    );
  }
}