// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
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
      .max(255, "Nama terlalu panjang."),

    email: z
      .string()
      .email("Format email tidak valid.")
      .max(255, "Email terlalu panjang.")
      .transform((value) => value.toLowerCase().trim()),

    phone: z
      .string()
      .min(10, "Nomor HP minimal 10 digit.")
      .max(20, "Nomor HP terlalu panjang.")
      .regex(/^[0-9+ -]+$/, "Nomor HP tidak valid."),

    username: z
      .string()
      .min(4, "Username minimal 4 karakter.")
      .max(100, "Username terlalu panjang.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh berisi huruf, angka, dan underscore."
      )
      .transform((value) => value.toLowerCase().trim()),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter."),

    confirmPassword: z.string(),

    role: z.enum(["Super Admin", "Perawat", "Pasien", "Finance", "Dokter", "Apoteker", "Admin", "Laboratory"],{
    message: "Role Tidak Tersedia"}
    ),

    terms: z.boolean().refine((value) => value === true, {
      message: "Syarat dan Ketentuan wajib disetujui.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

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

    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .where(
        or(
          eq(users.email, data.email),
          eq(users.username, data.username)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      const found = existingUser[0];

      if (found.email === data.email) {
        return NextResponse.json(
          { message: "Email sudah terdaftar." },
          { status: 409 }
        );
      }

      if (found.username === data.username) {
        return NextResponse.json(
          { message: "Username sudah digunakan." },
          { status: 409 }
        );
      }
    }

    

    const passwordHash = await bcrypt.hash(data.password, 12);

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
          role: data.role
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          username: users.username,
          phone: users.phone,
          status: users.status,
          role: users.role
        });


    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil.",
        user: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}