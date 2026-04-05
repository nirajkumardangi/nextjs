# 📘 Module 5: Data Fetching - Deep Dive


## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Adding a Backend](#2-adding-a-backend)
3. [Option 1: Client-Side Data Fetching](#3-option-1-client-side-data-fetching)
4. [Option 2: Server-Side Data Fetching](#4-option-2-server-side-data-fetching)
5. [Why Use a Separate Backend? Fetching Directly From the Source!](#5-why-use-a-separate-backend-fetching-directly-from-the-source)
6. [Showing a "Loading" Fallback](#6-showing-a-loading-fallback)
7. [Migrating an Entire Application to a Local Data Source](#7-migrating-an-entire-application-to-a-local-data-source)
8. [Granular Data Fetching with Suspense](#8-granular-data-fetching-with-suspense)
9. [Module Summary](#9-module-summary)

---

## 1. Module Introduction

### What This Module Covers

This module is a **deep dive into data fetching** in Next.js — moving from hard-coded dummy data to real data from databases and external APIs.

```
Module Progression:
┌────────────────────────────────────────────────────┐
│  1. Dummy Data (hard-coded)                        │
│     ↓                                              │
│  2. Separate Backend API (HTTP requests)           │
│     ↓                                              │
│  3. Direct Database Access (no separate API)       │
│     ↓                                              │
│  4. Optimized Loading States (Suspense)            │
└────────────────────────────────────────────────────┘
```

### Key Topics

| Topic                      | What You'll Learn                             |
| -------------------------- | --------------------------------------------- |
| **Client-Side Fetching**   | `useEffect` + `fetch` (traditional React way) |
| **Server-Side Fetching**   | `async` components + direct `fetch`           |
| **Direct Database Access** | Querying SQLite directly in Server Components |
| **Loading States**         | `loading.js` and `<Suspense>`                 |
| **Granular Loading**       | Multiple Suspense boundaries for fine control |

### The Three Approaches to Data Fetching in Next.js

```
┌───────────────────────────────────────────────────────┐
│  Approach 1: Client-Side Fetching                     │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Component → useEffect → fetch → setState        │  │
│  │ (Runs in browser)                               │  │
│  └─────────────────────────────────────────────────┘  │
│  Pros: Familiar to React devs                         │
│  Cons: Slower, bad for SEO, loading spinners          │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  Approach 2: Server-Side Fetching (External API)      │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Server Component → fetch API → render HTML      │  │
│  │ (Runs on server)                                │  │
│  └─────────────────────────────────────────────────┘  │
│  Pros: Better SEO, faster initial load                │
│  Cons: Still needs separate API server                │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  Approach 3: Direct Database Access (Next.js Power!)  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Server Component → Direct DB Query → HTML       │  │
│  │ (No separate API needed!)                       │  │
│  └─────────────────────────────────────────────────┘  │
│  Pros: Simplest, fastest, no extra API layer          │
│  Cons: Couples frontend to backend (design decision)  │
└───────────────────────────────────────────────────────┘
```

---

## 2. Adding a Backend

### Setting Up a Separate Backend Server

For learning purposes, we'll first set up a **separate backend API** using Node.js and Express.

### Step 1: Create Backend Folder

```
project-root/
├── app/           ← Next.js frontend
├── backend/       ← NEW: Separate API server
│   ├── data.db    ← SQLite database
│   ├── app.js     ← Express server
│   └── package.json
└── ...
```

### Step 2: Backend Setup

```bash
cd backend
npm install express sqlite3 cors
```

### Step 3: The Express Server

```javascript
// backend/app.js
const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("./data.db");

// Enable CORS so Next.js can call this API
app.use(cors());

// GET /news — Fetch all news
app.get("/news", (req, res) => {
  db.all("SELECT * FROM news", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /news/:slug — Fetch single news item
app.get("/news/:slug", (req, res) => {
  const { slug } = req.params;
  db.get("SELECT * FROM news WHERE slug = ?", [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(row);
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

### Step 4: Initialize the Database

```javascript
// backend/initdb.js
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./data.db");

db.serialize(() => {
  // Create table
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);

  // Insert dummy data
  const stmt = db.prepare(
    "INSERT INTO news (slug, title, content, date, image) VALUES (?, ?, ?, ?, ?)",
  );

  stmt.run(
    "will-ai-replace-humans",
    "Will AI Replace Humans?",
    "AI content...",
    "2021-07-01",
    "ai-robot.jpg",
  );
  stmt.run(
    "beaver-plague",
    "A Plague of Beavers",
    "Beaver content...",
    "2022-05-01",
    "beaver.jpg",
  );
  stmt.run(
    "couple-cooking",
    "Spend more time together!",
    "Cooking content...",
    "2024-03-01",
    "couple-cooking.jpg",
  );
  stmt.run(
    "hiking",
    "Hiking is the best!",
    "Hiking content...",
    "2024-10-01",
    "hiking.jpg",
  );

  stmt.finalize();

  console.log("Database initialized with dummy data.");
});

db.close();
```

```bash
node initdb.js   # Run once to create database
node app.js      # Start the backend server
```

### Step 5: Test the API

```bash
# In browser or with curl:
http://localhost:8080/news           # Get all news
http://localhost:8080/news/hiking    # Get specific news
```

---

## 3. Option 1: Client-Side Data Fetching

### The Traditional React Approach

This is how you'd fetch data in **regular React** (using `useEffect` and `fetch` in a **Client Component**).

```jsx
// app/news/page.js
"use client"; // ⚠️ Must be Client Component for useEffect

import { useEffect, useState } from "react";
import NewsList from "@/components/news-list";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news.");
        }

        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []); // Empty dependency array = run once on mount

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <h1>All News</h1>
      <NewsList news={news} />
    </>
  );
}
```

### How Client-Side Fetching Works

```
Timeline:
─────────────────────────────────────────────────────────
  0s          1s          2s          3s
  │           │           │           │
  │           │           │           │
  ▼           │           │           │
Component     │           │           │
renders       │           │           │
(empty/       │           │           │
 loading)     │           │           │
              │           │           │
              ▼           │           │
          useEffect       │           │
          fires           │           │
                          │           │
                          ▼           │
                      fetch()         │
                      sends request   │
                                      │
                                      ▼
                                  Response arrives
                                  setNews(data)
                                  Component re-renders
                                  with data

User sees:
  0s → "Loading news..."
  3s → Actual news list
```

### Problems with Client-Side Fetching

```
❌ Problems:
├── Slow: User sees loading spinner for 1-3 seconds
├── Bad SEO: Search engines see empty HTML (no content)
├── More code: useEffect, useState, loading, error handling
├── Browser waterfall: HTML → JS → fetch → data
└── Network latency: Request happens AFTER page loads

Browser receives:
<div>Loading news...</div>  ← Empty! Search engines see nothing.
```

---

## 4. Option 2: Server-Side Data Fetching

### The Next.js Server Component Approach

In Next.js, you can fetch data **directly in Server Components** — no `useEffect`, no `useState`, just `async/await`.

```jsx
// app/news/page.js
// ✅ Server Component (default — no 'use client')

import NewsList from "@/components/news-list";

async function fetchNews() {
  const response = await fetch("http://localhost:8080/news");

  if (!response.ok) {
    throw new Error("Failed to fetch news.");
  }

  return response.json();
}

export default async function NewsPage() {
  // Fetch data directly — no useEffect!
  const news = await fetchNews();

  return (
    <>
      <h1>All News</h1>
      <NewsList news={news} />
    </>
  );
}
```

### How Server-Side Fetching Works

```
Timeline:
─────────────────────────────────────────────────────────
  Server                          Browser
  ──────────────────              ────────────────
  │                                 │
  ▼                                 │
User requests /news                 │
  │                                 │
  ▼                                 │
Server Component runs               │
  │                                 │
  ▼                                 │
await fetch('http://localhost:8080/news')
  │                                 │
  ▼                                 │
Data arrives                        │
  │                                 │
  ▼                                 │
Server renders HTML with data       │
  │                                 │
  ├─────────────────────────────────▶
  │                                 │
  │                                 ▼
  │                           Full HTML received
  │                           (already has data!)
  │                                 │
  │                                 ▼
  │                           User sees content
  │                           immediately ✅

User sees:
  0s → Full news list (no loading spinner!)
```

### Benefits of Server-Side Fetching

```
✅ Benefits:
├── Faster: Data is ready when HTML arrives
├── Better SEO: Search engines see full HTML with content
├── Simpler code: No useEffect, useState, loading states
├── Fewer round trips: Only 1 request (not HTML → JS → fetch)
└── Better UX: No loading spinners
```

### Comparison: Client vs Server Fetching

| Aspect                   | Client-Side               | Server-Side                  |
| ------------------------ | ------------------------- | ---------------------------- |
| **Where it runs**        | Browser                   | Server                       |
| **When data is fetched** | After component mounts    | Before HTML is sent          |
| **User sees**            | Loading spinner → Content | Content immediately          |
| **SEO**                  | ❌ Bad (empty HTML)       | ✅ Excellent (full HTML)     |
| **Code complexity**      | High (hooks, state)       | Low (just async/await)       |
| **Component type**       | Client Component          | Server Component             |
| **Syntax**               | `useEffect` + `useState`  | `async function Component()` |

---

## 5. Why Use a Separate Backend? Fetching Directly From the Source!

### The Problem with a Separate API

```
Current Architecture:
┌─────────────┐         ┌─────────────┐         ┌──────────┐
│   Next.js   │  HTTP   │   Express   │  Query  │ Database │
│   Server    │ ──────→ │   Backend   │ ──────→ │ SQLite   │
│ Component   │         │   (Port     │         │          │
│             │ ←────── │    8080)    │ ←────── │          │
└─────────────┘         └─────────────┘         └──────────┘

Problems:
1. Extra HTTP request (slower)
2. Maintain two servers
3. CORS configuration needed
4. Deploy two applications
5. More moving parts = more failure points
```

### The Next.js Solution: Direct Database Access

```
Simplified Architecture:
┌─────────────┐         ┌──────────┐
│   Next.js   │  Query  │ Database │
│   Server    │ ──────→ │ SQLite   │
│ Component   │ ←────── │          │
└─────────────┘         └──────────┘

Benefits:
✅ Faster (no HTTP overhead)
✅ Simpler (one server instead of two)
✅ Easier deployment
✅ No CORS issues
✅ Type-safe (if using TypeScript with Prisma/Drizzle)
```

### Installing SQLite for Next.js

```bash
npm install better-sqlite3
```

### Creating a Database Utility

```javascript
// lib/news.js
import sql from "better-sqlite3";

const db = sql("news.db");

export function getAllNews() {
  return db.prepare("SELECT * FROM news ORDER BY date DESC").all();
}

export function getNewsItem(slug) {
  return db.prepare("SELECT * FROM news WHERE slug = ?").get(slug);
}

export function getNewsForYear(year) {
  return db
    .prepare(
      `SELECT * FROM news WHERE strftime('%Y', date) = ? ORDER BY date DESC`,
    )
    .all(year);
}

export function getNewsForYearAndMonth(year, month) {
  return db
    .prepare(
      `SELECT * FROM news WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ? ORDER BY date DESC`,
    )
    .all(year, month.toString().padStart(2, "0"));
}

export function getAvailableNewsYears() {
  const years = db
    .prepare(
      "SELECT DISTINCT strftime('%Y', date) as year FROM news ORDER BY year DESC",
    )
    .all()
    .map((row) => row.year);

  return years;
}

export function getAvailableNewsMonths(year) {
  const months = db
    .prepare(
      `SELECT DISTINCT strftime('%m', date) as month FROM news WHERE strftime('%Y', date) = ? ORDER BY month`,
    )
    .all(year)
    .map((row) => row.month);

  return months.map(Number);
}
```

### Using Direct Database Access in a Server Component

```jsx
// app/news/page.js
// ✅ Server Component — can access database directly!

import NewsList from "@/components/news-list";
import { getAllNews } from "@/lib/news";

export default async function NewsPage() {
  // Direct database query — no HTTP request!
  const news = await getAllNews();

  return (
    <>
      <h1>All News</h1>
      <NewsList news={news} />
    </>
  );
}
```

### Before & After Comparison

```javascript
// ❌ BEFORE: Separate API (extra HTTP request)
async function NewsPage() {
  const response = await fetch("http://localhost:8080/news");
  const news = await response.json();
  return <NewsList news={news} />;
}

// ✅ AFTER: Direct database access (no HTTP overhead)
import { getAllNews } from "@/lib/news";
async function NewsPage() {
  const news = await getAllNews(); // Direct DB query!
  return <NewsList news={news} />;
}
```

### Performance Difference

```
Separate API:
Next.js Server → HTTP request → Express API → SQLite → Express → Next.js
Time: ~50-100ms extra for HTTP overhead

Direct Database:
Next.js Server → SQLite → Next.js
Time: ~5-10ms (database query only)

Result: 5-10x faster! 🚀
```

### When to Use Which Approach

```
Use Direct Database Access when:
├── Building a traditional web app (not API-first)
├── You control both frontend and backend
├── Performance is critical
├── Deployment simplicity matters
└── No separate mobile app or third-party consumers

Use Separate API when:
├── Multiple frontends (web + mobile app)
├── Third-party API consumers
├── Microservices architecture
├── Team separation (frontend/backend teams)
└── GraphQL or complex API requirements
```

---

## 6. Showing a "Loading" Fallback

### The Problem: Slow Data Fetching

Even with server-side fetching, data can take time to load (slow database, external API, complex queries). Users need **visual feedback**.

### Simulating a Slow Database Query

```javascript
// lib/news.js
import sql from "better-sqlite3";

const db = sql("news.db");

export async function getAllNews() {
  // Simulate a slow database query
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

  return db.prepare("SELECT * FROM news ORDER BY date DESC").all();
}
```

### Method 1: Using `loading.js`

Create a `loading.js` file in the same folder as `page.js`:

```jsx
// app/news/loading.js
export default function LoadingNews() {
  return (
    <div id="news">
      <p>Loading news...</p>
    </div>
  );
}
```

### How `loading.js` Works

```
User navigates to /news:

1. Next.js sees loading.js exists
2. IMMEDIATELY shows loading.js content
3. In background, fetches data for page.js
4. When data is ready, REPLACES loading.js with page.js

Timeline:
─────────────────────────────────────────────
  0s           2s
  │            │
  ▼            ▼
loading.js → page.js (with data)
```

### File Structure

```
app/
└── news/
    ├── page.js         ← The actual page (fetches data)
    ├── loading.js      ← Loading fallback
    └── ...
```

### Adding Styling to Loading

```jsx
// app/news/loading.js
import classes from "./loading.module.css";

export default function LoadingNews() {
  return (
    <div className={classes.loading}>
      <div className={classes.spinner}></div>
      <p>Loading news...</p>
    </div>
  );
}
```

```css
/* app/news/loading.module.css */
.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

---

## 7. Migrating an Entire Application to a Local Data Source

### Step-by-Step Migration from Dummy Data to Database

#### Step 1: Update the News List Page

```jsx
// app/news/page.js
import NewsList from "@/components/news-list";
import { getAllNews } from "@/lib/news";

export default async function NewsPage() {
  const news = await getAllNews();

  return (
    <>
      <h1>News</h1>
      <NewsList news={news} />
    </>
  );
}
```

#### Step 2: Update the News Detail Page

```jsx
// app/news/[slug]/page.js
import { notFound } from "next/navigation";
import Image from "next/image";
import { getNewsItem } from "@/lib/news";

export default async function NewsDetailPage({ params }) {
  const newsItem = await getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <article className="news-article">
      <header>
        <Image
          src={`/images/news/${newsItem.image}`}
          alt={newsItem.title}
          width={600}
          height={400}
        />
        <h1>{newsItem.title}</h1>
        <time dateTime={newsItem.date}>{newsItem.date}</time>
      </header>
      <p>{newsItem.content}</p>
    </article>
  );
}
```

#### Step 3: Update the Archive Pages

```jsx
// app/archive/[[...filter]]/page.js
import NewsList from "@/components/news-list";
import {
  getAllNews,
  getNewsForYear,
  getNewsForYearAndMonth,
  getAvailableNewsYears,
  getAvailableNewsMonths,
} from "@/lib/news";
import Link from "next/link";

export default async function FilteredNewsPage({ params }) {
  const filter = params.filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let news;
  let links = getAvailableNewsYears();

  if (!filter) {
    news = await getAllNews();
  } else if (selectedYear && !selectedMonth) {
    news = await getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear);
  } else if (selectedYear && selectedMonth) {
    news = await getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = [];
  }

  let newsContent = <p>No news found for the selected period.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  // Validation
  if (
    (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) ||
    (selectedMonth &&
      !getAvailableNewsMonths(selectedYear).includes(+selectedMonth))
  ) {
    throw new Error("Invalid filter.");
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;

              return (
                <li key={link}>
                  <Link href={href}>{link}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}
```

#### Step 4: Add Loading States

```jsx
// app/news/loading.js
export default function LoadingNews() {
  return <p>Loading news...</p>;
}
```

```jsx
// app/archive/[[...filter]]/loading.js
export default function LoadingFilteredNews() {
  return <p>Loading filtered news...</p>;
}
```

```jsx
// app/news/[slug]/loading.js
export default function LoadingNewsDetail() {
  return <p>Loading article...</p>;
}
```

### Benefits of the Migration

```
Before (Dummy Data):
├── Hard-coded arrays in files
├── No persistence
├── Can't add/edit news
├── Static data only
└── No real-world simulation

After (Database):
├── Real data source
├── Persistent storage
├── Can add/edit/delete news
├── Realistic application
└── Production-ready pattern
```

---

## 8. Granular Data Fetching with Suspense

### The Problem with Page-Level Loading

When you use `loading.js`, the **entire page** shows a loading state — even parts that don't need loading.

```
Problem:
┌───────────────────────────────┐
│  "Loading..."                 │  ← Entire page hidden
│  (header hidden)              │
│  (navigation hidden)          │
│  (all content hidden)         │
└───────────────────────────────┘

What we want:
┌────────────────────────────────┐
│  Header (shows immediately)    │  ✅
│  Navigation (shows immediately)│  ✅
│  "Loading..." (only for data)  │  ← Only this part loading
└────────────────────────────────┘
```

### Solution: React `<Suspense>` for Granular Control

`<Suspense>` lets you show loading states for **specific parts** of your page.

### Step 1: Extract Data-Fetching into Separate Components

```jsx
// components/news-list-wrapper.js
import NewsList from "./news-list";
import { getAllNews } from "@/lib/news";

export default async function NewsListWrapper() {
  // This async component fetches data
  const news = await getAllNews();
  return <NewsList news={news} />;
}
```

### Step 2: Wrap with Suspense

```jsx
// app/news/page.js
import { Suspense } from "react";
import NewsListWrapper from "@/components/news-list-wrapper";

export default function NewsPage() {
  return (
    <>
      <h1>News</h1> {/* Shows immediately */}
      <p>Browse all the latest news</p> {/* Shows immediately */}
      {/* Only THIS part shows loading */}
      <Suspense fallback={<p>Loading news...</p>}>
        <NewsListWrapper />
      </Suspense>
    </>
  );
}
```

### How Suspense Works

```
User navigates to /news:

1. Next.js renders the page
2. Header and intro text show IMMEDIATELY ✅
3. When it reaches <Suspense>, it shows the fallback ("Loading news...")
4. In the background, NewsListWrapper fetches data
5. When data arrives, fallback is REPLACED with NewsListWrapper
6. User sees the news list

Timeline:
─────────────────────────────────────────────
  0s                    2s
  │                     │
  ▼                     ▼
Header                Header
Intro text            Intro text
"Loading news..."  →  News list (data loaded)
```

### Multiple Suspense Boundaries (Granular Loading)

You can have **multiple** `<Suspense>` boundaries for different parts of the page:

```jsx
// app/archive/[year]/page.js
import { Suspense } from "react";
import AvailableMonths from "@/components/available-months";
import NewsListForYear from "@/components/news-list-for-year";

export default function YearArchivePage({ params }) {
  return (
    <>
      <h1>News Archive for {params.year}</h1>

      {/* First loading boundary */}
      <Suspense fallback={<p>Loading available months...</p>}>
        <AvailableMonths year={params.year} />
      </Suspense>

      {/* Second loading boundary */}
      <Suspense fallback={<p>Loading news for this year...</p>}>
        <NewsListForYear year={params.year} />
      </Suspense>
    </>
  );
}
```

```jsx
// components/available-months.js
import Link from "next/link";
import { getAvailableNewsMonths } from "@/lib/news";

export default async function AvailableMonths({ year }) {
  // Simulated slow query
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const months = getAvailableNewsMonths(year);

  return (
    <nav>
      <ul>
        {months.map((month) => (
          <li key={month}>
            <Link href={`/archive/${year}/${month}`}>
              {new Date(year, month - 1).toLocaleString("en-US", {
                month: "long",
              })}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

```jsx
// components/news-list-for-year.js
import NewsList from "./news-list";
import { getNewsForYear } from "@/lib/news";

export default async function NewsListForYear({ year }) {
  // Simulated slow query
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const news = await getNewsForYear(year);
  return <NewsList news={news} />;
}
```

### What Happens with Multiple Suspense Boundaries

```
User visits /archive/2024:

0s:
┌─────────────────────────────────┐
│  News Archive for 2024          │  ← Shows immediately
│  "Loading available months..."  │  ← Suspense fallback #1
│  "Loading news for this year..."│  ← Suspense fallback #2
└─────────────────────────────────┘

2s (months load first):
┌─────────────────────────────────┐
│  News Archive for 2024          │
│  January | February | March     │  ← Months loaded!
│  "Loading news for this year..."│  ← Still loading
└─────────────────────────────────┘

3s (news loads):
┌───────────────────────────────┐
│  News Archive for 2024        │
│  January | February | March   │
│  [News list with articles]    │  ← Everything loaded!
└───────────────────────────────┘

Benefits:
✅ User sees content as it becomes available
✅ Perceived performance is better
✅ No "all or nothing" loading
```

### Suspense vs loading.js

| Feature                 | `loading.js`           | `<Suspense>`                             |
| ----------------------- | ---------------------- | ---------------------------------------- |
| **Granularity**         | Entire route segment   | Specific component                       |
| **Control**             | Automatic (file-based) | Manual (wrap components)                 |
| **Multiple boundaries** | ❌ One per route       | ✅ As many as you want                   |
| **Best for**            | Simple pages           | Complex pages with multiple data sources |
| **Flexibility**         | Limited                | High                                     |

### Best Practices for Suspense

```
1. Extract data-fetching into separate async components
2. Wrap each component with its own <Suspense>
3. Show meaningful fallback messages
4. Don't overuse — only for parts that actually take time
5. Combine with loading.js for page-level fallback

Good pattern:
<Suspense fallback={<Skeleton />}>  ← Show skeleton UI
  <SlowComponent />
</Suspense>

Bad pattern:
<Suspense fallback={<p>Loading...</p>}>
  <FastComponent />  ← Loads instantly, suspense not needed
</Suspense>
```

---

## 9. Module Summary

### Everything Covered in This Module

```
Module 5: Data Fetching Deep Dive — Complete Summary
═══════════════════════════════════════════════════════════

📊 THREE APPROACHES TO DATA FETCHING
├── Client-Side Fetching (useEffect + fetch)
│   ├── Runs in browser
│   ├── Slower (waterfall: HTML → JS → fetch → data)
│   ├── Bad SEO (empty initial HTML)
│   ├── Needs loading/error state management
│   └── Use when: Real-time data, user-specific data
│
├── Server-Side Fetching (async Server Component + fetch API)
│   ├── Runs on server
│   ├── Faster (data ready when HTML sent)
│   ├── Great SEO (full HTML with content)
│   ├── Simpler code (no useEffect/useState)
│   └── Use when: Static/shared data, SEO important
│
└── Direct Database Access (Server Component + DB query)
    ├── Runs on server
    ├── Fastest (no HTTP overhead)
    ├── Simplest architecture (no separate API)
    ├── Best DX (direct access, type-safe with Prisma)
    └── Use when: Traditional web app, performance critical

🗄️ DIRECT DATABASE ACCESS
├── Install: npm install better-sqlite3
├── Create utility: lib/news.js
├── Export functions: getAllNews(), getNewsItem(slug)
├── Use in Server Components: const news = await getAllNews()
├── No useEffect, useState, or API routes needed
└── 5-10x faster than separate API

⏳ LOADING STATES
├── Method 1: loading.js (page-level)
│   ├── Create loading.js next to page.js
│   ├── Automatically shows while page.js loads
│   ├── Entire route shows loading state
│   └── Simple but coarse-grained
│
└── Method 2: <Suspense> (component-level)
    ├── Wrap async components with <Suspense>
    ├── Show loading for SPECIFIC parts only
    ├── Multiple boundaries for different parts
    ├── Granular control over what shows when
    └── Better UX (progressive content loading)

🎯 SUSPENSE PATTERN
├── Extract data-fetching into separate async component
├── Wrap component with <Suspense fallback={...}>
├── Rest of page renders immediately
├── Suspense shows fallback while component loads
├── When data arrives, replaces fallback with component
└── Can have multiple Suspense boundaries

📦 MIGRATION CHECKLIST
├── 1. Set up database (SQLite + better-sqlite3)
├── 2. Create database utility functions (lib/news.js)
├── 3. Convert Client Components to Server Components
├── 4. Replace useEffect + fetch with direct DB calls
├── 5. Add loading.js files for routes
├── 6. Extract slow parts into separate components
├── 7. Wrap with <Suspense> for granular loading
└── 8. Test all routes and loading states
```

### Quick Reference Card

```jsx
// ❌ Client-Side Fetching (old way)
'use client';
import { useEffect, useState } from 'react';
export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  return <List data={data} />;
}

// ✅ Server-Side Fetching with External API
export default async function Page() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return <List data={data} />;
}

