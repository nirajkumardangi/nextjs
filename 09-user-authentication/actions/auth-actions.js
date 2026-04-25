"use server";

import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/user";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createAuthSession, destroySession } from "@/lib/auth";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  // store it in the database (create a new user)
  const hashedPassword = hashUserPassword(password);
  try {
    const userId = createUser(email, hashedPassword);
    await createAuthSession(userId);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "Entered email alredy exits, plz choose different email",
        },
      };
    }

    throw error;
  }

  redirect("/training");
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Basic validation
  if (!email || !password) {
    return {
      errors: { general: "Please enter your email and password." },
    };
  }

  // 2. Find user by email
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: { general: "Invalid credentials. Please try again." },
    };
  }

  // 3. Compare the submitted password with the stored hash
  const passwordMatch = verifyPassword(existingUser.password, password);

  if (!passwordMatch) {
    return {
      errors: { general: "Invalid credentials. Please try again." },
    };
  }

  // 4. Password is correct! Create a session
  await createAuthSession(existingUser.id);

  // 5. Redirect to protected area
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return await login(prevState, formData);
  } else {
    return await signup(prevState, formData);
  }
}

export async function logout() {
  await destroySession();
  redirect("/");
}
