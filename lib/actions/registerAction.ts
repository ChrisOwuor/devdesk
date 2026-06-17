"use server";

import { registerSchema } from "../validations/auth";
import prisma from "../prisma";
import bcrypt from "bcryptjs";

export type RegisterActionState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function registerAction(
  _: RegisterActionState | null,
  formData: FormData,
): Promise<RegisterActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  // 1. check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "User already exists" };
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. create user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
}