// ✅✅ Direct Database Access (best!)
import { getData } from '@/lib/db';
export default async function Page() {
  const data = await getData();  // Direct DB query!
  return <List data={data} />;
}

// 📦 Database Utility
// lib/news.js
import sql from 'better-sqlite3';
const db = sql('news.db');

export function getAllNews() {
  return db.prepare('SELECT * FROM news').all();
}

export function getNewsItem(slug) {
  return db.prepare('SELECT * FROM news WHERE slug = ?').get(slug);
}

// ⏳ Loading with loading.js
// app/news/loading.js
export default function Loading() {
  return <p>Loading news...</p>;
}

// 🎯 Granular Loading with Suspense
// app/news/page.js
import { Suspense } from 'react';
export default function Page() {
  return (
    <>
      <h1>News</h1>  {/* Shows immediately */}
      <Suspense fallback={<p>Loading...</p>}>
        <SlowNewsList />  {/* Only this shows loading */}
      </Suspense>
    </>
  );
}

// components/slow-news-list.js
import { getAllNews } from '@/lib/news';
export default async function SlowNewsList() {
  await new Promise(r => setTimeout(r, 2000));  // Simulate slow query
  const news = await getAllNews();
  return <NewsList news={news} />;
}
```

### Decision Tree: Which Fetching Method?

```
Do you need real-time, user-specific data?
├── YES → Client-Side Fetching (useEffect + fetch)
│          Example: Live chat, user notifications
│
└── NO → Are you building a public API?
    ├── YES → Separate API (Route Handlers)
    │          Example: Mobile app + web app
    │
    └── NO → Is it a traditional web app?
        └── YES → Direct Database Access ✅ (best choice!)
                   Example: Blog, e-commerce, news site

