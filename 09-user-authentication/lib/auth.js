import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";

// Create an adapter that connects Lucia to your SQLite database
const adapter = new BetterSqlite3Adapter(db, {
  user: "users", // Name of your users table
  session: "sessions", // Name of your sessions table
});

// Create the Lucia auth instance
export const lucia = new Lucia(adapter, {
  // Configure the session cookie
  sessionCookie: {
    expires: false, // Session-based cookie (expires when browser closes)
    attributes: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
    },
  },
});

// Helper function
export async function createAuthSession(userId) {
  // 1. Ask Lucia to create a new session for this user
  const session = await lucia.createSession(userId, {});
  //                                                ↑ Extra session data (empty for now)

  // 2. Get the cookie that Lucia wants to set
  const sessionCookie = lucia.createSessionCookie(session.id);

  // 3. Set the cookie in the browser
  const cookieStore = await cookies();

  cookieStore.set(
    sessionCookie.name, // Cookie name (e.g., "auth-session")
    sessionCookie.value, // Cookie value (the session ID)
    sessionCookie.attributes, // Cookie options (HttpOnly, Secure, SameSite, etc.)
  );
}

export async function verifyAuth() {
  const cookieStore = await cookies();

  // 1. Read the session cookie from the incoming request
  const sessionCookie = cookieStore.get(lucia.sessionCookieName);

  // 2. If no cookie, user is not logged in
  if (!sessionCookie || !sessionCookie.value) {
    return { user: null, session: null };
  }

  const sessionId = sessionCookie.value;

  // 3. Ask Lucia to validate the session ID
  let result;
  try {
    result = await lucia.validateSession(sessionId);
    // result = { session: {...}, user: {...} } if valid
    // result = { session: null, user: null } if invalid/expired
  } catch {
    return { user: null, session: null };
  }

  // 4. Handle session refresh (Lucia automatically extends session life)
  try {
    if (result.session && result.session.fresh) {
      // Session was refreshed — update the cookie with the new expiry
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    if (!result.session) {
      // Session is invalid/expired — clear the cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Next.js throws when trying to set cookies during rendering
    // (can only set cookies during actions or route handlers)
  }

  return result;
}
