import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { or, eq } from "drizzle-orm";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";