Performance Ranking:
1. 🥇 Direct Database Access (fastest)
2. 🥈 Server-Side Fetch from External API
3. 🥉 Client-Side Fetch (slowest)
```

### Loading State Decision Tree

```
Is the entire page slow to load?
├── YES → Use loading.js
│          Simple, automatic, covers whole route
│
└── NO → Do you have multiple slow parts?
    ├── YES → Use multiple <Suspense> boundaries
    │          Granular control, better UX
    │
    └── NO → Do you have one slow part?
        └── YES → Use single <Suspense>
                   Shows rest of page immediately
```

### Architecture Evolution

```
Stage 1: Dummy Data
app/page.js → const DUMMY_DATA = [...]

Stage 2: Separate API
app/page.js → fetch('http://localhost:8080/api') → Express → SQLite

Stage 3: Direct Database (Final)
app/page.js → import { getData } from '@/lib/db' → SQLite

Result: Simpler, faster, more maintainable! 🚀
```

---

> **🎯 Key Takeaways:**
>
> - **Server Components** are the default and preferred way to fetch data in Next.js
> - **Direct database access** eliminates the need for a separate API in many cases
> - Use **`loading.js`** for simple page-level loading states
> - Use **`<Suspense>`** for granular, component-level loading control
> - **Async Server Components** make data fetching as simple as `await getData()`
> - This pattern is **production-ready** and used by major Next.js applications
