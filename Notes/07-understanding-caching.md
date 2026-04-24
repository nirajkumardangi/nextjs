# 📘 Module 7: Understanding & Configuring Caching

---

## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Making Sense of Next.js' Caching Types](#2-making-sense-of-nextjs-caching-types)
3. [Project Setup](#3-project-setup)
4. [Handling Request Memoization](#4-handling-request-memoization)
5. [Understanding The Data Cache & Cache Settings](#5-understanding-the-data-cache--cache-settings)
6. [Controlling Data Caching](#6-controlling-data-caching)
7. [Making Sense of The Full Route Cache](#7-making-sense-of-the-full-route-cache)
8. [On-Demand Cache Invalidation with revalidatePath & revalidateTag](#8-on-demand-cache-invalidation-with-revalidatepath--revalidatetag)
9. [Setting Up Request Memoization For Custom Data Sources](#9-setting-up-request-memoization-for-custom-data-sources)
10. [Setting Up Data Caching For Custom Data Sources](#10-setting-up-data-caching-for-custom-data-sources)
11. [Invalidating Custom Data Source Data](#11-invalidating-custom-data-source-data)
12. [Module Summary](#12-module-summary)

---

## 1. Module Introduction

### Why Caching Matters

Caching is one of the **most powerful** features of Next.js — and also one of the **most misunderstood**. If you've ever been frustrated that your changes don't show up on screen, or wondered why your production app shows stale data, caching is the answer.

> **Think of caching like this:** Imagine you run a bakery. Instead of baking fresh bread for every single customer, you bake a large batch in the morning and serve from that batch all day. This is fast and efficient. But if a customer wants gluten-free bread that wasn't in your batch, you need a strategy. Next.js caching works the same way — it "pre-bakes" responses and serves them, but you control when to make a fresh batch.

### The Core Problem Caching Solves

```
Without Caching:
─────────────────
Every user visits /products:
  User 1 → Server fetches 500 products from DB → Renders HTML → Sends to User 1
  User 2 → Server fetches 500 products from DB → Renders HTML → Sends to User 2
  User 3 → Server fetches 500 products from DB → Renders HTML → Sends to User 3

  Problems:
  ❌ Database hit on EVERY request (slow)
  ❌ Wastes server resources
  ❌ Slow response time under high traffic

With Caching:
─────────────
First user visits /products:
  User 1 → Server fetches from DB → Renders HTML → CACHES the result → Sends to User 1

All subsequent users:
  User 2 → Server returns CACHED HTML immediately → No DB hit!
  User 3 → Server returns CACHED HTML immediately → No DB hit!
  User 4 → Server returns CACHED HTML immediately → No DB hit!

  Benefits:
  ✅ Database queried only ONCE (or occasionally)
  ✅ Much faster response times
  ✅ Handles high traffic with ease
```

### What You'll Learn

```
Module 7 Learning Path:
┌────────────────────────────────────────────────────────┐
│                                                         │
│  1. The 4 Caching Mechanisms in Next.js                 │
│     (understand what each one does)                     │
│                                                         │
│  2. How to CONTROL each caching mechanism               │
│     (opt in, opt out, configure duration)               │
│                                                         │
│  3. How to INVALIDATE caches                            │
│     (tell Next.js "refresh this data now")              │
│                                                         │
│  4. Caching with CUSTOM data sources                    │
│     (databases like SQLite, not just fetch API)         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Making Sense of Next.js' Caching Types

### The Big Picture: 4 Layers of Caching

Next.js has **four distinct caching mechanisms**, each operating at a different level. Understanding the difference between them is the key to mastering Next.js performance.

```
The 4 Caching Layers in Next.js:
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Layer 1: REQUEST MEMOIZATION                            │
│  ─────────────────────────────                           │
│  Scope:    Single request/render cycle                   │
│  Duration: Gone when response is sent                    │
│  What:     Deduplicates identical fetch() calls           │
│                                                           │
│  Layer 2: DATA CACHE                                     │
│  ────────────────────                                    │
│  Scope:    Server-wide                                   │
│  Duration: Persistent (survives multiple requests)        │
│  What:     Caches fetch() responses                      │
│                                                           │
│  Layer 3: FULL ROUTE CACHE                               │
│  ─────────────────────────                               │
│  Scope:    Server-wide                                   │
│  Duration: Persistent (until revalidation)               │
│  What:     Caches rendered HTML + RSC payload            │
│                                                           │
│  Layer 4: ROUTER CACHE                                   │
│  ───────────────────────                                 │
│  Scope:    Individual browser (client-side)              │
│  Duration: Session (until page refresh or expiry)        │
│  What:     Caches visited pages in browser               │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Layer 1: Request Memoization

> **Mental model:** Think of this like a **short-term memory within a single restaurant order**. If the waiter needs to check the same thing twice during your order (like "is this table available?"), they remember the answer instead of asking again. Once your order is complete, that memory is wiped.

```
What it solves:
────────────────
When multiple components in the same render tree need the same data,
they would each trigger a separate fetch() call.

Example:
  Layout.js calls: fetch('/api/user/profile')
  Header.js calls: fetch('/api/user/profile')
  Sidebar.js calls: fetch('/api/user/profile')

Without memoization: 3 separate network requests!
With memoization: Only 1 request — the other two use the cached result

How it works:
  First call  → fetch('/api/user/profile') → Makes real HTTP request → Stores result
  Second call → fetch('/api/user/profile') → Returns stored result (no HTTP request!)
  Third call  → fetch('/api/user/profile') → Returns stored result (no HTTP request!)

Duration:
  Only lasts for the DURATION OF A SINGLE REQUEST
  Once the server has sent the response to the browser, this cache is WIPED
```

### Layer 2: Data Cache

> **Mental model:** Think of this like a **warehouse that stores fetched data between requests**. The first time you order a product, the warehouse gets it from the supplier. The next time someone orders the same product, the warehouse already has it — no need to contact the supplier again.

```
What it solves:
────────────────
Even across different user requests, the same API call (fetch) might return
the same data. Why hit the API server every time?

Example:
  Request 1 (User A visits) → fetch('/api/products') → API responds → STORED in Data Cache
  Request 2 (User B visits) → fetch('/api/products') → Data Cache returns stored result!
  Request 3 (User C visits) → fetch('/api/products') → Data Cache returns stored result!

  The API server is only hit ONCE for all three users!

Duration:
  By default: INDEFINITE (stays forever until manually cleared or redeployed)
  You can configure: Time-based expiry (e.g., 60 seconds)
  You can: Opt out completely (always fetch fresh data)

Only works with:
  ✅ The native fetch() API
  ❌ Does NOT work with Axios, got, node-fetch by default
  ❌ Does NOT work with direct database queries (SQLite, Prisma, etc.)
```

### Layer 3: Full Route Cache

> **Mental model:** Think of this like a **printed newspaper vs a live TV broadcast**. The newspaper is printed once in the morning and distributed — everyone gets the same printed version. If big news happens, you'd need to print a new edition. The Full Route Cache is like that newspaper — pages are "printed" (rendered) once and served to all users.

```
What it solves:
────────────────
Rendering a React component tree to HTML takes computation.
Why do it for EVERY request if the result doesn't change?

Example:
  User A visits /about → Next.js renders the page → STORES the HTML → Sends to User A
  User B visits /about → Next.js returns STORED HTML (no rendering needed!) → Sends to User B
  User C visits /about → Next.js returns STORED HTML → Sends to User C

What exactly is cached:
  1. The rendered HTML (what the browser receives)
  2. The RSC (React Server Component) payload (what React uses for client navigation)

Duration:
  By default: At BUILD TIME (static pages are cached forever)
  Dynamic pages: Can still be cached after first request
  Until: Redeployment OR cache invalidation (revalidatePath, revalidateTag)

When it's NOT used:
  ❌ Dynamic routes that use cookies(), headers(), searchParams
  ❌ Routes that opt out with dynamic = 'force-dynamic'
  ❌ Routes that opt out with revalidate = 0
```

### Layer 4: Router Cache (Client-Side)

> **Mental model:** Think of this like your **browser's Back button**. When you go to a page, come back, and go forward again — the browser remembers where you were. It doesn't reload the entire page. The Router Cache works similarly but for Next.js route segments.

```
What it solves:
────────────────
When a user navigates around your app using <Link>, you want
navigation to feel instant — like a mobile app, not a website.

How it works:
  User visits /home → Page loaded
  User clicks link to /products → Page loaded and CACHED in browser memory
  User clicks Back → /home shown from browser cache (INSTANT! No server request!)
  User navigates to /products again → INSTANT! Already in cache!

Duration:
  Static pages: 5 minutes
  Dynamic pages: 30 seconds
  Until: Hard refresh OR specific invalidation

Where it runs:
  BROWSER (client-side) — not on the server
  This is automatic — you don't set it up

Important:
  This is DIFFERENT from the other 3 caches (which are server-side)
  You control the server caches; the Router Cache is automatic
```

### The 4 Caches: Side-by-Side

| Cache                   | Where?               | Duration                | What?                   | You Control? |
| ----------------------- | -------------------- | ----------------------- | ----------------------- | ------------ |
| **Request Memoization** | Server (per request) | Single request only     | `fetch()` deduplication | Partially    |
| **Data Cache**          | Server (persistent)  | Indefinite by default   | `fetch()` responses     | ✅ Fully     |
| **Full Route Cache**    | Server (persistent)  | Build time / indefinite | Rendered HTML + RSC     | ✅ Fully     |
| **Router Cache**        | Browser              | 30s-5min                | Visited route segments  | ❌ Automatic |

---

## 3. Project Setup

### Creating the Demo Project

```bash
npx create-next-app@latest nextjs-caching-demo
cd nextjs-caching-demo
npm run dev
```

### Project Overview

```
nextjs-caching-demo/
├── app/
│   ├── layout.js
│   ├── page.js              ← Home
│   ├── messages/
│   │   ├── page.js          ← Messages list
│   │   └── [id]/
│   │       └── page.js      ← Single message
│   └── api/
│       └── messages/
│           └── route.js     ← API endpoint
├── lib/
│   └── messages.js          ← Data utilities
└── public/
```

### A Simple Backend API

```javascript
// app/api/messages/route.js
import { NextResponse } from "next/server";
import { getAllMessages } from "@/lib/messages";

export async function GET() {
  const messages = getAllMessages();
  return NextResponse.json(messages);
}
```

```javascript
// lib/messages.js — Simulates a database
const MESSAGES = [
  { id: "m1", text: "Hello World", timestamp: Date.now() },
  { id: "m2", text: "How are you?", timestamp: Date.now() },
  { id: "m3", text: "What is up?", timestamp: Date.now() },
];

export function getAllMessages() {
  return MESSAGES;
}

export function getMessage(id) {
  return MESSAGES.find((m) => m.id === id);
}
```

---

## 4. Handling Request Memoization

### The Problem: Multiple Identical Fetch Calls

In a complex Next.js app, many components in the same render tree might need the same data. Without memoization, each component would make a **separate network request** — even in the same request cycle.

```jsx
// Imagine these components all render during a single page request:

// app/layout.js (Server Component)
export default async function RootLayout({ children }) {
  const messages = await fetch('http://localhost:3000/api/messages');
  //                           ↑ Fetch #1
  return (
    <html>
      <body>
        <Sidebar messages={messages} />
        {children}
      </body>
    </html>
  );
}

// app/messages/page.js (Server Component)
export default async function MessagesPage() {
  const messages = await fetch('http://localhost:3000/api/messages');
  //                           ↑ Fetch #2 — same URL!
  return <MessageList messages={messages} />;
}

// components/message-count.js (Server Component)
export default async function MessageCount() {
  const messages = await fetch('http://localhost:3000/api/messages');
  //                           ↑ Fetch #3 — same URL again!
  return <span>{messages.length} messages</span>;
}
```

### How Next.js Solves This: Request Memoization

Next.js automatically **deduplicates** identical `fetch()` calls within the same render cycle:

```
Without Memoization (what you might expect):
  Render starts
  ├── RootLayout: fetch('/api/messages') → HTTP Request 1 → 50ms wait
  ├── MessagesPage: fetch('/api/messages') → HTTP Request 2 → 50ms wait
  └── MessageCount: fetch('/api/messages') → HTTP Request 3 → 50ms wait
  Total: 3 HTTP requests, ~150ms

With Memoization (what Next.js does automatically):
  Render starts
  ├── RootLayout: fetch('/api/messages') → HTTP Request 1 → 50ms wait → STORED
  ├── MessagesPage: fetch('/api/messages') → No HTTP request → Returns stored result → 0ms!
  └── MessageCount: fetch('/api/messages') → No HTTP request → Returns stored result → 0ms!
  Total: 1 HTTP request, ~50ms
```

### Seeing Memoization in Action

```jsx
// app/messages/page.js
export default async function MessagesPage() {
  // Both of these calls reference the SAME URL
  const response1 = await fetch("http://localhost:3000/api/messages");
  const response2 = await fetch("http://localhost:3000/api/messages");

  // Despite two fetch() calls, only ONE HTTP request is made!
  // The second call returns the memoized (cached) result from the first

  const messages1 = await response1.json();
  const messages2 = await response2.json();

  console.log("Are they equal?", messages1.length === messages2.length);
  // true — same data, from the memoized result!
}
```

### Important: Request Memoization Only Works with `fetch()`

```
✅ Works with:
  fetch('http://localhost:3000/api/messages')
  fetch('https://api.external.com/data')

❌ Does NOT work with:
  import sql from 'better-sqlite3';
  db.prepare('SELECT * FROM messages').all();  // Direct DB — no memoization!

  axios.get('http://localhost:3000/api/messages')  // Axios — no memoization!
```

> We'll cover how to set up memoization for custom data sources (like SQLite) later in this module.

### When Does Memoization Reset?

```
Memoization ONLY exists for the duration of a single server request.
Once Next.js has sent the response to the browser, the memoization cache is WIPED.

Timeline:
  Request A arrives
  ├── fetch('/api/data') → Memoized (stored in memory)
  ├── fetch('/api/data') → Returns memoized result
  └── Response sent to browser
  ← Memoization cache WIPED for this request

  Request B arrives (new request)
  ├── fetch('/api/data') → NEW HTTP request (memoization started fresh)
  └── ...
```

---

## 5. Understanding The Data Cache & Cache Settings

### What Is the Data Cache?

The **Data Cache** is different from Request Memoization. While memoization only lasts for one request, the Data Cache **persists across multiple requests**. It stores the results of `fetch()` calls on the **server's file system**.

> **Think of it this way:** Request Memoization is like your **working memory** (RAM) — fast but cleared constantly. The Data Cache is like your **hard drive** — it persists between uses and has to be explicitly cleared.

### How the Data Cache Works

```
First Request (User A):
  Server receives request for /messages
  ├── fetch('http://localhost:3000/api/messages')
  │     ↓ Not in Data Cache
  │     ↓ Makes real HTTP request to API
  │     ↓ API returns data
  │     ↓ DATA STORED IN DATA CACHE ← (persisted to disk/memory)
  └── Returns response to User A

Second Request (User B):
  Server receives request for /messages
  ├── fetch('http://localhost:3000/api/messages')
  │     ↓ FOUND IN DATA CACHE ← (no HTTP request made!)
  │     ↓ Returns cached data immediately
  └── Returns response to User B (with SAME data as User A)

Nth Request (User Z):
  Same as User B — cached data returned instantly
```

### The Default Behavior (Before Next.js 15)

```
In Next.js 14 and earlier:
  fetch() calls are CACHED BY DEFAULT
  The result is stored indefinitely until you manually clear it

  This means: Data from 6 months ago might be shown unless you clear the cache!

  // This is cached forever by default:
  const response = await fetch('https://api.example.com/products');
```

### The Default Behavior (Next.js 15 — What This Course Covers)

```
In Next.js 15:
  fetch() calls are NOT cached by default
  Each request fetches fresh data

  // This fetches fresh data on every request (default in Next.js 15):
  const response = await fetch('https://api.example.com/products');

  // To cache, you must explicitly opt in:
  const response = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }  // Cache for 1 hour
  });
```

> **Important:** This is a significant change between versions! If you're looking at older tutorials, they may show caching as the default. In Next.js 15, you **opt in** to caching.

### Checking Current Cache Behavior

You can verify what's happening by adding timestamps to your data:

```jsx
// app/messages/page.js
export default async function MessagesPage() {
  const response = await fetch("http://localhost:3000/api/messages");
  const messages = await response.json();

  return (
    <div>
      <p>Fetched at: {new Date().toISOString()}</p>
      {/* If this timestamp is the same on every refresh, data is cached */}
      {/* If it changes on every refresh, data is fresh (not cached) */}
    </div>
  );
}
```

---

## 6. Controlling Data Caching

### The `cache` Option on `fetch()`

You can control caching on a **per-fetch-call** basis using the `cache` option:

```jsx
// Option 1: No caching (always fetch fresh data)
const response = await fetch("https://api.example.com/data", {
  cache: "no-store", // Never cache this request
});

// Option 2: Use cache (default behavior — up to Next.js to decide)
const response = await fetch("https://api.example.com/data", {
  cache: "force-cache", // Use cached data if available
});
```

### The `next.revalidate` Option — Time-Based Revalidation

> **Mental model:** Think of this like a **milk expiry date**. Milk is cached in your fridge and is good for 7 days. After that, it "expires" and you need fresh milk. `revalidate` sets the expiry time for your cached data.

```jsx
// Revalidate every 5 seconds
const response = await fetch("https://api.example.com/messages", {
  next: { revalidate: 5 }, // Cache for 5 seconds, then fetch fresh
});

// Revalidate every 1 hour
const response = await fetch("https://api.example.com/products", {
  next: { revalidate: 3600 }, // 3600 seconds = 1 hour
});

// Revalidate every 24 hours
const response = await fetch("https://api.example.com/static-data", {
  next: { revalidate: 86400 }, // 86400 seconds = 24 hours
});

// Never cache (always fresh)
const response = await fetch("https://api.example.com/live-data", {
  cache: "no-store",
});

// Cache forever (until manual revalidation)
const response = await fetch("https://api.example.com/static", {
  cache: "force-cache",
});
```

### How Time-Based Revalidation Works (ISR - Incremental Static Regeneration)

```
With revalidate: 5 (5 seconds):

  t=0s: First request → Fetch from API → Cache result
        User sees: fresh data

  t=3s: Second request → Data is still < 5s old → Return cached data
        User sees: cached data (from t=0)

  t=6s: Third request → Data is > 5s old → Return cached data (stale)
                                           → ALSO trigger background refresh
        User sees: stale data (from t=0) BUT...

  t=7s: Background refresh completes → New data cached

  t=8s: Fourth request → Return newly cached data (from t=7s)
        User sees: fresh data!

Key insight: The FIRST user after expiry sees stale data
             The NEXT user after background refresh sees fresh data
             This is called "stale-while-revalidate"
```

### Page-Level Cache Control

You can control caching for an **entire page** from the page file:

```jsx
// app/messages/page.js

// Option 1: Revalidate the entire page every 5 seconds
export const revalidate = 5;

// Option 2: Never cache this page (always dynamic)
export const dynamic = "force-dynamic";

// Option 3: Always use cache (never refetch)
export const dynamic = "force-static";

export default async function MessagesPage() {
  const response = await fetch("http://localhost:3000/api/messages");
  const messages = await response.json();

  return (
    <div>
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
    </div>
  );
}
```

### Practical Decisions: Which Cache Setting to Use?

```
Data changes rarely (e.g., product catalog, blog posts):
  → Use: next: { revalidate: 3600 }  // 1 hour
  → Or: cache: 'force-cache' with manual revalidation

Data changes frequently (e.g., news feed, stock prices):
  → Use: next: { revalidate: 30 }   // 30 seconds
  → Or: cache: 'no-store'           // No cache at all

Data is real-time (e.g., live chat, live scores):
  → Use: cache: 'no-store'
  → Or: export const dynamic = 'force-dynamic'

Data is completely static (e.g., about page content, company info):
  → Use: cache: 'force-cache'       // Cache forever
  → Or: export const dynamic = 'force-static'
```

---

## 7. Making Sense of The Full Route Cache

### What Is the Full Route Cache?

The **Full Route Cache** operates at a higher level than the Data Cache. While the Data Cache stores **raw fetched data**, the Full Route Cache stores the **fully rendered HTML output** of a route.

> **Think of it like a printing press:** The Data Cache stores the raw ingredients (data). The Full Route Cache stores the finished printed page. If the ingredients haven't changed, you don't need to print a new page — just serve the existing printed copy.

### What Exactly Gets Cached

```
When a route is cached in the Full Route Cache, two things are stored:

1. The HTML (what the browser renders)
   └── <html><body><h1>Hello</h1>...</body></html>

2. The RSC (React Server Component) Payload
   └── A special format Next.js uses for client-side navigation
       (Not the HTML, but a description of what components to render)
```

### The Difference Between Data Cache and Full Route Cache

```
Data Cache:
  Input:  fetch('https://api.example.com/messages')
  Stores: The JSON response from the API
  { messages: [{ id: 1, text: "Hello" }, ...] }

Full Route Cache:
  Input:  A request to /messages page
  Stores: The complete rendered HTML of that page
  "<html><body><ul><li>Hello</li>...</ul></body></html>"

  PLUS the RSC payload for client-side navigation
```

### When Is the Full Route Cache Used?

```
The Full Route Cache is used at BUILD TIME for STATIC pages.

Build Time: When you run 'npm run build', Next.js:
  1. Identifies which pages are "static" (don't depend on request-specific data)
  2. Renders those pages
  3. Stores the rendered HTML in the Full Route Cache
  4. When users visit those pages → Served from cache (incredibly fast!)

What makes a page STATIC (can be cached):
  ✅ No cookies(), headers(), or searchParams usage
  ✅ No dynamic = 'force-dynamic'
  ✅ No revalidate = 0
  ✅ Data fetching with cache: 'force-cache' or revalidate > 0

What makes a page DYNAMIC (cannot be cached):
  ❌ Uses cookies() or headers()
  ❌ Uses searchParams in the component
  ❌ Has dynamic = 'force-dynamic'
  ❌ Has revalidate = 0 or cache: 'no-store' fetch calls
```

### Visualizing the Relationship

```
           BUILD TIME                    REQUEST TIME
           ──────────                    ────────────

  Static Pages:            User visits static page:
  ┌────────────┐            ├── Full Route Cache HIT
  │   Render   │            └── Cached HTML served immediately
  │   Pages    │
  │            │            User visits dynamic page:
  │   Store    │            ├── Full Route Cache MISS
  │   HTML in  │            ├── Data Cache checked
  │   Full     │            │   ├── HIT → Use cached data
  │   Route    │            │   └── MISS → Fetch from API
  │   Cache    │            ├── Render the page fresh
  └────────────┘            └── Optionally store in Full Route Cache
```

### Example: Understanding Static vs Dynamic

```jsx
// STATIC page — Will be in Full Route Cache after build
// app/about/page.js
export default function AboutPage() {
  // No data fetching, no dynamic content
  return (
    <main>
      <h1>About Us</h1>
      <p>We are a great company.</p>
    </main>
  );
}

// STATIC page with cached data — Can be in Full Route Cache
// app/products/page.js
export default async function ProductsPage() {
  // This fetch uses cache: 'force-cache' (or has revalidate)
  const response = await fetch('https://api.example.com/products', {
    cache: 'force-cache'
  });
  const products = await response.json();

  return <ProductList products={products} />;
}

// DYNAMIC page — CANNOT be in Full Route Cache
// app/dashboard/page.js
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const session = cookies().get('session');  // ← Makes this dynamic!

  return (
    <main>
      <h1>Dashboard for {session?.value}</h1>
    </main>
  );
}
```

### Build Output Reveals Caching

```bash
npm run build

# Output shows which pages are static vs dynamic:
# ○ (Static)   prerendered as static content
# ● (Dynamic)  server-rendered on demand

# ○ /about          (Static — Full Route Cache)
# ○ /products       (Static — Full Route Cache)
# ● /dashboard      (Dynamic — NOT cached)
# ● /feed           (Dynamic — NOT cached if using cookies)
```

---

## 8. On-Demand Cache Invalidation with revalidatePath & revalidateTag

### The Problem: Stale Data

Imagine you have a blog. Your posts page is cached (both Data Cache and Full Route Cache). You write a new post. The cache still shows old posts! You need to **tell Next.js to clear the cache** and fetch fresh data.

> **Mental model:** Think of `revalidatePath` as **pressing the "refresh" button** on a specific cached page on the server. `revalidateTag` is like pressing "refresh" on all pages that used data with a specific label.

### `revalidatePath()` — Invalidate by URL Path

```javascript
import { revalidatePath } from "next/cache";

// In a Server Action:
export async function createPost(formData) {
  "use server";

  // Store the new post
  await storeNewPost(formData);

  // NOW clear the cache for specific paths
  revalidatePath("/posts"); // Clear /posts page
  revalidatePath("/"); // Clear home page
  revalidatePath("/posts", "layout"); // Clear /posts AND all nested pages
  revalidatePath("/", "layout"); // Clear EVERYTHING (nuclear option)

  redirect("/posts");
}
```

### How `revalidatePath()` Affects the Caches

```
revalidatePath('/posts') affects:

1. Data Cache:
   ├── Any fetch() calls on the /posts page are cleared
   └── Next request to /posts will fetch fresh data

2. Full Route Cache:
   ├── The cached HTML for /posts is cleared
   └── Next request to /posts will re-render the page

What it does NOT affect:
   ❌ The Data Cache for other pages
   ❌ The Full Route Cache for other pages
   ❌ The Router Cache (client-side, automatic)
```

### `revalidateTag()` — Invalidate by Tag Label

Tags give you **finer control** over cache invalidation. Instead of invalidating by URL, you tag your `fetch()` calls and invalidate by tag.

#### Step 1: Tag Your Fetch Calls

```javascript
// When fetching, add a tag
const response = await fetch("https://api.example.com/messages", {
  next: {
    revalidate: 3600, // Cache for 1 hour
    tags: ["messages"], // ← Tag this data with 'messages'
  },
});

// You can add multiple tags
const response = await fetch(
  "https://api.example.com/messages?type=important",
  {
    next: {
      tags: ["messages", "important-messages"], // Multiple tags
    },
  },
);
```

#### Step 2: Invalidate by Tag

```javascript
import { revalidateTag } from "next/cache";

export async function deleteMessage(messageId) {
  "use server";

  // Delete from database
  await deleteMessageFromDb(messageId);

  // Invalidate ALL data tagged with 'messages'
  // This affects any fetch() that used tags: ['messages']
  // on ANY page in the app!
  revalidateTag("messages");

  redirect("/messages");
}
```

### `revalidatePath` vs `revalidateTag` — When to Use Which?

```
Use revalidatePath when:
├── You know exactly which page(s) need to be refreshed
├── Simple apps with clear page-to-data relationships
└── Example: "After creating a post, refresh /posts"

  revalidatePath('/posts');  // Simple and direct

Use revalidateTag when:
├── The same data appears on MULTIPLE pages
├── You want to be precise about WHICH data to clear
└── Example: "User data appears on /profile, /dashboard, /settings —
               I want to clear user data everywhere at once"

  // When fetching user data anywhere:
  fetch('/api/user', { next: { tags: ['user', 'user-profile'] } })

  // When updating user:
  revalidateTag('user');  // Clears ONLY user data everywhere
```

### Practical Example: Blog Application

```javascript
// Tagging fetch calls
async function fetchPosts() {
  const res = await fetch("https://api.example.com/posts", {
    next: { tags: ["posts"] },
  });
  return res.json();
}

async function fetchPost(id) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: ["posts", `post-${id}`] },
  });
  return res.json();
}

// Invalidating after mutations
export async function createPost(formData) {
  "use server";
  await savePost(formData);
  revalidateTag("posts"); // Refreshes all pages using 'posts' tag
  redirect("/posts");
}

export async function updatePost(id, formData) {
  "use server";
  await updatePostInDb(id, formData);
  revalidateTag(`post-${id}`); // Only refreshes the specific post
  revalidateTag("posts"); // Also refresh the list
  redirect(`/posts/${id}`);
}

export async function deletePost(id) {
  "use server";
  await deletePostFromDb(id);
  revalidateTag("posts"); // Refresh the list
  revalidatePath("/"); // Maybe home page shows recent posts
  redirect("/posts");
}
```

---

## 9. Setting Up Request Memoization For Custom Data Sources

### The Problem with Direct Database Access

As we learned, Request Memoization automatically works with `fetch()`. But what about **direct database access** (SQLite, Prisma, etc.)?

```javascript
// ❌ Direct database calls are NOT automatically memoized!
import sql from "better-sqlite3";
const db = sql("messages.db");

// In Layout.js:
const messages = db.prepare("SELECT * FROM messages").all();
// → Database query #1

// In Page.js:
const messages = db.prepare("SELECT * FROM messages").all();
// → Database query #2 (same query! No memoization!)
```

### The Solution: React's `cache()` Function

React provides a `cache()` function that wraps any function and **memoizes it for the duration of a request** — just like what `fetch()` does automatically.

```javascript
import { cache } from "react";

// Wrap your data-fetching function with cache()
export const getAllMessages = cache(function getAllMessages() {
  // This function is now memoized!
  const db = getDb();
  return db.prepare("SELECT * FROM messages").all();
});
```

### How `cache()` Works

```
Without cache():

  Render starts
  ├── Layout.js: getAllMessages() → DB Query #1 → returns data
  ├── Page.js: getAllMessages() → DB Query #2 → returns data
  └── Sidebar.js: getAllMessages() → DB Query #3 → returns data
  Total: 3 database queries!

With cache():

  Render starts
  ├── Layout.js: getAllMessages() → DB Query #1 → returns data → MEMOIZED
  ├── Page.js: getAllMessages() → No DB query → returns MEMOIZED data
  └── Sidebar.js: getAllMessages() → No DB query → returns MEMOIZED data
  Total: 1 database query!
```

### Implementation

```javascript
// lib/messages.js
import { cache } from "react";
import sql from "better-sqlite3";

function getDb() {
  return sql("messages.db");
}

// Wrap with cache() for Request Memoization
export const getAllMessages = cache(function getAllMessages() {
  console.log("Fetching messages from DB...");
  // This log appears ONCE even if called multiple times per request

  const db = getDb();
  return db.prepare("SELECT * FROM messages").all();
});

// Another memoized function
export const getMessage = cache(function getMessage(id) {
  console.log("Fetching message from DB:", id);

  const db = getDb();
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
});
```

### Using in Components

```jsx
// app/layout.js (Server Component)
import { getAllMessages } from '@/lib/messages';

export default async function RootLayout({ children }) {
  const messages = await getAllMessages();
  // ↑ First call — runs database query
  return (
    <html>
      <body>
        <Sidebar count={messages.length} />
        {children}
      </body>
    </html>
  );
}

// app/messages/page.js (Server Component)
import { getAllMessages } from '@/lib/messages';

export default async function MessagesPage() {
  const messages = await getAllMessages();
  // ↑ Second call in same request — returns MEMOIZED result (no new DB query!)
  return <MessageList messages={messages} />;
}
```

### `cache()` vs `fetch()` Memoization

```
fetch() — Automatic Memoization:
  ✅ Works automatically
  ✅ Deduplicated within a request
  ✅ Also integrated with Data Cache (persistent)
  ❌ Only for HTTP requests

cache() — Manual Memoization:
  ✅ Works with ANY function (DB queries, file reads, etc.)
  ✅ Deduplicated within a request
  ❌ Does NOT persist across requests (request-scoped only)
  ❌ Must be applied manually
```

---

## 10. Setting Up Data Caching For Custom Data Sources

### The Problem: `cache()` Doesn't Persist

`cache()` from React gives us **Request Memoization** — but it resets on every request. The **Data Cache** (which persists across requests) only works with `fetch()` by default.

> **The gap:** If you're using SQLite or Prisma directly, your data is fetched fresh on EVERY request (no persistent cache), even if the data hasn't changed.

### Solution: Use `fetch()` to Talk to Your Own API

One approach is to **wrap your database in an API endpoint** and use `fetch()` to call it:

```javascript
// app/api/messages/route.js — Your own API
import { getAllMessages } from "@/lib/messages";

export async function GET() {
  const messages = getAllMessages();
  return Response.json(messages);
}

// app/messages/page.js — Use fetch() to call your own API
export default async function MessagesPage() {
  const response = await fetch("http://localhost:3000/api/messages", {
    next: { revalidate: 5 }, // Now you have Data Cache with 5s revalidation!
  });
  const messages = await response.json();
  return <MessageList messages={messages} />;
}
```

### Why This Works

```
Direct DB access (no persistent cache):
  Request A → DB Query → Returns data (no cache)
  Request B → DB Query → Returns data (no cache)
  Request C → DB Query → Returns data (no cache)

  Every request hits the database!

fetch() to your own API (with Data Cache):
  Request A → fetch('/api/messages') → Data Cache MISS → API called → DB queried → CACHED
  Request B → fetch('/api/messages') → Data Cache HIT → Returns cached data (no API call!)
  Request C → fetch('/api/messages') → Data Cache HIT → Returns cached data (no API call!)

  Database is queried only ONCE (or after revalidation)!
```

### Alternative: The `unstable_cache` Function

Next.js provides `unstable_cache` to add Data Cache behavior to **any function** (not just `fetch()`):

```javascript
import { unstable_cache } from "next/cache";

// Wrap your database function with unstable_cache
export const getAllMessages = unstable_cache(
  function getAllMessages() {
    const db = sql("messages.db");
    return db.prepare("SELECT * FROM messages").all();
  },
  ["all-messages"], // ← Cache key (unique identifier)
  {
    revalidate: 5, // ← Revalidate every 5 seconds
    tags: ["messages"], // ← Tag for revalidateTag()
  },
);
```

### Understanding `unstable_cache` Arguments

```javascript
unstable_cache(
  dataFetcher, // The function to cache
  cacheKey, // Array of strings — unique identifier for this cache
  options, // { revalidate, tags }
);

// Example:
export const getUserData = unstable_cache(
  async (userId) => {
    const db = getDb();
    return db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  },
  ["user-data"], // Cache key — should be unique across your app
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["users"], // Can be invalidated with revalidateTag('users')
  },
);

// The cache key should be UNIQUE for each different function
// Even if you have multiple unstable_cache wrappers:
export const getAllUsers = unstable_cache(
  () => db.prepare("SELECT * FROM users").all(),
  ["all-users"], // Different key!
  { tags: ["users"] },
);

export const getAdminUsers = unstable_cache(
  () => db.prepare("SELECT * FROM users WHERE role = 'admin'").all(),
  ["admin-users"], // Different key!
  { tags: ["users", "admins"] },
);
```

### How `unstable_cache` Works

```
First call to getAllMessages():
  ├── Check cache with key ['all-messages']
  ├── Not found (cache miss)
  ├── Execute the inner function (DB query)
  ├── Store result with key ['all-messages']
  └── Return result

Second call to getAllMessages() (same request or different request):
  ├── Check cache with key ['all-messages']
  ├── Found! (cache hit)
  ├── Is it older than revalidate (5s)?
  │   ├── NO → Return cached result (no DB query!)
  │   └── YES → Return cached result AND schedule background refresh
  └── Return result

This IS the Data Cache — persistent across requests!
```

### Comparing the Three Approaches

```
Approach 1: Direct DB (no caching):
  getAllMessages() → DB query → Returns data
  Every single request hits the database
  ❌ Slow under load

Approach 2: cache() wrapper (Request Memoization only):
  getAllMessages() → DB query → Returns data
  Same request: Memoized (no extra DB queries)
  Different requests: Still hits DB every time
  ✅ Good for same-request deduplication
  ❌ No cross-request caching

Approach 3: unstable_cache wrapper (Data Cache):
  First request: getAllMessages() → DB query → CACHED
  All subsequent requests: getAllMessages() → Returns cached data
  After 5 seconds: Returns stale + schedules refresh
  ✅ Cross-request caching
  ✅ Can be tagged for invalidation
  ✅ Time-based revalidation

Approach 4: fetch() to your own API (Data Cache via fetch):
  fetch('/api/messages') → (API route) → DB query → CACHED in Data Cache
  All subsequent requests: Returns cached fetch response
  ✅ Same as Approach 3 but uses fetch() Data Cache
  ❌ Extra HTTP request overhead
```

---

## 11. Invalidating Custom Data Source Data

### The Challenge

When using `unstable_cache`, you need to make sure that `revalidateTag()` and `revalidatePath()` work correctly to clear your custom data source cache.

### Setting Up Tags for Invalidation

```javascript
// lib/messages.js
import { unstable_cache } from "next/cache";
import { cache } from "react";
import sql from "better-sqlite3";

function getDb() {
  return sql("messages.db");
}

// unstable_cache with tags
export const getAllMessages = unstable_cache(
  function () {
    return getDb().prepare("SELECT * FROM messages").all();
  },
  ["messages"], // Cache key
  { tags: ["messages"] }, // Tag for revalidation
);

export const getMessage = unstable_cache(
  function (id) {
    return getDb().prepare("SELECT * FROM messages WHERE id = ?").get(id);
  },
  ["message"], // Cache key
  { tags: ["messages"] }, // Same tag — will be invalidated together
);
```

### Invalidating in Server Actions

```javascript
// actions/messages.js
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { storeMessage } from "@/lib/messages";

export async function createMessage(formData) {
  const text = formData.get("message");

  if (!text || text.trim().length === 0) {
    return { error: "Message cannot be empty." };
  }

  // Store in database
  storeMessage({ text, userId: 1 });

  // Invalidate the cache!
  revalidateTag("messages"); // Clears all caches tagged with 'messages'
  // OR:
  revalidatePath("/messages"); // Clears /messages page cache

  redirect("/messages");
}
```

### Combining `cache()` and `unstable_cache`

For the best of both worlds — **Request Memoization** AND **Data Cache**:

```javascript
// lib/messages.js
import { cache } from "react";
import { unstable_cache } from "next/cache";
import sql from "better-sqlite3";

// Inner function: database query
function fetchAllMessagesFromDb() {
  return sql("messages.db").prepare("SELECT * FROM messages").all();
}

// Wrap with unstable_cache for Data Cache (cross-request caching)
const getCachedMessages = unstable_cache(
  fetchAllMessagesFromDb,
  ["all-messages"],
  {
    revalidate: 5,
    tags: ["messages"],
  },
);

// Wrap with cache() for Request Memoization (within-request deduplication)
export const getAllMessages = cache(getCachedMessages);

// Result:
// ✅ Within a single request: Memoized (cache() does this)
// ✅ Across requests: Cached for 5 seconds (unstable_cache does this)
// ✅ Can be invalidated: revalidateTag('messages') works
```

### Testing the Cache Invalidation

```
Before creating a message:
  GET /messages → Returns 3 messages (from cache)
  GET /messages → Returns 3 messages (from cache — no DB hit!)

Create a new message (triggers Server Action):
  createMessage() → Stores in DB → revalidateTag('messages')
  ← Cache cleared!

After creating a message:
  GET /messages → DB hit → Returns 4 messages → CACHED again
  GET /messages → Returns 4 messages (from cache)
```

---

## 12. Module Summary

### The Complete Picture

```
Module 7: Caching — Complete Summary
══════════════════════════════════════════════════════════════

🗄️ THE 4 CACHING LAYERS
├── Layer 1: Request Memoization
│   ├── Where: Server RAM (per request)
│   ├── Duration: Single request only
│   ├── What: Deduplicates identical fetch() calls
│   ├── Auto: Yes (for fetch)
│   └── Manual: cache() from 'react' (for DB queries)
│
├── Layer 2: Data Cache
│   ├── Where: Server (persistent storage)
│   ├── Duration: Indefinite (configurable)
│   ├── What: fetch() response data
│   ├── Auto: No in Next.js 15 (must opt in)
│   └── Manual: next: { revalidate: N } or unstable_cache
│
├── Layer 3: Full Route Cache
│   ├── Where: Server (persistent)
│   ├── Duration: Build time / indefinite
│   ├── What: Rendered HTML + RSC payload
│   ├── Auto: Yes (for static pages at build time)
│   └── Control: export const dynamic / revalidate
│
└── Layer 4: Router Cache
    ├── Where: Browser (client-side)
    ├── Duration: 30s (dynamic) / 5min (static)
    ├── What: Visited route segments
    ├── Auto: Yes (completely automatic)
    └── Control: None (automatic)

⚙️ CONTROLLING FETCH() CACHING
├── No cache: cache: 'no-store'
├── Always cache: cache: 'force-cache'
├── Time-based: next: { revalidate: 60 }
├── Tagged: next: { tags: ['my-tag'] }
└── Page-level: export const revalidate = 60

♻️ CACHE INVALIDATION
├── revalidatePath('/path')
│   └── Clears Data Cache + Full Route Cache for a path
├── revalidatePath('/path', 'layout')
│   └── Clears path AND all nested paths
├── revalidateTag('tag-name')
│   └── Clears all fetch() calls with that tag
└── export const dynamic = 'force-dynamic'
    └── Never cache this page

🔧 CUSTOM DATA SOURCES (Non-fetch)
├── Request Memoization:
│   └── cache() from 'react'
│       export const getMessages = cache(function() {
│         return db.prepare('SELECT *').all();
│       });
│
└── Data Cache (persistent):
    └── unstable_cache from 'next/cache'
        export const getMessages = unstable_cache(
          function() { return db.prepare('SELECT *').all(); },
          ['messages-key'],
          { revalidate: 60, tags: ['messages'] }
        );

🔄 VERSION DIFFERENCES
├── Next.js 14: fetch() cached by default (opt OUT to avoid)
└── Next.js 15: fetch() NOT cached by default (opt IN to cache)

📊 DECISION GUIDE
Data changes:
├── Never → cache: 'force-cache' (permanent cache)
├── Rarely (hourly) → next: { revalidate: 3600 }
├── Sometimes (5 min) → next: { revalidate: 300 }
├── Frequently (realtime) → cache: 'no-store'
└── After mutations → revalidatePath / revalidateTag
```

### Quick Reference Card

```javascript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FETCH() CACHE CONTROL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// No caching (always fresh):
fetch(url, { cache: "no-store" });

// Cache forever (until manual invalidation):
fetch(url, { cache: "force-cache" });

// Time-based (revalidate every 60 seconds):
fetch(url, { next: { revalidate: 60 } });

// Tagged (for revalidateTag):
fetch(url, { next: { tags: ["my-data"] } });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE-LEVEL CACHE CONTROL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Always dynamic (never cached):
export const dynamic = "force-dynamic";

// Always static:
export const dynamic = "force-static";

// Revalidate every N seconds:
export const revalidate = 60;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CACHE INVALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { revalidatePath, revalidateTag } from "next/cache";

// Clear a specific page:
revalidatePath("/messages");

// Clear page + all nested pages:
revalidatePath("/messages", "layout");

// Clear everything:
revalidatePath("/", "layout");

// Clear by tag:
revalidateTag("messages");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOM DATA SOURCES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Request Memoization (within-request):
import { cache } from "react";
export const getData = cache(function getData() {
  return db.prepare("SELECT * FROM data").all();
});

// Data Cache (persistent across requests):
import { unstable_cache } from "next/cache";
export const getData = unstable_cache(
  function getData() {
    return db.prepare("SELECT * FROM data").all();
  },
  ["data-key"],
  { revalidate: 60, tags: ["data"] },
);

// Both combined (best of both worlds):
export const getData = cache(
  unstable_cache(() => db.prepare("SELECT * FROM data").all(), ["data-key"], {
    revalidate: 60,
    tags: ["data"],
  }),
);
```

### Common Caching Mistakes

```
❌ Mistake 1: Not calling revalidatePath after mutations
  After creating a post, the feed still shows old posts.
  Fix: Always call revalidatePath('/feed') after mutations.

❌ Mistake 2: Using cache: 'no-store' everywhere
  This kills all caching benefits.
  Fix: Only opt out of caching when data truly needs to be real-time.

❌ Mistake 3: Forgetting the difference between dev and production
  In development, caching is minimal.
  In production, caching is aggressive.
  Fix: Always test caching behavior with npm run build + npm start.

❌ Mistake 4: Not using unstable_cache for DB queries
  Direct DB queries are not cached — every request hits the DB.
  Fix: Wrap DB functions with unstable_cache for persistent caching.

❌ Mistake 5: Using cache() and expecting cross-request persistence
  cache() from React only lasts for ONE request.
  Fix: Use unstable_cache for cross-request data persistence.
```

---

> **🎯 Key Takeaways:**
>
> - Next.js has **4 caching layers**, each serving a different purpose
> - **Request Memoization** deduplicates fetch() calls within a single request
> - The **Data Cache** persists fetch() results across multiple requests
> - The **Full Route Cache** stores fully-rendered HTML for static pages
> - The **Router Cache** is automatic client-side caching you don't control
> - In **Next.js 15**, caching is NOT the default — you opt in
> - Use **`cache()` from React** for custom data source memoization
> - Use **`unstable_cache`** from Next.js for persistent custom data caching
> - Always call **`revalidatePath()`** or **`revalidateTag()`** after mutations
> - Test caching in **production mode** — development behaves differently
