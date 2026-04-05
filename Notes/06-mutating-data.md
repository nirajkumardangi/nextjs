# 📘 Module 6: Mutating Data - Deep Dive

---

## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Starting Project & Analyzing Mutation Options](#2-starting-project--analyzing-mutation-options)
3. [Setting Up a Form Action](#3-setting-up-a-form-action)
4. [Creating a Server Action](#4-creating-a-server-action)
5. [Storing Data in Databases](#5-storing-data-in-databases)
6. [Providing User Feedback with useFormStatus Hook](#6-providing-user-feedback-with-useformstatus-hook)
7. [Validating User Input with useFormState Hook](#7-validating-user-input-with-useformstate-hook)
8. [Adjusting Server Actions for useFormState](#8-adjusting-server-actions-for-useformstate)
9. [Storing Server Actions in Separate Files](#9-storing-server-actions-in-separate-files)
10. ["use server" Does Not Guarantee Server-side Execution!](#10-use-server-does-not-guarantee-server-side-execution)
11. [Uploading & Storing Images](#11-uploading--storing-images)
12. [Alternative Ways of Using Server Actions](#12-alternative-ways-of-using-configuring--triggering-server-actions)
13. [Revalidating Data to Avoid Caching Problems](#13-revalidating-data-to-avoid-caching-problems)
14. [Performing Optimistic Updates](#14-performing-optimistic-updates-with-nextjs)
15. [Caching Differences: Development vs Production](#15-caching-differences-development-vs-production)
16. [Module Summary](#16-module-summary)

---

## 1. Module Introduction

### What This Module Covers

This module is a **deep dive into data mutations** in Next.js — creating, updating, and deleting data using **Server Actions**.

```
Module Focus: Data Mutations
┌───────────────────────────────────────────────────────┐
│                                                       │
│  Reading Data (Module 5)  →  Mutating Data (Module 6) │
│  ────────────────────────     ────────────────────    │
│  • getAllPosts()              • createPost()          │
│  • getPost(id)                • updatePost(id)        │
│  • Server Components          • deletePost(id)        │
│  • Direct DB queries          • Server Actions        │
│                               • Form handling         │
│                               • Image uploads         │
│                               • Validation            │
│                               • Optimistic updates    │
└───────────────────────────────────────────────────────┘
```

### Key Topics

| Topic | What You'll Learn |
|---|---|
| **Server Actions** | Functions that run on the server for mutations |
| **Form Actions** | Using `action` prop instead of `onSubmit` |
| **useFormStatus** | Track form submission state (pending, etc.) |
| **useFormState** | Handle server validation errors |
| **Image Uploads** | Cloudinary integration for file storage |
| **Revalidation** | Clearing Next.js cache after mutations |
| **Optimistic Updates** | Update UI immediately before server confirms |
| **Caching Strategies** | Development vs production behavior |

### The Project: Social Media Feed

You'll build a **social media post feed** with:

```
Features:
├── View posts (feed)
├── Create new posts (with images)
├── Like/unlike posts
├── Form validation
├── Image uploads to Cloudinary
├── Real-time UI updates
└── Optimistic updates
```

---

## 2. Starting Project & Analyzing Mutation Options

### Initial Project Setup

```bash
# Create the project
npx create-next-app@latest nextjs-posts

# Options:
# TypeScript: No
# ESLint: Yes
# Tailwind CSS: No
# src/ directory: No
# App Router: Yes

cd nextjs-posts
npm run dev
```

### Project Structure

```
nextjs-posts/
├── app/
│   ├── layout.js
│   ├── page.js              ← Home page
│   ├── feed/
│   │   └── page.js          ← Posts feed
│   └── new-post/
│       └── page.js          ← Create new post
├── components/
│   ├── posts.js             ← Post list component
│   ├── post.js              ← Single post component
│   └── post-form.js         ← Post creation form
├── lib/
│   └── posts.js             ← Database utilities
├── public/
│   └── images/
└── posts.db                 ← SQLite database
```

### Database Setup

```javascript
// lib/posts.js
import sql from 'better-sqlite3';

const db = sql('posts.db');

// Initialize database
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    )
  `);
}

// Read operations
export function getPosts() {
  return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
}

export function getPost(id) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
}

// Mutation operation (we'll implement this)
export function storePost(post) {
  db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (?, ?, ?, ?)
  `).run(post.imageUrl, post.title, post.content, post.userId);
}
```

### Understanding Mutation Options

```
Option 1: Traditional React (Client-Side)
┌──────────────────────────────────────────┐
│  Form submission → fetch() → API route   │
│  (Client Component)                      │
└──────────────────────────────────────────┘
Problems:
❌ Extra HTTP request
❌ Need to build API routes
❌ More boilerplate code
❌ Client-side only

Option 2: Next.js Server Actions (Modern)
┌──────────────────────────────────────────┐
│  Form submission → Server Action → DB    │
│  (No API route needed!)                  │
└──────────────────────────────────────────┘
Benefits:
✅ No API routes needed
✅ Direct database access
✅ Built-in form handling
✅ Simpler code
✅ Better security
```

---

## 3. Setting Up a Form Action

### Traditional Form Handling (React)

```jsx
// ❌ Traditional React approach
'use client';
import { useState } from 'react';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    
    // Handle response...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Next.js Form Action Approach

```jsx
// ✅ Next.js Server Action approach
export default function PostForm() {
  async function createPost(formData) {
    'use server';  // This makes it a Server Action
    
    const title = formData.get('title');
    const content = formData.get('content');
    
    // Save to database...
  }

  return (
    <form action={createPost}>  {/* action instead of onSubmit */}
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Key Differences

| Feature | Traditional (`onSubmit`) | Server Action (`action`) |
|---|---|---|
| **Runs where?** | Browser | Server |
| **Component type** | Client Component | Can be Server or Client |
| **Directive** | None | `'use server'` |
| **Data access** | `e.target.elements` or state | `formData.get('name')` |
| **API route needed?** | ✅ Yes | ❌ No |
| **preventDefault()** | ✅ Required | ❌ Not needed |
| **Async?** | Can be | Must be `async` |

### How FormData Works

```jsx
// HTML form:
<form action={createPost}>
  <input name="title" value="Hello" />
  <input name="content" value="World" />
  <input name="image" type="file" />
</form>

// Server Action receives FormData:
async function createPost(formData) {
  'use server';
  
  // Get text inputs
  const title = formData.get('title');      // "Hello"
  const content = formData.get('content');  // "World"
  
  // Get file input
  const image = formData.get('image');      // File object
  
  console.log(title, content, image);
}
```

### FormData API

```javascript
// Getting values
formData.get('fieldName')      // Get single value
formData.getAll('fieldName')   // Get all values (for multiple inputs with same name)

// Checking existence
formData.has('fieldName')      // Returns true/false

// Iterating
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

// Converting to object
const data = Object.fromEntries(formData);  // { title: "Hello", content: "World" }
```

---

## 4. Creating a Server Action

### Step 1: Define the Server Action (Inline)

```jsx
// app/new-post/page.js
export default function NewPostPage() {
  async function createPost(formData) {
    'use server';  // ← This directive makes it a Server Action
    
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');
    
    console.log({ title, content, image });
    // This logs in the TERMINAL (server-side), not browser console!
  }

  return (
    <form action={createPost}>
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" name="image" type="file" accept="image/*" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="5" required />
      </p>
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### How Server Actions Work

```
User fills form and clicks "Create Post"
      │
      ▼
Browser automatically collects form data into FormData object
      │
      ▼
FormData is sent to the server (HTTP POST)
      │
      ▼
Next.js identifies this as a Server Action
      │
      ▼
createPost(formData) runs on the SERVER
      │
      ▼
Database operation, file upload, etc.
      │
      ▼
Response sent back to browser
      │
      ▼
Form resets (if successful)
```

### Server Action Rules

```
✅ Must be marked with 'use server'
✅ Must be async
✅ Receives FormData as first argument
✅ Runs on the server (has access to filesystem, database, secrets)
✅ Can be defined inline or in separate files
✅ Can be used in Server or Client Components

❌ Cannot use browser APIs (window, document)
❌ Cannot use hooks (useState, useEffect, etc.)
```

### Inline vs Separate File

```jsx
// Method 1: Inline (inside a Server Component)
export default function Page() {
  async function myAction(formData) {
    'use server';
    // ...
  }
  
  return <form action={myAction}>...</form>;
}

// Method 2: Separate file (can be used anywhere)
// actions/posts.js
'use server';  // ← At file level, all exports are Server Actions

export async function createPost(formData) {
  // ...
}

// app/new-post/page.js
import { createPost } from '@/actions/posts';

export default function Page() {
  return <form action={createPost}>...</form>;
}
```

---

## 5. Storing Data in Databases

### Complete Server Action with Database Storage

```jsx
// app/new-post/page.js
import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';

export default function NewPostPage() {
  async function createPost(formData) {
    'use server';
    
    // 1. Extract data from FormData
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('image');
    
    // 2. Process image (we'll implement upload later)
    const imageUrl = '/images/default.jpg';  // Placeholder for now
    
    // 3. Construct post object
    const post = {
      imageUrl,
      title,
      content,
      userId: 1,  // Hard-coded for now (will be from session later)
    };
    
    // 4. Store in database
    storePost(post);
    
    // 5. Redirect to feed
    redirect('/feed');
  }

  return (
    <main>
      <h1>Create a New Post</h1>
      <form action={createPost}>
        <p>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required />
        </p>
        <p>
          <label htmlFor="image">Image</label>
          <input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/png, image/jpeg" 
            required 
          />
        </p>
        <p>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" required />
        </p>
        <button type="submit">Create Post</button>
      </form>
    </main>
  );
}
```

### Database Function

```javascript
// lib/posts.js
import sql from 'better-sqlite3';

const db = sql('posts.db');

export function storePost(post) {
  return db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (@imageUrl, @title, @content, @userId)
  `).run(post);
}

export function getPosts() {
  return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
}
```

### Verifying the Data

```jsx
// app/feed/page.js
import { getPosts } from '@/lib/posts';
import Posts from '@/components/posts';

export default async function FeedPage() {
  const posts = await getPosts();
  
  return (
    <>
      <h1>All Posts</h1>
      <Posts posts={posts} />
    </>
  );
}
```

---

## 6. Providing User Feedback with useFormStatus Hook

### The Problem: No Visual Feedback

When a form is submitted, the user doesn't know if anything is happening. We need to show a loading state.

### The `useFormStatus` Hook

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  // pending = true while Server Action is running
  // pending = false when it's done
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating Post...' : 'Create Post'}
    </button>
  );
}
```

### Important: Must Be a Child Component

```jsx
// ❌ WRONG — useFormStatus must be in a component INSIDE the <form>
function PostForm() {
  const { pending } = useFormStatus();  // Won't work here!
  
  return (
    <form action={createPost}>
      <button disabled={pending}>Submit</button>
    </form>
  );
}

// ✅ CORRECT — useFormStatus in a separate component rendered INSIDE <form>
function SubmitButton() {
  const { pending } = useFormStatus();  // Works!
  return <button disabled={pending}>Submit</button>;
}

function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <SubmitButton />  {/* Inside the form ✅ */}
    </form>
  );
}
```

### Complete Example

```jsx
// components/submit-button.js
'use client';  // useFormStatus requires Client Component

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : label}
    </button>
  );
}
```

```jsx
// app/new-post/page.js
import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/submit-button';

export default function NewPostPage() {
  async function createPost(formData) {
    'use server';
    
    const post = {
      imageUrl: '/images/default.jpg',
      title: formData.get('title'),
      content: formData.get('content'),
      userId: 1,
    };
    
    await storePost(post);
    redirect('/feed');
  }

  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton label="Create Post" />  {/* Must be inside <form> */}
    </form>
  );
}
```

### What `useFormStatus` Returns

```javascript
const status = useFormStatus();

console.log(status);
// {
//   pending: false,     // true while form is submitting
//   data: FormData,     // The FormData being submitted
//   method: 'post',     // HTTP method
//   action: '/path'     // Action URL or function
// }
```

---

## 7. Validating User Input with useFormState Hook

### The Need for Validation

```
Client-side validation (HTML attributes):
<input required minLength={3} />

Problems:
❌ Can be bypassed (user can disable JavaScript)
❌ Can't validate against database (e.g., "username already exists")
❌ Limited validation rules

Server-side validation:
✅ Cannot be bypassed
✅ Can check database
✅ Full validation logic
✅ ALWAYS required for security
```

### The `useFormState` Hook

`useFormState` (also called `useActionState` in newer React versions) connects a Server Action to form state, letting you return validation errors from the server.

```jsx
'use client';
import { useFormState } from 'react-dom';

function PostForm({ action }) {
  // useFormState(action, initialState)
  const [state, formAction] = useFormState(action, { errors: [] });
  //    ↑         ↑                         ↑          ↑
  //  current  wrapped         Server Action    initial value
  //  state    action

  return (
    <form action={formAction}>  {/* Use formAction, not action directly */}
      <input name="title" />
      {state.errors.includes('title') && (
        <p className="error">Title is required.</p>
      )}
      
      <textarea name="content" />
      {state.errors.includes('content') && (
        <p className="error">Content is required.</p>
      )}
      
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Server Action with Validation

```javascript
// actions/posts.js
'use server';

export async function createPost(prevState, formData) {
  // ⚠️ Note: When using useFormState, Server Action gets TWO arguments:
  //    1. prevState (previous state from useFormState)
  //    2. formData
  
  const title = formData.get('title');
  const content = formData.get('content');
  
  const errors = [];
  
  // Validate title
  if (!title || title.trim() === '') {
    errors.push('title');
  }
  
  // Validate content
  if (!content || content.trim() === '' || content.trim().length < 10) {
    errors.push('content');
  }
  
  // If errors, return them (they'll become the new state)
  if (errors.length > 0) {
    return { errors };
  }
  
  // If valid, store the post
  storePost({ title, content, imageUrl: '/default.jpg', userId: 1 });
  
  // Redirect to feed
  redirect('/feed');
}
```

### Complete Example

```jsx
// app/new-post/page.js
'use client';

import { useFormState } from 'react-dom';
import { createPost } from '@/actions/posts';
import SubmitButton from '@/components/submit-button';

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, { errors: [] });

  return (
    <main>
      <h1>Create a New Post</h1>
      <form action={formAction}>
        <p>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" />
          {state.errors.includes('title') && (
            <span className="error">Title is required!</span>
          )}
        </p>
        
        <p>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
          {state.errors.includes('content') && (
            <span className="error">Content must be at least 10 characters!</span>
          )}
        </p>
        
        <SubmitButton label="Create Post" />
      </form>
    </main>
  );
}
```

### How `useFormState` Works

```
Flow:
1. Component renders with initialState { errors: [] }
2. User submits form
3. formAction is called (wraps createPost Server Action)
4. createPost runs on server
5. If validation fails → returns { errors: ['title', 'content'] }
6. useFormState receives the return value
7. state updates to { errors: ['title', 'content'] }
8. Component re-renders, showing error messages
9. User fixes errors and submits again
10. If valid → redirect('/feed')
```

---

## 8. Adjusting Server Actions for useFormState

### The Extra `prevState` Argument

When a Server Action is used with `useFormState`, it receives an **extra first argument**:

```javascript
// Without useFormState:
async function createPost(formData) {
  'use server';
  // ...
}

// With useFormState:
async function createPost(prevState, formData) {
  'use server';
  //                ↑ extra argument!
  // ...
}
```

### Why `prevState`?

`prevState` lets you access the **previous state** returned by the Server Action. This is useful for:

- Preserving form data after validation errors
- Tracking submission attempts
- Showing "try again" messages

```javascript
'use server';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  const errors = {};
  
  if (!title || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }
  
  if (!content || content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters.';
  }
  
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { title, content },  // Preserve user input
      message: 'Validation failed. Please fix the errors.',
    };
  }
  
  // Valid — store and redirect
  storePost({ title, content, imageUrl: '/default.jpg', userId: 1 });
  redirect('/feed');
}
```

### Using Preserved Values in the Form

```jsx
'use client';

import { useFormState } from 'react-dom';
import { createPost } from '@/actions/posts';

export default function PostForm() {
  const [state, formAction] = useFormState(createPost, {});

  return (
    <form action={formAction}>
      <p>
        <label htmlFor="title">Title</label>
        <input 
          id="title" 
          name="title" 
          defaultValue={state.values?.title || ''}  {/* Preserve input */}
        />
        {state.errors?.title && (
          <span className="error">{state.errors.title}</span>
        )}
      </p>
      
      <p>
        <label htmlFor="content">Content</label>
        <textarea 
          id="content" 
          name="content" 
          defaultValue={state.values?.content || ''}  {/* Preserve input */}
        />
        {state.errors?.content && (
          <span className="error">{state.errors.content}</span>
        )}
      </p>
      
      {state.message && <p className="error">{state.message}</p>}
      
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## 9. Storing Server Actions in Separate Files

### Why Separate Files?

```
❌ Inline Server Actions:
└── Only work in Server Components
└── Can't be reused across multiple components
└── Clutter the component file

✅ Separate Files:
└── Work in both Server and Client Components
└── Reusable across entire application
└── Clean separation of concerns
└── Easy to test
```

### Creating an Actions File

```javascript
// actions/posts.js
'use server';  // ← At file level = ALL exports are Server Actions

import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const image = formData.get('image');
  
  // Validation
  const errors = {};
  
  if (!title || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }
  
  if (!content || content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters.';
  }
  
  if (!image || image.size === 0) {
    errors.image = 'Image is required.';
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  
  // Store post
  const imageUrl = '/images/default.jpg';  // Placeholder
  await storePost({ title, content, imageUrl, userId: 1 });
  
  // Clear cache and redirect
  revalidatePath('/feed');
  redirect('/feed');
}
```

### Using in Components

```jsx
// app/new-post/page.js
'use client';

import { useFormState } from 'react-dom';
import { createPost } from '@/actions/posts';  // Import the action
import PostForm from '@/components/post-form';

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, {});

  return (
    <main>
      <h1>Create a New Post</h1>
      <PostForm formAction={formAction} state={state} />
    </main>
  );
}
```

### Project Structure

```
project/
├── app/
│   ├── new-post/
│   │   └── page.js           ← Uses actions
│   └── feed/
│       └── page.js
├── actions/
│   ├── posts.js              ← Server Actions for posts
│   └── likes.js              ← Server Actions for likes
├── lib/
│   └── posts.js              ← Database utilities (read operations)
└── components/
    └── post-form.js
```

---

## 10. "use server" Does Not Guarantee Server-side Execution!

### Important Clarification

The `'use server'` directive **marks a function as a Server Action**, but it doesn't mean the function **only** runs on the server.

```
What 'use server' actually means:
✅ This function CAN be called from the client
✅ When called, it WILL run on the server
✅ The function body has access to server resources

What it does NOT mean:
❌ This function NEVER runs in the browser
❌ The function is completely hidden from the client
```

### How Server Actions Actually Work

```
When a Server Action is called from a Client Component:

1. Client calls the action (e.g., formAction())
2. Next.js intercepts the call
3. Data is sent to the server via HTTP POST
4. Server executes the action
5. Result is sent back to the client
6. Client receives the result

The function DEFINITION is sent to the browser,
but the EXECUTION always happens on the server.
```

### Security Implications

```javascript
// ❌ WRONG — Secrets are NOT safe in Server Actions!
'use server';

export async function dangerousAction() {
  const apiKey = 'super-secret-key';  // ❌ This is visible in browser code!
  // ...
}

// ✅ CORRECT — Use environment variables
'use server';

export async function safeAction() {
  const apiKey = process.env.API_KEY;  // ✅ This is safe (only on server)
  // ...
}
```

### Best Practices

```
✅ DO:
├── Use environment variables for secrets
├── Validate ALL inputs on the server
├── Assume all client data is untrusted
├── Use Server Actions for mutations
└── Keep sensitive logic in Server Components or server-only files

❌ DON'T:
├── Hard-code secrets in Server Actions
├── Trust client-side validation alone
├── Expose internal implementation details
└── Assume Server Actions are "invisible" to the client
```

---

## 11. Uploading & Storing Images

### The Problem with Local File Storage

```
❌ Storing files in public/ or local filesystem:
├── Files are lost on deployment (ephemeral filesystem)
├── Doesn't scale (multiple server instances)
├── No CDN (slow image delivery)
└── Limited storage

✅ Cloud storage (Cloudinary, AWS S3, etc.):
├── Persistent storage
├── CDN (fast delivery worldwide)
├── Scalable
├── Image transformations
└── Professional solution
```

### Setting Up Cloudinary

1. **Sign up** at [cloudinary.com](https://cloudinary.com)
2. **Get credentials** from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Installing Cloudinary SDK

```bash
npm install cloudinary
```

### Environment Variables

```bash
# .env.local (NEVER commit this file!)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Upload Function

```javascript
// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image) {
  // Convert File to Buffer
  const imageData = await image.arrayBuffer();
  const buffer = Buffer.from(imageData);
  
  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'nextjs-posts',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);  // Returns the image URL
        }
      }
    ).end(buffer);
  });
}
```

### Server Action with Image Upload

```javascript
// actions/posts.js
'use server';

import { uploadImage } from '@/lib/cloudinary';
import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const image = formData.get('image');
  
  // Validation
  const errors = {};
  
  if (!title || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }
  
  if (!content || content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters.';
  }
  
  if (!image || image.size === 0) {
    errors.image = 'Image is required.';
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  
  // Upload image to Cloudinary
  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    return {
      errors: {
        image: 'Image upload failed. Please try again.',
      },
    };
  }
  
  // Store post with Cloudinary URL
  await storePost({
    title,
    content,
    imageUrl,  // ← Cloudinary URL
    userId: 1,
  });
  
  revalidatePath('/feed');
  redirect('/feed');
}
```

### Displaying Uploaded Images

```jsx
// components/post.js
import Image from 'next/image';

export default function Post({ post }) {
  return (
    <article>
      <Image 
        src={post.imageUrl}  // ← Cloudinary URL from database
        alt={post.title}
        width={600}
        height={400}
      />
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  );
}
```

### Configuring Next.js for External Images

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## 12. Alternative Ways of Using, Configuring & Triggering Server Actions

### Method 1: Form Action (Most Common)

```jsx
<form action={serverAction}>
  <input name="title" />
  <button type="submit">Submit</button>
</form>
```

### Method 2: Button `formAction` (Override Form Action)

```jsx
<form action={defaultAction}>
  <input name="title" />
  <button type="submit">Default Submit</button>
  <button formAction={alternativeAction}>Alternative Submit</button>
</form>
```

### Method 3: Programmatic Call (from Event Handler)

```jsx
'use client';

import { deletePost } from '@/actions/posts';
import { useTransition } from 'react';

export default function Post({ post }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm('Are you sure?')) {
      startTransition(async () => {
        await deletePost(post.id);
      });
    }
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <button onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </article>
  );
}
```

### Method 4: Like Button Example

```javascript
// actions/likes.js
'use server';

import sql from 'better-sqlite3';
import { revalidatePath } from 'next/cache';

const db = sql('posts.db');

export async function togglePostLikeStatus(postId) {
  const userId = 1;  // Hard-coded for demo
  
  // Check if already liked
  const existingLike = db.prepare(`
    SELECT * FROM likes WHERE user_id = ? AND post_id = ?
  `).get(userId, postId);
  
  if (existingLike) {
    // Unlike
    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?')
      .run(userId, postId);
  } else {
    // Like
    db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)')
      .run(userId, postId);
  }
  
  revalidatePath('/feed');
}
```

```jsx
// components/like-button.js
'use client';

import { togglePostLikeStatus } from '@/actions/likes';
import { useOptimistic } from 'react';

export default function LikeButton({ postId, isLiked }) {
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(isLiked);

  async function handleToggle() {
    setOptimisticLiked(!optimisticLiked);  // Optimistic update
    await togglePostLikeStatus(postId);     // Server action
  }

  return (
    <button onClick={handleToggle}>
      {optimisticLiked ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
}
```

---

## 13. Revalidating Data to Avoid Caching Problems

### The Caching Problem

```
Problem:
1. User creates a new post
2. Server Action stores it in database ✅
3. User is redirected to /feed
4. Feed page shows OLD data (doesn't include new post) ❌

Why?
Next.js aggressively caches pages and data for performance.
After mutation, the cache is still showing old data.
```

### The Solution: `revalidatePath()`

```javascript
import { revalidatePath } from 'next/cache';

export async function createPost(prevState, formData) {
  // ... validation and storage ...
  
  await storePost(post);
  
  // Clear the cache for /feed so it re-fetches fresh data
  revalidatePath('/feed');
  
  redirect('/feed');
}
```

### How `revalidatePath()` Works

```
Before revalidatePath:
┌────────────────────────┐
│  /feed is cached       │  ← Shows old posts
│  [Post 1, Post 2]      │
└────────────────────────┘
        │
        ▼
  New post created (Post 3)
        │
        ▼
  redirect('/feed')
        │
        ▼
┌────────────────────────┐
│  /feed still cached    │  ← Still shows old posts!
│  [Post 1, Post 2]      │  ❌ Post 3 is missing
└────────────────────────┘


After revalidatePath:
┌────────────────────────┐
│  /feed is cached       │
│  [Post 1, Post 2]      │
└────────────────────────┘
        │
        ▼
  New post created (Post 3)
        │
        ▼
  revalidatePath('/feed')  ← Clears the cache!
        │
        ▼
  redirect('/feed')
        │
        ▼
┌────────────────────────┐
│  /feed re-generated    │  ← Fresh data from database
│  [Post 1, Post 2, Post 3]  ✅ Post 3 appears!
└────────────────────────┘
```

### `revalidatePath` Options

```javascript
// Revalidate a specific page
revalidatePath('/feed');

// Revalidate a page AND all nested pages
revalidatePath('/feed', 'layout');

// Revalidate everything
revalidatePath('/', 'layout');
```

### Using with Different Routes

```javascript
// actions/posts.js
'use server';

export async function createPost(prevState, formData) {
  // ... create post ...
  
  // Revalidate affected routes
  revalidatePath('/feed');         // Feed page
  revalidatePath('/');             // Home page (if it shows posts)
}

export async function deletePost(postId) {
  // ... delete post ...
  
  revalidatePath('/feed');         // Feed page
  revalidatePath(`/posts/${postId}`);  // The deleted post page
}

export async function toggleLike(postId) {
  // ... toggle like ...
  
  revalidatePath('/feed');         // Feed page shows like count
  revalidatePath(`/posts/${postId}`);  // Post detail page
}
```

### When to Use `revalidatePath`

```
✅ Use revalidatePath when:
├── Creating new data
├── Updating existing data
├── Deleting data
├── Any mutation that affects displayed content
└── After any database write operation

❌ Don't use revalidatePath when:
├── Just reading data
├── No data has changed
└── In non-mutation Server Actions
```

---

## 14. Performing Optimistic Updates with Next.js

### What Are Optimistic Updates?

**Optimistic updates** update the UI **immediately** (before the server confirms), assuming the operation will succeed. If it fails, roll back.

```
Without Optimistic Updates:
User clicks "Like" → Wait for server → Update UI (2-3 seconds)

With Optimistic Updates:
User clicks "Like" → Update UI immediately → Server confirms in background
```

### The `useOptimistic` Hook

```jsx
import { useOptimistic } from 'react';

const [optimisticValue, setOptimisticValue] = useOptimistic(currentValue);
//     ↑                  ↑                                  ↑
//  displayed value   function to update            actual value from server
```

### Example: Like Button with Optimistic Update

```jsx
// components/like-button.js
'use client';

import { useOptimistic } from 'react';
import { togglePostLikeStatus } from '@/actions/likes';

export default function LikeButton({ postId, isLiked }) {
  // useOptimistic manages optimistic state
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(
    isLiked,           // Current actual value
    (currentState, newValue) => newValue  // How to update optimistically
  );

  async function handleToggle() {
    // 1. Update UI immediately (optimistic)
    setOptimisticLiked(!optimisticLiked);
    
    // 2. Call server action in background
    try {
      await togglePostLikeStatus(postId);
      // If successful, the actual `isLiked` prop will update
      // and sync with the optimistic value
    } catch (error) {
      // If failed, React automatically reverts to the actual value
      console.error('Failed to toggle like:', error);
    }
  }

  return (
    <button onClick={handleToggle} className="like-button">
      {optimisticLiked ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
}
```

### How It Works

```
Timeline:

0s: User clicks "Like"
    ├── optimisticLiked changes from false to true
    ├── Button shows "❤️ Liked" IMMEDIATELY ✅
    └── Server Action starts (in background)

1-2s: Server Action completes
    ├── Database updated
    ├── revalidatePath() called
    ├── Component re-renders with fresh data
    └── isLiked prop updates to true
        └── optimisticLiked syncs with actual value

If server fails:
    ├── Server Action throws error
    ├── catch block runs
    └── React REVERTS optimisticLiked back to false (rollback)
```

### Complete Example with Like Count

```jsx
// components/post.js
'use client';

import { useOptimistic } from 'react';
import { togglePostLikeStatus } from '@/actions/likes';
import Image from 'next/image';

export default function Post({ post, isLiked, likeCount }) {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { isLiked, likeCount },
    (currentState, action) => {
      if (action === 'toggle') {
        return {
          isLiked: !currentState.isLiked,
          likeCount: currentState.isLiked 
            ? currentState.likeCount - 1 
            : currentState.likeCount + 1,
        };
      }
      return currentState;
    }
  );

  async function handleToggleLike() {
    setOptimisticLikes('toggle');  // Optimistic update
    await togglePostLikeStatus(post.id);  // Server action
  }

  return (
    <article className="post">
      <Image src={post.imageUrl} alt={post.title} width={600} height={400} />
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={handleToggleLike}>
        {optimisticLikes.isLiked ? '❤️' : '🤍'} {optimisticLikes.likeCount}
      </button>
    </article>
  );
}
```

### When to Use Optimistic Updates

```
✅ Use optimistic updates for:
├── Like/unlike buttons
├── Follow/unfollow buttons
├── Bookmark/save actions
├── Simple toggles
└── Actions that are VERY likely to succeed

❌ Don't use optimistic updates for:
├── Complex mutations with high failure risk
├── Financial transactions
├── Account deletions
├── Actions requiring server validation
└── Actions with side effects (emails, notifications)
```

---

## 15. Caching Differences: Development vs Production

### Development Mode (`npm run dev`)

```
Development:
├── No aggressive caching
├── Pages re-render on every request
├── Changes are visible immediately
├── revalidatePath() less critical (but still good practice)
└── Easy debugging
```

### Production Mode (`npm run build` + `npm run start`)

```
Production:
├── Aggressive caching
├── Static pages pre-rendered at build time
├── Dynamic pages cached after first request
├── revalidatePath() is CRITICAL
└── Maximum performance
```

### Testing Production Caching

```bash
# 1. Build the production version
npm run build

# 2. Start the production server
npm run start

# 3. Visit http://localhost:3000
# 4. Create a new post
# 5. Without revalidatePath, the new post WON'T appear on /feed!
```

### Cache Behavior Comparison

| Scenario | Development | Production |
|---|---|---|
| **Page first load** | Renders fresh | Renders from cache (if available) |
| **Subsequent loads** | Re-renders | Serves from cache |
| **Data mutation** | Fresh data visible | OLD data shown (cache stale) |
| **After revalidatePath()** | Fresh data | Cache cleared, fresh data |
| **Static pages** | Re-renders on change | Stays cached until revalidate |
| **Dynamic pages** | Re-renders | Cached for 30s by default |

### Forcing Dynamic Rendering

If you want a page to NEVER be cached (always dynamic):

```jsx
// app/feed/page.js
export const dynamic = 'force-dynamic';  // ← Never cache this page

export default async function FeedPage() {
  const posts = await getPosts();
  return <Posts posts={posts} />;
}
```

### Revalidation Strategies

```javascript
// 1. On-demand revalidation (after mutations)
revalidatePath('/feed');  // Clear cache for /feed

// 2. Time-based revalidation (Incremental Static Regeneration)
export const revalidate = 60;  // Revalidate every 60 seconds

export default async function FeedPage() {
  const posts = await getPosts();
  return <Posts posts={posts} />;
}

// 3. No caching (always dynamic)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FeedPage() {
  const posts = await getPosts();
  return <Posts posts={posts} />;
}
```

### Best Practices

```
✅ In Development:
├── Don't worry too much about caching
├── Focus on functionality
└── Use revalidatePath() as good practice

✅ Before Production:
├── Test with 'npm run build' + 'npm run start'
├── Verify all mutations call revalidatePath()
├── Check that new data appears after mutations
├── Test all pages that display mutated data
└── Consider time-based revalidation for frequently changing data
```

---

## 16. Module Summary

### Everything Covered in This Module

```
Module 6: Mutating Data Deep Dive — Complete Summary
═══════════════════════════════════════════════════════════

🔧 SERVER ACTIONS (Core Concept)
├── Functions that run on the server
├── Marked with 'use server' directive
├── Must be async
├── Receive FormData as argument
├── Used for CREATE, UPDATE, DELETE operations
├── Replace traditional API routes
├── Can be inline or in separate files
└── Work with both Server and Client Components

📝 FORM HANDLING
├── Use action prop (not onSubmit)
├── Browser automatically creates FormData
├── formData.get('fieldName') to extract values
├── No preventDefault() needed
├── No useState for controlled inputs (unless needed)
└── Simpler than traditional React forms

🎯 HOOKS FOR FORMS
├── useFormStatus
│   ├── Track submission state (pending)
│   ├── Must be in child component inside <form>
│   ├── Show loading UI while submitting
│   └── Disable button during submission
│
└── useFormState (useActionState)
    ├── Connect Server Action to form state
    ├── Return validation errors from server
    ├── Server Action gets extra prevState argument
    ├── Update UI with error messages
    └── Preserve form values after validation

✅ VALIDATION
├── Server-side validation is MANDATORY
├── Client-side validation is optional (UX)
├── Return errors from Server Action
├── Display errors with useFormState
├── Validate before database operations
└── Never trust client data

🖼️ IMAGE UPLOADS
├── Use cloud storage (Cloudinary, S3)
│   ├── NOT local filesystem (ephemeral)
│   ├── CDN for fast delivery
│   ├── Scalable storage
│   └── Image transformations
│
├── Upload in Server Action
│   ├── Get file: formData.get('image')
│   ├── Convert to Buffer
│   ├── Upload to cloud
│   ├── Store URL in database
│   └── Handle upload errors
│
└── Display with Next.js <Image>
    ├── src={cloudinaryUrl}
    ├── Configure remotePatterns in next.config.js
    └── Automatic optimization

♻️ CACHE REVALIDATION
├── revalidatePath(path) — Clear cache for a route
├── revalidatePath(path, 'layout') — Clear route + children
├── Call after every mutation
├── Critical in production (aggressive caching)
├── Less critical in development
└── Without it: stale data shown after mutations

⚡ OPTIMISTIC UPDATES
├── useOptimistic hook
├── Update UI immediately (before server confirms)
├── Server Action runs in background
├── Auto-rollback if server fails
├── Great UX for likes, follows, toggles
├── Use for high-success-rate actions
└── Don't use for critical/risky operations

🏗️ PROJECT ORGANIZATION
├── actions/ — Server Actions files
│   ├── posts.js
│   └── likes.js
│
├── lib/ — Database utilities
│   ├── posts.js (read operations)
│   └── cloudinary.js (image uploads)
│
├── components/ — UI components
│   ├── post-form.js
│   ├── submit-button.js (useFormStatus)
│   └── like-button.js (useOptimistic)
│
└── app/ — Routes
    ├── feed/page.js
    └── new-post/page.js (useFormState)

🔄 DEVELOPMENT vs PRODUCTION
├── Development (npm run dev)
│   ├── Minimal caching
│   ├── Changes visible immediately
│   └── Easy debugging
│
└── Production (npm run build + npm run start)
    ├── Aggressive caching
    ├── Static pages pre-rendered
    ├── revalidatePath() CRITICAL
    └── Test before deploying!
```

### Quick Reference Card

```jsx
// 📝 Basic Server Action
'use server';
export async function createPost(formData) {
  const title = formData.get('title');
  await storePost({ title });
  revalidatePath('/feed');
  redirect('/feed');
}

// 🎯 Server Action with useFormState
'use server';
export async function createPost(prevState, formData) {
  const title = formData.get('title');
  if (!title) return { errors: { title: 'Required' } };
  await storePost({ title });
  revalidatePath('/feed');
  redirect('/feed');
}

// 📋 Form with useFormState
'use client';
import { useFormState } from 'react-dom';
import { createPost } from '@/actions/posts';

export default function PostForm() {
  const [state, formAction] = useFormState(createPost, {});
  return (
    <form action={formAction}>
      <input name="title" />
      {state.errors?.title && <p>{state.errors.title}</p>}
      <SubmitButton />
    </form>
  );
}

// ⏳ Submit Button with useFormStatus
'use client';
import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// 🖼️ Image Upload
'use server';
import { uploadImage } from '@/lib/cloudinary';

export async function createPost(prevState, formData) {
  const image = formData.get('image');
  const imageUrl = await uploadImage(image);
  await storePost({ imageUrl, ... });
  revalidatePath('/feed');
  redirect('/feed');
}

// ⚡ Optimistic Update
'use client';
import { useOptimistic } from 'react';

export default function LikeButton({ postId, isLiked }) {
  const [optimistic, setOptimistic] = useOptimistic(isLiked);
  
  async function toggle() {
    setOptimistic(!optimistic);  // Immediate UI update
    await toggleLike(postId);     // Server action
  }
  
  return <button onClick={toggle}>{optimistic ? '❤️' : '🤍'}</button>;
}

// ♻️ Revalidation
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData) {
  await storePost(...);
  revalidatePath('/feed');        // Clear /feed cache
  revalidatePath('/', 'layout');  // Clear all caches
  redirect('/feed');
}
```

### Decision Trees

#### Which Mutation Approach?

```
Are you handling a form submission?
├── YES → Use Server Action with action prop
│         ✅ <form action={serverAction}>
│
└── NO → Is it a button/event handler?
    └── YES → Use Server Action with onClick + useTransition
              ✅ <button onClick={() => startTransition(async () => {...})}>
```

#### Which Hook for Form State?

```
Do you need to show submission status?
├── YES → useFormStatus (for loading state)
│         ✅ const { pending } = useFormStatus();
│
└── Do you need to show validation errors?
    └── YES → useFormState (for error messages)
              ✅ const [state, formAction] = useFormState(action, {});
```

#### Should You Use Optimistic Updates?

```
Is the action very likely to succeed?
├── YES → Does it require validation?
│   ├── NO → Use optimistic updates ✅
│   │         (like, follow, bookmark)
│   │
│   └── YES → Don't use optimistic updates ❌
│             (create post, update profile)
│
└── NO → Don't use optimistic updates ❌
          (payment, delete account)
```

### Complete Data Mutation Flow

```
User Action → Form Submit
      │
      ▼
Form Action (Server Action)
      │
      ├─→ Extract FormData
      │
      ├─→ Validate Input
      │   ├─→ If invalid: return { errors }
      │   └─→ If valid: continue
      │
      ├─→ Process Files (upload to Cloudinary)
      │
      ├─→ Store in Database
      │
      ├─→ revalidatePath('/affected-route')
      │
      └─→ redirect('/success-page')
      
      ▼
UI Updates Automatically ✅
```

---

> **🎯 Key Takeaways:**  
> - **Server Actions** are the modern way to handle mutations in Next.js
> - They replace API routes for most use cases
> - **Always validate** on the server (never trust client data)
> - Use **useFormStatus** for loading states and **useFormState** for validation errors
> - **Cloudinary** (or similar) is essential for production image uploads
> - **revalidatePath()** is critical for showing fresh data after mutations
> - **Optimistic updates** improve UX but should be used carefully
> - Test in **production mode** before deploying (caching behaves differently)