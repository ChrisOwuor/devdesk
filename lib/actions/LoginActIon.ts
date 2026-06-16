"use server";

import { signIn } from "../auth";
import { loginSchema } from "../validations/auth";

export async function loginAction(_: any, formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
    };
  }
  console.log(parsed);

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/app",
    });

    return { success: true };
  } catch (e) {
    console.log(e);
    return {
      error: "Invalid email or password",
    };
  }
}
