# 📘 Module 9: User Authentication

---

## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Project Setup](#2-project-setup)
3. [User Signup: Extracting & Validating User Input](#3-user-signup-extracting--validating-user-input)
4. [Storing Users in a Database — The Wrong Way](#4-storing-users-in-a-database--the-wrong-way)
5. [Hashing Passwords & Storing User Data The Right Way](#5-hashing-passwords--storing-user-data-the-right-way)
6. [Checking for Email Duplication](#6-checking-for-email-duplication)
7. [Theory: How Does User Authentication Work?](#7-theory-how-does-user-authentication-work)
8. [Choosing a Third-Party Auth Package (Lucia)](#8-choosing-a-third-party-auth-package-lucia)
9. [Creating a New Lucia Auth Instance](#9-creating-a-new-lucia-auth-instance)
10. [Configuring A Session & A Session Cookie](#10-configuring-a-session--a-session-cookie)
11. [Setting Up An Auth Session](#11-setting-up-an-auth-session)
12. [Verifying An Active Auth Session](#12-verifying-an-active-auth-session)
13. [Protecting Routes Against Unauthenticated Access](#13-protecting-routes-against-unauthenticated-access)
14. [Switching Auth Modes With Query Parameters](#14-switching-auth-modes-with-query-parameters)
15. [Adding User Login (via a Server Action)](#15-adding-user-login-via-a-server-action)
16. [Triggering Different Server Actions via Query Parameters](#16-triggering-different-server-actions-via-query-parameters)
17. [Adding an Auth-only Layout](#17-adding-an-auth-only-layout)
18. [One Root Layout vs Multiple Root Layouts](#18-one-root-layout-vs-multiple-root-layouts)
19. [Adding User Logout](#19-adding-user-logout)
20. [Module Summary](#20-module-summary)

---

## 1. Module Introduction

### What Is User Authentication?

**Authentication** is the process of verifying **who a user is**. It answers the question: _"Are you who you say you are?"_

> **Real-world analogy:** Think of authentication like a club with a bouncer. When you arrive, the bouncer checks your ID (verifies your identity). If you're on the list (correct credentials), they stamp your hand (give you a session token). Every time you come back in from outside, they check your stamp (verify your session) instead of asking for your ID again.

```
Authentication vs Authorization:
─────────────────────────────────
Authentication = "Who are you?"
  └── You are user@example.com with password ✅

Authorization = "What are you allowed to do?"
  └── You are allowed to view /dashboard but not /admin
```

### What You'll Build

```
Authentication Features:
┌────────────────────────────────────────────────────────┐
│                                                         │
│  ✅ User Registration (Signup)                          │
│     └── Email + password + validation                   │
│     └── Secure password hashing                        │
│     └── Duplicate email checking                        │
│                                                         │
│  ✅ User Login                                          │
│     └── Email + password verification                   │
│     └── Session creation                                │
│     └── Session cookie                                  │
│                                                         │
│  ✅ Session Management                                  │
│     └── Persistent login across requests                │
│     └── Session expiration                              │
│     └── Server-side session verification                │
│                                                         │
│  ✅ Route Protection                                    │
│     └── Redirect unauthenticated users                  │
│     └── Auth-only layouts                               │
│                                                         │
│  ✅ User Logout                                         │
│     └── Destroy session                                 │
│     └── Clear session cookie                            │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Project Setup

### Creating the Project

```bash
npx create-next-app@latest nextjs-auth-demo
cd nextjs-auth-demo
npm run dev
```

### Installing Required Packages

```bash
# Password hashing
npm install bcryptjs

# Lucia auth library
npm install lucia

# SQLite database adapter for Lucia
npm install @lucia-auth/adapter-sqlite

# SQLite database
npm install better-sqlite3
```

### Project Structure

```
nextjs-auth-demo/
├── app/
│   ├── layout.js              ← Root layout
│   ├── page.js                ← Home page
│   ├── (auth)/                ← Route group for auth pages
│   │   ├── layout.js          ← Auth-specific layout
│   │   └── auth/
│   │       └── page.js        ← Login/Signup page
│   └── training/              ← Protected section
│       └── page.js            ← Requires login
├── lib/
│   ├── auth.js                ← Lucia configuration
│   ├── db.js                  ← Database setup
│   └── users.js               ← User database operations
├── actions/
│   └── auth-actions.js        ← Server Actions for auth
└── training.db                ← SQLite database
```

### Database Setup

```javascript
// lib/db.js
import sql from "better-sqlite3";

const db = sql("training.db");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

export default db;
```

---

## 3. User Signup: Extracting & Validating User Input

### The Signup Form

```jsx
// app/(auth)/auth/page.js
import { signup } from "@/actions/auth-actions";

export default function AuthPage() {
  return (
    <main>
      <h1>Create an Account</h1>
      <form action={signup}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={8}
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}
```

### The Signup Server Action (Initial — Wrong Way First)

```javascript
// actions/auth-actions.js
"use server";

export async function signup(formData) {
  // Step 1: Extract the submitted data
  const email = formData.get("email");
  const password = formData.get("password");

  // Step 2: Validate the input
  // Check email format
  if (!email || !email.includes("@")) {
    return { errors: { email: "Please enter a valid email address." } };
  }

  // Check password length
  if (!password || password.trim().length < 8) {
    return { errors: { password: "Password must be at least 8 characters." } };
  }

  // Step 3: Create the user (we'll implement this next)
  console.log("Creating user:", email);
}
```

### Comprehensive Validation

```javascript
// actions/auth-actions.js
"use server";

function validateSignupData(email, password) {
  const errors = {};

  // Email validation
  if (!email) {
    errors.email = "Email is required.";
  } else if (!email.includes("@") || !email.includes(".")) {
    errors.email = "Please enter a valid email address.";
  }

  // Password validation
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one number.";
  }

  return errors;
}

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = validateSignupData(email, password);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Proceed to create user...
}
```

### Displaying Validation Errors

```jsx
// app/(auth)/auth/page.js
"use client";

import { useFormState } from "react-dom";
import { signup } from "@/actions/auth-actions";

export default function AuthPage() {
  const [state, formAction] = useFormState(signup, {});

  return (
    <main>
      <form action={formAction}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
          {state.errors?.email && <p className="error">{state.errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          {state.errors?.password && (
            <p className="error">{state.errors.password}</p>
          )}
        </div>
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}
```

---

## 4. Storing Users in a Database — The Wrong Way

### The Naive (DANGEROUS) Approach

Let's first look at what **NOT** to do, so we understand why password hashing is critical.

```javascript
// ❌ EXTREMELY DANGEROUS — NEVER DO THIS!
export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Store the password directly in the database
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    generateId(),
    email,
    password,
  ); // ← STORING PLAIN TEXT PASSWORD!
}
```

### Why Storing Plain Text Passwords Is Catastrophic

```
What happens in a database breach with plain text passwords:

Database table (visible to attacker):
┌─────────────────────────────────────┐
│ id │ email            │ password    │
├────┼──────────────────┼─────────────┤
│ 1  │ alice@example.com│ myPassword1 │  ← Attacker can see Alice's password!
│ 2  │ bob@example.com  │ secret123   │  ← Bob's password exposed!
│ 3  │ carol@test.com   │ qwerty2024  │  ← Carol's password exposed!
└─────────────────────────────────────┘

Consequences:
❌ Attacker can log in as any user immediately
❌ Users likely use the SAME PASSWORD on other sites (email, banking!)
❌ Massive security breach, legal liability, trust destroyed
❌ Even your own employees/developers can see user passwords!
```

---

## 5. Hashing Passwords & Storing User Data The Right Way

### What Is Password Hashing?

**Hashing** is a one-way transformation. You put in a password and get out a random-looking string. The key property: **you cannot reverse it** — you cannot get the original password back from the hash.

> **Mental model:** Hashing is like a meat grinder. You put meat in, you get ground meat out. You can NEVER put the ground meat back together to get the original piece. Even if someone steals the ground meat, they can't get the original steak back.

```
Password Hashing:
─────────────────
Input:   "myPassword123"
Process: bcrypt hash function (one-way)
Output:  "$2b$12$K8HFuecAa8HYl3J2PqlhGO..." (60-character hash)

Key Properties:
✅ Deterministic: Same input ALWAYS gives a different output (because of salt!)
✅ One-way: Cannot reverse the hash to get the original password
✅ Slow: bcrypt is intentionally slow (makes brute-force attacks impractical)
✅ Salted: Each hash includes a random "salt" — identical passwords get different hashes
```

### What Is a Salt?

```
Without Salt (DANGEROUS):
  "password123" → "abc123hash"
  "password123" → "abc123hash"  ← SAME hash!

  Problem: Attacker can build a "rainbow table" — a list of common passwords
           and their hashes. Then they just look up the hash in the table!

With Salt:
  "password123" + random_salt_1 → "$2b$12$K8HF..."
  "password123" + random_salt_2 → "$2b$12$mP9x..."  ← DIFFERENT hash!

  Solution: Even if two users have the SAME password, their hashes are DIFFERENT
            Rainbow table attacks don't work!
```

### Installing and Using bcrypt

```bash
npm install bcryptjs
```

```javascript
import bcrypt from "bcryptjs";

// Hashing a password:
const password = "myPassword123";
const saltRounds = 12; // Higher = more secure but slower (12 is a good balance)

const hashedPassword = await bcrypt.hash(password, saltRounds);
// hashedPassword = "$2b$12$K8HFuecAa8HYl3J2PqlhGO..." (60 chars)

// Verifying a password (during login):
const isValid = await bcrypt.compare("myPassword123", hashedPassword);
// isValid = true ✅

const isInvalid = await bcrypt.compare("wrongPassword", hashedPassword);
// isInvalid = false ❌
```

### The Correct Signup Flow

```javascript
// actions/auth-actions.js
"use server";

import bcrypt from "bcryptjs";
import db from "@/lib/db";

function generateUserId() {
  return Math.random().toString(36).substring(2, 15);
}

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Validate input
  const errors = validateSignupData(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // 2. Hash the password BEFORE storing
  const hashedPassword = await bcrypt.hash(password, 12);
  //                                                  ↑ Salt rounds (cost factor)

  // 3. Store the USER with the HASHED password
  const userId = generateUserId();

  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    userId,
    email,
    hashedPassword,
  ); // ← Storing HASH, not plain password!

  // 4. Create a session (coming later)
  // 5. Redirect to protected page
}
```

### What the Database Looks Like Now

```
Database table (secure!):
┌─────────────────────────────────────────────────────────────────────┐
│ id     │ email            │ password                                 │
├────────┼──────────────────┼──────────────────────────────────────────┤
│ abc123 │ alice@example.com│ $2b$12$K8HFuecAa8HYl3J2PqlhGO...        │
│ def456 │ bob@example.com  │ $2b$12$mP9xR3KlQvWjYs4TuN8pZ...         │
└─────────────────────────────────────────────────────────────────────┘

Even if an attacker steals this database:
✅ They cannot see the original passwords
✅ They cannot easily reverse the hashes (bcrypt is computationally expensive)
✅ Rainbow table attacks fail (because of unique salts)
```

---

## 6. Checking for Email Duplication

### Why Check for Duplicate Emails?

```
If we allow duplicate emails:
├── Two users with same email → Ambiguous login
├── User can "register" multiple times with same email
└── Database integrity issues
```

### Implementation

```javascript
// lib/users.js
import db from "./db";

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function createUser(id, email, hashedPassword) {
  return db
    .prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)")
    .run(id, email, hashedPassword);
}
```

```javascript
// actions/auth-actions.js
"use server";

import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/users";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Validate input format
  const errors = validateSignupData(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // 2. Check if email already exists
  const existingUser = getUserByEmail(email);

  if (existingUser) {
    return {
      errors: {
        email:
          "An account with this email already exists. Please login instead.",
      },
    };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user
  const userId = generateId();
  createUser(userId, email, hashedPassword);

  // 5. Create session & redirect (coming next)
}
```

---

## 7. Theory: How Does User Authentication Work?

### The Complete Authentication Flow

This is one of the most important concepts to understand deeply. Let's trace through the entire flow:

#### Step 1: Registration

```
User Registration Flow:
─────────────────────────────────────────────────────
  User fills form:
  ┌────────────────────┐
  │ Email: user@email  │
  │ Password: pass123  │
  └────────────────────┘
          │
          ▼
  Server receives data
          │
          ▼
  Validate email format, password strength
          │
          ▼
  Check: Is email already in database?
  ├── YES → Return error "Email already exists"
  └── NO → Continue
          │
          ▼
  Hash the password:
  "pass123" → "$2b$12$K8HF..."
          │
          ▼
  Store in database:
  { id: "abc", email: "user@email", password: "$2b$12$K8HF..." }
          │
          ▼
  Create a session (login the user automatically)
```

#### Step 2: Creating a Session

```
Why Sessions? The HTTP Problem:
────────────────────────────────
HTTP is STATELESS. Every request is completely independent.
The server has NO MEMORY of previous requests.

Without sessions:
  Request 1: "Here are my credentials" → Server verifies → "OK, you're logged in"
  Request 2: "Show me my dashboard" → Server: "Who are you? I don't remember you!"

With sessions:
  Request 1: "Here are my credentials" → Server verifies → Creates SESSION
             → Gives user a SESSION TOKEN (cookie)
  Request 2: User sends SESSION TOKEN → Server: "I recognize this token! You're logged in!"
```

```
Session Creation:
─────────────────
1. Server generates a unique, random session ID
   Session ID: "a1b2c3d4e5f6g7h8i9j0..."

2. Server stores session in database:
   ┌────────────────────────────────────────────────┐
   │ sessions table                                  │
   │ id: "a1b2c3d4..."   ← The session ID          │
   │ user_id: "abc"      ← Which user this is for  │
   │ expires_at: [timestamp]  ← When it expires     │
   └────────────────────────────────────────────────┘

3. Server sends session ID to browser as a COOKIE:
   Set-Cookie: auth-session=a1b2c3d4...; HttpOnly; Secure; SameSite=Lax
```

#### Step 3: Subsequent Requests

```
Every Authenticated Request:
─────────────────────────────────────────────────────
  Browser automatically sends cookie with EVERY request:
  Cookie: auth-session=a1b2c3d4...
          │
          ▼
  Server reads the cookie value
          │
          ▼
  Server looks up session ID in database:
  SELECT * FROM sessions WHERE id = 'a1b2c3d4...'
          │
  ┌───────┴────────┐
  │                 │
  ▼                 ▼
NOT FOUND       FOUND
  │                 │
  ▼                 ▼
Not logged in   Check expiry
                │
        ┌───────┴────────┐
        │                 │
        ▼                 ▼
    EXPIRED         VALID
        │                 │
        ▼                 ▼
    Delete session   Get user_id from session
    Not logged in    Fetch user data
                     User is logged in ✅
```

#### Step 4: Logout

```
Logout Flow:
─────────────
  User clicks "Logout"
          │
          ▼
  Server Action runs:
  ├── Delete session from database
  └── Clear the session cookie in the browser
          │
          ▼
  Browser no longer has valid session
          │
          ▼
  Next request: No valid cookie → Not logged in
```

### Cookies: The Transport Mechanism

```
What is a Cookie?
──────────────────
A small piece of data stored in the BROWSER.
Automatically sent with EVERY request to the same domain.
Set by the SERVER, stored by the BROWSER.

Important Cookie Security Flags:
┌──────────────────────────────────────────────────────────┐
│  HttpOnly                                                │
│  └── JavaScript CANNOT read this cookie                 │
│      Prevents XSS (Cross-Site Scripting) attacks        │
│                                                          │
│  Secure                                                  │
│  └── Cookie only sent over HTTPS                        │
│      Prevents man-in-the-middle attacks                  │
│                                                          │
│  SameSite=Lax (or Strict)                               │
│  └── Cookie not sent with cross-site requests           │
│      Prevents CSRF (Cross-Site Request Forgery) attacks  │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Choosing a Third-Party Auth Package (Lucia)

### Why Use a Library?

```
Building auth from scratch requires:
├── Understanding cryptographic concepts
├── Implementing session management correctly
├── Handling token rotation
├── Managing cookie security
├── Dealing with session expiration
├── Preventing security vulnerabilities
└── Keeping up with security best practices

One mistake = Security breach!

Using a well-tested library:
├── Security implemented by experts
├── Regularly updated
├── Battle-tested in production
└── You focus on your app logic, not auth internals
```

### Auth Options for Next.js

```
Option 1: NextAuth.js (Auth.js) — Most popular
├── Works with Next.js out of the box
├── Supports many OAuth providers (Google, GitHub, etc.)
├── Good for social login
└── Can be opinionated and complex for custom flows

Option 2: Lucia — Used in this course
├── Lightweight and flexible
├── Framework-agnostic (works with any JS framework)
├── Great for learning (less magic, more transparent)
├── Gives you full control
└── Easy to understand what's happening under the hood

Option 3: Build your own
├── Maximum control
├── Very risky if not done correctly
└── Not recommended for production

Option 4: External services (Clerk, Auth0, Supabase Auth)
├── Easiest to set up
├── Monthly fees for large scale
├── Less control
└── Great for quick projects
```

### Why Lucia for This Course?

```
Lucia is great for learning because:
✅ Transparent — you can see exactly what it does
✅ Flexible — doesn't force you into specific patterns
✅ Simple API — easy to understand
✅ Teaches core concepts — session management, cookies
✅ Production-ready — used in real applications
```

---

## 9. Creating a New Lucia Auth Instance

### Setting Up Lucia

```javascript
// lib/auth.js
import { Lucia } from "lucia";
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
```

### Understanding the Adapter

```
What the Adapter Does:
──────────────────────
Lucia doesn't know about your specific database.
The adapter is a bridge that translates Lucia's operations
to your specific database (SQLite in our case).

Lucia says: "Create a session"
Adapter says: "Ok, I'll run: INSERT INTO sessions ..."

Lucia says: "Get session by ID"
Adapter says: "Ok, I'll run: SELECT * FROM sessions WHERE id = ?"

This pattern allows Lucia to work with ANY database:
SQLite, PostgreSQL, MySQL, MongoDB, etc.
```

### Database Schema Requirements

```javascript
// lib/db.js — Tables must match Lucia's expectations
import sql from "better-sqlite3";

const db = sql("training.db");

// Users table — must have at minimum:
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,    ← Lucia requires id as primary key
    email TEXT NOT NULL UNIQUE,      ← Your custom fields
    password TEXT NOT NULL           ← Your custom fields
  )
`);

// Sessions table — Lucia manages this:
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,    ← Session ID (managed by Lucia)
    expires_at INTEGER NOT NULL,     ← Expiry timestamp (managed by Lucia)
    user_id TEXT NOT NULL,           ← Links to users table
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

export default db;
```

---

## 10. Configuring A Session & A Session Cookie

### Understanding Session Cookies

```
Session Cookie vs Persistent Cookie:
─────────────────────────────────────
Session Cookie:
  ├── No expiry date set
  ├── Deleted when browser is CLOSED
  └── User must log in again after closing browser

Persistent Cookie:
  ├── Has an explicit expiry date (e.g., 30 days)
  ├── Survives browser restarts
  └── User stays logged in for days/weeks

Our configuration:
  expires: false  → Session cookie (safer default)

  But Lucia also automatically extends the session
  if the user is active (within expiry window)
```

### Lucia Session Cookie Config

```javascript
// lib/auth.js
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // Becomes a session cookie
    attributes: {
      // Only send cookie over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // HttpOnly: true by default in Lucia (protects against XSS)
      // SameSite: 'Lax' by default in Lucia (protects against CSRF)
    },
  },
});
```

### Creating a Session (After Signup/Login)

```javascript
// lib/auth.js — Helper function
import { cookies } from "next/headers";

export async function createAuthSession(userId) {
  // 1. Ask Lucia to create a new session for this user
  const session = await lucia.createSession(userId, {});
  //                                                   ↑ Extra session data (empty for now)

  // 2. Get the cookie that Lucia wants to set
  const sessionCookie = lucia.createSessionCookie(session.id);

  // 3. Set the cookie in the browser
  cookies().set(
    sessionCookie.name, // Cookie name (e.g., "auth-session")
    sessionCookie.value, // Cookie value (the session ID)
    sessionCookie.attributes, // Cookie options (HttpOnly, Secure, SameSite, etc.)
  );
}
```

---

## 11. Setting Up An Auth Session

### Complete Signup with Session Creation

```javascript
// actions/auth-actions.js
"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/users";
import { createAuthSession } from "@/lib/auth";

function generateId() {
  // Generate a random unique ID
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 15; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Validate
  const errors = validateSignupData(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // 2. Check for existing user
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return {
      errors: { email: "Email already in use. Please login instead." },
    };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user in database
  const userId = generateId();
  createUser(userId, email, hashedPassword);

  // 5. Create auth session (log the user in!)
  await createAuthSession(userId);

  // 6. Redirect to protected area
  redirect("/training");
}
```

### The `createAuthSession` Function in Detail

```javascript
// lib/auth.js
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSession(userId) {
  // Lucia creates a session record in the database
  const session = await lucia.createSession(userId, {});

  // Lucia creates the cookie data
  const sessionCookie = lucia.createSessionCookie(session.id);

  // Next.js sets the cookie in the response
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
```

---

## 12. Verifying An Active Auth Session

### Reading and Verifying the Session

On every protected request, we need to:

1. Read the session cookie from the browser
2. Look up the session in the database
3. Verify it's valid and not expired
4. Return the user data if valid

```javascript
// lib/auth.js
export async function verifyAuth() {
  // 1. Read the session cookie from the incoming request
  const sessionCookie = cookies().get(lucia.sessionCookieName);

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
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    if (!result.session) {
      // Session is invalid/expired — clear the cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
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
```

### What `lucia.validateSession()` Does

```
lucia.validateSession(sessionId) internally:
──────────────────────────────────────────────
1. Query: SELECT * FROM sessions WHERE id = sessionId
2. If not found → return { session: null, user: null }
3. If found but expired → Delete from DB, return { session: null, user: null }
4. If found and valid:
   a. Check if it's time to refresh (within expiry window)
   b. If refresh needed: Update expires_at in DB, mark session.fresh = true
   c. Query: SELECT * FROM users WHERE id = session.user_id
   d. Return: { session: { id, userId, expiresAt, fresh }, user: { id, ... } }
```

---

## 13. Protecting Routes Against Unauthenticated Access

### Method 1: Protecting Inside the Page Component

```jsx
// app/training/page.js
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TrainingPage() {
  // Verify auth on EVERY request to this page
  const { user } = await verifyAuth();

  if (!user) {
    // User is not authenticated — redirect to login
    redirect("/auth");
  }

  // User IS authenticated — show the protected content
  return (
    <main>
      <h1>Training Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <p>This content is only visible to authenticated users.</p>
    </main>
  );
}
```

### Method 2: Protecting an Entire Section with Middleware

```javascript
// middleware.js (in project root)
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(request) {
  const { user } = await verifyAuth();

  // If not authenticated and accessing a protected route
  if (!user && request.nextUrl.pathname.startsWith("/training")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/training/:path*"],
};
```

### Method 3: Protecting in a Layout

```jsx
// app/training/layout.js
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TrainingLayout({ children }) {
  // All pages inside /training will be protected
  const { user } = await verifyAuth();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="training-layout">
      <aside>
        <nav>
          <p>Logged in as: {user.email}</p>
          {/* Navigation items */}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### Comparison of Protection Methods

```
Method 1: Inside Page Component
  ✅ Simple, straightforward
  ✅ Works perfectly for individual pages
  ❌ Must remember to add to EVERY protected page
  ❌ Code duplication if many pages

Method 2: Middleware
  ✅ One place to protect all routes
  ✅ Request is blocked BEFORE rendering
  ✅ No code duplication
  ❌ More complex setup
  ❌ Limited access to Next.js features

Method 3: Layout Component
  ✅ Protects entire sections at once
  ✅ Can add section-specific UI (sidebar, nav)
  ✅ No code duplication within the section
  ❌ Layout still renders briefly before redirect
```

---

## 14. Switching Auth Modes With Query Parameters

### The Concept: One Page, Two Modes

Instead of separate `/login` and `/register` pages, use **one page** that switches between modes based on a query parameter:

```
URL: /auth?mode=login     → Show login form
URL: /auth?mode=signup    → Show signup form (default)
URL: /auth                → Show signup form (default)
```

### Reading Query Parameters (Search Params)

```jsx
// app/(auth)/auth/page.js
export default function AuthPage({ searchParams }) {
  // searchParams is automatically provided by Next.js for page components
  const mode = searchParams.mode;
  // mode = 'login' if URL is /auth?mode=login
  // mode = undefined if URL is /auth

  const isLoginMode = mode === "login";

  return (
    <main>
      <h1>{isLoginMode ? "Login" : "Create Account"}</h1>

      <form action={isLoginMode ? login : signup}>
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">
          {isLoginMode ? "Login" : "Create Account"}
        </button>
      </form>

      {/* Toggle link */}
      <p>
        {isLoginMode ? (
          <>
            Don't have an account? <a href="/auth?mode=signup">Sign up</a>
          </>
        ) : (
          <>
            Already have an account? <a href="/auth?mode=login">Login</a>
          </>
        )}
      </p>
    </main>
  );
}
```

---

## 15. Adding User Login (via a Server Action)

### The Login Flow

```
User Login Steps:
─────────────────────────────────────────────
1. User submits email + password
2. Find user by email in database
3. Compare submitted password with stored hash
4. If valid → Create session → Redirect
5. If invalid → Return error message
```

### Login Server Action

```javascript
// actions/auth-actions.js
"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/users";
import { createAuthSession } from "@/lib/auth";

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
  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    // ⚠️ Don't say "email not found" — reveals which emails exist
    // Instead, use a generic message
    return {
      errors: { general: "Invalid credentials. Please try again." },
    };
  }

  // 3. Compare the submitted password with the stored hash
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

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
```

### Why Use Generic Error Messages

```
❌ WRONG — Security risk (information disclosure):
  if (!user) return { errors: { email: 'No account with this email.' } };
  if (!match) return { errors: { password: 'Wrong password.' } };

  Why bad?
  ├── Attacker knows which emails have accounts (can target those users)
  ├── Attacker knows password is close (can focus on brute force)
  └── Enables targeted phishing attacks

✅ CORRECT — Generic error:
  return { errors: { general: 'Invalid credentials. Please try again.' } };

  Why good?
  ├── Attacker can't tell if email exists or password is wrong
  ├── No information leakage
  └── Frustrates brute force attacks
```

---

## 16. Triggering Different Server Actions via Query Parameters

### The Challenge

We have two Server Actions (`signup` and `login`) but one form. How do we call the right one based on the mode?

```jsx
// ❌ This doesn't work — action is static
<form action={signup}>
  {/* Cannot dynamically choose between signup and login */}
</form>
```

### Solution 1: Separate Forms

```jsx
// Simplest: Conditionally render different forms
{
  isLoginMode ? (
    <form action={login}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Login</button>
    </form>
  ) : (
    <form action={signup}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Solution 2: One Action That Reads Query Params

```javascript
// actions/auth-actions.js
"use server";

export async function auth(prevState, formData) {
  // Read the mode from the form data
  // We'll pass it as a hidden input or read from the URL
  const mode = formData.get("mode") || "signup";

  if (mode === "login") {
    return await loginUser(formData);
  } else {
    return await signupUser(formData);
  }
}
```

```jsx
// app/(auth)/auth/page.js
import { auth } from "@/actions/auth-actions";

export default function AuthPage({ searchParams }) {
  const mode = searchParams.mode || "signup";

  return (
    <form action={auth}>
      {/* Pass the current mode as a hidden field */}
      <input type="hidden" name="mode" value={mode} />

      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
    </form>
  );
}
```

### Solution 3: Using `formAction` on Buttons

```jsx
import { login, signup } from "@/actions/auth-actions";

export default function AuthPage({ searchParams }) {
  const isLoginMode = searchParams.mode === "login";

  return (
    <form>
      <input type="email" name="email" />
      <input type="password" name="password" />

      {isLoginMode ? (
        <button formAction={login}>Login</button>
      ) : (
        <button formAction={signup}>Create Account</button>
      )}
    </form>
  );
}
```

---

## 17. Adding an Auth-only Layout

### What Is an Auth-only Layout?

An auth-only layout wraps pages that should **only be accessible to authenticated users**. Instead of checking auth in every protected page, the layout handles it once.

```
app/
└── (auth-required)/         ← Route group with auth check
    ├── layout.js             ← Checks auth for ALL pages in this group
    ├── training/
    │   └── page.js           ← Protected (covered by layout)
    └── profile/
        └── page.js           ← Protected (covered by layout)
```

### The Auth-only Layout

```jsx
// app/(auth-required)/layout.js
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  // Check auth for ALL pages wrapped by this layout
  const { user } = await verifyAuth();

  if (!user) {
    // Redirect unauthenticated users to the login page
    redirect("/auth");
  }

  // Auth is valid — render the protected content
  return <div className="protected-layout">{children}</div>;
}
```

### The Protected Page (Much Simpler Now!)

```jsx
// app/(auth-required)/training/page.js
// No auth check needed here — the layout handles it!

export default function TrainingPage() {
  return (
    <main>
      <h1>Welcome to Training</h1>
      <p>This is protected content.</p>
    </main>
  );
}
```

### Benefits of Auth Layout

```
Without Auth Layout:
  app/training/page.js:
    const { user } = await verifyAuth();
    if (!user) redirect('/auth');
    // ... page content

  app/profile/page.js:
    const { user } = await verifyAuth();  // Same check!
    if (!user) redirect('/auth');          // Same redirect!
    // ... page content

  app/dashboard/page.js:
    const { user } = await verifyAuth();  // Same check!
    if (!user) redirect('/auth');          // Same redirect!
    // ... page content

  ❌ Repetition! Forget one page = security hole!

With Auth Layout:
  app/(auth-required)/layout.js:
    const { user } = await verifyAuth();  // Once!
    if (!user) redirect('/auth');          // Once!
    return {children};                     // All pages protected!

  app/(auth-required)/training/page.js:   // Just the content!
  app/(auth-required)/profile/page.js:    // Just the content!
  app/(auth-required)/dashboard/page.js:  // Just the content!

  ✅ DRY (Don't Repeat Yourself)
  ✅ No page left unprotected by accident
```

---

## 18. One Root Layout vs Multiple Root Layouts

### The Problem

The root layout at `app/layout.js` wraps **everything** — including the auth pages (login/signup). But what if your auth pages need a completely different look?

```
app/
├── layout.js              ← Root layout (has Header, Footer)
│   └── Wraps everything, including auth pages
├── auth/
│   └── page.js            ← Auth page (shouldn't have Header/Footer!)
└── training/
    └── page.js            ← Training page (should have Header/Footer)
```

### Solution: Route Groups with Separate Layouts

```
app/
├── (main)/                ← Group for main app (with Header/Footer)
│   ├── layout.js          ← Main layout
│   └── training/
│       └── page.js
│
└── (auth)/                ← Group for auth pages (different/minimal layout)
    ├── layout.js          ← Auth layout (simple, centered)
    └── auth/
        └── page.js
```

### Multiple Root Layouts

Each route group can have its **own root layout** (with `<html>` and `<body>` tags):

```jsx
// app/(main)/layout.js — Main app layout
export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />              {/* Navigation bar */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/(auth)/layout.js — Auth pages layout (minimal)
export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="auth-container">
          <div className="auth-card">
            {children}          {/* Just the login form, centered */}
          </div>
        </div>
      </body>
    </html>
  );
}
```

### When to Use Multiple Root Layouts

```
Use ONE root layout when:
├── All pages share the same basic structure (header, footer)
├── Small app with consistent design
└── Auth pages can be a section within the main layout

Use MULTIPLE root layouts when:
├── Auth pages look completely different (full-screen centered form)
├── Marketing pages vs App pages (different designs)
├── Public vs Admin areas (different branding)
└── You need different <html> or <body> attributes
```

---

## 19. Adding User Logout

### The Logout Flow

```
Logout Steps:
─────────────────────────────────────────────────
1. User clicks "Logout" button
2. Server Action runs:
   a. Read the session cookie
   b. Validate the session (make sure user is actually logged in)
   c. Delete the session from the database
   d. Clear/invalidate the cookie in the browser
3. Redirect to login page
```

### The Destroy Session Helper

```javascript
// lib/auth.js
export async function destroySession() {
  // 1. Verify current session
  const { session } = await verifyAuth();

  if (!session) {
    // No session to destroy
    return;
  }

  // 2. Tell Lucia to invalidate the session
  // This deletes the session from the database
  await lucia.invalidateSession(session.id);

  // 3. Clear the session cookie in the browser
  const sessionCookie = lucia.createBlankSessionCookie();
  // "blank" cookie = same name, but empty value + expired date
  // This effectively deletes the cookie from the browser

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
```

### The Logout Server Action

```javascript
// actions/auth-actions.js
"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";

export async function logout() {
  // Destroy the session
  await destroySession();

  // Redirect to the login page
  redirect("/auth");
}
```

### Logout Button Component

```jsx
// components/auth/logout-button.js
import { logout } from "@/actions/auth-actions";

export default function LogoutButton() {
  return (
    // A form with a button that triggers the logout Server Action
    <form action={logout}>
      <button type="submit">Logout</button>
    </form>
  );
}
```

### Adding Logout to the Navigation

```jsx
// components/main-header.js
import Link from "next/link";
import LogoutButton from "./auth/logout-button";
import { verifyAuth } from "@/lib/auth";

export default async function MainHeader() {
  const { user } = await verifyAuth();

  return (
    <header>
      <nav>
        <Link href="/">Home</Link>

        {user ? (
          // Show these when logged in
          <>
            <Link href="/training">Training</Link>
            <span>Hello, {user.email}</span>
            <LogoutButton />
          </>
        ) : (
          // Show these when logged out
          <>
            <Link href="/auth?mode=login">Login</Link>
            <Link href="/auth?mode=signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
```

---

## 20. Module Summary

### Complete Authentication Flow Recap

```
Module 9: User Authentication — Complete Summary
═══════════════════════════════════════════════════════════════

🔐 CORE CONCEPTS
├── Authentication = Verifying who the user is
├── Authorization = What the user can do
├── Session = Server-side record of a logged-in user
├── Cookie = Browser-side token that references the session
└── Hashing = One-way transformation of passwords (bcrypt)

📝 SIGNUP FLOW
├── 1. Extract email + password from FormData
├── 2. Validate input (format, length, strength)
├── 3. Check for existing user with same email
├── 4. Hash password with bcrypt (12 salt rounds)
├── 5. Generate unique user ID
├── 6. Store user in database (with HASHED password)
├── 7. Create auth session (Lucia)
├── 8. Set session cookie in browser
└── 9. Redirect to protected area

🔑 LOGIN FLOW
├── 1. Extract email + password from FormData
├── 2. Find user by email in database
├── 3. Use bcrypt.compare() to verify password
├── 4. Use generic error messages (don't reveal which field is wrong)
├── 5. If valid: Create auth session
├── 6. Set session cookie in browser
└── 7. Redirect to protected area

🍪 SESSION MANAGEMENT (Lucia)
├── createSession(userId) → Creates DB record + returns session
├── createSessionCookie(sessionId) → Creates cookie data
├── validateSession(sessionId) → Verifies session is valid
├── invalidateSession(sessionId) → Deletes session (logout)
└── createBlankSessionCookie() → Clears cookie from browser

🛡️ ROUTE PROTECTION STRATEGIES
├── In Page: verifyAuth() + redirect() in page component
├── In Layout: verifyAuth() + redirect() in layout component
│   └── Protects all pages in the layout at once
├── In Middleware: verifyAuth() in middleware.js
│   └── Blocks request before any rendering
└── Auth Route Group: (auth-required)/layout.js
    └── DRY pattern — one check for many pages

📁 PROJECT STRUCTURE
├── lib/auth.js — Lucia instance, createAuthSession, verifyAuth, destroySession
├── lib/db.js — Database setup (users + sessions tables)
├── lib/users.js — getUserByEmail, createUser
├── actions/auth-actions.js — signup, login, logout Server Actions
├── app/(auth)/auth/page.js — Login/Signup page
└── app/(auth-required)/layout.js — Protected layout

🔐 SECURITY BEST PRACTICES
├── ✅ Always hash passwords (bcrypt, 12 rounds)
├── ✅ Never store plain text passwords
├── ✅ Use HttpOnly cookies (prevents XSS)
├── ✅ Use Secure cookies in production (HTTPS only)
├── ✅ Use SameSite cookies (prevents CSRF)
├── ✅ Generic error messages (prevents info disclosure)
├── ✅ Validate ALL inputs server-side
├── ✅ Check for duplicate emails
└── ✅ Protect routes (server-side, not client-side only)
```

### Quick Reference Card

```javascript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIB/AUTH.JS — Core Auth Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === "production" },
  },
});

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);
  if (!sessionCookie?.value) return { user: null, session: null };
  const result = await lucia.validateSession(sessionCookie.value);
  return result;
}

export async function destroySession() {
  const { session } = await verifyAuth();
  if (!session) return;
  await lucia.invalidateSession(session.id);
  const blankCookie = lucia.createBlankSessionCookie();
  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIONS/AUTH-ACTIONS.JS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
("use server");
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAuthSession, destroySession } from "@/lib/auth";
import { getUserByEmail, createUser } from "@/lib/users";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  if (existingUser) return { errors: { email: "Email already in use." } };

  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = generateId();
  createUser(userId, email, hashedPassword);
  await createAuthSession(userId);
  redirect("/training");
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const user = getUserByEmail(email);
  if (!user) return { errors: { general: "Invalid credentials." } };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { errors: { general: "Invalid credentials." } };

  await createAuthSession(user.id);
  redirect("/training");
}

export async function logout() {
  await destroySession();
  redirect("/auth");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROTECTING A ROUTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/(auth-required)/layout.js
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const { user } = await verifyAuth();
  if (!user) redirect("/auth");
  return <>{children}</>;
}
```

### Security Checklist

```
Before deploying auth to production:
─────────────────────────────────────
☐ Passwords hashed with bcrypt (12+ rounds)
☐ Generic error messages on login failure
☐ Session cookies set as HttpOnly
☐ Session cookies set as Secure (production)
☐ SameSite cookie attribute configured
☐ Email uniqueness enforced in database
☐ Server-side input validation on ALL inputs
☐ All protected routes verified server-side
☐ Logout properly destroys session in DB
☐ Environment variables for secrets (.env.local)
☐ No sensitive data in client-side code
☐ HTTPS enabled in production
```

---

> **🎯 Key Takeaways:**
>
> - **Never store plain text passwords** — always hash with bcrypt
> - Authentication is fundamentally about **sessions and cookies** — not magic
> - **Lucia** handles the complex session management so you can focus on your app
> - **Protect routes server-side** — client-side protection is easily bypassed
> - Use **generic error messages** on login failure to prevent information leakage
> - A **layout-based protection pattern** (auth-required route group) is the cleanest approach
> - **Route groups** allow you to have different layouts for different sections without affecting URLs
> - The flow is always: Register → Hash password → Store → Create session → Cookie → Subsequent requests use cookie to verify
