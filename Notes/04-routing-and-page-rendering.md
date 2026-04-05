# 📘 Module 4: Routing and Page Rendering - Deep Dive


## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Project Setup, Overview & Exercise](#2-project-setup-overview--exercise)
3. [Exercise Solution - Building the News App](#3-exercise-solution--building-the-news-app)
4. [App Styling & Using Dummy Data](#4-app-styling--using-dummy-data)
5. [Handling "Not Found" Errors](#5-handling-not-found-errors--showing-not-found-pages)
6. [Setting Up & Using Parallel Routes](#6-setting-up--using-parallel-routes)
7. [Working with Parallel Routes & Nested Routes](#7-working-with-parallel-routes--nested-routes)
8. [Configuring Catch-All Routes](#8-configuring-catch-all-routes)
9. [Catch-All Fallback Routes & Multiple Path Segments](#9-catch-all-fallback-routes--dealing-with-multiple-path-segments)
10. [Throwing Route-Related Errors](#10-throwing-route-related-errors)
11. [Handling Errors With Error Pages](#11-handling-errors-with-error-pages)
12. [Server vs Client Components (Deep Dive)](#12-server-vs-client-components-deep-dive)
13. [Nested Routes Inside Dynamic Routes](#13-nested-routes-inside-dynamic-routes)
14. [Intercepting Navigation & Using Interception Routes](#14-intercepting-navigation--using-interception-routes)
15. [Combining Parallel & Intercepting Routes](#15-combining-parallel--intercepting-routes)
16. [Replace page.js with default.js](#16-replace-pagejs-with-defaultjs)
17. [Navigating Programmatically](#17-navigating-programmatically)
18. [Defining the Base HTML Document](#18-defining-the-base-html-document)
19. [Using & Understanding Route Groups](#19-using--understanding-route-groups)
20. [Building APIs with Route Handlers](#20-building-apis-with-route-handlers)
21. [Using Middleware](#21-using-middleware)
22. [Module Summary](#22-module-summary)

---

## 1. Module Introduction

### What This Module Covers

This module is a **deep dive** into Next.js routing and rendering — covering advanced routing patterns and concepts that go beyond the basics.

```
Module 3:  Core routing concepts (basics)
Module 4:  Advanced routing patterns (deep dive)

Topics Covered:
├── Parallel Routes (@slot syntax)
├── Intercepting Routes ((.)folder syntax)
├── Catch-all routes ([...slug])
├── Optional catch-all routes ([[...slug]])
├── Route Groups ((folder))
├── default.js file
├── Server vs Client Components (deeper understanding)
├── Route Handlers (API routes)
├── Middleware
├── Programmatic navigation
└── Custom not-found and error pages
```

### The Project: News Archive App

You'll build a **news archive application** that demonstrates all these advanced routing patterns.

```
News Archive App Features:
┌────────────────────────────────────────┐
│  / (home)                              │
│  ├── Latest news                       │
│  └── News archive link                 │
│                                        │
│  /archive                              │
│  ├── Browse news by year               │
│  └── Filter news                       │
│                                        │
│  /archive/[year]                       │
│  ├── News from specific year           │
│  └── Parallel routes demo              │
│                                        │
│  /archive/[year]/[month]               │
│  ├── News from specific month          │
│  └── Catch-all routes demo             │
│                                        │
│  /news/[slug]                          │
│  ├── Individual news detail            │
│  └── Intercepting routes demo          │
└────────────────────────────────────────┘
```

---

## 2. Project Setup, Overview & Exercise

### Setting Up the Project

```bash
# Create the project
npx create-next-app@latest news-app

# Options:
# TypeScript: No
# ESLint: Yes
# Tailwind CSS: No
# src/ directory: No
# App Router: Yes
# Customize import alias: No

cd news-app
npm run dev
```

### Initial File Structure

```
news-app/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── public/
├── components/
├── lib/
│   └── news.js          ← Dummy news data
├── package.json
└── next.config.js
```

### Exercise Task

**Build the following routes:**

1. Home page at `/`
2. News archive at `/archive`
3. Filtered archive at `/archive/{year}`
4. Further filtered at `/archive/{year}/{month}`
5. Individual news detail at `/news/{slug}`

---

## 3. Exercise Solution - Building the News App

### Step 1: Create the Dummy Data

```javascript
// lib/news.js
const DUMMY_NEWS = [
  {
    id: 'n1',
    slug: 'will-ai-replace-humans',
    title: 'Will AI Replace Humans?',
    image: 'ai-robot.jpg',
    date: '2021-07-01',
    content:
      'Since late 2022 AI is on the rise and therefore many people worry whether AI will replace humans. The answer is not that simple...',
  },
  {
    id: 'n2',
    slug: 'beaver-plague',
    title: 'A Plague of Beavers',
    date: '2022-05-01',
    image: 'beaver.jpg',
    content:
      'Beavers are taking over the world. They are building dams everywhere and flooding entire cities...',
  },
  {
    id: 'n3',
    slug: 'couple-cooking',
    title: 'Spend more time together!',
    date: '2024-03-01',
    image: 'couple-cooking.jpg',
    content:
      'Cooking together is a great way to spend more time with your partner. It is fun and you get to eat something delicious afterwards...',
  },
  {
    id: 'n4',
    slug: 'hiking',
    title: 'Hiking is the best!',
    date: '2024-10-01',
    image: 'hiking.jpg',
    content:
      'Hiking is a great way to stay in shape and enjoy nature. It is also a great way to clear your mind and get some fresh air...',
  },
  {
    id: 'n5',
    slug: 'landscape',
    title: 'Beautiful Landscapes',
    date: '2022-09-01',
    image: 'landscape.jpg',
    content:
      'Landscapes are beautiful. They are a great source of inspiration for artists and photographers...',
  },
];

export function getAllNews() {
  return DUMMY_NEWS;
}

export function getLatestNews() {
  return DUMMY_NEWS.slice(0, 3);
}

export function getAvailableNewsYears() {
  return DUMMY_NEWS.reduce((years, news) => {
    const year = new Date(news.date).getFullYear();
    if (!years.includes(year)) {
      years.push(year);
    }
    return years;
  }, []).sort((a, b) => b - a);
}

export function getAvailableNewsMonths(year) {
  return DUMMY_NEWS.reduce((months, news) => {
    const newsYear = new Date(news.date).getFullYear();
    if (newsYear === +year) {
      const month = new Date(news.date).getMonth();
      if (!months.includes(month)) {
        months.push(month + 1); // 0-indexed to 1-indexed
      }
    }
    return months;
  }, []).sort((a, b) => a - b);
}

export function getNewsForYear(year) {
  return DUMMY_NEWS.filter(
    (news) => new Date(news.date).getFullYear() === +year
  );
}

export function getNewsForYearAndMonth(year, month) {
  return DUMMY_NEWS.filter((news) => {
    const newsYear = new Date(news.date).getFullYear();
    const newsMonth = new Date(news.date).getMonth() + 1;
    return newsYear === +year && newsMonth === +month;
  });
}

export function getNewsItem(slug) {
  return DUMMY_NEWS.find((news) => news.slug === slug);
}
```

### Step 2: Create Route Structure

```
app/
├── layout.js              →  Root layout
├── page.js                →  / (Home)
│
├── archive/
│   ├── page.js            →  /archive
│   │
│   └── [year]/
│       ├── page.js        →  /archive/2024
│       │
│       └── [month]/
│           └── page.js    →  /archive/2024/10
│
└── news/
    └── [slug]/
        └── page.js        →  /news/hiking
```

### Step 3: Home Page

```jsx
// app/page.js
import Link from 'next/link';
import NewsList from '@/components/news-list';
import { getLatestNews } from '@/lib/news';

export default function HomePage() {
  const latestNews = getLatestNews();

  return (
    <>
      <h1>Welcome to the News Archive</h1>
      <p>
        <Link href="/archive">Go to archive</Link>
      </p>
      <NewsList news={latestNews} />
    </>
  );
}
```

### Step 4: Archive Page

```jsx
// app/archive/page.js
import Link from 'next/link';
import { getAvailableNewsYears } from '@/lib/news';

export default function ArchivePage() {
  const years = getAvailableNewsYears();

  return (
    <>
      <h1>News Archive</h1>
      <nav>
        <ul>
          {years.map((year) => (
            <li key={year}>
              <Link href={`/archive/${year}`}>{year}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
```

### Step 5: Filtered by Year Page

```jsx
// app/archive/[year]/page.js
import Link from 'next/link';
import NewsList from '@/components/news-list';
import { getNewsForYear, getAvailableNewsMonths } from '@/lib/news';

export default function FilteredNewsPage({ params }) {
  const year = params.year;
  const news = getNewsForYear(year);
  const availableMonths = getAvailableNewsMonths(year);

  return (
    <>
      <h1>News in {year}</h1>
      <nav>
        <ul>
          {availableMonths.map((month) => (
            <li key={month}>
              <Link href={`/archive/${year}/${month}`}>
                {new Date(year, month - 1).toLocaleString('en-US', {
                  month: 'long',
                })}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <NewsList news={news} />
    </>
  );
}
```

### Step 6: Filtered by Year & Month Page

```jsx
// app/archive/[year]/[month]/page.js
import NewsList from '@/components/news-list';
import { getNewsForYearAndMonth } from '@/lib/news';

export default function FilteredNewsPage({ params }) {
  const year = params.year;
  const month = params.month;
  const news = getNewsForYearAndMonth(year, month);

  return (
    <>
      <h1>
        News in {new Date(year, month - 1).toLocaleString('en-US', { month: 'long' })} {year}
      </h1>
      <NewsList news={news} />
    </>
  );
}
```

### Step 7: News Detail Page

```jsx
// app/news/[slug]/page.js
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';

export default function NewsDetailPage({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <article>
      <header>
        <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
        <h1>{newsItem.title}</h1>
        <time dateTime={newsItem.date}>{newsItem.date}</time>
      </header>
      <p>{newsItem.content}</p>
    </article>
  );
}
```

---

## 4. App Styling & Using Dummy Data

### Creating a Reusable NewsList Component

```jsx
// components/news-list.js
import Link from 'next/link';
import Image from 'next/image';

export default function NewsList({ news }) {
  return (
    <ul className="news-list">
      {news.map((newsItem) => (
        <li key={newsItem.id}>
          <Link href={`/news/${newsItem.slug}`}>
            <Image
              src={`/images/news/${newsItem.image}`}
              alt={newsItem.title}
              width={400}
              height={300}
            />
            <span>{newsItem.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

### Global Styling

```css
/* app/globals.css */
* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
  --color-grey-50: #f4f3f1;
  --color-grey-100: #dddbd8;
  --color-grey-200: #acaaa5;
  --color-grey-300: #8a8886;
  --color-grey-400: #656360;
  --color-grey-500: #4b4a47;
  --color-grey-600: #3a3937;
  --color-grey-700: #2e2d2b;
  --color-grey-800: #222120;
  --color-grey-900: #1c1b1a;
}

body {
  margin: 0;
  background-color: var(--color-grey-900);
  color: var(--color-grey-100);
}

h1 {
  text-align: center;
  color: var(--color-grey-50);
}

.news-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2rem;
}

.news-list li {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.news-list a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.news-list img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.news-list span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  font-size: 1.25rem;
  font-weight: bold;
}
```

---

## 5. Handling "Not Found" Errors & Showing "Not Found" Pages

### Global Not Found Page

```jsx
// app/not-found.js
export default function NotFoundPage() {
  return (
    <div id="error">
      <h1>Not Found</h1>
      <p>Unfortunately, we could not find the requested page or resource.</p>
    </div>
  );
}
```

### Route-Specific Not Found Page

```jsx
// app/news/[slug]/not-found.js
export default function NewsNotFoundPage() {
  return (
    <div id="error">
      <h1>News Article Not Found</h1>
      <p>Unfortunately, we could not find the requested news article.</p>
    </div>
  );
}
```

### Triggering Not Found Programmatically

```jsx
// app/news/[slug]/page.js
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';

export default function NewsDetailPage({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();  // Triggers the nearest not-found.js
  }

  return (
    <article>
      <h1>{newsItem.title}</h1>
      <p>{newsItem.content}</p>
    </article>
  );
}
```

### Not Found Hierarchy

```
How Next.js finds the right not-found.js:

User visits /news/nonexistent

1. Check: app/news/[slug]/not-found.js  ← Most specific
2. Check: app/news/not-found.js
3. Check: app/not-found.js              ← Global fallback
4. Use the closest one found

Priority: Most specific → Least specific
```

---

## 6. Setting Up & Using Parallel Routes

### What Are Parallel Routes?

**Parallel Routes** allow you to render **multiple pages simultaneously** in the same layout. Think of them as "slots" that can show different content.

```
Traditional Routing:
┌──────────────────┐
│     Layout       │
│  ┌────────────┐  │
│  │  Page      │  │  ← Only ONE page at a time
│  │  (main)    │  │
│  └────────────┘  │
└──────────────────┘

Parallel Routing:
┌──────────────────┐
│     Layout       │
│  ┌────────┐      │
│  │ @slot1 │      │  ← Multiple "slots" simultaneously
│  └────────┘      │
│  ┌────────┐      │
│  │ @slot2 │      │
│  └────────┘      │
└──────────────────┘
```

### Syntax: `@folderName`

Folders that start with `@` are **slots** for parallel routes:

```
app/
└── archive/
    └── [year]/
        ├── page.js          ← Main content
        ├── @archive/        ← Parallel route slot 1
        │   └── page.js
        └── @latest/         ← Parallel route slot 2
            └── page.js
```

### Example: News Archive with Parallel Routes

```jsx
// app/archive/[year]/layout.js
export default function YearArchiveLayout({ children, archive, latest }) {
  return (
    <div>
      <h1>News Archive</h1>
      
      <main>{children}</main>      {/* Main page content */}
      
      <aside>
        <h2>Archive</h2>
        {archive}                   {/* @archive slot */}
      </aside>
      
      <aside>
        <h2>Latest News</h2>
        {latest}                    {/* @latest slot */}
      </aside>
    </div>
  );
}
```

```jsx
// app/archive/[year]/page.js — Main content
export default function YearPage({ params }) {
  return <p>Showing news for {params.year}</p>;
}
```

```jsx
// app/archive/[year]/@archive/page.js — Archive slot
import NewsList from '@/components/news-list';
import { getNewsForYear } from '@/lib/news';

export default function ArchiveNewsPage({ params }) {
  const news = getNewsForYear(params.year);
  return <NewsList news={news} />;
}
```

```jsx
// app/archive/[year]/@latest/page.js — Latest slot
import NewsList from '@/components/news-list';
import { getLatestNews } from '@/lib/news';

export default function LatestNewsPage() {
  const latestNews = getLatestNews();
  return <NewsList news={latestNews} />;
}
```

### How Parallel Routes Work

```
URL: /archive/2024

Next.js renders:
├── app/archive/[year]/layout.js
│   ├── {children} = app/archive/[year]/page.js
│   ├── {archive} = app/archive/[year]/@archive/page.js
│   └── {latest} = app/archive/[year]/@latest/page.js

All THREE pages render SIMULTANEOUSLY!
```

### Key Points

| Point | Explanation |
|---|---|
| **@ prefix** | Marks a folder as a parallel route slot |
| **Props in layout** | Each slot becomes a prop in the layout |
| **Simultaneous rendering** | All slots render at the same time |
| **Independent navigation** | Each slot can show different content for the same URL |
| **Same level** | Slots must be at the same level as the page they're parallel to |

---

## 7. Working with Parallel Routes & Nested Routes

### Nested Routes Inside Parallel Routes

You can have **nested routes inside parallel route slots**.

```
app/
└── archive/
    └── [year]/
        ├── layout.js
        ├── page.js          ← Main
        │
        ├── @archive/
        │   ├── page.js      ← Default archive view
        │   └── [month]/
        │       └── page.js  ← Nested: /archive/2024/10
        │
        └── @latest/
            └── page.js
```

### Example: Archive Slot with Nested Month Route

```jsx
// app/archive/[year]/@archive/page.js — Default archive view
import NewsList from '@/components/news-list';
import { getNewsForYear } from '@/lib/news';
import Link from 'next/link';
import { getAvailableNewsMonths } from '@/lib/news';

export default function ArchiveNewsPage({ params }) {
  const news = getNewsForYear(params.year);
  const months = getAvailableNewsMonths(params.year);

  return (
    <>
      <nav>
        <ul>
          {months.map((month) => (
            <li key={month}>
              <Link href={`/archive/${params.year}/${month}`}>
                {new Date(params.year, month - 1).toLocaleString('en-US', {
                  month: 'long',
                })}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <NewsList news={news} />
    </>
  );
}
```

```jsx
// app/archive/[year]/@archive/[month]/page.js — Nested month view
import NewsList from '@/components/news-list';
import { getNewsForYearAndMonth } from '@/lib/news';

export default function MonthArchiveNewsPage({ params }) {
  const news = getNewsForYearAndMonth(params.year, params.month);

  return (
    <>
      <h2>
        News in {new Date(params.year, params.month - 1).toLocaleString('en-US', { month: 'long' })}
      </h2>
      <NewsList news={news} />
    </>
  );
}
```

### What Happens

```
URL: /archive/2024
├── Layout renders with:
│   ├── {children} = app/archive/[year]/page.js
│   ├── {archive} = app/archive/[year]/@archive/page.js  ← Shows all 2024 news
│   └── {latest} = app/archive/[year]/@latest/page.js

User clicks October link → URL becomes /archive/2024/10

URL: /archive/2024/10
├── Layout renders with:
│   ├── {children} = (still) app/archive/[year]/page.js
│   ├── {archive} = app/archive/[year]/@archive/[month]/page.js  ← Shows Oct 2024 news
│   └── {latest} = app/archive/[year]/@latest/page.js

Notice: Only the @archive slot changed!
The main page and @latest slot stayed the same!
```

### The Power of Parallel Routes

```
Without Parallel Routes:
/archive/2024      → Shows year content
/archive/2024/10   → COMPLETELY DIFFERENT page

With Parallel Routes:
/archive/2024      → Shows year content + archive + latest
/archive/2024/10   → Shows SAME page, but @archive slot shows different content

Benefit: Part of the page changes, rest stays the same!
```

---

## 8. Configuring Catch-All Routes

### What Are Catch-All Routes?

**Catch-all routes** match **all remaining segments** of a URL path. They're defined with `[...slug]` syntax.

```
Normal dynamic route:
app/blog/[id]/page.js     → Matches /blog/123
                            Does NOT match /blog/123/comments

Catch-all route:
app/blog/[...slug]/page.js → Matches /blog/123
                            → Matches /blog/123/comments
                            → Matches /blog/a/b/c/d/e
```

### Syntax

```
[...paramName]   → Catch-all (requires at least 1 segment)
[[...paramName]] → Optional catch-all (can match 0 segments too)
```

### Example: Archive Catch-All

Instead of having separate routes for year and month, use a catch-all:

```
Before (separate routes):
app/
└── archive/
    ├── page.js              →  /archive
    ├── [year]/
    │   └── page.js          →  /archive/2024
    └── [year]/[month]/
        └── page.js          →  /archive/2024/10

After (catch-all):
app/
└── archive/
    ├── page.js              →  /archive
    └── [...filter]/
        └── page.js          →  /archive/2024
                                 /archive/2024/10
```

### Implementation

```jsx
// app/archive/[...filter]/page.js
import NewsList from '@/components/news-list';
import {
  getNewsForYear,
  getNewsForYearAndMonth,
  getAvailableNewsYears,
  getAvailableNewsMonths,
} from '@/lib/news';
import Link from 'next/link';

export default function FilteredNewsPage({ params }) {
  const filter = params.filter;
  
  // filter is an ARRAY of path segments
  // /archive/2024 → filter = ['2024']
  // /archive/2024/10 → filter = ['2024', '10']

  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let news;
  let links = getAvailableNewsYears();

  if (selectedYear && !selectedMonth) {
    // Show news for the year
    news = getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear);
  }

  if (selectedYear && selectedMonth) {
    // Show news for the year and month
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = [];
  }

  let newsContent = <p>No news found for the selected period.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  // Build filter links
  if (
    (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) ||
    (selectedMonth && !getAvailableNewsMonths(selectedYear).includes(+selectedMonth))
  ) {
    throw new Error('Invalid filter.');
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

### Understanding the `params.filter` Array

```javascript
URL: /archive/2024
params.filter = ['2024']

URL: /archive/2024/10
params.filter = ['2024', '10']

URL: /archive/2024/10/some/random/path
params.filter = ['2024', '10', 'some', 'random', 'path']

// Access segments:
const year = params.filter[0];   // '2024'
const month = params.filter[1];  // '10'
const third = params.filter[2];  // 'some'
```

---

## 9. Catch-All Fallback Routes & Dealing With Multiple Path Segments

### Optional Catch-All Routes

Use `[[...slug]]` (double brackets) to make the catch-all **optional** — it can match **zero or more** segments.

```
[...slug]     → Requires at least 1 segment
                /blog/a  ✅
                /blog    ❌ (doesn't match)

[[...slug]]   → Can match 0 or more segments
                /blog/a  ✅
                /blog    ✅ (matches with slug = undefined)
```

### Example: Optional Archive Filter

```
app/
└── archive/
    └── [[...filter]]/
        └── page.js       →  /archive         (filter = undefined)
                              /archive/2024    (filter = ['2024'])
                              /archive/2024/10 (filter = ['2024', '10'])
```

```jsx
// app/archive/[[...filter]]/page.js
import NewsList from '@/components/news-list';
import {
  getAllNews,
  getNewsForYear,
  getNewsForYearAndMonth,
  getAvailableNewsYears,
  getAvailableNewsMonths,
} from '@/lib/news';
import Link from 'next/link';

export default function FilteredNewsPage({ params }) {
  const filter = params.filter;

  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let news;
  let links = getAvailableNewsYears();

  // No filter → show all news
  if (!filter) {
    news = getAllNews();
  }

  // Year filter only
  if (selectedYear && !selectedMonth) {
    news = getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear);
  }

  // Year + month filter
  if (selectedYear && selectedMonth) {
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = [];
  }

  let newsContent = <p>No news found for the selected period.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
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

### Validation & Error Handling

```jsx
// Add validation to prevent invalid URLs
export default function FilteredNewsPage({ params }) {
  const filter = params.filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  // Validate year
  if (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) {
    throw new Error('Invalid year.');
  }

  // Validate month
  if (
    selectedMonth &&
    !getAvailableNewsMonths(selectedYear).includes(+selectedMonth)
  ) {
    throw new Error('Invalid month.');
  }

  // ... rest of the code
}
```

---

## 10. Throwing Route-Related Errors

### Throwing Errors for Invalid Routes

You can throw errors when route parameters are invalid:

```jsx
// app/archive/[[...filter]]/page.js
export default function FilteredNewsPage({ params }) {
  const filter = params.filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  // Throw an error if the year is invalid
  if (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) {
    throw new Error('Invalid year.');
  }

  // Throw an error if the month is invalid
  if (
    selectedMonth &&
    !getAvailableNewsMonths(selectedYear).includes(+selectedMonth)
  ) {
    throw new Error('Invalid month.');
  }

  // ... render logic
}
```

### `notFound()` vs `throw new Error()`

```jsx
import { notFound } from 'next/navigation';

// Use notFound() when the resource doesn't exist
export default function NewsDetailPage({ params }) {
  const newsItem = getNewsItem(params.slug);
  
  if (!newsItem) {
    notFound();  // → Shows not-found.js (404 status)
  }
}

// Use throw new Error() for invalid requests
export default function FilteredNewsPage({ params }) {
  const year = params.filter?.[0];
  
  if (year && !isValidYear(year)) {
    throw new Error('Invalid year.');  // → Shows error.js (500 status)
  }
}
```

| Scenario | Use | Result |
|---|---|---|
| Resource doesn't exist | `notFound()` | Shows `not-found.js` (404) |
| Invalid input/parameters | `throw new Error()` | Shows `error.js` (500) |
| Server-side failure | `throw new Error()` | Shows `error.js` (500) |

---

## 11. Handling Errors With Error Pages

### Creating an Error Page

```jsx
// app/archive/[[...filter]]/error.js
'use client';  // ⚠️ error.js MUST be a Client Component

export default function FilteredNewsErrorPage({ error }) {
  return (
    <div id="error">
      <h2>An error occurred!</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

### Why `'use client'` Is Required

```
Error boundaries in React:
├── Only work in Client Components
├── Need to catch both server and client errors
└── Need access to browser APIs for recovery

Therefore:
error.js MUST have 'use client' directive
```

### Error Props

```jsx
'use client';

export default function ErrorPage({ error, reset }) {
  return (
    <div id="error">
      <h2>An error occurred!</h2>
      <p>{error.message}</p>           {/* Error message */}
      <button onClick={reset}>         {/* Try again */}
        Try again
      </button>
    </div>
  );
}
```

| Prop | Type | Description |
|---|---|---|
| `error` | Error object | Contains `message`, `stack`, etc. |
| `reset` | Function | Re-tries rendering the component tree |

### Error Hierarchy

```
Error boundary cascade (closest error.js catches the error):

app/
├── error.js               ← Global error handler
├── archive/
│   ├── error.js           ← Catches errors in archive routes
│   └── [[...filter]]/
│       ├── error.js       ← Catches errors in this specific route
│       └── page.js        ← If this throws → caught by closest error.js

Precedence: Most specific → Least specific
```

---

## 12. Server vs Client Components (Deep Dive)

### The Fundamental Difference

```
┌─────────────────────────────────────────────────────────────┐
│                  Component Rendering Flow                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVER COMPONENT (default):                                │
│  ┌────────────┐                    ┌────────────┐           │
│  │   Server   │  runs React code   │  Browser   │           │
│  │            │ ─────────────────→ │            │           │
│  │  Renders   │  sends HTML only   │  Shows     │           │
│  │  to HTML   │                    │  static    │           │
│  └────────────┘                    │  content   │           │
│                                    └────────────┘           │
│                                                             │
│  CLIENT COMPONENT ('use client'):                           │
│  ┌────────────┐                    ┌────────────┐           │
│  │   Server   │  sends HTML +      │  Browser   │           │
│  │            │  JavaScript        │            │           │
│  │  Renders   │ ─────────────────→ │  Hydrates  │           │
│  │  initial   │                    │  + runs    │           │
│  │  HTML      │                    │  React     │           │
│  └────────────┘                    └────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Detailed Comparison

| Aspect | Server Component 🔵 | Client Component 🟡 |
|---|---|---|
| **Default?** | ✅ Yes (no directive) | ❌ Needs `'use client'` |
| **Runs where?** | Server ONLY | Server (SSR) + Browser |
| **Can be `async`?** | ✅ Yes | ❌ No |
| **Can use hooks?** | ❌ No | ✅ Yes |
| **Can use event handlers?** | ❌ No | ✅ Yes |
| **Direct DB access?** | ✅ Yes | ❌ No |
| **Environment variables?** | ✅ All | Only `NEXT_PUBLIC_*` |
| **JavaScript sent to browser?** | ❌ No (0kb) | ✅ Yes (adds to bundle) |
| **Bundle size impact?** | None | Increases |
| **Re-renders on state change?** | ❌ N/A (no state) | ✅ Yes |
| **SEO** | ✅ Excellent | ✅ Good (after hydration) |
| **Best for** | Data fetching, layouts | Interactivity, forms |

### When To Use Each

```
Use SERVER Components for:
├── Layouts
├── Static content
├── Data fetching
├── Database queries
├── Reading files
├── Authentication checks
├── API calls
└── Anything that doesn't need interactivity

Use CLIENT Components for:
├── Forms
├── Buttons with onClick
├── useState, useEffect, useContext
├── Event handlers
├── Browser APIs (localStorage, window)
├── Third-party interactive libraries
└── Animations
```

### The Composition Pattern

```jsx
// ✅ GOOD: Keep Client Components small, wrap Server Components as children

// ClientModal.js — Client Component (just for the modal logic)
'use client';
import { useState } from 'react';

export default function ClientModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && (
        <div className="modal">
          {children}  {/* Children can be Server Components! */}
        </div>
      )}
    </>
  );
}

// Page.js — Server Component
import ClientModal from './ClientModal';
import NewsDetail from './NewsDetail';  // Server Component

export default function NewsPage() {
  return (
    <ClientModal>
      <NewsDetail />  {/* Server Component wrapped by Client Component */}
    </ClientModal>
  );
}
```

### The `'use client'` Boundary

```
'use client' creates a MODULE BOUNDARY:

File A (Server Component)
┌──────────────────────────┐
│ import ClientComp from B │  ← Imports a Client Component
│                          │
│ export default function  │
│ ServerComp() {           │
│   return <ClientComp />  │  ← Renders Client Component
│ }                        │
└──────────────────────────┘

File B (Client Component)
┌──────────────────────────┐
│ 'use client';            │  ← Boundary starts here
│                          │
│ import ChildComp from C  │  ← C becomes Client too (auto)
│                          │
│ export default function  │
│ ClientComp() {           │
│   return <ChildComp />   │
│ }                        │
└──────────────────────────┘

File C (automatically Client)
┌──────────────────────────┐
│ // No 'use client' needed│  ← But it's Client anyway!
│                          │
│ export default function  │
│ ChildComp() {            │
│   // This is a Client    │
│   // Component           │
│ }                        │
└──────────────────────────┘

Rule: Everything IMPORTED BY a Client Component
      becomes a Client Component too!
```

### Common Mistake: Importing Server Component Into Client

```jsx
// ❌ WRONG — Can't import Server Component into Client Component
'use client';
import { useState } from 'react';
import ServerNewsGrid from './ServerNewsGrid';  // ❌ Server Component!

export default function NewsPage() {
  const [filter, setFilter] = useState('all');
  return (
    <>
      <button onClick={() => setFilter('latest')}>Latest</button>
      <ServerNewsGrid filter={filter} />  {/* ❌ Won't work! */}
    </>
  );
}

// ✅ CORRECT — Pass Server Component as children
'use client';
import { useState } from 'react';

export default function NewsPage({ children }) {  // ✅ Receive as prop
  const [filter, setFilter] = useState('all');
  return (
    <>
      <button onClick={() => setFilter('latest')}>Latest</button>
      {children}  {/* ✅ Children can be Server Components */}
    </>
  );
}

// Usage in parent:
<NewsPage>
  <ServerNewsGrid />  {/* ✅ Works! */}
</NewsPage>
```

---

## 13. Nested Routes Inside Dynamic Routes

### Creating Nested Routes in Dynamic Segments

You can have **static routes nested inside dynamic routes**:

```
app/
└── news/
    └── [slug]/
        ├── page.js          →  /news/hiking (news detail)
        └── image/
            └── page.js      →  /news/hiking/image (news image page)
```

### Example: Image Page for News

```jsx
// app/news/[slug]/image/page.js
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';

export default function ImagePage({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="fullscreen-image">
      <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
    </div>
  );
}
```

### Nested Dynamic Routes

You can also have **dynamic routes nested inside dynamic routes**:

```
app/
└── news/
    └── [slug]/
        ├── page.js          →  /news/hiking
        └── comments/
            └── [commentId]/
                └── page.js  →  /news/hiking/comments/123
```

```jsx
// app/news/[slug]/comments/[commentId]/page.js
export default function CommentPage({ params }) {
  return (
    <div>
      <p>News: {params.slug}</p>
      <p>Comment: {params.commentId}</p>
    </div>
  );
}
```

---

## 14. Intercepting Navigation & Using Interception Routes

### What Are Intercepting Routes?

**Intercepting Routes** let you show **different content depending on HOW the user navigated** to a route:

- Clicked a link from within the app → Show intercepted version (e.g., modal)
- Directly visited the URL → Show the regular page

```
Scenario:
├── User is on /archive and clicks a news link
│   → Show news in a MODAL (intercepted)
│
└── User visits /news/hiking directly (via URL bar or refresh)
    → Show news on a FULL PAGE (not intercepted)
```

### Syntax: `(.)`, `(..)`, `(...)`, `(....)`

Interception routes use **parentheses with dots** to indicate which route to intercept:

| Syntax | Intercepts | Example |
|---|---|---|
| `(.)folder` | Same level | `(.)news` intercepts `news` at same level |
| `(..)folder` | One level up | `(..)news` intercepts `../news` |
| `(...)folder` | From root | `(...)news` intercepts `/news` from anywhere |
| `(....)folder` | Two levels up | Rarely used |

### Visual Route Structure

```
app/
├── archive/
│   └── [year]/
│       ├── page.js           →  /archive/2024
│       └── (.)news/          ← Intercepts /news when navigating from archive
│           └── [slug]/
│               └── page.js   →  Shows news in modal
│
└── news/
    └── [slug]/
        └── page.js           →  /news/hiking (full page)
```

### Example: Intercepting News Detail to Show Modal

```jsx
// app/news/[slug]/page.js — Full page version (direct visit)
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';

export default function NewsDetailPage({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <article>
      <header>
        <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
        <h1>{newsItem.title}</h1>
        <time>{newsItem.date}</time>
      </header>
      <p>{newsItem.content}</p>
    </article>
  );
}
```

```jsx
// app/archive/[year]/(.)news/[slug]/page.js — Intercepted version (modal)
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';
import ModalBackdrop from '@/components/modal-backdrop';

export default function InterceptedNewsPage({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <>
      <ModalBackdrop />
      <dialog className="modal" open>
        <article>
          <header>
            <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
            <h1>{newsItem.title}</h1>
          </header>
          <p>{newsItem.content}</p>
        </article>
      </dialog>
    </>
  );
}
```

### How It Works

```
User on /archive/2024 clicks a news link to /news/hiking:

1. Next.js checks: Is there an intercepting route?
2. Finds: app/archive/[year]/(.)news/[slug]/page.js
3. Renders: The INTERCEPTED version (modal)
4. URL changes to /news/hiking (but shows modal)

User refreshes the page OR visits /news/hiking directly:

1. Next.js looks for: app/news/[slug]/page.js
2. Renders: The REGULAR page (full screen)
```

### Modal Backdrop Component (Client Component)

```jsx
// components/modal-backdrop.js
'use client';

import { useRouter } from 'next/navigation';

export default function ModalBackdrop() {
  const router = useRouter();

  return <div className="modal-backdrop" onClick={router.back} />;
}
```

```css
/* Modal styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9;
}

.modal {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 40rem;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  z-index: 10;
}
```

---

## 15. Combining Parallel & Intercepting Routes

### The Ultimate Pattern: Parallel + Intercepted Routes

You can combine **parallel routes** and **intercepting routes** for powerful UI patterns like modals that preserve page state.

### Use Case: Modal Over Archive Page

```
Goal:
When on /archive, clicking a news item should:
1. Keep the archive page visible in the background
2. Show the news detail in a modal overlay
3. Update the URL to /news/[slug]
4. Allow closing the modal (router.back())
```

### Route Structure

```
app/
└── archive/
    └── [year]/
        ├── layout.js          ← Defines parallel slots
        ├── page.js            ← Main content (@children)
        ├── @archive/          ← Parallel slot
        │   └── page.js
        ├── @latest/           ← Parallel slot
        │   └── page.js
        └── @modal/            ← Parallel slot for modal
            ├── default.js     ← Shows nothing by default
            └── (.)news/       ← Intercepts /news
                └── [slug]/
                    └── page.js
```

### Layout with Parallel Routes

```jsx
// app/archive/[year]/layout.js
export default function ArchiveLayout({ children, archive, latest, modal }) {
  return (
    <div>
      <h1>News Archive</h1>
      
      <main>{children}</main>
      
      <aside>
        <h2>Archive</h2>
        {archive}
      </aside>
      
      <aside>
        <h2>Latest News</h2>
        {latest}
      </aside>
      
      {modal}   {/* Modal slot — shows intercepted news or nothing */}
    </div>
  );
}
```

### Default State for Modal Slot

```jsx
// app/archive/[year]/@modal/default.js
export default function DefaultModal() {
  return null;  // Shows nothing when no modal is active
}
```

### Intercepted Modal Route

```jsx
// app/archive/[year]/@modal/(.)news/[slug]/page.js
import { notFound } from 'next/navigation';
import { getNewsItem } from '@/lib/news';
import ModalBackdrop from '@/components/modal-backdrop';

export default function InterceptedNewsModal({ params }) {
  const newsItem = getNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <>
      <ModalBackdrop />
      <dialog className="modal" open>
        <article>
          <header>
            <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
            <h1>{newsItem.title}</h1>
          </header>
          <p>{newsItem.content}</p>
        </article>
      </dialog>
    </>
  );
}
```

### How It Works

```
User on /archive/2024:
┌─────────────────────────────────┐
│  Layout                         │
│  ├── {children} = page.js       │
│  ├── {archive} = @archive       │
│  ├── {latest} = @latest         │
│  └── {modal} = default.js (null)│
└─────────────────────────────────┘

User clicks news link → URL: /news/hiking
┌─────────────────────────────────┐
│  Layout (stays the same!)       │
│  ├── {children} = page.js       │  ← Same
│  ├── {archive} = @archive       │  ← Same
│  ├── {latest} = @latest         │  ← Same
│  └── {modal} = InterceptedModal │  ← Changed!
└─────────────────────────────────┘

Modal appears over the existing page!
Archive and latest news stay visible in background!

User closes modal (router.back()):
URL: /archive/2024
┌─────────────────────────────────┐
│  Layout                         │
│  ├── {children} = page.js       │
│  ├── {archive} = @archive       │
│  ├── {latest} = @latest         │
│  └── {modal} = default.js (null)│  ← Back to default
└─────────────────────────────────┘

Modal disappears, page underneath is unchanged!
```

---

## 16. Replace page.js with default.js

### What Is `default.js`?

`default.js` is a **fallback** for parallel route slots when Next.js can't determine which page to show.

```
When is default.js used?
├── For parallel route slots when the URL doesn't match any page
├── After a hard refresh with an intercepted route
└── When navigating programmatically to a route that doesn't have a matching parallel route
```

### Example

```
app/
└── archive/
    └── [year]/
        ├── layout.js         ← Defines @modal slot
        ├── page.js
        └── @modal/
            ├── default.js    ← Renders when no modal is active
            └── (.)news/
                └── [slug]/
                    └── page.js
```

```jsx
// app/archive/[year]/@modal/default.js
export default function DefaultModal() {
  return null;  // Show nothing
}
```

### Why You Need It

```
Without default.js:
User on /archive/2024 → clicks news link → modal shows ✅
User refreshes page → Error! Next.js doesn't know what to show in @modal slot ❌

With default.js:
User on /archive/2024 → clicks news link → modal shows ✅
User refreshes page → default.js renders (null) → page works ✅
```

---

## 17. Navigating Programmatically

### Using `useRouter` Hook

```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function MyComponent() {
  const router = useRouter();

  function goToArchive() {
    router.push('/archive');  // Navigate to /archive
  }

  function goBack() {
    router.back();  // Go back one step in history
  }

  function goForward() {
    router.forward();  // Go forward one step
  }

  function refreshPage() {
    router.refresh();  // Re-run Server Components (refetch data)
  }

  return (
    <>
      <button onClick={goToArchive}>Go to Archive</button>
      <button onClick={goBack}>Back</button>
      <button onClick={goForward}>Forward</button>
      <button onClick={refreshPage}>Refresh</button>
    </>
  );
}
```

### `useRouter` Methods

| Method | Description | Example |
|---|---|---|
| `router.push(path)` | Navigate to a path | `router.push('/about')` |
| `router.replace(path)` | Navigate and replace history | `router.replace('/login')` |
| `router.back()` | Go back in history | Like browser back button |
| `router.forward()` | Go forward in history | Like browser forward button |
| `router.refresh()` | Re-run Server Components | Refetch data without reload |
| `router.prefetch(path)` | Prefetch a route | `router.prefetch('/about')` |

### Example: Modal Close Button

```jsx
// components/modal-backdrop.js
'use client';

import { useRouter } from 'next/navigation';

export default function ModalBackdrop() {
  const router = useRouter();

  return (
    <div 
      className="modal-backdrop" 
      onClick={() => router.back()}  // Close modal
    />
  );
}
```

### Server-Side Navigation: `redirect()`

For **Server Components** or **Server Actions**, use `redirect()`:

```javascript
// lib/actions.js
'use server';

import { redirect } from 'next/navigation';

export async function createNews(formData) {
  // ... save news to database
  
  redirect('/archive');  // Navigate to archive after creation
}
```

```jsx
// In a Server Component
import { redirect } from 'next/navigation';

export default function MyPage() {
  const isAuthenticated = false;
  
  if (!isAuthenticated) {
    redirect('/login');  // Redirect to login
  }

  return <div>Protected content</div>;
}
```

---

## 18. Defining the Base HTML Document

### The `<html>` and `<body>` Tags

The **root layout** (`app/layout.js`) is where you define the **base HTML structure**:

```jsx
// app/layout.js
import './globals.css';

export const metadata = {
  title: 'News App',
  description: 'A news archive application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="page">
          {children}
        </div>
      </body>
    </html>
  );
}
```

### Why This Is Different from Regular React

```
Regular React (Vite, CRA):
├── You have an index.html file
├── React injects content into <div id="root"></div>
└── You DON'T write <html> or <body> in components

Next.js App Router:
├── NO index.html file
├── Root layout.js defines <html> and <body>
├── Next.js generates the HTML from layout.js
└── You CAN (and should) customize <html> and <body>
```

### Common Customizations

```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark-mode">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="container">
        <header>
          <nav>My App</nav>
        </header>
        <main>{children}</main>
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
```

---

## 19. Using & Understanding Route Groups

### What Are Route Groups?

**Route Groups** let you **organize routes** without affecting the URL structure. Use parentheses `()` to create a route group.

```
Without route groups:
app/
├── marketing/
│   ├── about/page.js      →  /marketing/about  ❌ (unwanted 'marketing' in URL)
│   └── contact/page.js    →  /marketing/contact

With route groups:
app/
├── (marketing)/            ← Group (NOT in URL)
│   ├── about/page.js      →  /about  ✅
│   └── contact/page.js    →  /contact  ✅
```

### Use Cases for Route Groups

#### 1. Organizing Routes Without URL Segments

```
app/
├── (marketing)/         ← Group for organization only
│   ├── about/
│   │   └── page.js      →  /about
│   ├── pricing/
│   │   └── page.js      →  /pricing
│   └── contact/
│       └── page.js      →  /contact
│
├── (shop)/              ← Another group
│   ├── products/
│   │   └── page.js      →  /products
│   └── cart/
│       └── page.js      →  /cart
│
└── page.js              →  /
```

#### 2. Multiple Layouts for Different Sections

```
app/
├── (marketing)/
│   ├── layout.js         ← Marketing layout
│   ├── about/page.js
│   └── contact/page.js
│
├── (shop)/
│   ├── layout.js         ← Shop layout (different from marketing)
│   ├── products/page.js
│   └── cart/page.js
│
└── layout.js             ← Root layout (wraps everything)
```

```jsx
// app/(marketing)/layout.js
export default function MarketingLayout({ children }) {
  return (
    <div className="marketing-theme">
      <header>Marketing Header</header>
      {children}
      <footer>Marketing Footer</footer>
    </div>
  );
}
```

```jsx
// app/(shop)/layout.js
export default function ShopLayout({ children }) {
  return (
    <div className="shop-theme">
      <header>Shop Header</header>
      <aside>Shopping Cart</aside>
      {children}
    </div>
  );
}
```

#### 3. Multiple Root Layouts (Different Apps in One Project)

```
app/
├── (app)/
│   ├── layout.js         ← Root layout for app
│   ├── page.js           →  /
│   └── dashboard/
│       └── page.js       →  /dashboard
│
└── (auth)/
    ├── layout.js         ← Different root layout for auth
    ├── login/
    │   └── page.js       →  /login
    └── register/
        └── page.js       →  /register
```

### Route Group Naming Convention

```
(folderName)   → NOT part of the URL
folderName     → IS part of the URL

app/
├── (admin)/         ← NOT in URL
│   └── users/       ← IS in URL
│       └── page.js  →  /users (NOT /admin/users)
│
├── api/             ← IS in URL
│   └── users/       ← IS in URL
│       └── route.js →  /api/users
```

### Key Points

| Feature | Explanation |
|---|---|
| **Syntax** | Wrap folder name in `()` |
| **URL impact** | None — doesn't appear in URLs |
| **Purpose** | Organization, multiple layouts |
| **Nesting** | Can be nested, combined with other routes |
| **Layouts** | Each group can have its own layout |

---

## 20. Building APIs with Route Handlers

### What Are Route Handlers?

**Route Handlers** let you create **API endpoints** in Next.js. They replace the `pages/api/*` approach from Pages Router.

```
Pages Router (old):
pages/api/news/route.js  →  /api/news

App Router (new):
app/api/news/route.js    →  /api/news
```

### Creating a Route Handler

Use the special file name **`route.js`** (or `.ts`):

```
app/
└── api/
    └── news/
        └── route.js       →  /api/news
```

```javascript
// app/api/news/route.js
import { NextResponse } from 'next/server';
import { getAllNews } from '@/lib/news';

// GET /api/news
export async function GET(request) {
  const news = getAllNews();
  return NextResponse.json(news);
}

// POST /api/news
export async function POST(request) {
  const body = await request.json();
  // ... save news to database
  return NextResponse.json({ message: 'News created!' }, { status: 201 });
}
```

### Supported HTTP Methods

```javascript
// app/api/news/route.js
export async function GET(request) { /* ... */ }
export async function POST(request) { /* ... */ }
export async function PUT(request) { /* ... */ }
export async function PATCH(request) { /* ... */ }
export async function DELETE(request) { /* ... */ }
export async function HEAD(request) { /* ... */ }
export async function OPTIONS(request) { /* ... */ }
```

### The `request` Object

```javascript
export async function GET(request) {
  // URL and query parameters
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');  // ?filter=latest

  // Headers
  const authHeader = request.headers.get('authorization');

  // Cookies
  const token = request.cookies.get('token');

  return NextResponse.json({ filter, authHeader, token });
}
```

### The `NextResponse` Object

```javascript
import { NextResponse } from 'next/server';

// Return JSON
export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}

// Return JSON with custom status
export async function POST() {
  return NextResponse.json(
    { message: 'Created' }, 
    { status: 201 }
  );
}

// Redirect
export async function GET() {
  return NextResponse.redirect(new URL('/home', request.url));
}

// Set cookies
export async function GET() {
  const response = NextResponse.json({ message: 'Success' });
  response.cookies.set('token', 'abc123');
  return response;
}

// Set headers
export async function GET() {
  return NextResponse.json(
    { message: 'Success' },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value',
      },
    }
  );
}
```

### Dynamic Route Handlers

```
app/
└── api/
    └── news/
        └── [slug]/
            └── route.js   →  /api/news/hiking
```

```javascript
// app/api/news/[slug]/route.js
import { NextResponse } from 'next/server';
import { getNewsItem } from '@/lib/news';

export async function GET(request, { params }) {
  const newsItem = getNewsItem(params.slug);
  
  if (!newsItem) {
    return NextResponse.json(
      { error: 'News not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(newsItem);
}
```

### When to Use Route Handlers vs Server Actions

```
Use Route Handlers when:
├── You need a public API
├── You're integrating with webhooks
├── You're building a REST/GraphQL API
└── You need to support non-form HTTP requests

Use Server Actions when:
├── Handling form submissions
├── Internal mutations (not public API)
├── You want tighter integration with React
└── You're building a traditional web app (not API-first)
```

---

## 21. Using Middleware

### What Is Middleware?

**Middleware** is code that runs **before a request is completed**. It can:
- Redirect users
- Rewrite URLs
- Set headers/cookies
- Block requests

```
Request Flow:

User makes request
      │
      ▼
Middleware runs       ← Runs BEFORE the route
      │
      ▼
Route handler/page renders
      │
      ▼
Response sent to user
```

### Creating Middleware

Create a `middleware.js` file in the **root** of your project (same level as `app/`):

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware executed for:', request.url);
  
  // Continue to the route
  return NextResponse.next();
}
```

### Matching Paths

By default, middleware runs for **every request**. Use a `matcher` to run it only for specific paths:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Protected route accessed:', request.url);
  
  // Check authentication
  const token = request.cookies.get('authToken');
  
  if (!token) {
    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Allow the request
  return NextResponse.next();
}

// Run middleware ONLY for these paths
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Matcher Patterns

```javascript
export const config = {
  matcher: [
    '/dashboard/:path*',     // /dashboard and all sub-paths
    '/admin/:path*',         // /admin and all sub-paths
    '/api/:path*',           // All API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',  // All except these
  ],
};
```

### Common Middleware Use Cases

#### 1. Authentication Check

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

#### 2. Setting Custom Headers

```javascript
export function middleware(request) {
  const response = NextResponse.next();
  
  response.headers.set('X-Custom-Header', 'my-value');
  response.headers.set('X-Request-Time', new Date().toISOString());
  
  return response;
}
```

#### 3. Rewriting URLs

```javascript
export function middleware(request) {
  // Rewrite /blog/* to /news/*
  if (request.nextUrl.pathname.startsWith('/blog')) {
    return NextResponse.rewrite(
      new URL(request.nextUrl.pathname.replace('/blog', '/news'), request.url)
    );
  }
  
  return NextResponse.next();
}
```

#### 4. Logging & Analytics

```javascript
export function middleware(request) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  
  const response = NextResponse.next();
  
  // Track response time
  response.headers.set('X-Response-Time', Date.now());
  
  return response;
}
```

#### 5. A/B Testing

```javascript
export function middleware(request) {
  // Randomly assign users to variant A or B
  const variant = Math.random() > 0.5 ? 'A' : 'B';
  
  const response = NextResponse.next();
  response.cookies.set('ab-test-variant', variant);
  
  if (variant === 'B') {
    // Show alternative version
    return NextResponse.rewrite(new URL('/variant-b', request.url));
  }
  
  return response;
}
```

### The `NextResponse` API

```javascript
import { NextResponse } from 'next/server';

// Continue to the route (do nothing)
return NextResponse.next();

// Redirect
return NextResponse.redirect(new URL('/login', request.url));

// Rewrite (change the URL behind the scenes)
return NextResponse.rewrite(new URL('/new-path', request.url));

// Return a custom response
return new NextResponse('Forbidden', { status: 403 });

// Return JSON
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

---

## 22. Module Summary

### Everything Covered in This Module

```
Module 4: Routing & Page Rendering Deep Dive — Complete Summary
═══════════════════════════════════════════════════════════════════

📁 ADVANCED ROUTING PATTERNS
├── Dynamic routes [slug]
├── Catch-all routes [...slug]
├── Optional catch-all routes [[...slug]]
├── Nested dynamic routes
└── Dynamic segments at multiple levels

🔀 PARALLEL ROUTES
├── @slot syntax (@archive, @latest, @modal)
├── Render multiple pages simultaneously
├── Define slots as props in layout ({ archive, latest })
├── Each slot can have independent navigation
└── Use default.js for fallback content

🪝 INTERCEPTING ROUTES
├── (.) intercept same level
├── (..) intercept one level up
├── (...) intercept from root
├── Show different content based on navigation method
│   ├── Link click → Modal
│   └── Direct URL → Full page
└── Combine with parallel routes for powerful modal patterns

🎯 ROUTE GROUPS
├── (folderName) syntax
├── Organize routes without affecting URLs
├── Multiple layouts in one app
├── Group by feature/section
└── Can have multiple root layouts

📄 SPECIAL FILES
├── page.js — The page UI
├── layout.js — Shared wrapper
├── loading.js — Loading fallback
├── error.js — Error boundary ('use client' required)
├── not-found.js — 404 page
├── default.js — Parallel route fallback
├── route.js — API endpoint (Route Handler)
└── middleware.js — Request interceptor (root level)

❌ ERROR HANDLING
├── error.js catches runtime errors
├── not-found.js handles 404s
├── notFound() function to trigger 404
├── throw new Error() for invalid input
├── Error boundaries cascade (closest catches)
└── error.js MUST be Client Component

🖥️ SERVER VS CLIENT COMPONENTS (Deep Dive)
├── Server Components (default)
│   ├── Run ONLY on server
│   ├── Can be async
│   ├── Direct DB/file access
│   ├── No hooks or event handlers
│   └── No JS sent to browser (0kb)
│
├── Client Components ('use client')
│   ├── Run on server (SSR) + browser (hydration)
│   ├── Can use hooks, event handlers
│   ├── Cannot be async
│   └── JS sent to browser (adds to bundle)
│
└── Composition Pattern
    ├── Keep Client Components small
    ├── Wrap Server Components as children
    └── Push 'use client' DOWN the tree

🧭 NAVIGATION
├── <Link> for declarative navigation
├── useRouter() for programmatic (Client)
│   ├── router.push(path)
│   ├── router.replace(path)
│   ├── router.back()
│   ├── router.forward()
│   └── router.refresh()
└── redirect() for Server Components/Actions

🔌 API ROUTES (Route Handlers)
├── app/api/*/route.js
├── Export GET, POST, PUT, DELETE, etc.
├── Receive request object
├── Return NextResponse.json()
├── Support dynamic segments
└── Replace pages/api from Pages Router

🛡️ MIDDLEWARE
├── middleware.js in project root
├── Runs BEFORE route handler
├── Can redirect, rewrite, set headers
├── Use matcher to target specific paths
└── Use cases:
    ├── Authentication
    ├── Logging
    ├── A/B testing
    ├── Custom headers
    └── URL rewriting
```

### Quick Reference Card

```jsx
// 🔵 Server Component (default)
export default async function Page({ params }) {
  const data = await fetch(`/api/data/${params.id}`);
  return <div>{data.title}</div>;
}

// 🟡 Client Component
'use client';
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// 📁 Parallel Routes Layout
export default function Layout({ children, slot1, slot2 }) {
  return (
    <>
      <main>{children}</main>
      <aside>{slot1}</aside>
      <aside>{slot2}</aside>
    </>
  );
}

// 🪝 Intercepting Route (modal)
// app/(.)news/[slug]/page.js
import ModalBackdrop from '@/components/modal-backdrop';
export default function InterceptedPage({ params }) {
  return (
    <>
      <ModalBackdrop />
      <dialog open>{/* Modal content */}</dialog>
    </>
  );
}

// 🔌 Route Handler (API)
// app/api/news/route.js
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ data: [] });
}

// 🛡️ Middleware
// middleware.js
import { NextResponse } from 'next/server';
export function middleware(request) {
  if (!request.cookies.get('auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
```

### Pattern Decision Tree

```
When should I use...?

Parallel Routes:
├── Need multiple views of different data simultaneously
├── Modal that preserves background page
└── Dashboard with multiple independent widgets

Intercepting Routes:
├── Show modal when clicked, full page when visited directly
├── Image lightbox
└── Quick preview without leaving current page

Catch-all Routes:
├── Handle variable URL depth (blog/2024/10/15/post-title)
├── Documentation with nested sections
└── Flexible filtering/search pages

Route Groups:
├── Organize related routes
├── Different layouts for different sections
└── Multiple root layouts in one app

Route Handlers:
├── Public API endpoints
├── Webhooks
└── Third-party integrations

Middleware:
├── Authentication checks
├── Redirects/rewrites
├── Logging
└── Setting cookies/headers
```

---

> **🎯 Key Takeaways:**  
> This module covered Next.js's most **advanced routing features**. Understanding parallel routes, intercepting routes, and the Server/Client component distinction is essential for building complex, production-ready applications. These patterns enable sophisticated UI interactions like modals, multi-pane layouts, and context-aware navigation.