# 📘 Module 3: Next.js Essentials (App Router)

---

## Table of Contents

1. [Module Introduction & Starting Setup](#1-module-introduction--starting-setup)
2. [File-Based Routing & React Server Components](#2-file-based-routing--react-server-components)
3. [Adding Another Route via the File System](#3-adding-another-route-via-the-file-system)
4. [Navigating Between Pages — Wrong & Right Solution](#4-navigating-between-pages--wrong--right-solution)
5. [Working with Pages & Layouts](#5-working-with-pages--layouts)
6. [Reserved File Names & Project Organization](#6-reserved-file-names--project-organization)
7. [Dynamic Routes & Route Parameters](#7-dynamic-routes--route-parameters)
8. [The Foodies App — Main Project](#8-the-foodies-app--main-project)
9. [Exercise: Building Routes](#9-exercise-building-routes)
10. [Revisiting Layouts](#10-revisiting-layouts)
11. [Adding Custom Components to a Layout](#11-adding-custom-components-to-a-layout)
12. [Styling Next.js Projects & CSS Modules](#12-styling-nextjs-projects--css-modules)
13. [Optimizing Images with the Next.js Image Component](#13-optimizing-images-with-the-nextjs-image-component)
14. [Using More Custom Components](#14-using-more-custom-components)
15. [Populating the Starting Page Content](#15-populating-the-starting-page-content)
16. [Preparing an Image Slideshow](#16-preparing-an-image-slideshow)
17. [React Server Components vs Client Components](#17-react-server-components-vs-client-components)
18. [Using Client Components Efficiently](#18-using-client-components-efficiently)
19. [Outputting Meals Data & Images with Unknown Dimensions](#19-outputting-meals-data--images-with-unknown-dimensions)
20. [Setting Up a SQLite Database](#20-setting-up-a-sqlite-database)
21. [Fetching Data — Leveraging Next.js Fullstack Capabilities](#21-fetching-data--leveraging-nextjs-fullstack-capabilities)
22. [Adding a Loading Page](#22-adding-a-loading-page)
23. [Using Suspense & Streamed Responses](#23-using-suspense--streamed-responses)
24. [Handling Errors](#24-handling-errors)
25. [Handling "Not Found" States](#25-handling-not-found-states)
26. [Loading & Rendering Meal Details via Dynamic Routes](#26-loading--rendering-meal-details-via-dynamic-routes)
27. [Throwing Not Found Errors for Individual Meals](#27-throwing-not-found-errors-for-individual-meals)
28. [Getting Started with the "Share Meal" Form](#28-getting-started-with-the-share-meal-form)
29. [Custom Image Picker Input Component](#29-custom-image-picker-input-component)
30. [Adding Image Preview to the Picker](#30-adding-image-preview-to-the-picker)
31. [Server Actions for Handling Form Submissions](#31-server-actions-for-handling-form-submissions)
32. [Storing Server Actions in Separate Files](#32-storing-server-actions-in-separate-files)
33. [Creating a Slug & Sanitizing User Input (XSS Protection)](#33-creating-a-slug--sanitizing-user-input-xss-protection)
34. [Storing Uploaded Images & Data in the Database](#34-storing-uploaded-images--data-in-the-database)
35. [Managing Form Submission Status with useFormStatus](#35-managing-form-submission-status-with-useformstatus)
36. [Adding Server-Side Input Validation](#36-adding-server-side-input-validation)
37. [Working with Server Action Responses & useFormState](#37-working-with-server-action-responses--useformstate)
38. [Building for Production & Understanding Next.js Caching](#38-building-for-production--understanding-nextjs-caching)
39. [Triggering Cache Revalidations](#39-triggering-cache-revalidations)
40. [Don't Store Files Locally & Cloud Storage (AWS S3)](#40-dont-store-files-locally--cloud-storage-aws-s3)
41. [Adding Static Metadata](#41-adding-static-metadata)
42. [Adding Dynamic Metadata](#42-adding-dynamic-metadata)
43. [Module Summary](#43-module-summary)

---

## 1. Module Introduction & Starting Setup

### What This Module Covers

This is the **most important module** of the course. It covers all essential App Router concepts by building a complete **"Foodies" application** — a community recipe sharing website.

```
What You'll Build:
┌─────────────────────────────────────────────┐
│           🍕 NextLevel Food                 │
│                                             │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Home   │ │  Browse  │ │  Share Meal  │  │
│  │  Page   │ │  Meals   │ │   (Form)     │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │         Meal Detail Page               │ │
│  │   (Dynamic route: /meals/[slug])       │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  Features:                                  │
│  • File-based routing                       │
│  • Server & Client Components               │
│  • SQLite database                          │
│  • Image uploads                            │
│  • Server Actions (form handling)           │
│  • Loading & Error states                   │
│  • Caching & Revalidation                   │
│  • Static & Dynamic Metadata (SEO)          │
└─────────────────────────────────────────────┘
```

### Starting Setup

```bash
# Create the project (or use the provided starter code)
npx create-next-app@latest foodies-app

# Navigate into the project
cd foodies-app

# Start development server
npm run dev
```

### Initial File Structure

```
foodies-app/
├── app/
│   ├── layout.js          ← Root layout
│   ├── page.js            ← Home page (/)
│   └── globals.css        ← Global styles
├── public/
│   └── images/            ← Static images
├── components/            ← Reusable components
├── package.json
└── next.config.js
```

---

## 2. File-Based Routing & React Server Components

### File-Based Routing Explained

In Next.js App Router, the **folder structure** inside the `app/` directory defines your application's **URL routes**. Every route needs a `page.js` file.

```
How it works:

app/
├── page.js                →  URL: /                (Home)
├── about/
│   └── page.js            →  URL: /about           (About page)
├── meals/
│   ├── page.js            →  URL: /meals           (All meals)
│   └── [slug]/
│       └── page.js        →  URL: /meals/pasta     (Individual meal)
└── community/
    └── page.js            →  URL: /community       (Community page)
```

### The Rules

```
Rule 1: Only folders create route SEGMENTS
        app/about/page.js  →  /about
        The "about" folder creates the "/about" URL segment

Rule 2: Only page.js files create ACCESSIBLE routes
        A folder without page.js = NOT a visitable route
        app/components/Button.js  → This is NOT a route (no page.js)

Rule 3: layout.js wraps the page and all nested pages
        app/layout.js  → Wraps EVERYTHING
        app/about/layout.js  → Wraps only /about and its children
```

### React Server Components (Default)

In Next.js App Router, **all components are Server Components by default**.

```jsx
// app/page.js
// This is a SERVER COMPONENT (runs on the server, NOT in the browser)

export default function HomePage() {
  // This console.log appears in your TERMINAL, not browser console
  console.log('This runs on the server!');
  
  return (
    <main>
      <h1>Welcome to our app!</h1>
    </main>
  );
}
```

### What Does "Server Component" Mean?

```
Server Component:
┌──────────────────────────────────────────────────────┐
│  1. Your component code runs on the SERVER           │
│  2. The server generates HTML from your component    │
│  3. Only the HTML is sent to the browser             │
│  4. NO JavaScript for this component is sent         │
│  5. The component code NEVER runs in the browser     │
└──────────────────────────────────────────────────────┘

Benefits:
✅ Can directly access databases, file system, secrets
✅ Less JavaScript sent to browser = faster page loads
✅ Better SEO (full HTML sent)
✅ Can use async/await directly in the component

Limitations:
❌ Cannot use useState, useEffect, or other React hooks
❌ Cannot use event handlers (onClick, onChange, etc.)
❌ Cannot use browser APIs (window, document, localStorage)
```

---

## 3. Adding Another Route via the File System

### Creating New Routes

To add a new page, simply create a **folder** with a **`page.js`** file inside it.

**Example: Adding an "About" page**

```
Step 1: Create the folder
  app/about/

Step 2: Create page.js inside it
  app/about/page.js
```

```jsx
// app/about/page.js
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We are a food-loving community!</p>
    </main>
  );
}
```

Now visit `http://localhost:3000/about` — your page is live! 🎉

### Adding Multiple Routes

```
app/
├── page.js                    →  localhost:3000/
├── about/
│   └── page.js                →  localhost:3000/about
├── meals/
│   └── page.js                →  localhost:3000/meals
└── community/
    └── page.js                →  localhost:3000/community
```

```jsx
// app/meals/page.js
export default function MealsPage() {
  return (
    <main>
      <h1>Our Meals</h1>
      <p>Browse our delicious recipes shared by the community.</p>
    </main>
  );
}
```

```jsx
// app/community/page.js
export default function CommunityPage() {
  return (
    <main>
      <h1>Our Community</h1>
      <p>Join fellow food enthusiasts!</p>
    </main>
  );
}
```

### Nested Routes

Create nested folders for nested URLs:

```
app/
└── meals/
    ├── page.js                →  /meals
    └── share/
        └── page.js            →  /meals/share
```

```jsx
// app/meals/share/page.js
export default function ShareMealPage() {
  return (
    <main>
      <h1>Share Your Meal</h1>
      <p>Share your favorite recipe with the community!</p>
    </main>
  );
}
```

---

## 4. Navigating Between Pages — Wrong & Right Solution

### ❌ The WRONG Way: Using `<a>` Tags

```jsx
// ❌ DON'T DO THIS
export default function HomePage() {
  return (
    <main>
      <h1>Welcome!</h1>
      <a href="/meals">Browse Meals</a>   {/* This causes a FULL PAGE RELOAD */}
    </main>
  );
}
```

**Why is `<a>` wrong?**

```
When you click an <a> tag:
1. Browser sends a NEW request to the server
2. Server sends a BRAND NEW HTML page
3. The ENTIRE application reloads
4. All React state is LOST
5. User sees a flash/flicker

This defeats the purpose of a Single Page Application!
```

### ✅ The RIGHT Way: Using Next.js `<Link>` Component

```jsx
import Link from 'next/link';   // Import from 'next/link' (NOT 'react-router-dom')

export default function HomePage() {
  return (
    <main>
      <h1>Welcome!</h1>
      <Link href="/meals">Browse Meals</Link>    {/* Client-side navigation */}
      <Link href="/community">Our Community</Link>
      <Link href="/meals/share">Share a Meal</Link>
    </main>
  );
}
```

**Why `<Link>` is correct:**

```
When you click a <Link>:
1. Next.js intercepts the click (prevents browser default)
2. Only the CHANGED content is fetched
3. The page updates WITHOUT a full reload
4. React state is PRESERVED
5. Navigation is INSTANT (no flash/flicker)
6. Next.js PREFETCHES linked pages in the background!
```

### Key Differences

| Feature | `<a href>` | `<Link href>` |
|---|---|---|
| Full page reload | ✅ Yes | ❌ No |
| Client-side navigation | ❌ No | ✅ Yes |
| Preserves state | ❌ No | ✅ Yes |
| Prefetching | ❌ No | ✅ Automatic |
| Speed | Slow | Fast |
| Import from | Built-in HTML | `next/link` |

### Important Syntax Difference from React Router

```jsx
// React Router (what you might know):
import { Link } from 'react-router-dom';
<Link to="/about">About</Link>          // Uses "to" prop

// Next.js (what you use here):
import Link from 'next/link';
<Link href="/about">About</Link>        // Uses "href" prop
```

---

## 5. Working with Pages & Layouts

### Understanding `layout.js`

The `layout.js` file is a **wrapper component** that wraps the `page.js` and all **nested routes**. It persists across page navigations (doesn't re-render).

```jsx
// app/layout.js — ROOT LAYOUT (wraps the ENTIRE application)
import './globals.css';

export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}   {/* ← The current page renders here */}
      </body>
    </html>
  );
}
```

### How Layouts Work

```
URL: /meals

What actually renders:

RootLayout (app/layout.js)
└── <html>
    └── <body>
        └── {children} ← MealsPage (app/meals/page.js)
            └── <main>
                └── <h1>Our Meals</h1>


URL: /about

RootLayout (app/layout.js)         ← SAME layout, does NOT re-render
└── <html>
    └── <body>
        └── {children} ← AboutPage (app/about/page.js)  ← DIFFERENT page
            └── <main>
                └── <h1>About Us</h1>
```

### Root Layout Requirements

The **root layout** (`app/layout.js`) is **mandatory** and must:

1. ✅ Include `<html>` and `<body>` tags
2. ✅ Accept and render `{children}`
3. ✅ Be in the top-level `app/` directory

```jsx
// This is the MINIMUM required root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Nested Layouts

You can have layouts at **any level** of your route structure:

```
app/
├── layout.js              ← Root layout (wraps everything)
├── page.js
└── meals/
    ├── layout.js          ← Meals layout (wraps only /meals and its children)
    ├── page.js
    └── [slug]/
        └── page.js
```

```jsx
// app/meals/layout.js — Only wraps /meals routes
export default function MealsLayout({ children }) {
  return (
    <>
      <header>
        <h2>🍔 Meals Section</h2>
      </header>
      {children}
    </>
  );
}
```

```
URL: /meals renders:
RootLayout
└── MealsLayout         ← Nested layout
    └── MealsPage       ← The actual page

URL: /about renders:
RootLayout
└── AboutPage           ← No MealsLayout here (it's outside /meals)
```

---

## 6. Reserved File Names & Project Organization

### Reserved File Names in the `app/` Directory

Next.js reserves specific file names for special purposes. These files must be named **exactly** as shown:

| File Name | Purpose | When It's Used |
|---|---|---|
| **`page.js`** | The page UI for that route | When user visits the route |
| **`layout.js`** | Shared layout wrapper | Wraps the page and nested routes |
| **`loading.js`** | Loading UI (fallback) | While page/data is loading |
| **`error.js`** | Error UI | When an error occurs |
| **`not-found.js`** | 404 Not Found UI | When route/resource doesn't exist |
| **`route.js`** | API endpoint (no UI) | For backend API routes |
| **`template.js`** | Like layout but re-renders on navigation | Rarely used |
| **`default.js`** | Fallback for parallel routes | Advanced feature |

### Visual Overview

```
app/
├── layout.js          ← Required root layout
├── page.js            ← Home page (/)
├── loading.js         ← Loading UI for home page
├── error.js           ← Error UI for home page
├── not-found.js       ← 404 page (global)
├── globals.css        ← Global styles
│
├── meals/
│   ├── page.js        ← /meals page
│   ├── layout.js      ← Layout for /meals section
│   ├── loading.js     ← Loading UI for /meals
│   ├── error.js       ← Error UI for /meals
│   │
│   ├── share/
│   │   └── page.js    ← /meals/share page
│   │
│   └── [slug]/
│       └── page.js    ← /meals/:slug page (dynamic)
│
└── community/
    └── page.js        ← /community page
```

### How These Files Work Together

```
When a user visits /meals:

1. Next.js looks for app/meals/page.js
2. While loading → shows app/meals/loading.js (if it exists)
3. If data loads successfully → shows page.js
4. If an error occurs → shows app/meals/error.js (if it exists)
5. If the route doesn't exist → shows app/not-found.js

The page is wrapped by:
- app/layout.js (root layout)
- app/meals/layout.js (if it exists)
```

### Custom Components & Where to Put Them

Non-page components (regular reusable components) can be placed **anywhere** because Next.js only treats `page.js`, `layout.js`, etc. as special.

```
Option 1: Top-level components folder (RECOMMENDED)
─────────────────────────────────────────────────────
foodies-app/
├── app/
│   └── ...
├── components/            ← Reusable components here
│   ├── header/
│   │   ├── MainHeader.js
│   │   └── MainHeader.module.css
│   ├── meals/
│   │   ├── MealItem.js
│   │   └── MealItem.module.css
│   └── ui/
│       ├── Button.js
│       └── Card.js
└── ...


Option 2: Inside app/ (co-located with routes)
───────────────────────────────────────────────
app/
├── meals/
│   ├── page.js
│   ├── _components/        ← Underscore prefix = private folder
│   │   └── MealsList.js    ← Only used in /meals pages
│   └── [slug]/
│       └── page.js
└── ...


Option 3: Next to the page file (simplest for small components)
───────────────────────────────────────────────────────────────
app/
├── meals/
│   ├── page.js
│   ├── MealGrid.js        ← Not a reserved name, so it's safe
│   └── MealGrid.module.css
└── ...
```

### Important: Non-Reserved Files Are Safe

```
Inside the app/ folder, you CAN have other files:
✅ app/meals/MealGrid.js        ← Not a route (not named page.js)
✅ app/meals/meals.module.css    ← Just a CSS file
✅ app/meals/helpers.js          ← Just a utility file
✅ app/meals/_components/        ← Private folder (underscore prefix)

ONLY these names create routes/special behavior:
page.js, layout.js, loading.js, error.js, not-found.js, route.js
```

### Private Folders (Underscore Convention)

Prefix a folder with `_` to exclude it from routing:

```
app/
├── _components/           ← Private! Not a route
│   └── Button.js
├── _lib/                  ← Private! Not a route
│   └── utils.js
└── meals/
    └── page.js            ← This IS a route: /meals
```

### Route Groups (Parentheses Convention)

Wrap a folder name in `()` to create a **route group** — it organizes files without affecting the URL:

```
app/
├── (marketing)/            ← Group! Does NOT appear in URL
│   ├── about/
│   │   └── page.js         →  /about  (NOT /marketing/about)
│   └── contact/
│       └── page.js         →  /contact
├── (shop)/                 ← Group! Does NOT appear in URL
│   ├── products/
│   │   └── page.js         →  /products
│   └── cart/
│       └── page.js         →  /cart
└── page.js                 →  /
```

---

## 7. Dynamic Routes & Route Parameters

### What Are Dynamic Routes?

Dynamic routes handle URLs where part of the path **changes** — like a product ID, blog slug, or user name.

```
Static route:   /meals          → Always the same content
Dynamic route:  /meals/pasta    → Content depends on "pasta"
Dynamic route:  /meals/burger   → Content depends on "burger"
Dynamic route:  /meals/sushi    → Content depends on "sushi"
```

### Creating Dynamic Routes

Use **square brackets** `[]` in the folder name to create a dynamic segment:

```
app/
└── meals/
    ├── page.js              →  /meals (static)
    └── [slug]/              ← Square brackets = dynamic!
        └── page.js          →  /meals/ANYTHING
                                 /meals/pasta
                                 /meals/burger
                                 /meals/sushi-roll
```

### Accessing Route Parameters

The dynamic segment value is available through the `params` prop:

```jsx
// app/meals/[slug]/page.js

export default function MealDetailPage({ params }) {
  // params.slug contains the dynamic part of the URL
  // If URL is /meals/pasta → params.slug = "pasta"
  // If URL is /meals/burger → params.slug = "burger"

  return (
    <main>
      <h1>Meal: {params.slug}</h1>
      <p>Details about this meal would go here.</p>
    </main>
  );
}
```

### Multiple Dynamic Segments

```
app/
└── blog/
    └── [year]/
        └── [month]/
            └── page.js      →  /blog/2024/03

// app/blog/[year]/[month]/page.js
export default function BlogArchivePage({ params }) {
  return (
    <h1>
      Posts from {params.month}/{params.year}
    </h1>
  );
}
// URL: /blog/2024/03 → params = { year: "2024", month: "03" }
```

### Catch-All Dynamic Routes

Use `[...slug]` to catch **all** remaining segments:

```
app/
└── docs/
    └── [...slug]/
        └── page.js          →  /docs/getting-started
                                 /docs/api/reference
                                 /docs/a/b/c/d

// app/docs/[...slug]/page.js
export default function DocsPage({ params }) {
  // params.slug is an ARRAY
  // /docs/a/b/c → params.slug = ["a", "b", "c"]
  return <h1>Docs: {params.slug.join(' > ')}</h1>;
}
```

### Summary of Dynamic Route Patterns

| Pattern | Folder Name | Example URL | `params` Value |
|---|---|---|---|
| Single dynamic | `[slug]` | `/meals/pasta` | `{ slug: "pasta" }` |
| Multiple dynamic | `[category]/[id]` | `/shop/electronics/42` | `{ category: "electronics", id: "42" }` |
| Catch-all | `[...slug]` | `/docs/a/b/c` | `{ slug: ["a", "b", "c"] }` |
| Optional catch-all | `[[...slug]]` | `/docs` or `/docs/a/b` | `{ slug: undefined }` or `{ slug: ["a", "b"] }` |

---

## 8. The Foodies App — Main Project

### Project Overview

The main project for this module is a **community recipe sharing app** called "NextLevel Food."

```
┌────────────────────────────────────────────────────────┐
│              🍕 NextLevel Food App                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Pages:                                                │
│  ┌────────────────┐                                    │
│  │ Home (/)       │ Landing page with image slideshow  │
│  ├────────────────┤                                    │
│  │ Meals (/meals) │ Grid of all community meals        │
│  ├────────────────┤                                    │
│  │ Meal Detail    │ Single meal with full details      │
│  │ (/meals/[slug])│ (dynamic route)                    │
│  ├────────────────┤                                    │
│  │ Share Meal     │ Form to submit a new recipe        │
│  │ (/meals/share) │                                    │
│  ├────────────────┤                                    │
│  │ Community      │ Community info page                │
│  │ (/community)   │                                    │
│  └────────────────┘                                    │
│                                                        │
│  Features:                                             │
│  • SQLite database for storing meals                   │
│  • Image upload with preview                           │
│  • Server Actions for form handling                    │
│  • Loading states with Suspense                        │
│  • Error handling                                      │
│  • SEO metadata                                        │
│  • Image optimization                                  │
│  • XSS protection                                      │
│  • Cache revalidation                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Route Structure

```
app/
├── layout.js                  ← Root layout (header + main nav)
├── page.js                    ← Home page (/)
├── page.module.css
├── not-found.js               ← Custom 404 page
│
├── meals/
│   ├── page.js                ← All meals (/meals)
│   ├── loading.js             ← Loading state for meals
│   ├── error.js               ← Error state for meals
│   │
│   ├── share/
│   │   └── page.js            ← Share meal form (/meals/share)
│   │
│   └── [slug]/
│       └── page.js            ← Meal detail (/meals/pasta)
│
└── community/
    └── page.js                ← Community (/community)
```

---

## 9. Exercise: Building Routes

### Task

Create the complete route structure for the Foodies app:

1. Home page at `/`
2. Meals page at `/meals`
3. Share meal page at `/meals/share`
4. Individual meal page at `/meals/[slug]`
5. Community page at `/community`

### Solution

```jsx
// app/page.js — Home Page
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to NextLevel Food!</h1>
      <p>
        Explore & share meals from around the world.
      </p>
    </main>
  );
}
```

```jsx
// app/meals/page.js — All Meals
export default function MealsPage() {
  return (
    <main>
      <h1>Delicious meals, created{' '}
        <span>by you</span>
      </h1>
      <p>
        Choose your favorite recipe and cook it yourself. It is easy and fun!
      </p>
    </main>
  );
}
```

```jsx
// app/meals/share/page.js — Share Meal Form
export default function ShareMealPage() {
  return (
    <main>
      <h1>
        Share your <span>favorite meal</span>
      </h1>
      <p>Or any other meal you feel needs sharing!</p>
      {/* Form will be added later */}
    </main>
  );
}
```

```jsx
// app/meals/[slug]/page.js — Meal Detail
export default function MealDetailPage({ params }) {
  return (
    <main>
      <h1>Meal: {params.slug}</h1>
      {/* Meal details will be fetched from database later */}
    </main>
  );
}
```

```jsx
// app/community/page.js — Community
export default function CommunityPage() {
  return (
    <main>
      <h1>
        One shared passion: <span>Food</span>
      </h1>
      <p>Join our community and share your favorite recipes!</p>
    </main>
  );
}
```

---

## 10. Revisiting Layouts

### How Layouts Nest

Layouts **wrap** their `page.js` and all **child layouts/pages**. They are **persistent** — they don't re-render when you navigate between pages within the same layout.

```
Visual representation of layout nesting:

app/layout.js (Root Layout)
┌──────────────────────────────────────┐
│  <html>                              │
│    <body>                            │
│      <MainHeader />                  │
│                                      │
│      {children}  ←─── This changes   │
│                       based on URL   │
│                                      │
│    </body>                           │
│  </html>                             │
└──────────────────────────────────────┘

When URL = /
  children = <HomePage />

When URL = /meals
  children = <MealsLayout>
               <MealsPage />
             </MealsLayout>

When URL = /meals/pasta
  children = <MealsLayout>
               <MealDetailPage />
             </MealsLayout>
```

### Layout Persistence

```
User navigates: /meals → /meals/pasta → /meals/share

Root Layout:  Stays mounted (NEVER re-renders)   ← 🔑 Key feature!
└── MealsLayout: Stays mounted (same section)
    └── Page: Changes with each navigation

This means:
✅ Header navigation state is preserved
✅ Sidebar state is preserved
✅ Scroll position in layout is preserved
✅ Better performance (less re-rendering)
```

### Important: `template.js` vs `layout.js`

```
layout.js:    Does NOT re-render on navigation (persistent)
template.js:  DOES re-render on navigation (creates new instance)

Use layout.js (default) for most cases.
Use template.js when you need to reset state on navigation
(e.g., animations that should replay).
```

---

## 11. Adding Custom Components to a Layout

### Creating a Main Header/Navigation

```jsx
// components/main-header/main-header.js
import Link from 'next/link';
import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import Image from 'next/image';
import MainHeaderBackground from './main-header-background';
import NavLink from './nav-link';

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <MainHeaderBackground />
      <Link className={classes.logo} href="/">
        <Image 
          src={logoImg} 
          alt="A plate with food" 
          priority 
        />
        NextLevel Food
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink href="/meals">Browse Meals</NavLink>
          </li>
          <li>
            <NavLink href="/community">Foodies Community</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

### Adding Header to Root Layout

```jsx
// app/layout.js
import MainHeader from '@/components/main-header/main-header';
import './globals.css';

export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />       {/* Header appears on EVERY page */}
        {children}            {/* Current page content */}
      </body>
    </html>
  );
}
```

### The `@` Import Alias

Next.js provides `@` as an alias for the project root:

```jsx
// Instead of relative paths with ../../..
import MainHeader from '../../../components/main-header/main-header';

// Use the @ alias (cleaner, doesn't break when you move files)
import MainHeader from '@/components/main-header/main-header';
```

This is configured in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 12. Styling Next.js Projects & CSS Modules

### Styling Options in Next.js

| Option | Scoped? | Description |
|---|---|---|
| **Global CSS** | ❌ Global | `globals.css` imported in root layout |
| **CSS Modules** | ✅ Scoped | `.module.css` files imported as objects |
| **Tailwind CSS** | ✅ Utility | Utility-first CSS framework |
| **CSS-in-JS** | ✅ Scoped | styled-components, etc. (limited in Server Components) |
| **Sass/SCSS** | Both | After installing `sass` package |

### Global CSS

```css
/* app/globals.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Montserrat', sans-serif;
}

body {
  background: #1e1e2f;
  color: #ddd;
}

a {
  color: #f0b463;
  text-decoration: none;
}
```

```jsx
// app/layout.js — Import global CSS here
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### CSS Modules (Recommended for Components)

```css
/* components/main-header/main-header.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 2rem;
  text-decoration: none;
  color: #ddd6cb;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  font-size: 1.5rem;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: #ddd6cb;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.nav a:hover,
.nav a.active {
  background: linear-gradient(90deg, #ff8a05, #f9b331);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

```jsx
// components/main-header/main-header.js
import classes from './main-header.module.css';

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        NextLevel Food
      </div>
      <nav className={classes.nav}>
        <ul>
          <li><a href="/meals">Browse Meals</a></li>
          <li><a href="/community">Community</a></li>
        </ul>
      </nav>
    </header>
  );
}
```

### Page-Specific CSS Modules

```css
/* app/page.module.css */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin: 3rem auto;
  width: 90%;
  max-width: 75rem;
}

.header h1 {
  font-size: 2rem;
}

.header h1 span {
  background: linear-gradient(90deg, #ff8a05, #f9b331);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta {
  font-size: 1.2rem;
}

.cta a {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #ff8a05, #f9b331);
  color: #1e1e2f;
  font-weight: bold;
}
```

```jsx
// app/page.js
import Link from 'next/link';
import classes from './page.module.css';

export default function HomePage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          NextLevel Food for <span>NextLevel Foodies</span>
        </h1>
        <p>Taste & share food from all over the world.</p>
        <p className={classes.cta}>
          <Link href="/community">Join the Community</Link>
        </p>
      </header>
      <main>
        {/* Slideshow and more content */}
      </main>
    </>
  );
}
```

---

## 13. Optimizing Images with the Next.js Image Component

### The Problem with Regular `<img>` Tags

```jsx
// ❌ Regular <img> — no optimization
<img src="/images/burger.jpg" alt="Burger" />

// Problems:
// 1. Full-size image loads even on small screens
// 2. No lazy loading by default
// 3. May cause layout shift (CLS)
// 4. No modern format (WebP/AVIF) conversion
// 5. No automatic sizing
```

### The Next.js `<Image>` Component

```jsx
import Image from 'next/image';  // Import from 'next/image'

// For LOCAL images (imported):
import burgerImg from '@/assets/burger.jpg';

export default function MealCard() {
  return (
    <div>
      <Image 
        src={burgerImg}          // Imported image
        alt="A delicious burger"
        // width and height are AUTOMATIC for imported images!
        priority                  // Load immediately (for above-the-fold images)
      />
    </div>
  );
}
```

### What `<Image>` Does Automatically

```
Next.js Image Component automatically:
┌──────────────────────────────────────────────────┐
│ ✅ Lazy loading (loads when scrolling into view)  │
│ ✅ Responsive sizes (serves right size for screen)│
│ ✅ Modern formats (converts to WebP/AVIF)         │
│ ✅ Prevents layout shift (reserves space)         │
│ ✅ Blur placeholder (shows blur while loading)    │
│ ✅ Caching (caches optimized images)              │
│ ✅ On-demand optimization (optimizes at request)  │
└──────────────────────────────────────────────────┘
```

### Different Ways to Use `<Image>`

#### 1. Local Images (Imported)

```jsx
import Image from 'next/image';
import logoImg from '@/assets/logo.png';

// Width and height are automatically detected from the imported file
<Image 
  src={logoImg} 
  alt="Logo" 
  priority            // Use for above-the-fold images (no lazy load)
/>
```

#### 2. Remote Images (URLs)

```jsx
// For remote images, you MUST provide width and height
<Image 
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={400}          // Required for remote images
  height={300}         // Required for remote images
/>
```

#### 3. Fill Mode (Unknown Dimensions)

```jsx
// When you don't know the exact dimensions, use "fill"
// The image will fill its parent container
<div style={{ position: 'relative', width: '100%', height: '300px' }}>
  <Image 
    src={mealImage}
    alt="Meal"
    fill                 // Image fills the parent container
    style={{ objectFit: 'cover' }}  // How to fit (cover, contain, etc.)
  />
</div>
```

### Remote Image Domains Configuration

For security, you must whitelist remote image domains in `next.config.js`:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

### The `priority` Prop

```jsx
// Use priority for the LARGEST image visible on initial page load
// (above the fold = visible without scrolling)

// ✅ Use priority for:
<Image src={heroImg} alt="Hero" priority />    // Hero images
<Image src={logoImg} alt="Logo" priority />     // Logo in header

// ❌ Don't use priority for:
<Image src={footerImg} alt="Footer" />          // Below the fold
<Image src={galleryImg} alt="Gallery item" />   // Scrollable gallery
```

---

## 14. Using More Custom Components

### Creating Reusable Components

```jsx
// components/meals/meal-item.js
import Link from 'next/link';
import Image from 'next/image';
import classes from './meal-item.module.css';

export default function MealItem({ title, slug, image, summary, creator }) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={image} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
```

```jsx
// components/meals/meals-grid.js
import MealItem from './meal-item';
import classes from './meals-grid.module.css';

export default function MealsGrid({ meals }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
```

---

## 15. Populating the Starting Page Content

### Home Page with Rich Content

```jsx
// app/page.js
import Link from 'next/link';
import ImageSlideshow from '@/components/images/image-slideshow';
import classes from './page.module.css';

export default function HomePage() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>NextLevel Food for NextLevel Foodies</h1>
            <p>Taste & share food from all over the world.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/community">Join the Community</Link>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes, 
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect 
            with other food lovers.
          </p>
        </section>
        <section className={classes.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world.
          </p>
        </section>
      </main>
    </>
  );
}
```

---

## 16. Preparing an Image Slideshow

### Creating a Slideshow Component

The slideshow automatically cycles through food images. It uses `useState` and `useEffect`, which means it needs to be a **Client Component**.

```jsx
// components/images/image-slideshow.js
'use client';  // ← Required because we use useState and useEffect

import { useState, useEffect } from 'react';
import Image from 'next/image';

import burgerImg from '@/assets/burger.jpg';
import curryImg from '@/assets/curry.jpg';
import dumplingsImg from '@/assets/dumplings.jpg';
import macncheeseImg from '@/assets/macncheese.jpg';
import pizzaImg from '@/assets/pizza.jpg';
import schnitzelImg from '@/assets/schnitzel.jpg';
import tomatoSaladImg from '@/assets/tomato-salad.jpg';

import classes from './image-slideshow.module.css';

const images = [
  { image: burgerImg, alt: 'A delicious, juicy burger' },
  { image: curryImg, alt: 'A delicious, spicy curry' },
  { image: dumplingsImg, alt: 'Steamed dumplings' },
  { image: macncheeseImg, alt: 'Mac and cheese' },
  { image: pizzaImg, alt: 'A delicious pizza' },
  { image: schnitzelImg, alt: 'A delicious schnitzel' },
  { image: tomatoSaladImg, alt: 'A delicious tomato salad' },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);  // Cleanup
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ''}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
```

---

## 17. React Server Components vs Client Components

### The Two Types of Components

```
┌────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                          │
│                                                                │
│   ┌──────────────────────┐      ┌───────────────────────────┐  │
│   │  Server Components   │      │   Client Components       │  │
│   │  (DEFAULT)           │      │   ('use client')          │  │
│   │                      │      │                           │  │
│   │  ✅ Run on server    │      │  ✅ Run in browser        │  │
│   │  ✅ Direct DB access │      │  ✅ useState, useEffect   │  │
│   │  ✅ No JS sent to    │      │  ✅ Event handlers        │  │
│   │     browser          │      │  ✅ Browser APIs          │  │
│   │  ✅ async/await      │      │  ✅ Interactivity         │  │
│   │  ✅ Secrets/API keys │      │                           │  │
│   │                      │      │  ❌ Can't access server   │  │
│   │  ❌ No hooks         │      │     resources directly    │  │
│   │  ❌ No event handlers│      │  ❌ More JS sent to       │  │
│   │  ❌ No browser APIs  │      │     browser               │  │
│   └──────────────────────┘      └───────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### When to Use Which?

```
Decision Tree:

Does the component need...
├── useState or useEffect?           → 🟡 Client Component
├── onClick, onChange, onSubmit?     → 🟡 Client Component
├── Browser APIs (window, document)? → 🟡 Client Component
├── Interactive widgets?             → 🟡 Client Component
│
├── Database access?                 → 🔵 Server Component
├── File system access?              → 🔵 Server Component
├── API keys / secrets?              → 🔵 Server Component
├── Just displaying data?            → 🔵 Server Component
├── Fetching data from APIs?         → 🔵 Server Component
└── No interactivity?                → 🔵 Server Component (default)
```

### Detailed Comparison

| Feature | Server Component 🔵 | Client Component 🟡 |
|---|---|---|
| **Default?** | ✅ Yes (no directive needed) | ❌ Must add `'use client'` |
| **Runs where?** | Server only | Server (initial) + Browser |
| **useState** | ❌ | ✅ |
| **useEffect** | ❌ | ✅ |
| **useRef** | ❌ | ✅ |
| **Event handlers** | ❌ | ✅ |
| **async component** | ✅ `async function Page()` | ❌ |
| **Direct DB access** | ✅ | ❌ |
| **Environment variables (secrets)** | ✅ | ❌ (only `NEXT_PUBLIC_` ones) |
| **JS bundle size impact** | None (no JS sent) | Increases bundle |
| **SEO** | ✅ Full HTML rendered | HTML rendered, then hydrated |
| **Import Server Components?** | ✅ | ❌ (but can receive as children) |
| **Import Client Components?** | ✅ | ✅ |

### How to Make a Client Component

Add `'use client'` as the **very first line** of the file:

```jsx
'use client';  // ← This directive makes it a Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### The Boundary Rule

```
'use client' creates a BOUNDARY.

Everything imported INTO a Client Component
also becomes a Client Component (automatically).

                Server Component (page.js)
                ┌──────────────────────┐
                │  Can render Server   │
                │  and Client comps    │
                │                      │
                │  ┌────────────────┐  │
                │  │'use client'    │  │  ← Client boundary
                │  │ Counter.js     │  │
                │  │                │  │
                │  │  ┌──────────┐  │  │
                │  │  │ChildComp │  │  │  ← Also Client
                │  │  │(auto)    │  │  │ (even without 'use client')
                │  │  └──────────┘  │  │
                │  └────────────────┘  │
                │                      │
                │  ┌────────────────┐  │
                │  │ ServerComp     │  │  ← Still Server
                │  │ (no directive) │  │     (not imported by Client)
                │  └────────────────┘  │
                └──────────────────────┘
```

---

## 18. Using Client Components Efficiently

### The Golden Rule: Keep Client Components Small

```
❌ BAD: Making the entire page a Client Component
─────────────────────────────────────────────────
'use client'  // ← Everything becomes Client!

export default function MealsPage() {
  const [search, setSearch] = useState('');
  
  return (
    <main>
      <h1>Meals</h1>                          {/* Doesn't need client */}
      <p>Browse our meals</p>                  {/* Doesn't need client */}
      <input onChange={(e) => setSearch(...)} />{/* NEEDS client */}
      <MealsGrid meals={meals} />              {/* Doesn't need client */}
    </main>
  );
}


✅ GOOD: Extract only the interactive part into a Client Component
───────────────────────────────────────────────────────────────────
// SearchBar.js (Client Component — small, focused)
'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  return <input onChange={(e) => setSearch(e.target.value)} />;
}

// MealsPage.js (Server Component — most of the page)
import SearchBar from '@/components/SearchBar';
import MealsGrid from '@/components/MealsGrid';

export default function MealsPage() {
  return (
    <main>
      <h1>Meals</h1>                    {/* Server rendered */}
      <p>Browse our meals</p>            {/* Server rendered */}
      <SearchBar />                      {/* Client island */}
      <MealsGrid meals={meals} />        {/* Server rendered */}
    </main>
  );
}
```

### Pattern: Wrapping Server Components as Children

Server Components **can** be passed as `children` to Client Components:

```jsx
// ClientWrapper.js — Client Component
'use client';
import { useState } from 'react';

export default function ClientWrapper({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
      {isVisible && children}  {/* children can be Server Components! */}
    </div>
  );
}

// Page.js — Server Component
import ClientWrapper from './ClientWrapper';
import ServerContent from './ServerContent';  // Server Component

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* This stays a Server Component! */}
    </ClientWrapper>
  );
}
```

### Active NavLink Example (Client Component)

```jsx
// components/main-header/nav-link.js
'use client';  // Need usePathname hook

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const path = usePathname();   // Get current URL path
  
  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.link} ${classes.active}`
          : classes.link
      }
    >
      {children}
    </Link>
  );
}
```

```jsx
// components/main-header/main-header.js
// This stays a SERVER Component!
import NavLink from './nav-link';

export default function MainHeader() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink href="/meals">Browse Meals</NavLink>  {/* Client */}
          </li>
          <li>
            <NavLink href="/community">Community</NavLink> {/* Client */}
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

### Summary: Component Strategy

```
Server Components (default — use for most things):
├── Page layouts
├── Data display
├── Static content
├── Database queries
└── API calls

Client Components ('use client' — use ONLY when needed):
├── Forms & input fields
├── Buttons with onClick
├── Dropdowns, modals, tabs
├── Animations
├── Hooks (useState, useEffect, etc.)
└── Browser APIs

Rule of thumb:
"Push 'use client' as far DOWN the component tree as possible"
```

---

## 19. Outputting Meals Data & Images with Unknown Dimensions

### Rendering a Meals Grid

```jsx
// components/meals/meals-grid.js
import MealItem from './meal-item';
import classes from './meals-grid.module.css';

export default function MealsGrid({ meals }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
```

### Handling Images with Unknown Dimensions

When images come from a database or user uploads, you often don't know the exact dimensions. Use the `fill` prop:

```jsx
// components/meals/meal-item.js
import Link from 'next/link';
import Image from 'next/image';
import classes from './meal-item.module.css';

export default function MealItem({ title, slug, image, summary, creator }) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          {/* 'fill' makes the image fill its positioned parent */}
          <Image 
            src={image} 
            alt={title} 
            fill 
          />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
```

```css
/* The parent container MUST have position: relative */
.image {
  position: relative;     /* Required for fill mode */
  width: 100%;
  height: 20rem;
}

.image img {
  object-fit: cover;      /* How the image fills the container */
}
```

---

## 20. Setting Up a SQLite Database

### Why SQLite?

- **Simple** — No external database server needed
- **File-based** — Database is just a file on disk
- **Great for learning** — Easy to set up and use
- **Good for small projects** — Used by many production apps

### Installation

```bash
npm install better-sqlite3
```

### Database Setup

```javascript
// lib/meals.js (or initdb.js for initial setup)
import sql from 'better-sqlite3';

// Create/connect to the database file
const db = sql('meals.db');
```

### Initialize the Database with Seed Data

```javascript
// initdb.js (run once to create tables and seed data)
const sql = require('better-sqlite3');
const db = sql('meals.db');

// Create the meals table
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    instructions TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_email TEXT NOT NULL
  )
`).run();

// Insert sample data
const stmt = db.prepare(`
  INSERT INTO meals VALUES (
    null,
    @slug,
    @title,
    @image,
    @summary,
    @instructions,
    @creator,
    @creator_email
  )
`);

const dummyMeals = [
  {
    title: 'Juicy Cheese Burger',
    slug: 'juicy-cheese-burger',
    image: '/images/burger.jpg',
    summary: 'A mouth-watering burger with a juicy beef patty...',
    instructions: 'Prepare the patty...\nGrill the burger...',
    creator: 'John Doe',
    creator_email: 'johndoe@example.com',
  },
  {
    title: 'Spicy Curry',
    slug: 'spicy-curry',
    image: '/images/curry.jpg',
    summary: 'A rich and spicy curry...',
    instructions: 'Heat oil...\nAdd spices...',
    creator: 'Max Schwarz',
    creator_email: 'max@example.com',
  },
  // ... more meals
];

for (const meal of dummyMeals) {
  stmt.run(meal);
}
```

```bash
# Run the seed script once
node initdb.js
```

---

## 21. Fetching Data — Leveraging Next.js Fullstack Capabilities

### The Power of Server Components for Data Fetching

Because components in Next.js App Router are **Server Components by default**, you can **directly access the database** inside your components. No API routes needed, no `useEffect`, no loading spinner code.

```jsx
// lib/meals.js — Database utility functions
import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
  // Simulate a delay (to see loading states)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Direct database query — this runs on the SERVER!
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}
```

```jsx
// app/meals/page.js — Server Component (async!)
import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';
import Link from 'next/link';
import classes from './page.module.css';

export default async function MealsPage() {
  // 🔑 Direct database access in the component!
  // No useEffect, no useState, no API calls!
  const meals = await getMeals();

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{' '}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={classes.main}>
        <MealsGrid meals={meals} />
      </main>
    </>
  );
}
```

### Why This Is Amazing

```
Traditional React:
──────────────────
1. Component renders (empty)
2. useEffect fires
3. fetch() to API route/endpoint
4. API route queries database
5. API sends JSON response
6. Component receives data
7. Component re-renders with data
8. Show loading spinner during steps 2-6

Next.js Server Component:
─────────────────────────
1. Component runs on server
2. Database query happens directly
3. HTML is generated with the data
4. Complete HTML sent to browser
5. Done!

No API routes needed!
No useEffect needed!
No loading state code needed! (handled separately)
No second render needed!
```

---

## 22. Adding a Loading Page

### The `loading.js` File

Create a `loading.js` file in the same folder as `page.js` to show a **loading fallback** while the page data is being fetched.

```jsx
// app/meals/loading.js
import classes from './loading.module.css';

export default function MealsLoadingPage() {
  return (
    <p className={classes.loading}>Fetching meals...</p>
  );
}
```

```css
/* app/meals/loading.module.css */
.loading {
  text-align: center;
  animation: loading 1.2s ease-in-out infinite;
}

@keyframes loading {
  0% { color: #e9e9e9; }
  50% { color: #b89a64; }
  100% { color: #e9e9e9; }
}
```

### How `loading.js` Works

```
User navigates to /meals:

1. Next.js sees /meals has a loading.js
2. IMMEDIATELY shows loading.js content
3. In the background, fetches data for page.js
4. When data is ready, REPLACES loading.js with page.js

Timeline:
─────────────────────────────────────────────
  loading.js displayed          page.js displayed
  ├──────────────────────────┤ ├──────────────→
  0s                          2s (data ready)
```

### Problem: Loading Replaces the Entire Page

`loading.js` replaces **everything** in that route segment — including the header text that doesn't need loading:

```
What happens:                    What we want:
┌───────────────────┐            ┌─────────────────────┐
│  "Loading..."     │            │  Header text        │
│                   │            │  (shows immediately)│
│  (header text     │            │                     │
│   is hidden too!) │            │  "Loading..."       │
│                   │            │  (only for grid)    │
└───────────────────┘            └─────────────────────┘
```

The solution is **Suspense** — covered in the next section.

---

## 23. Using Suspense & Streamed Responses

### The Problem with `loading.js`

`loading.js` wraps the **entire page** — it hides everything while loading. But often, you want to show **some content immediately** and only show a loading indicator for the **data-dependent part**.

### Solution: React `<Suspense>` with Granular Control

**Step 1:** Extract the data-fetching part into its own async component:

```jsx
// components/meals/meals-list.js (or keep it in page)
import { getMeals } from '@/lib/meals';
import MealsGrid from './meals-grid';

export default async function Meals() {
  const meals = await getMeals();   // This takes time (async)
  return <MealsGrid meals={meals} />;
}
```

**Step 2:** Use `<Suspense>` in the page to wrap ONLY the slow part:

```jsx
// app/meals/page.js
import { Suspense } from 'react';
import Link from 'next/link';
import classes from './page.module.css';
import Meals from '@/components/meals/meals-list';

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{' '}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself.
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        {/* Only THIS part shows loading. Header above is immediate! */}
        <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
```

### How Suspense Works

```
Without Suspense (loading.js):
┌──────────────────┐         ┌──────────────────┐
│                  │         │  Header          │
│  "Loading..."    │  ──→    │  Meals Grid      │
│  (everything)    │         │  (everything)    │
│                  │         │                  │
└──────────────────┘         └──────────────────┘
     All or nothing            All at once


With Suspense (granular):
┌──────────────────┐         ┌────────────────────┐
│  Header          │  ──→    │  Header            │
│  (immediate!)    │         │  (stays)           │
│                  │         │                    │
│  "Loading..."    │         │  Meals Grid        │
│  (only grid)     │         │  (replaces loader) │
└──────────────────┘         └────────────────────┘
  Header + loading             Everything loaded
```

### Streaming

Suspense enables **streaming** — the server sends the page in **chunks**:

```
Traditional server rendering:
Server: [wait for ALL data] → [send complete HTML]

Streaming with Suspense:
Server: [send HTML with static parts immediately]
        [when data is ready, stream in the dynamic parts]

Result: User sees content FASTER
```

### You Can Delete `loading.js` When Using Suspense

When you use `<Suspense>` with a `fallback`, you no longer need the `loading.js` file for that route:

```
❌ app/meals/loading.js    ← Can be deleted
✅ <Suspense fallback={<Loading />}>  ← Replaces it with more control
```

---

## 24. Handling Errors

### The `error.js` File

Create an `error.js` file to catch **runtime errors** in a route segment and its children.

```jsx
// app/meals/error.js
'use client';  // ⚠️ error.js MUST be a Client Component!

export default function MealsErrorPage({ error }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>Failed to fetch meal data. Please try again later.</p>
    </main>
  );
}
```

### Why `error.js` Must Be a Client Component

```
error.js must have 'use client' because:

1. Errors can happen on the client side too
2. React's Error Boundary (which error.js creates) 
   only works as a Client Component
3. It needs to be able to recover from client-side errors
```

### How `error.js` Works

```
Normal flow:
layout.js → page.js renders successfully ✅

Error flow:
layout.js → page.js throws an error ❌
         → error.js catches the error and displays fallback UI

Error boundary hierarchy:
app/
├── layout.js          ← NOT caught by app/error.js
├── error.js           ← Catches errors in page.js and children
├── page.js            ← If this throws → error.js shows
└── meals/
    ├── error.js       ← Catches errors in meals/page.js
    ├── page.js        ← If this throws → meals/error.js shows
    └── [slug]/
        └── page.js    ← If this throws → meals/error.js shows
                          (bubbles up to nearest error.js)
```

### Error Recovery

```jsx
// app/meals/error.js
'use client';

export default function MealsErrorPage({ error, reset }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>  {/* Retry rendering */}
    </main>
  );
}
```

| Prop | Type | Description |
|---|---|---|
| `error` | `Error` object | The error that was thrown |
| `reset` | Function | Re-tries rendering the route segment |

---

## 25. Handling "Not Found" States

### Global 404 Page

```jsx
// app/not-found.js — Shown when visiting a URL that doesn't match any route
export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>Not found</h1>
      <p>Unfortunately, we could not find the requested page or resource.</p>
    </main>
  );
}
```

### When `not-found.js` Is Triggered

```
Automatically triggered when:
• User visits a URL with no matching route
  e.g., /some-random-page → no app/some-random-page/page.js exists

Manually triggered when:
• You call the notFound() function in your code
  (covered in the next section)
```

---

## 26. Loading & Rendering Meal Details via Dynamic Routes

### Creating the Meal Detail Page

```jsx
// app/meals/[slug]/page.js
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMeal } from '@/lib/meals';
import classes from './page.module.css';

export default function MealDetailPage({ params }) {
  const meal = getMeal(params.slug);
  
  // If no meal found, show 404
  if (!meal) {
    notFound();
  }

  // Replace newlines in instructions with <br> tags
  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image 
            src={meal.image} 
            alt={meal.title} 
            fill
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p 
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        />
      </main>
    </>
  );
}
```

### The `getMeal()` Function

```javascript
// lib/meals.js
import sql from 'better-sqlite3';

const db = sql('meals.db');

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
  return db.prepare('SELECT * FROM meals').all();
}
```

### Understanding `dangerouslySetInnerHTML`

```jsx
// This renders raw HTML (the instructions contain <br /> tags)
<p dangerouslySetInnerHTML={{ __html: meal.instructions }} />

// Why "dangerously"?
// Raw HTML can contain malicious scripts (XSS attacks)
// Only use this with trusted/sanitized content!

// Later we'll add XSS protection with sanitization
```

---

## 27. Throwing Not Found Errors for Individual Meals

### Using `notFound()` for Dynamic Routes

```jsx
// app/meals/[slug]/page.js
import { notFound } from 'next/navigation';
import { getMeal } from '@/lib/meals';

export default function MealDetailPage({ params }) {
  const meal = getMeal(params.slug);
  
  if (!meal) {
    notFound();   // Triggers the nearest not-found.js page
  }

  return (
    // ... render meal details
  );
}
```

### How `notFound()` Works

```
User visits /meals/nonexistent-meal

1. MealDetailPage runs with params.slug = "nonexistent-meal"
2. getMeal("nonexistent-meal") returns undefined (not in DB)
3. notFound() is called
4. Next.js looks for the nearest not-found.js:
   - First checks: app/meals/[slug]/not-found.js
   - Then checks: app/meals/not-found.js
   - Then checks: app/not-found.js (global)
5. Renders the closest not-found.js it finds
```

### Route-Specific Not Found Page

```jsx
// app/meals/[slug]/not-found.js — Specific 404 for meals
export default function MealNotFoundPage() {
  return (
    <main className="not-found">
      <h1>Meal not found</h1>
      <p>Unfortunately, we could not find the requested meal.</p>
    </main>
  );
}
```

---

## 28. Getting Started with the "Share Meal" Form

### Basic Form Setup

```jsx
// app/meals/share/page.js
import ImagePicker from '@/components/meals/image-picker';
import classes from './page.module.css';

export default function ShareMealPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
            ></textarea>
          </p>
          <ImagePicker label="Your image" name="image" />
          <p className={classes.actions}>
            <button type="submit">Share Meal</button>
          </p>
        </form>
      </main>
    </>
  );
}
```

---

## 29. Custom Image Picker Input Component

### Building an Image Picker

Since the image picker needs event handlers (`onClick`, `onChange`), it must be a **Client Component**.

```jsx
// components/meals/image-picker.js
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import classes from './image-picker.module.css';

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);
  const imageInputRef = useRef();

  function handlePickClick() {
    // Programmatically click the hidden file input
    imageInputRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    // Create a data URL from the file for preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);  // Base64 data URL
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image 
              src={pickedImage} 
              alt="The image selected by the user." 
              fill 
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
          required
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
```

---

## 30. Adding Image Preview to the Picker

### How FileReader Creates a Preview

```
User selects image file
        │
        ▼
FileReader reads the file
        │
        ▼
Converts to Base64 data URL
(data:image/jpeg;base64,/9j/4AAQ...)
        │
        ▼
Set as state → Image component renders preview
```

```jsx
function handleImageChange(event) {
  const file = event.target.files[0];

  if (!file) {
    setPickedImage(null);
    return;
  }

  const fileReader = new FileReader();
  
  // This callback fires when reading is complete
  fileReader.onload = () => {
    setPickedImage(fileReader.result);
    // fileReader.result = "data:image/jpeg;base64,/9j/4AAQ..."
  };
  
  // Start reading the file as a Data URL
  fileReader.readAsDataURL(file);
}
```

### The Hidden Input Pattern

```
Why hide the default file input?
├── The default <input type="file"> looks ugly and is hard to style
├── We hide it with CSS and create a custom button
├── When the custom button is clicked, we programmatically click the hidden input
└── This gives us full control over the appearance

┌──────────────────────────────────────────────┐
│  [Pick an Image]  ← Custom button (styled)   │
│  <input type="file" />  ← Hidden (visually)  │
│                                              │
│         ┌──────────────────────┐             │
│         │    Image Preview     │             │
│         │    (shows selected   │             │
│         │     image)           │             │
│         └──────────────────────┘             │
└──────────────────────────────────────────────┘
```

---

## 31. Server Actions for Handling Form Submissions

### What Are Server Actions?

**Server Actions** are **asynchronous functions that run on the server**. They can be used to handle form submissions, data mutations, and other server-side operations — without creating separate API routes.

```
Traditional approach:
Form → fetch('/api/submit') → API route handler → Database

Server Actions:
Form → Server Action function → Database
(No separate API route needed!)
```

### Creating a Server Action

There are two ways to define Server Actions:

#### Method 1: Inline in a Server Component

```jsx
// app/meals/share/page.js (Server Component)
export default function ShareMealPage() {
  
  // Server Action defined with 'use server' directive
  async function shareMeal(formData) {
    'use server';   // ← This makes it a Server Action
    
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
    };

    console.log(meal);  // Logs in the TERMINAL (server-side!)
    // Save to database...
  }

  return (
    <form action={shareMeal}>   {/* action prop instead of onSubmit */}
      <input name="title" required />
      <input name="name" required />
      <input name="email" required />
      <input name="summary" required />
      <textarea name="instructions" required />
      <button type="submit">Share Meal</button>
    </form>
  );
}
```

#### Method 2: In a Separate File (Recommended)

```jsx
// lib/actions.js
'use server';  // ← ALL functions in this file are Server Actions

export async function shareMeal(formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  // Save to database...
}
```

### Using `action` Instead of `onSubmit`

```jsx
// ❌ Traditional React way (onSubmit + fetch)
<form onSubmit={handleSubmit}>  {/* Needs 'use client', fetch, etc. */}

// ✅ Next.js Server Action way (action prop)
<form action={shareMeal}>  {/* Runs on server automatically! */}
```

### How Server Actions Work

```
1. User fills out the form and clicks "Submit"
2. Browser automatically creates a FormData object
3. FormData is sent to the SERVER (HTTP POST request)
4. The Server Action function runs on the SERVER
5. You can access the form data with formData.get('fieldName')
6. You can save to database, send emails, etc.
7. The page can be revalidated/redirected

Key point: The action function NEVER runs in the browser!
```

### The `formData` Object

```javascript
// Server Action receives FormData automatically
async function shareMeal(formData) {
  // Get individual field values by their 'name' attribute
  const title = formData.get('title');           // <input name="title" />
  const email = formData.get('email');           // <input name="email" />
  const image = formData.get('image');           // <input name="image" type="file" />
  const instructions = formData.get('instructions'); // <textarea name="instructions" />

  // For file inputs, you get a File object
  console.log(image);        // File { name: "photo.jpg", size: 142857, type: "image/jpeg" }
  console.log(image.name);   // "photo.jpg"
  console.log(image.size);   // 142857 (bytes)
}
```

---

## 32. Storing Server Actions in Separate Files

### Why Separate Files?

```
❌ Inline Server Action (only works in Server Components):
   - Can't use with Client Components
   - Mixes UI code with server logic

✅ Separate file (works everywhere):
   - Can be imported by BOTH Server and Client Components
   - Clean separation of concerns
   - Reusable across multiple forms/pages
```

### The Pattern

```javascript
// lib/actions.js
'use server';  // ← Marks ALL exports as Server Actions

import { redirect } from 'next/navigation';
import { saveMeal } from './meals';
import { revalidatePath } from 'next/cache';

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  // Validate
  if (!meal.title || meal.title.trim() === '') {
    return { message: 'Title is required.' };
  }

  // Save to database
  await saveMeal(meal);
  
  // Revalidate cache so the meals page shows the new meal
  revalidatePath('/meals');
  
  // Redirect to meals page
  redirect('/meals');
}
```

### Using in a Client Component

```jsx
// app/meals/share/page.js
'use client';  // This page CAN be a Client Component now

import { shareMeal } from '@/lib/actions';

export default function ShareMealPage() {
  return (
    <form action={shareMeal}>
      {/* Form fields */}
      <button type="submit">Share Meal</button>
    </form>
  );
}
```

---

## 33. Creating a Slug & Sanitizing User Input (XSS Protection)

### What Is a Slug?

A **slug** is a URL-friendly version of a string:

```
Title:  "My Delicious Spaghetti Bolognese!"
Slug:   "my-delicious-spaghetti-bolognese"

Rules:
✅ Lowercase
✅ Spaces replaced with hyphens
✅ Special characters removed
✅ URL-safe
```

### Generating a Slug

```javascript
// lib/meals.js
import slugify from 'slugify';    // npm install slugify
import xss from 'xss';            // npm install xss

export async function saveMeal(meal) {
  // Generate URL-friendly slug from the title
  meal.slug = slugify(meal.title, { lower: true });
  
  // Sanitize the instructions to prevent XSS attacks
  meal.instructions = xss(meal.instructions);
  
  // ... save image and store in database
}
```

### Install the Packages

```bash
npm install slugify xss
```

### XSS (Cross-Site Scripting) Protection

```
What is XSS?
─────────────
An attacker puts malicious JavaScript in a form field:

Input: <script>stealUserData()</script>

If you render this with dangerouslySetInnerHTML,
the script EXECUTES and steals user data!

Solution: Sanitize with the 'xss' package
───────────────────────────────────────────
Input:  "<script>alert('hacked')</script><p>Hello</p>"
Output: "<p>Hello</p>"  ← Script tag REMOVED!
```

```javascript
import xss from 'xss';

// Before sanitization:
const dirty = '<script>alert("XSS")</script><p>Cook for 20 minutes.</p>';

// After sanitization:
const clean = xss(dirty);
// Result: '<p>Cook for 20 minutes.</p>'
// The <script> tag is REMOVED!
```

---

## 34. Storing Uploaded Images & Data in the Database

### Complete `saveMeal` Function

```javascript
// lib/meals.js
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function saveMeal(meal) {
  // 1. Generate slug
  meal.slug = slugify(meal.title, { lower: true });
  
  // 2. Sanitize instructions (prevent XSS)
  meal.instructions = xss(meal.instructions);

  // 3. Handle image upload
  const extension = meal.image.name.split('.').pop();  // 'jpg', 'png', etc.
  const fileName = `${meal.slug}.${extension}`;        // 'my-meal.jpg'

  // 4. Write image to public/images folder
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed!');
    }
  });

  // 5. Store the image PATH (not the file itself) in the database
  meal.image = `/images/${fileName}`;

  // 6. Insert into database
  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}
```

### The Complete Flow

```
User submits form
      │
      ▼
Server Action receives FormData
      │
      ▼
Extract fields: title, summary, instructions, image, etc.
      │
      ▼
Generate slug: "My Pasta" → "my-pasta"
      │
      ▼
Sanitize instructions (remove malicious HTML/scripts)
      │
      ▼
Save image file to public/images/my-pasta.jpg
      │
      ▼
Save data to SQLite database (with image PATH)
      │
      ▼
Revalidate /meals cache
      │
      ▼
Redirect to /meals page
```

---

## 35. Managing Form Submission Status with `useFormStatus`

### What Is `useFormStatus`?

`useFormStatus` is a React hook that tells you the **current status of a form submission** — is it pending, completed, etc.

```jsx
// components/meals/meal-form-submit.js
'use client';

import { useFormStatus } from 'react-dom';

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  // pending = true while the Server Action is running
  // pending = false when it's done

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Share Meal'}
    </button>
  );
}
```

### Important Rule: Must Be INSIDE a `<form>`

```jsx
// ❌ WRONG — useFormStatus must be used in a component
//           rendered INSIDE a <form>
function ShareMealPage() {
  const { pending } = useFormStatus();  // Won't work here!
  return <form>...</form>;
}

// ✅ CORRECT — Create a separate component and use it inside the form
function MealsFormSubmit() {
  const { pending } = useFormStatus();  // Works!
  return <button disabled={pending}>{pending ? 'Submitting...' : 'Share'}</button>;
}

function ShareMealPage() {
  return (
    <form action={shareMeal}>
      {/* ... form fields ... */}
      <MealsFormSubmit />   {/* Inside the form ✅ */}
    </form>
  );
}
```

### Using in the Form

```jsx
// app/meals/share/page.js
import MealsFormSubmit from '@/components/meals/meals-form-submit';
import ImagePicker from '@/components/meals/image-picker';
import { shareMeal } from '@/lib/actions';

export default function ShareMealPage() {
  return (
    <form action={shareMeal}>
      <div>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" name="name" required />
      </div>
      {/* ... more fields ... */}
      <ImagePicker label="Your image" name="image" />
      <MealsFormSubmit />
    </form>
  );
}
```

---

## 36. Adding Server-Side Input Validation

### Why Server-Side Validation?

```
Client-side validation:
✅ Better user experience (instant feedback)
❌ Can be bypassed (user can disable JavaScript or use DevTools)
❌ NEVER trust client-side validation alone!

Server-side validation:
✅ Cannot be bypassed
✅ Secure — validates on the server before saving
✅ Should ALWAYS be done
```

### Validating in the Server Action

```javascript
// lib/actions.js
'use server';

import { saveMeal } from './meals';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  // Validate all fields
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: 'Invalid input. Please check your data and try again.',
    };
  }

  await saveMeal(meal);
  revalidatePath('/meals');
  redirect('/meals');
}
```

---

## 37. Working with Server Action Responses & useFormState

### What Is `useFormState` (now `useActionState`)?

`useFormState` (renamed to `useActionState` in newer React versions) lets you **read the return value** of a Server Action and **update the UI accordingly**.

```jsx
// app/meals/share/page.js
'use client';

import { useFormState } from 'react-dom';
// In newer React versions: import { useActionState } from 'react';

import ImagePicker from '@/components/meals/image-picker';
import MealsFormSubmit from '@/components/meals/meals-form-submit';
import { shareMeal } from '@/lib/actions';
import classes from './page.module.css';

export default function ShareMealPage() {
  // useFormState connects a Server Action to form state
  const [state, formAction] = useFormState(shareMeal, { message: null });
  //    ↑       ↑                         ↑           ↑
  //  current  wrapped        Server Action     initial state
  //  state    action

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          {/* Form fields */}
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" rows="10" required />
          </p>
          <ImagePicker label="Your image" name="image" />
          
          {/* Show error message if validation failed */}
          {state.message && <p className={classes.error}>{state.message}</p>}
          
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}
```

### How `useFormState` / `useActionState` Works

```
Flow:
1. Component renders with initial state { message: null }
2. User submits form
3. formAction is called (wraps shareMeal Server Action)
4. shareMeal runs on the server
5. If validation fails → returns { message: 'Invalid input...' }
6. useFormState receives the return value
7. state updates to { message: 'Invalid input...' }
8. Component re-renders, showing the error message

Important: The Server Action receives an EXTRA first argument (prevState)
when used with useFormState:

// Without useFormState:
async function shareMeal(formData) { ... }

// With useFormState:
async function shareMeal(prevState, formData) { ... }
//                       ↑ extra argument!
```

### `useFormState` vs `useActionState`

```
useFormState   → from 'react-dom'     (current, works in Next.js)
useActionState → from 'react'         (newer name, same functionality)

// They work the same way. useActionState is the new name.
// Use whichever is available in your React version.
```

---

## 38. Building for Production & Understanding Next.js Caching

### Building for Production

```bash
# Build the optimized production version
npm run build

# Start the production server
npm run start
```

### Next.js Caching Strategies

Next.js uses **aggressive caching** to make your app fast. Understanding caching is crucial.

```
Next.js Caching Layers:
┌────────────────────────────────────────────────────┐
│                                                    │
│  1. Request Memoization                            │
│     Same fetch() calls are deduplicated            │
│                                                    │
│  2. Data Cache                                     │
│     Fetch responses are cached on the server       │
│                                                    │
│  3. Full Route Cache                               │
│     Rendered HTML is cached at build time          │
│                                                    │
│  4. Router Cache (Client-side)                     │
│     Previously visited pages are cached in browser │
│                                                    │
└────────────────────────────────────────────────────┘
```

### The Caching Problem

```
Problem scenario:
1. You build the app (npm run build)
2. The meals page is generated with current database data
3. The HTML is CACHED (static)
4. A user adds a new meal via the form
5. The meal is saved in the database ✅
6. But the meals page STILL shows the old cached version! ❌
7. The new meal doesn't appear!

Why?
Because Next.js pre-rendered and cached the meals page during build.
It doesn't automatically check for database changes.
```

### Solution: Revalidation (Next Section)

---

## 39. Triggering Cache Revalidations

### `revalidatePath()`

Tells Next.js to **throw away the cached version** of a specific path and re-generate it.

```javascript
// lib/actions.js
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveMeal } from './meals';

export async function shareMeal(prevState, formData) {
  // ... extract and validate data ...

  await saveMeal(meal);
  
  // Clear the cache for /meals so it shows the new meal
  revalidatePath('/meals');
  
  // Redirect to meals page
  redirect('/meals');
}
```

### `revalidatePath` Options

```javascript
// Revalidate a specific page
revalidatePath('/meals');

// Revalidate a page and all nested pages
revalidatePath('/meals', 'layout');

// Revalidate everything
revalidatePath('/', 'layout');
```

### `revalidateTag()`

```javascript
// In your data fetching:
fetch('https://api.example.com/meals', {
  next: { tags: ['meals'] }     // Tag this fetch
});

// In your Server Action:
import { revalidateTag } from 'next/cache';
revalidateTag('meals');          // Revalidate all fetches with this tag
```

### Revalidation Summary

| Method | What It Does | When to Use |
|---|---|---|
| `revalidatePath('/path')` | Clears cache for a specific page | After data mutation for that page |
| `revalidatePath('/path', 'layout')` | Clears cache for page + all children | After mutations affecting many pages |
| `revalidatePath('/', 'layout')` | Clears ALL cached pages | Nuclear option |
| `revalidateTag('tag')` | Clears cache for tagged fetches | Targeted cache clearing |

---

## 40. Don't Store Files Locally & Cloud Storage (AWS S3)

### The Problem with Local File Storage

```
❌ Storing files in public/ folder:

In Development:
- Works fine!
- Files are stored on your computer

In Production (deployed to Vercel, AWS, etc.):
- The file system is READ-ONLY or EPHEMERAL!
- Files saved locally will be LOST on next deployment
- Files saved locally won't be shared across server instances
- Container/serverless functions reset their file systems

Solution: Use cloud storage (AWS S3, Cloudinary, etc.)
```

### AWS S3 Setup (Bonus)

```bash
npm install @aws-sdk/client-s3
```

```javascript
// lib/meals.js — Using AWS S3 for image storage
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function saveMeal(meal) {
  // ... slug and sanitization ...

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  // Upload image to S3
  const bufferedImage = await meal.image.arrayBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: 'your-nextjs-meals-bucket',
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    })
  );

  // Store the S3 URL in the database
  meal.image = `https://your-nextjs-meals-bucket.s3.amazonaws.com/${fileName}`;

  // Save to database...
}
```

### Environment Variables

```bash
# .env.local (NEVER commit this file!)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

```
Remember:
.env.local              → Server-side only (secrets)
NEXT_PUBLIC_*            → Available in browser too
.env.local in .gitignore → NEVER commit secrets!
```

---

## 41. Adding Static Metadata

### What Is Metadata?

**Metadata** is information about your page used by search engines and social media. It includes the page title, description, Open Graph images, etc.

```html
<!-- This is what metadata becomes in the HTML -->
<head>
  <title>NextLevel Food - Browse Meals</title>
  <meta name="description" content="Browse delicious meals shared by our community." />
  <meta property="og:title" content="NextLevel Food - Browse Meals" />
  <meta property="og:description" content="Browse delicious meals..." />
</head>
```

### Exporting Static Metadata

In any `page.js` or `layout.js`, export a `metadata` object:

```jsx
// app/layout.js — Root metadata (applies to ALL pages by default)
export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```jsx
// app/meals/page.js — Page-specific metadata (OVERRIDES root for this page)
export const metadata = {
  title: 'All Meals',
  description: 'Browse the delicious meals shared by our vibrant community.',
};

export default function MealsPage() {
  return <main>{/* ... */}</main>;
}
```

```jsx
// app/meals/share/page.js
export const metadata = {
  title: 'Share a Meal',
  description: 'Share your favorite meal recipe with the world!',
};

export default function ShareMealPage() {
  return <main>{/* ... */}</main>;
}
```

```jsx
// app/community/page.js
export const metadata = {
  title: 'Foodies Community',
  description: 'Join our community of food lovers and share your recipes!',
};

export default function CommunityPage() {
  return <main>{/* ... */}</main>;
}
```

### Metadata Inheritance

```
app/layout.js metadata:  title = "NextLevel Food"
                         description = "Delicious meals..."

When visiting /meals:
app/meals/page.js has its own metadata → OVERRIDES the root

When visiting /community:
app/community/page.js has its own metadata → OVERRIDES the root

When visiting / (home):
No page-level metadata → INHERITS from root layout
```

---

## 42. Adding Dynamic Metadata

### What Is Dynamic Metadata?

For **dynamic routes** (like `/meals/[slug]`), the metadata depends on the **specific data** being displayed. You can't hardcode it — you need to **generate it dynamically**.

### Using `generateMetadata()` Function

```jsx
// app/meals/[slug]/page.js
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

// This function generates metadata dynamically based on the route params
export async function generateMetadata({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
    openGraph: {
      title: meal.title,
      description: meal.summary,
      images: [{ url: meal.image }],
    },
  };
}

// The page component
export default function MealDetailPage({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header>
        <h1>{meal.title}</h1>
        <p>{meal.summary}</p>
      </header>
      <main>
        <p dangerouslySetInnerHTML={{ __html: meal.instructions }} />
      </main>
    </>
  );
}
```

### Static vs Dynamic Metadata

```jsx
// STATIC metadata — use when data is known at build time
export const metadata = {
  title: 'All Meals',
  description: 'Browse all meals',
};

// DYNAMIC metadata — use when data depends on route params or fetched data
export async function generateMetadata({ params }) {
  // Fetch data based on the route
  const data = await fetchSomething(params.id);
  return {
    title: data.title,
    description: data.description,
  };
}

// You can only use ONE per file (not both)
```

### Common Metadata Fields

```jsx
export const metadata = {
  // Basic
  title: 'Page Title',
  description: 'Page description for SEO',
  
  // Open Graph (social media sharing)
  openGraph: {
    title: 'Page Title',
    description: 'Description for social media',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Description for Twitter',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## 43. Module Summary

### Everything Covered in This Module

```
Module 3: NextJS Essentials (App Router) — Complete Summary
═══════════════════════════════════════════════════════════════

📁 FILE-BASED ROUTING
├── Folders in app/ create URL segments
├── page.js creates accessible routes
├── layout.js wraps pages (persistent across navigation)
├── Dynamic routes with [param] folders
├── Reserved files: page, layout, loading, error, not-found, route
└── Route groups () and private folders _

🔗 NAVIGATION
├── Use <Link> from 'next/link' (NOT <a> tags)
├── href prop (not "to" like React Router)
├── usePathname() for active link styling
└── redirect() for programmatic navigation (server-side)

🖥️ SERVER COMPONENTS (Default)
├── Run on the server, no JS sent to browser
├── Can be async functions
├── Can directly access databases, file system
├── Cannot use hooks (useState, useEffect)
├── Cannot use event handlers (onClick, etc.)
└── console.log appears in terminal

🟡 CLIENT COMPONENTS ('use client')
├── Add 'use client' directive at top of file
├── Can use hooks and event handlers
├── Run in the browser (after hydration)
├── Keep as small as possible
└── Push 'use client' as far DOWN the tree as possible

📊 DATA FETCHING
├── Direct database access in Server Components
├── async/await in component functions
├── No useEffect needed
├── No API routes needed for reads
└── <Suspense> for granular loading states

⏳ LOADING STATES
├── loading.js — page-level loading indicator
├── <Suspense fallback={...}> — granular loading
└── Streaming — send HTML in chunks

❌ ERROR HANDLING
├── error.js — catches runtime errors ('use client' required)
├── not-found.js — handles 404 states
├── notFound() function — trigger 404 programmatically
└── Error boundaries cascade up the tree

📝 SERVER ACTIONS
├── 'use server' directive
├── async functions that run on the server
├── Handle form submissions (action prop)
├── Receive FormData automatically
├── Can be in page files (inline) or separate files
├── Store in lib/actions.js for reusability
└── Work with both Server and Client Components

📋 FORM HANDLING
├── action={serverAction} instead of onSubmit
├── useFormStatus() — track submission status (pending)
├── useFormState() / useActionState() — read action responses
├── Server-side validation (never trust client alone)
└── Must be inside <form> for useFormStatus to work

🖼️ IMAGE HANDLING
├── <Image> from 'next/image' — automatic optimization
├── fill prop for unknown dimensions
├── priority prop for above-the-fold images
├── Remote images need domain configuration
├── Image picker with FileReader preview
└── Store uploads in cloud (S3), NOT local filesystem

🗄️ DATABASE
├── SQLite with better-sqlite3
├── Direct queries in Server Components
├── Slug generation with slugify
├── XSS sanitization with xss package
└── Parameterized queries (SQL injection prevention)

🗃️ CACHING & REVALIDATION
├── Next.js aggressively caches pages
├── revalidatePath('/path') — clear specific cache
├── revalidatePath('/', 'layout') — clear all caches
├── revalidateTag('tag') — clear tagged caches
└── Call after data mutations in Server Actions

🏷️ METADATA (SEO)
├── Static: export const metadata = { ... }
├── Dynamic: export async function generateMetadata()
├── Defined in page.js or layout.js
├── Child metadata overrides parent metadata
├── Support for OpenGraph, Twitter cards, etc.
└── Only one type per file (static OR dynamic)

📂 PROJECT ORGANIZATION
├── app/ — routes and pages
├── components/ — reusable UI components
├── lib/ — utility functions, database, actions
├── public/ — static assets
└── @ alias for project root imports
```

### Quick Reference Card

```jsx
// 🔵 Server Component (default — no directive needed)
export default async function Page({ params }) {
  const data = await db.query('SELECT * FROM items');
  return <div>{data.map(item => <p key={item.id}>{item.name}</p>)}</div>;
}

// 🟡 Client Component (needs 'use client')
'use client';
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// 📝 Server Action (in separate file)
'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
export async function createItem(prevState, formData) {
  const name = formData.get('name');
  if (!name) return { message: 'Name is required' };
  await db.insert(name);
  revalidatePath('/items');
  redirect('/items');
}

// 📋 Form with Server Action
'use client';
import { useFormState } from 'react-dom';
import { createItem } from '@/lib/actions';
export default function Form() {
  const [state, formAction] = useFormState(createItem, { message: null });
  return (
    <form action={formAction}>
      <input name="name" required />
      {state.message && <p>{state.message}</p>}
      <SubmitButton />
    </form>
  );
}

// 🏷️ Static Metadata
export const metadata = { title: 'My Page', description: '...' };

// 🏷️ Dynamic Metadata
export async function generateMetadata({ params }) {
  const item = await getItem(params.id);
  return { title: item.name, description: item.description };
}
```

---

> **🎯 This is the foundation of everything else in the course!** Make sure you understand Server Components, Client Components, Server Actions, and file-based routing before moving on. These concepts are used in every subsequent module.