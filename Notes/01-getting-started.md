

# 📘 Module 01: Getting Started with Next.js

---

## Table of Contents

1. [Welcome to the Course](#1-welcome-to-the-course)
2. [What Is Next.js? Why Would You Use It?](#2-what-is-nextjs-why-would-you-use-it)
3. [Key Features & Benefits of Next.js](#3-key-features--benefits-of-nextjs)
4. [Creating a First Next.js App](#4-creating-a-first-nextjs-app)
5. [Next.js vs "Just React" — Analyzing the Project](#5-nextjs-vs-just-react--analyzing-the-project)
6. [Editing the First App](#6-editing-the-first-app)
7. [Pages Router vs App Router](#7-pages-router-vs-app-router)
8. [How to Get the Most Out of This Course](#8-how-to-get-the-most-out-of-this-course)
9. [Course Setup & Resources](#9-course-setup--resources)

---

## 1. Welcome to the Course

### Course Overview

This course teaches you **Next.js** — the most popular **React framework** for building full-stack web applications. By the end, you will be able to build production-ready applications using Next.js.

### What You'll Learn

```
Course Journey:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React Basics → Next.js Fundamentals → Advanced Features → Full Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

| Area | Topics |
|---|---|
| **React Refresher** | Components, State, Props, Hooks, Routing |
| **Next.js Core** | File-based routing, Server Components, Rendering |
| **Data & Backend** | Data fetching, API routes, Server Actions, Databases |
| **Advanced** | Authentication, Optimization, Deployment |
| **Projects** | Multiple real-world applications |

### Prerequisites

- Basic **HTML, CSS, JavaScript** knowledge
- **React fundamentals** (covered in the React refresher module)
- **Node.js** installed on your machine

---

## 2. What Is Next.js? Why Would You Use It?

### The Simple Definition

> **Next.js** is a **React framework** for building **full-stack web applications**.

Let's break this down:

```
React      = A JavaScript LIBRARY for building user interfaces (frontend)
Next.js    = A FRAMEWORK built ON TOP of React that adds many features
```

### React Alone vs React + Next.js

```
┌─────────────────────────────────────────────────────────┐
│                     React (Library)                     │
│                                                         │
│  ✅ Components, State, Props, Hooks                     │
│  ✅ Building user interfaces                            │
│  ❌ No built-in routing                                 │
│  ❌ No server-side rendering                            │
│  ❌ No file-based routing                               │
│  ❌ No backend/API capabilities                         │
│  ❌ No built-in data fetching patterns                  │
│  ❌ No image/font optimization                          │
│                                                         │
│  You need to install and configure EVERYTHING yourself: │
│  - React Router for routing                             │
│  - Custom setup for SSR                                 │
│  - Separate backend server                              │
│  - Manual optimization                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Next.js (Framework)                   │
│                                                         │
│  ✅ Everything React offers (it IS React underneath)    │
│  ✅ File-based routing (built-in)                       │
│  ✅ Server-side rendering (SSR)                         │
│  ✅ Static site generation (SSG)                        │
│  ✅ API routes / Server Actions (backend built-in)      │
│  ✅ Image & font optimization                           │
│  ✅ Data fetching patterns                              │
│  ✅ Built-in CSS/Sass support                           │
│  ✅ TypeScript support                                  │
│  ✅ Deployment optimization                             │
│                                                         │
│  Everything is set up and ready to go!                  │
└─────────────────────────────────────────────────────────┘
```

### Library vs Framework

| Aspect | Library (React) | Framework (Next.js) |
|---|---|---|
| **Control** | You decide the structure | Framework provides the structure |
| **Flexibility** | Maximum (choose your own tools) | Opinionated (conventions to follow) |
| **Setup effort** | High (configure everything) | Low (most things are built-in) |
| **Learning curve** | Flexible but scattered | Clear rules and patterns |
| **Analogy** | A toolbox — pick what you need | A kitchen — tools are already arranged |

### Why Would You Use Next.js?

```
Problem 1: "I need multiple pages with different URLs"
  React alone: Install React Router, configure routes manually
  Next.js:     Just create files in the right folder → routes created automatically!

Problem 2: "I need my page to load fast and be good for SEO"
  React alone: Build a client-side SPA → search engines see empty HTML → bad SEO
  Next.js:     Server renders the HTML → search engines see full content → great SEO!

Problem 3: "I need a backend API for my app"
  React alone: Build a separate Node.js/Express server
  Next.js:     Create API routes right inside your Next.js project!

Problem 4: "I need to fetch data before the page loads"
  React alone: Component renders empty → useEffect fetches → loading spinner → data
  Next.js:     Data is fetched on the server → page arrives with data already loaded!
```

### Who Uses Next.js?

Next.js is used by major companies including:
- **Netflix**, **TikTok**, **Hulu**, **Twitch**
- **Nike**, **Uber**, **GitHub**
- **Washington Post**, **Notion**

It was created and is maintained by **Vercel**.

---

## 3. Key Features & Benefits of Next.js

### Feature 1: File-Based Routing

Instead of writing routing code, you just create files and folders. The **file structure IS the route structure**.

```
React (Manual Routing):
─────────────────────────
// You write this code manually
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:id" element={<BlogPost />} />


Next.js (File-Based Routing):
─────────────────────────────
app/
├── page.js           →  URL: /
├── about/
│   └── page.js       →  URL: /about
├── blog/
│   ├── page.js       →  URL: /blog
│   └── [id]/
│       └── page.js   →  URL: /blog/123 (dynamic)
```

> **No router setup code needed!** Just create folders and files, and Next.js creates the routes automatically.

### Feature 2: Server-Side Rendering (SSR) & Static Site Generation (SSG)

```
Regular React (Client-Side Rendering - CSR):
──────────────────────────────────────────────
1. Browser requests page
2. Server sends EMPTY HTML + JavaScript bundle
3. JavaScript loads in browser
4. React renders the page in the browser
5. User finally sees content

Problem: User sees blank screen while JS loads
Problem: Search engines see empty HTML → bad SEO

         Server                    Browser
         ┌────┐    empty HTML     ┌─────────┐
         │    │ ──────────────→   │ blank   │
         │    │    + big JS       │ screen  │
         │    │                   │   ...   │
         │    │                   │ loading │
         │    │                   │   ...   │
         │    │                   │ content!│
         └────┘                   └─────────┘


Next.js (Server-Side Rendering - SSR):
───────────────────────────────────────
1. Browser requests page
2. Server runs React components
3. Server generates FULL HTML with content
4. Server sends complete HTML to browser
5. User immediately sees content
6. JavaScript loads → page becomes interactive (hydration)

Benefit: User sees content instantly
Benefit: Search engines see full content → great SEO

         Server                    Browser
         ┌─────┐   FULL HTML       ┌────────┐
         │ 🔄  │ ──────────────→   │content!│ ← instant!
         │runs │                   │        │
         │React│    + JS for       │becomes │
         │     │    interactivity  │interact│
         └─────┘                   └────────┘
```

### Feature 3: Full-Stack Capabilities

Next.js lets you write **backend code** right alongside your frontend code.

```
Traditional Setup:
┌─────────────┐          ┌─────────────┐
│   Frontend  │  HTTP    │   Backend   │   Two separate projects!
│   (React)   │ ←─────→  │  (Express)  │   Two deployments!
│   Port 3000 │          │  Port 8080  │   More complexity!
└─────────────┘          └─────────────┘

Next.js Setup:
┌───────────────────────────┐
│       Next.js App         │   One project!
│  ┌──────────┐ ┌─────────┐ │   One deployment!
│  │ Frontend │ │ Backend │ │   Less complexity!
│  │   Pages  │ │   API   │ │
│  │Components│ │ Routes  │ │
│  │          │ │ Server  │ │
│  │          │ │ Actions │ │
│  └──────────┘ └─────────┘ │
└───────────────────────────┘
```

### Feature 4: Data Fetching

Next.js provides **built-in data fetching** methods that work on the server:

| Method | When Data Is Fetched | Use Case |
|---|---|---|
| **Server Components** | At request time on server | Dynamic, personalized data |
| **Static Generation** | At build time | Blog posts, marketing pages |
| **ISR (Incremental Static Regeneration)** | After build, on a schedule | Data that changes periodically |

### Feature 5: Built-In Optimizations

| Optimization | What It Does |
|---|---|
| **Image Optimization** | Automatically resizes, compresses, serves modern formats (WebP) |
| **Font Optimization** | Loads fonts efficiently, prevents layout shift |
| **Code Splitting** | Only loads the JavaScript needed for the current page |
| **Prefetching** | Preloads linked pages in the background |
| **Caching** | Smart caching of pages and data |

### All Key Features at a Glance

```
Next.js Key Features
├── 📁 File-Based Routing (no router config)
├── 🖥️ Server-Side Rendering (fast initial load, SEO)
├── 📄 Static Site Generation (pre-built pages)
├── 🔄 Server Components (fetch data on server)
├── 🛠️ API Routes & Server Actions (backend built-in)
├── 🖼️ Image Optimization (automatic)
├── 🔤 Font Optimization (automatic)
├── 📦 Code Splitting (automatic)
├── ⚡ Prefetching (automatic)
├── 🎨 Built-in CSS/Sass Support
├── 📝 TypeScript Support (built-in)
└── 🚀 Easy Deployment (especially on Vercel)
```

---

## 4. Creating a First Next.js App

### Step-by-Step: Creating a New Project

**Step 1:** Open your terminal and run:

```bash
npx create-next-app@latest my-nextjs-app
```

**Step 2:** Answer the setup questions:

```
✔ Would you like to use TypeScript?            → No (for beginners) / Yes
✔ Would you like to use ESLint?                → Yes
✔ Would you like to use Tailwind CSS?          → No (for now)
✔ Would you like to use `src/` directory?      → No (simpler structure)
✔ Would you like to use App Router?            → Yes (recommended!)
✔ Would you like to customize the import alias?→ No
```

**Step 3:** Navigate into the project and start it:

```bash
cd my-nextjs-app
npm run dev
```

**Step 4:** Open your browser and go to:

```
http://localhost:3000
```

🎉 You should see the Next.js welcome page!

### What `create-next-app` Does

```
1. Creates a new folder with your project name
2. Sets up the project structure
3. Installs all necessary dependencies:
   - react
   - react-dom
   - next
4. Configures everything (bundler, compiler, etc.)
5. Creates starter files
```

### Project Structure Overview

```
my-nextjs-app/
├── app/                    ← Your main application code (App Router)
│   ├── layout.js           ← Root layout (wraps all pages)
│   ├── page.js             ← Home page (URL: /)
│   ├── globals.css         ← Global styles
│   └── page.module.css     ← CSS Module for the home page
├── public/                 ← Static files (images, fonts, etc.)
│   ├── next.svg
│   └── vercel.svg
├── node_modules/           ← Installed packages (don't touch)
├── package.json            ← Project config & scripts
├── next.config.js          ← Next.js configuration
├── jsconfig.json           ← JavaScript configuration
└── README.md               ← Project documentation
```

### Important Scripts in `package.json`

```json
{
  "scripts": {
    "dev": "next dev",        // Start development server (with hot reload)
    "build": "next build",    // Build for production
    "start": "next start",    // Start production server
    "lint": "next lint"       // Run ESLint to check code quality
  }
}
```

```bash
npm run dev      # During development (auto-refreshes on changes)
npm run build    # When ready to deploy (creates optimized build)
npm run start    # Run the built app in production mode
```

---

## 5. Next.js vs "Just React" — Analyzing the Project

### Key Differences in Project Structure

```
React (Vite) Project:              Next.js Project:
─────────────────────              ──────────────────
src/                               app/
├── main.jsx  ← entry point       ├── layout.js  ← root layout
├── App.jsx   ← root component    ├── page.js    ← home page
├── App.css                        ├── globals.css
└── components/                    └── about/
    └── ...                            └── page.js  ← about page

index.html    ← single HTML       NO index.html!
                                   (Next.js generates it)
```

### Difference 1: No `index.html`

```
React:    You have an index.html file with <div id="root"></div>
          React injects everything into that div

Next.js:  There is NO index.html file
          Next.js generates the HTML automatically on the server
          The layout.js file defines the HTML structure
```

### Difference 2: The `layout.js` File

In Next.js, `layout.js` replaces the traditional `index.html`:

```jsx
// app/layout.js — This is the ROOT LAYOUT
// It wraps EVERY page in your application

export const metadata = {
  title: 'My Next.js App',
  description: 'Created with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}   {/* ← Page content renders here */}
      </body>
    </html>
  );
}
```

> Notice: The layout returns `<html>` and `<body>` tags — something you'd never do in regular React because that was in `index.html`.

### Difference 3: The `page.js` File

In Next.js, each route has a `page.js` file:

```jsx
// app/page.js — This is the HOME PAGE (URL: /)

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>This is the home page.</p>
    </main>
  );
}
```

### Difference 4: Server Components (Default)

```
React:    ALL components run in the BROWSER (client-side)

Next.js:  Components run on the SERVER by default!
          They are called "Server Components"
          The HTML is generated on the server and sent to the browser
```

```jsx
// This component runs on the SERVER (default in Next.js)
export default function HomePage() {
  console.log('This prints in the TERMINAL, not the browser console!');
  
  return <h1>Hello from the server!</h1>;
}
```

### Difference 5: No Client-Side Router Setup

```
React:    You manually install react-router-dom
          You manually define <Route> components
          You manually set up <BrowserRouter>

Next.js:  Routing is AUTOMATIC based on file/folder structure
          No router package to install
          No routing code to write
```

### Side-by-Side Comparison

| Feature | React (Vite) | Next.js |
|---|---|---|
| **Entry point** | `main.jsx` | `app/layout.js` |
| **HTML file** | `index.html` | None (auto-generated) |
| **Routing** | Manual (React Router) | Automatic (file-based) |
| **Rendering** | Client-side only | Server-side by default |
| **Components** | All client components | Server Components by default |
| **Data fetching** | `useEffect` + `fetch` | Direct `fetch` in components |
| **Backend** | Separate server needed | Built-in API routes |
| **SEO** | Poor (empty HTML) | Excellent (full HTML from server) |
| **`console.log`** | Browser console | Terminal (server) |

---

## 6. Editing the First App

### Modifying the Home Page

Let's edit `app/page.js` to see how changes work:

```jsx
// app/page.js

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Next.js App! 🚀</h1>
      <p>This is my first Next.js application.</p>
      <ul>
        <li>✅ Server-side rendering</li>
        <li>✅ File-based routing</li>
        <li>✅ Full-stack capabilities</li>
      </ul>
    </main>
  );
}
```

### Hot Reload / Fast Refresh

When you save the file, the browser **automatically updates** — no manual refresh needed!

```
You edit code → Save file → Browser updates instantly
                              (Fast Refresh / HMR)
```

### Modifying the Layout

```jsx
// app/layout.js

export const metadata = {
  title: 'My Awesome App',              // Changes the browser tab title
  description: 'Built with Next.js',    // Changes the meta description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <h2>My App</h2>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 My App</p>
        </footer>
      </body>
    </html>
  );
}
```

### Adding Styles

```css
/* app/globals.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
```

---

## 7. Pages Router vs App Router

### Two Ways to Build with Next.js

Next.js has **two routing systems**. This is important to understand:

```
┌────────────────────────────────────────────────────────┐
│                      Next.js                           │
│                                                        │
│   ┌──────────────────┐     ┌───────────────────────┐   │
│   │   Pages Router   │     │     App Router        │   │
│   │   (Original)     │     │     (New — v13.4+)    │   │
│   │                  │     │                       │   │
│   │  pages/          │     │  app/                 │   │
│   │  ├── index.js    │     │  ├── page.js          │   │
│   │  ├── about.js    │     │  ├── about/           │   │
│   │  └── blog/       │     │  │   └── page.js      │   │
│   │      └── [id].js │     │  └── blog/            │   │
│   │                  │     │      └── [id]/        │   │
│   │                  │     │          └── page.js  │   │
│   │  Stable, mature  │     │  Modern, recommended  │   │
│   │  Huge community  │     │  Server Components    │   │
│   │  Many tutorials  │     │  Server Actions       │   │
│   │                  │     │  Streaming            │   │
│   │                  │     │  Better performance   │   │
│   └──────────────────┘     └───────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Pages Router (Original Approach)

The **Pages Router** was the original routing system in Next.js. It uses a `pages/` directory.

```
pages/
├── index.js         →  URL: /
├── about.js         →  URL: /about
├── contact.js       →  URL: /contact
└── blog/
    ├── index.js     →  URL: /blog
    └── [id].js      →  URL: /blog/123 (dynamic)

// Each file exports a React component
// Special functions: getStaticProps, getServerSideProps, getStaticPaths
```

```jsx
// pages/index.js (Pages Router)
export default function HomePage({ data }) {
  return <h1>Welcome! {data.title}</h1>;
}

// Data fetching with special function
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };  // Passed as props to the component
}
```

### App Router (New Approach — Recommended)

The **App Router** was introduced in Next.js 13.4 and is the **recommended** approach going forward. It uses an `app/` directory.

```
app/
├── layout.js        →  Root layout (wraps all pages)
├── page.js          →  URL: /
├── about/
│   └── page.js      →  URL: /about
├── contact/
│   └── page.js      →  URL: /contact
└── blog/
    ├── page.js      →  URL: /blog
    └── [id]/
        └── page.js  →  URL: /blog/123 (dynamic)

// Uses React Server Components by default
// Data fetching directly in components (no special functions)
// Server Actions for mutations
```

```jsx
// app/page.js (App Router)
// This component runs on the SERVER by default

export default async function HomePage() {
  // You can fetch data DIRECTLY — no useEffect, no special functions!
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return <h1>Welcome! {data.title}</h1>;
}
```

### Key Differences Between the Two Routers

| Feature | Pages Router | App Router |
|---|---|---|
| **Directory** | `pages/` | `app/` |
| **Route files** | Any `.js` file is a route | Only `page.js` files are routes |
| **Layouts** | `_app.js` and `_document.js` | `layout.js` (nested layouts) |
| **Default rendering** | Client Components | **Server Components** |
| **Data fetching** | `getStaticProps`, `getServerSideProps` | Direct `fetch` in components |
| **Mutations** | API routes only | **Server Actions** |
| **Loading UI** | Custom implementation | Built-in `loading.js` |
| **Error handling** | Custom implementation | Built-in `error.js` |
| **Streaming** | ❌ | ✅ |
| **Status** | Stable, maintained | **Recommended for new projects** |
| **Learning curve** | Lower | Slightly higher |

### Which One Should You Learn?

```
📌 This course covers BOTH routers!

For NEW projects:  → Use the App Router (it's the future)
For EXISTING projects: → Many still use Pages Router (you'll encounter it)
For JOB interviews: → Know both (many companies use Pages Router)

Course structure:
┌─────────────────────────────────┐
│  Main content: App Router       │ ← Primary focus
│  Later section: Pages Router    │ ← Also covered
└─────────────────────────────────┘
```

### Can You Use Both?

Yes! In a single Next.js project, you can have **both** `app/` and `pages/` directories. Routes from both will work. However, the **same route** should not exist in both.

```
my-project/
├── app/              ← App Router routes
│   └── page.js       →  /
├── pages/            ← Pages Router routes
│   └── legacy.js     →  /legacy
```

> ⚠️ This is mainly for **migration purposes**. For new projects, stick with one approach (preferably App Router).

---

## 8. How to Get the Most Out of This Course

### Learning Tips

#### Tip 1: Code Along

```
DON'T just watch → DO type the code yourself

Watching: 20% retention
Coding along: 70% retention
Building your own projects: 90% retention
```

#### Tip 2: Pause and Practice

After each section:
1. **Pause** the video
2. **Try to recreate** what was taught without looking
3. **Experiment** — change things, break things, fix things
4. **Move on** only when you understand

#### Tip 3: Use the Course Resources

- **Source code** is attached to lectures — compare with your code when stuck
- **Q&A section** — ask questions if you're stuck
- **Course community** — connect with other students

#### Tip 4: Don't Memorize — Understand

```
❌ Memorizing: "I type 'export default function' then the name then..."
✅ Understanding: "A component is a function that returns JSX, and I export 
                   it so other files can use it"
```

#### Tip 5: Revisit When Needed

```
First watch:  Get the overview, understand concepts
Second watch: Pay attention to details, code along
Later:        Use as reference when building your own projects
```

### Recommended Workflow

```
1. Watch the lecture
2. Code along (type everything yourself)
3. Pause → try to recreate from memory
4. If stuck → re-watch that specific part
5. Experiment (change values, add features)
6. Complete the exercises/assignments
7. Move to the next lecture
```

---

## 9. Course Setup & Resources

### Required Tools

| Tool | Purpose | Download |
|---|---|---|
| **Node.js** (v18+) | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| **Modern Browser** | Testing | Chrome or Firefox |
| **Git** (optional) | Version control | [git-scm.com](https://git-scm.com) |

### Verify Installation

```bash
node --version     # Should show v18.x.x or higher
npm --version      # Should show 9.x.x or higher
```

### Recommended VS Code Extensions

| Extension | Purpose |
|---|---|
| **ES7+ React/Redux/React-Native** | React snippets and shortcuts |
| **Prettier** | Auto-format code on save |
| **ESLint** | Find code problems |
| **Auto Rename Tag** | Rename matching HTML/JSX tags |
| **Path Intellisense** | Auto-complete file paths |
| **Material Icon Theme** | Better file/folder icons |

### Course Resources

- **Lecture source code** — Attached to each lecture as downloadable zip files
- **GitHub repository** — Complete course code
- **Slides** — Available as PDFs
- **Q&A section** — Ask questions for each lecture
- **Discord/Community** — Connect with other students

### Quick Start Reference

```bash
# Create a new Next.js project
npx create-next-app@latest project-name

# Navigate to the project
cd project-name

# Start the development server
npm run dev

# Open in browser
# → http://localhost:3000
```

---

## 📋 Module 1 Summary — Quick Reference Card

```
┌──────────────────────────────────────────────────────────┐
│                MODULE 1 SUMMARY                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  What is Next.js?                                        │
│  → A React FRAMEWORK for full-stack web apps             │
│  → Built on top of React (React + extra features)        │
│  → Created by Vercel                                     │
│                                                          │
│  Why Next.js?                                            │
│  → File-based routing (no router setup)                  │
│  → Server-side rendering (fast + SEO-friendly)           │
│  → Full-stack (frontend + backend in one project)        │
│  → Built-in optimizations (images, fonts, code)          │
│                                                          │
│  Two Router Systems:                                     │
│  → Pages Router (pages/ directory) — original            │
│  → App Router (app/ directory) — new & recommended       │
│                                                          │
│  Create Project: npx create-next-app@latest my-app       │
│  Run Dev Server: npm run dev                             │
│  View in Browser: http://localhost:3000                  │
│                                                          │
│  Key Files:                                              │
│  → app/layout.js  — Root layout (like index.html)        │
│  → app/page.js    — Home page component                  │
│  → next.config.js — Next.js configuration                │
│  → package.json   — Dependencies & scripts               │
│                                                          │
│  Key Difference from React:                              │
│  → Components run on the SERVER by default               │
│  → No index.html (HTML is auto-generated)                │
│  → No manual router setup                                │
│  → console.log appears in TERMINAL, not browser          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

> **🎯 Next Up:** Module 2 will dive deep into **Next.js App Router** — the file-based routing system, layouts, pages, and how to build multi-page applications with Next.js.