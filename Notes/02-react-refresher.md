# 📘 Module 02: — React Refresher

---

## Table of Contents

1. [What Is React & Why Use It](#1-what-is-react--why-use-it)
2. [React Projects — Requirements](#2-react-projects--requirements)
3. [Creating React Projects](#3-creating-react-projects)
4. [Understanding How React Works](#4-understanding-how-react-works)
5. [Building A First Custom Component](#5-building-a-first-custom-component)
6. [Outputting Dynamic Values](#6-outputting-dynamic-values)
7. [Reusing Components](#7-reusing-components)
8. [Passing Data with Props](#8-passing-data-to-components-with-props)
9. [CSS Styling & CSS Modules](#9-css-styling--css-modules)
10. [Exercise & Another Component](#10-exercise--another-component)
11. [Preparing the App for State Management](#11-preparing-the-app-for-state-management)
12. [Adding Event Listeners](#12-adding-event-listeners)
13. [Working with State](#13-working-with-state)
14. [Lifting State Up](#14-lifting-state-up)
15. [The Special "children" Prop](#15-the-special-children-prop)
16. [State & Conditional Content](#16-state--conditional-content)
17. [Adding a Shared Header & More State Management](#17-adding-a-shared-header--more-state-management)
18. [Adding Form Buttons](#18-adding-form-buttons)
19. [Handling Form Submission](#19-handling-form-submission)
20. [Updating State Based on Previous State](#20-updating-state-based-on-previous-state)
21. [Outputting List Data](#21-outputting-list-data)
22. [Adding a Backend to the React SPA](#22-adding-a-backend-to-the-react-spa)
23. [Sending a POST HTTP Request](#23-sending-a-post-http-request)
24. [Handling Side Effects with useEffect()](#24-handling-side-effects-with-useeffect)
25. [Handle Loading State](#25-handle-loading-state)
26. [Understanding & Adding Routing](#26-understanding--adding-routing)
27. [Adding Routes](#27-adding-routes)
28. [Working with Layout Routes](#28-working-with-layout-routes)
29. [Refactoring Route Components & More Nesting](#29-refactoring-route-components--more-nesting)
30. [Linking & Navigating](#30-linking--navigating)
31. [Data Fetching via loader()s](#31-data-fetching-via-loaders)
32. [Submitting Data with action()s](#32-submitting-data-with-actions)
33. [Dynamic Routes](#33-dynamic-routes)
34. [React Context (Legacy Section)](#34-react-context-legacy-section)
35. [Module Summary](#35-module-summary)

---

## 1. What Is React & Why Use It

### What Is React?

React is a **JavaScript library** for building **user interfaces (UIs)**. It was created and is maintained by **Meta (Facebook)** and a large open-source community.

> **Key definition:** React is a *client-side* JavaScript library that helps you build modern, reactive, and interactive user interfaces for the web.

### The Problem React Solves

Without React (or similar libraries), you would build websites using **plain HTML, CSS, and vanilla JavaScript**. This approach has problems:

| Problem | Explanation |
|---|---|
| **Imperative code** | You must write step-by-step instructions telling the browser *exactly* what to do (select this element, change this text, add this class, etc.) |
| **Hard to maintain** | As the app grows, the code becomes messy and difficult to manage |
| **No reusability** | You repeat the same UI logic in many places |
| **Full page reloads** | Traditional websites reload the entire page for every action, making the experience slow and clunky |

### How React Fixes These Problems

```
Traditional Website:
User clicks → Server sends new HTML page → Full page reload

React Application:
User clicks → JavaScript updates only the part that changed → No page reload
```

1. **Declarative approach** — You describe *what* the UI should look like, and React figures out *how* to update the DOM
2. **Component-based** — You build small, reusable pieces of UI called **components**
3. **Virtual DOM** — React uses a virtual (in-memory) representation of the DOM to calculate the minimum number of changes needed, making updates fast
4. **Single Page Application (SPA)** — React can power the entire frontend; only one HTML page is loaded, and React handles all UI changes with JavaScript

### Why React Over Alternatives?

- **Huge ecosystem** — Thousands of third-party packages
- **Massive community** — Easy to find help, tutorials, and jobs
- **Backed by Meta** — Active development and long-term support
- **Flexible** — Works for small widgets or full applications
- **React Native** — Same concepts can build mobile apps

---

## 2. React Projects — Requirements

### What You Need to Know Before Starting

| Prerequisite | Level Needed |
|---|---|
| **HTML** | Basic to intermediate |
| **CSS** | Basic to intermediate |
| **JavaScript** | Intermediate (ES6+ features) |

### Essential JavaScript (ES6+) Features You Must Know

```javascript
// 1. let & const
let changeable = "I can change";
const fixed = "I cannot change";

// 2. Arrow Functions
const greet = (name) => {
  return `Hello, ${name}!`;
};
// Short form (implicit return):
const greetShort = (name) => `Hello, ${name}!`;

// 3. Template Literals
const message = `Welcome, ${userName}!`;

// 4. Destructuring
// Object destructuring:
const { name, age } = userObject;
// Array destructuring:
const [first, second] = myArray;

// 5. Spread Operator
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: "value" };

// 6. Import/Export (Modules)
// Named export:
export const myFunction = () => {};
// Default export:
export default MyComponent;
// Import:
import MyComponent from './MyComponent';
import { myFunction } from './utils';

// 7. Array methods
const doubled = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);
const sum = numbers.reduce((acc, num) => acc + num, 0);

// 8. Promises & async/await
const fetchData = async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
};
```

### Tools You Need Installed

1. **Node.js** (version 16 or higher) — Download from [nodejs.org](https://nodejs.org)
2. **A code editor** — Visual Studio Code is recommended
3. **A modern browser** — Chrome or Firefox with developer tools

To verify Node.js installation:
```bash
node --version    # Should show v16+ or v18+
npm --version     # Comes with Node.js
```

---

## 3. Creating React Projects

### Method 1: Vite (Recommended — Modern & Fast)

```bash
# Create a new React project with Vite
npm create vite@latest my-react-app -- --template react

# Navigate into the project
cd my-react-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Why Vite?**
- ⚡ Extremely fast startup and hot module replacement (HMR)
- 📦 Optimized build output
- 🔧 Modern tooling
- This is the **currently recommended** approach

### Method 2: Create React App (Older — Still Works)

```bash
npx create-react-app my-react-app
cd my-react-app
npm start
```

> ⚠️ **Note:** Create React App is no longer actively maintained. The React team now recommends Vite or framework-based setups like Next.js.

### Project Structure (Vite)

```
my-react-app/
├── node_modules/        ← Installed packages (don't touch)
├── public/              ← Static files (images, favicon, etc.)
│   └── vite.svg
├── src/                 ← Your source code goes here
│   ├── App.jsx          ← Main App component
│   ├── App.css          ← Styles for App
│   ├── main.jsx         ← Entry point (renders App)
│   ├── index.css        ← Global styles
│   └── assets/          ← Images, fonts, etc.
├── index.html           ← The single HTML page
├── package.json         ← Project config & dependencies
├── vite.config.js       ← Vite configuration
└── README.md
```

### Understanding the Entry Point

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>  <!-- React renders everything here -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**main.jsx:**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create a "root" and render the App component into the div#root
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 4. Understanding How React Works

### The Core Idea: Components

React applications are built entirely from **components**. A component is a **reusable piece of the user interface**.

```
┌─────────────────────────────────────────────┐
│                   App                       │
│  ┌──────────┐  ┌─────────────────────────┐  │
│  │  Header  │  │       Main Content      │  │
│  └──────────┘  │  ┌─────┐  ┌─────┐       │  │
│                │  │Card │  │Card │       │  │
│                │  └─────┘  └─────┘       │  │
│                └─────────────────────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │             Footer                   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### What Is a Component?

A React component is simply a **JavaScript function** that returns **JSX** (HTML-like code).

```jsx
// This is a React component!
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

### What Is JSX?

**JSX (JavaScript XML)** is a syntax extension that lets you write HTML-like code inside JavaScript. It is NOT valid JavaScript — it gets transformed by a build tool (like Vite/Babel) into regular JavaScript.

```jsx
// What you write (JSX):
const element = <h1 className="title">Hello!</h1>;

// What it becomes (JavaScript):
const element = React.createElement('h1', { className: 'title' }, 'Hello!');
```

### JSX Rules

| Rule | Example |
|---|---|
| Must return **one root element** | Wrap in `<div>` or `<>...</>` (Fragment) |
| Use `className` instead of `class` | `<div className="box">` |
| Use `htmlFor` instead of `for` | `<label htmlFor="email">` |
| All tags must be **closed** | `<img />`, `<br />`, `<input />` |
| JavaScript expressions in **curly braces** | `<p>{userName}</p>` |
| Use **camelCase** for attributes | `onClick`, `onChange`, `tabIndex` |

### The Virtual DOM

```
  Your Components          Virtual DOM            Real DOM
  ┌──────────┐          ┌──────────┐          ┌──────────┐
  │  State   │  ──→     │  React   │  ──→     │  Browser │
  │  Changes │  render  │ compares │  minimal │  updates │
  │          │          │ old & new│  changes │  screen  │
  └──────────┘          └──────────┘          └──────────┘
```

1. When state changes, React **re-renders** the component (calls the function again)
2. React creates a **new Virtual DOM tree** (a lightweight copy)
3. React **compares** the new Virtual DOM with the old one (this is called **"diffing"**)
4. React calculates the **minimum number of changes** needed
5. React applies **only those changes** to the real browser DOM

This process is called **reconciliation** and it makes React very fast.

---

## 5. Building A First Custom Component

### The Anatomy of a Component

```jsx
// File: src/components/Post.jsx

// A component is a function that returns JSX
function Post() {
  return (
    <div className="post">
      <h2>My First Post</h2>
      <p>This is the content of my first post.</p>
    </div>
  );
}

// You MUST export the component to use it elsewhere
export default Post;
```

### Rules for Components

1. **Function name must start with an uppercase letter** — `Post`, not `post`
2. **Must return JSX** (or `null`)
3. **Must return one root element** — use a wrapper `<div>` or Fragment `<>...</>`
4. **Must be exported** to be used in other files

### Using the Component

```jsx
// File: src/App.jsx
import Post from './components/Post';

function App() {
  return (
    <div>
      <h1>My Blog</h1>
      <Post />   {/* Using the custom component like an HTML tag */}
    </div>
  );
}

export default App;
```

### Fragments (Avoiding Unnecessary Wrapper divs)

```jsx
// Problem: You don't want an extra <div> in the DOM
function Post() {
  return (
    <div>  {/* This div might be unnecessary */}
      <h2>Title</h2>
      <p>Content</p>
    </div>
  );
}

// Solution 1: React Fragment (long form)
import { Fragment } from 'react';
function Post() {
  return (
    <Fragment>
      <h2>Title</h2>
      <p>Content</p>
    </Fragment>
  );
}

// Solution 2: Short Fragment syntax (most common)
function Post() {
  return (
    <>
      <h2>Title</h2>
      <p>Content</p>
    </>
  );
}
```

### File & Folder Organization

```
src/
├── components/
│   ├── Post.jsx
│   ├── Post.css         (or Post.module.css)
│   ├── Header.jsx
│   └── Header.css
├── App.jsx
├── App.css
└── main.jsx
```

> **Best Practice:** Put each component in its own file. Name the file the same as the component.

---

## 6. Outputting Dynamic Values

### Using Curly Braces `{}` for Dynamic Content

In JSX, anything inside **curly braces** `{}` is treated as a **JavaScript expression**.

```jsx
function Post() {
  const title = "Learning React";
  const currentDate = new Date().toLocaleDateString();
  const likes = 42;

  return (
    <div className="post">
      <h2>{title}</h2>                          {/* Variable */}
      <p>Published on: {currentDate}</p>         {/* Expression */}
      <p>Likes: {likes}</p>                      {/* Number */}
      <p>Double likes: {likes * 2}</p>           {/* Math */}
      <p>Status: {likes > 10 ? 'Popular' : 'New'}</p>  {/* Ternary */}
    </div>
  );
}
```

### What You CAN Put in Curly Braces

| Type | Example | Works? |
|---|---|---|
| Variables | `{userName}` | ✅ |
| Numbers | `{42}` | ✅ |
| Strings | `{"hello"}` | ✅ |
| Math expressions | `{2 + 2}` | ✅ |
| Function calls | `{getData()}` | ✅ |
| Ternary operator | `{isTrue ? 'Yes' : 'No'}` | ✅ |
| Template literals | `` {`Hello ${name}`} `` | ✅ |
| Array.map() | `{items.map(i => <li>{i}</li>)}` | ✅ |

### What You CANNOT Put in Curly Braces

| Type | Example | Works? |
|---|---|---|
| if/else statements | `{if (true) {...}}` | ❌ |
| for loops | `{for (let i...) {...}}` | ❌ |
| Objects directly | `{myObject}` | ❌ (use `JSON.stringify()` or access properties) |

### Dynamic Attributes

```jsx
function UserAvatar() {
  const imageUrl = "https://example.com/avatar.jpg";
  const altText = "User profile picture";

  return (
    <img 
      src={imageUrl}           // Dynamic src
      alt={altText}            // Dynamic alt
      className="avatar"       // Static className (no curly braces needed for strings)
    />
  );
}
```

---

## 7. Reusing Components

### The Power of Reusability

Instead of writing the same HTML structure multiple times, you create a component **once** and use it **many times**.

```jsx
// ❌ Without components (repetitive)
function App() {
  return (
    <div>
      <div className="post">
        <h2>Post 1</h2>
        <p>Content 1</p>
      </div>
      <div className="post">
        <h2>Post 2</h2>
        <p>Content 2</p>
      </div>
      <div className="post">
        <h2>Post 3</h2>
        <p>Content 3</p>
      </div>
    </div>
  );
}

// ✅ With components (reusable)
function Post() {
  return (
    <div className="post">
      <h2>A Post</h2>
      <p>Some content</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Post />
      <Post />
      <Post />
    </div>
  );
}
```

> **Problem:** All three posts show the same content. We need **props** to make each instance unique — covered in the next section!

---

## 8. Passing Data to Components with Props

### What Are Props?

**Props (properties)** are the mechanism for passing data **from a parent component to a child component**. Props make components **configurable and reusable**.

Think of props like **function arguments** — they let you pass different values to the same component.

```
┌─────────────────────┐
│    Parent (App)     │
│                     │
│  Passes data via    │
│  props (attributes) │
│         │           │
│         ▼           │
│  ┌───────────────┐  │
│  │ Child (Post)  │  │
│  │ Receives data │  │
│  │ via props obj │  │
│  └───────────────┘  │
└─────────────────────┘
```

### How Props Work

**Step 1:** Parent passes data as attributes (like HTML attributes)

```jsx
// App.jsx (Parent)
function App() {
  return (
    <div>
      <Post 
        author="Alice" 
        title="Learning React" 
        body="React is awesome!" 
        likes={42}           // Numbers need curly braces
        isPublished={true}   // Booleans need curly braces
      />
      <Post 
        author="Bob" 
        title="Understanding Props" 
        body="Props pass data down." 
        likes={18} 
        isPublished={false} 
      />
    </div>
  );
}
```

**Step 2:** Child receives all props as a single **object**

```jsx
// Method 1: Using the props object
function Post(props) {
  return (
    <div className="post">
      <h2>{props.title}</h2>
      <p>By: {props.author}</p>
      <p>{props.body}</p>
      <span>❤️ {props.likes}</span>
    </div>
  );
}

// Method 2: Using destructuring (RECOMMENDED — cleaner)
function Post({ author, title, body, likes, isPublished }) {
  return (
    <div className="post">
      <h2>{title}</h2>
      <p>By: {author}</p>
      <p>{body}</p>
      <span>❤️ {likes}</span>
      {isPublished && <span className="badge">Published</span>}
    </div>
  );
}
```

### Props Rules

| Rule | Explanation |
|---|---|
| **Props are read-only** | A child component must NEVER modify its props |
| **Data flows one way** | Parent → Child only (top-down / unidirectional) |
| **Any data type** | Strings, numbers, arrays, objects, functions, even other components |
| **String props** | Don't need curly braces: `name="Alice"` |
| **Non-string props** | Need curly braces: `age={25}`, `isActive={true}` |

### Default Props

```jsx
function Post({ author = "Anonymous", title, body, likes = 0 }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>By: {author}</p>     {/* Shows "Anonymous" if no author passed */}
      <span>❤️ {likes}</span>  {/* Shows 0 if no likes passed */}
    </div>
  );
}
```

---

## 9. CSS Styling & CSS Modules

### Method 1: Regular CSS Import

```css
/* Post.css */
.post {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post h2 {
  color: #333;
  margin-bottom: 8px;
}
```

```jsx
// Post.jsx
import './Post.css';  // Just import the CSS file

function Post({ title, body }) {
  return (
    <div className="post">  {/* Use className, not class */}
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
```

> ⚠️ **Problem with regular CSS:** Styles are **global**. If two components both use `.post` class, they will **conflict**!

### Method 2: CSS Modules (RECOMMENDED)

CSS Modules automatically **scope** styles to the component, preventing conflicts.

**Step 1:** Name the file with `.module.css` extension

```css
/* Post.module.css */
.post {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.title {
  color: #333;
  font-size: 1.5rem;
}

.content {
  color: #666;
}
```

**Step 2:** Import as a JavaScript object

```jsx
// Post.jsx
import classes from './Post.module.css';
// OR: import styles from './Post.module.css';

function Post({ title, body }) {
  return (
    <div className={classes.post}>      {/* Access class as a property */}
      <h2 className={classes.title}>{title}</h2>
      <p className={classes.content}>{body}</p>
    </div>
  );
}
```

**What happens behind the scenes:**

```html
<!-- The actual HTML rendered in the browser -->
<div class="Post_post__x7aS3">     <!-- Unique, auto-generated class name -->
  <h2 class="Post_title__k2mD1">...</h2>
  <p class="Post_content__p9qW2">...</p>
</div>
```

### CSS Modules — Multiple Classes & Dynamic Classes

```jsx
// Multiple classes
<div className={`${classes.post} ${classes.featured}`}>

// Dynamic/Conditional classes
<div className={isActive ? classes.active : classes.inactive}>

// Combining static and dynamic
<div className={`${classes.post} ${isHighlighted ? classes.highlighted : ''}`}>
```

### Method 3: Inline Styles

```jsx
function Post({ title }) {
  const style = {
    backgroundColor: 'white',   // camelCase, not kebab-case
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={style}>
      <h2>{title}</h2>
    </div>
  );
}

// Or inline directly:
<div style={{ backgroundColor: 'white', padding: '16px' }}>
```

### Comparison Table

| Feature | Regular CSS | CSS Modules | Inline Styles |
|---|---|---|---|
| Scoped? | ❌ Global | ✅ Scoped | ✅ Scoped |
| Pseudo-classes (:hover) | ✅ | ✅ | ❌ |
| Media queries | ✅ | ✅ | ❌ |
| Easy to use | ✅ | ✅ | ✅ |
| Recommended? | For global styles | ✅ For components | Rarely |

---

## 10. Exercise & Another Component

### Practice: Creating a New Component

Let's create a `MeetupItem` component:

```jsx
// components/MeetupItem.jsx
import classes from './MeetupItem.module.css';

function MeetupItem({ title, image, address, description }) {
  return (
    <li className={classes.item}>
      <div className={classes.image}>
        <img src={image} alt={title} />
      </div>
      <div className={classes.content}>
        <h3>{title}</h3>
        <address>{address}</address>
        <p>{description}</p>
      </div>
      <div className={classes.actions}>
        <button>To Favorites</button>
      </div>
    </li>
  );
}

export default MeetupItem;
```

```css
/* MeetupItem.module.css */
.item {
  list-style: none;
  margin: 1rem 0;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
}

.content {
  padding: 1rem;
  text-align: center;
}

.actions {
  padding: 1rem;
  text-align: center;
}

.actions button {
  background: #77002e;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.actions button:hover {
  background: #9c0e4e;
}
```

---

## 11. Preparing the App for State Management

### Why Do We Need State?

Components often need to **change what they display** based on user interaction. For example:

- A button click should open a modal
- Typing in a search box should filter results
- Adding an item to a cart should update the count

**Regular variables don't work** for this because:

```jsx
function Counter() {
  let count = 0;  // Regular variable

  function handleClick() {
    count = count + 1;  // This changes the variable...
    console.log(count); // ...but React doesn't know about it!
  }

  // Even though count changes, React NEVER re-renders this component
  // The screen will always show 0
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Add</button>
    </div>
  );
}
```

> **The Problem:** React doesn't monitor regular variables. When a regular variable changes, React has **no idea** and doesn't update the screen.

> **The Solution:** React provides a special mechanism called **State** — when state changes, React **re-renders** the component and updates the screen.

---

## 12. Adding Event Listeners

### How Events Work in React

In React, you add event listeners as **props** directly on JSX elements. You don't use `addEventListener`.

```jsx
function Button() {
  // Define the handler function
  function handleClick() {
    console.log('Button was clicked!');
  }

  return (
    // Pass the function REFERENCE (no parentheses!)
    <button onClick={handleClick}>Click Me</button>
  );
}
```

### ⚠️ Common Mistake

```jsx
// ❌ WRONG — This CALLS the function immediately when rendering
<button onClick={handleClick()}>Click Me</button>

// ✅ CORRECT — This PASSES a reference to the function
<button onClick={handleClick}>Click Me</button>

// ✅ ALSO CORRECT — Arrow function (useful when you need to pass arguments)
<button onClick={() => handleClick('some-argument')}>Click Me</button>
```

### Common React Events

| Event | HTML Equivalent | When It Fires |
|---|---|---|
| `onClick` | `onclick` | Element is clicked |
| `onChange` | `onchange` | Input value changes |
| `onSubmit` | `onsubmit` | Form is submitted |
| `onMouseEnter` | `onmouseenter` | Mouse enters element |
| `onMouseLeave` | `onmouseleave` | Mouse leaves element |
| `onKeyDown` | `onkeydown` | Key is pressed down |
| `onFocus` | `onfocus` | Element gains focus |
| `onBlur` | `onblur` | Element loses focus |

### The Event Object

React automatically passes an **event object** to your handler function:

```jsx
function InputField() {
  function handleChange(event) {
    console.log(event.target.value);  // The current value of the input
  }

  function handleSubmit(event) {
    event.preventDefault();  // Prevent page reload on form submit
    console.log('Form submitted!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        onChange={handleChange} 
        placeholder="Type something..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 13. Working with State

### Introducing `useState`

`useState` is a **React Hook** — a special function that lets you add state to functional components.

```jsx
import { useState } from 'react';

function Counter() {
  // useState returns an array with exactly 2 elements:
  // [0] = current state value
  // [1] = function to update the state
  const [count, setCount] = useState(0);
  //     ↑       ↑                   ↑
  //   value   setter          initial value

  function incrementHandler() {
    setCount(count + 1);  // Update state → triggers re-render
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementHandler}>+1</button>
    </div>
  );
}
```

### How `useState` Works — Step by Step

```
Step 1: Component renders for the first time
        useState(0) → count = 0

Step 2: User clicks the button
        setCount(1) is called

Step 3: React schedules a RE-RENDER
        The entire component function runs again

Step 4: Component renders the second time
        useState remembers the state → count = 1
        Screen shows "Count: 1"

Step 5: User clicks again
        setCount(2) → re-render → count = 2 → screen updates
```

### Rules of Hooks

| Rule | Explanation |
|---|---|
| Only call at **top level** | Never inside if statements, loops, or nested functions |
| Only call in **React functions** | Only in components or custom hooks |
| Call in the **same order** every time | React relies on the order of hook calls |

```jsx
// ❌ WRONG
function MyComponent() {
  if (someCondition) {
    const [value, setValue] = useState('hello');  // NEVER do this!
  }
}

// ✅ CORRECT
function MyComponent() {
  const [value, setValue] = useState('hello');  // Always at the top level
  
  if (someCondition) {
    // Use the state value here instead
  }
}
```

### Multiple State Variables

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="number" 
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
    </form>
  );
}
```

### State Can Hold Any Data Type

```jsx
const [name, setName] = useState('');           // String
const [count, setCount] = useState(0);          // Number
const [isOpen, setIsOpen] = useState(false);    // Boolean
const [items, setItems] = useState([]);         // Array
const [user, setUser] = useState(null);         // Null (or object later)
const [config, setConfig] = useState({          // Object
  theme: 'dark',
  language: 'en'
});
```

---

## 14. Lifting State Up

### The Problem

Sometimes **two sibling components** need to share data. But props only flow **downward** (parent → child). Siblings can't communicate directly.

```
      App
     /   \
  PostA   PostB    ← These siblings can't talk to each other!
```

### The Solution: Lift State Up

Move the shared state to the **closest common parent** (ancestor), then pass it down via props.

```
      App          ← State lives HERE (shared state)
     / | \
    /  |  \
PostA  |  PostB    ← Both receive data via props
       |
  NewPostForm      ← Sends data UP via a function prop
```

### Example: Lifting State Up

```jsx
// App.jsx — The common parent that holds the shared state
import { useState } from 'react';
import NewPostForm from './components/NewPostForm';
import PostList from './components/PostList';

function App() {
  // State is "lifted" here — the closest common ancestor
  const [posts, setPosts] = useState([]);

  // Handler function to add a new post
  function addPostHandler(newPost) {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  }

  return (
    <div>
      {/* Pass the handler DOWN to the form */}
      <NewPostForm onAddPost={addPostHandler} />
      
      {/* Pass the data DOWN to the list */}
      <PostList posts={posts} />
    </div>
  );
}
```

```jsx
// NewPostForm.jsx — Sends data UP by calling the function prop
function NewPostForm({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function submitHandler(event) {
    event.preventDefault();
    
    // Call the parent's function, passing data UP
    onAddPost({ title, body });
    
    // Reset form
    setTitle('');
    setBody('');
  }

  return (
    <form onSubmit={submitHandler}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit">Add Post</button>
    </form>
  );
}
```

```jsx
// PostList.jsx — Receives and displays the data
function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post, index) => (
        <li key={index}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

### Data Flow Diagram

```
         ┌──── App ─────┐
         │  [posts]     │
         │  setPosts()  │
         │              │
    props│         props│
         │              │
    (onAddPost)      (posts)
         │              │
         ▼              ▼
  ┌─────────────┐  ┌──────────┐
  │NewPostForm  │  │ PostList │
  │             │  │          │
  │ calls       │  │ displays │
  │ onAddPost() │  │ posts    │
  └─────────────┘  └──────────┘
  
  Data flows DOWN via props ↓
  Events flow UP via function props ↑
```

---

## 15. The Special "children" Prop

### What Is the `children` Prop?

`children` is a **special, built-in prop** that contains whatever content you place **between the opening and closing tags** of a component.

```jsx
// Using a component WITH content between tags
<Card>
  <h2>Hello!</h2>
  <p>This content is the "children"</p>
</Card>
```

### Creating a Wrapper Component

```jsx
// Card.jsx — A reusable wrapper component
import classes from './Card.module.css';

function Card({ children }) {
  return (
    <div className={classes.card}>
      {children}   {/* Whatever is placed between <Card>...</Card> */}
    </div>
  );
}

export default Card;
```

```css
/* Card.module.css */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
```

### Using the Wrapper Component

```jsx
// Now you can wrap ANY content with the Card styling
function App() {
  return (
    <div>
      <Card>
        <h2>Meetup Title</h2>
        <p>Some description here</p>
      </Card>

      <Card>
        <img src="photo.jpg" alt="Photo" />
        <p>A completely different layout, same card styling!</p>
        <button>Click me</button>
      </Card>
    </div>
  );
}
```

### Another Example: Modal Wrapper

```jsx
// Modal.jsx
import classes from './Modal.module.css';

function Modal({ children, onClose }) {
  return (
    <>
      <div className={classes.backdrop} onClick={onClose} />
      <dialog open className={classes.modal}>
        {children}
      </dialog>
    </>
  );
}

export default Modal;

// Usage:
<Modal onClose={closeHandler}>
  <h2>Are you sure?</h2>
  <p>This action cannot be undone.</p>
  <button onClick={closeHandler}>Cancel</button>
  <button onClick={deleteHandler}>Delete</button>
</Modal>
```

### Another Example: Layout Wrapper

```jsx
// Layout.jsx
function Layout({ children }) {
  return (
    <div>
      <header>
        <nav>My App</nav>
      </header>
      <main>{children}</main>
      <footer>© 2024</footer>
    </div>
  );
}

// Usage:
<Layout>
  <h1>Welcome to my page!</h1>
  <p>This appears in the main section.</p>
</Layout>
```

---

## 16. State & Conditional Content

### Showing/Hiding Content Based on State

```jsx
import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  function toggleHandler() {
    setIsVisible((prev) => !prev);  // Toggle between true and false
  }

  return (
    <div>
      <button onClick={toggleHandler}>
        {isVisible ? 'Hide' : 'Show'} Details
      </button>
      
      {/* Conditional rendering */}
      {isVisible && (
        <div className="details">
          <p>Here are the details that can be shown or hidden!</p>
        </div>
      )}
    </div>
  );
}
```

### Three Ways to Render Conditionally

#### Method 1: `&&` Operator (Short-circuit evaluation)

```jsx
// If condition is true, render the JSX. If false, render nothing.
{isLoggedIn && <p>Welcome back!</p>}
{items.length > 0 && <ItemList items={items} />}
{errorMessage && <p className="error">{errorMessage}</p>}
```

#### Method 2: Ternary Operator `? :`

```jsx
// If condition is true, render A. Otherwise, render B.
{isLoggedIn ? <Dashboard /> : <LoginForm />}
{items.length > 0 ? <ItemList items={items} /> : <p>No items found.</p>}
{isLoading ? <p>Loading...</p> : <p>Data loaded!</p>}
```

#### Method 3: Variable + if/else (for complex conditions)

```jsx
function StatusMessage({ status }) {
  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'error') {
    content = <p className="error">Something went wrong!</p>;
  } else if (status === 'success') {
    content = <p className="success">Data loaded successfully!</p>;
  } else {
    content = <p>No data yet. Click the button to load.</p>;
  }

  return <div>{content}</div>;
}
```

### Practical Example: Modal with Conditional Rendering

```jsx
import { useState } from 'react';
import Modal from './Modal';
import NewPostForm from './NewPostForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      {/* Only render the Modal when isModalOpen is true */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NewPostForm onSubmit={closeModal} />
        </Modal>
      )}

      <button onClick={openModal}>Create New Post</button>
      <PostList />
    </div>
  );
}
```

---

## 17. Adding a Shared Header & More State Management

### Creating a Header Component

```jsx
// components/MainHeader.jsx
import classes from './MainHeader.module.css';

function MainHeader({ onCreatePost }) {
  return (
    <header className={classes.header}>
      <h1>React Poster</h1>
      <p>
        <button onClick={onCreatePost}>New Post</button>
      </p>
    </header>
  );
}

export default MainHeader;
```

### Managing Multiple Pieces of State

```jsx
// App.jsx
import { useState } from 'react';
import MainHeader from './components/MainHeader';
import PostList from './components/PostList';
import Modal from './components/Modal';
import NewPostForm from './components/NewPostForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  function showModalHandler() {
    setIsModalOpen(true);
  }

  function hideModalHandler() {
    setIsModalOpen(false);
  }

  function addPostHandler(postData) {
    setPosts((prevPosts) => [postData, ...prevPosts]);
    hideModalHandler();  // Close modal after adding
  }

  return (
    <>
      <MainHeader onCreatePost={showModalHandler} />
      
      {isModalOpen && (
        <Modal onClose={hideModalHandler}>
          <NewPostForm 
            onCancel={hideModalHandler} 
            onAddPost={addPostHandler} 
          />
        </Modal>
      )}
      
      <main>
        <PostList posts={posts} />
      </main>
    </>
  );
}
```

---

## 18. Adding Form Buttons

### Form with Cancel and Submit Buttons

```jsx
// NewPostForm.jsx
import classes from './NewPostForm.module.css';

function NewPostForm({ onCancel, onAddPost }) {
  // ... state and handlers ...

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {/* Form inputs here */}
      
      <p className={classes.actions}>
        {/* type="button" prevents form submission */}
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        
        {/* type="submit" triggers form onSubmit */}
        <button type="submit">
          Submit
        </button>
      </p>
    </form>
  );
}
```

### Button Types in Forms

| Type | Behavior |
|---|---|
| `type="submit"` | Triggers the form's `onSubmit` event (default for buttons in forms) |
| `type="button"` | Does nothing with the form — only triggers its own `onClick` |
| `type="reset"` | Resets all form fields to their initial values |

---

## 19. Handling Form Submission

### Complete Form Handling Example

```jsx
import { useState } from 'react';
import classes from './NewPostForm.module.css';

function NewPostForm({ onCancel, onAddPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');

  function submitHandler(event) {
    event.preventDefault();  // ❗ MUST prevent default or page will reload

    const postData = {
      title: title,
      body: body,
      author: author,
    };

    onAddPost(postData);  // Send data to parent
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <p>
        <label htmlFor="title">Title</label>
        <input 
          type="text" 
          id="title" 
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </p>
      
      <p>
        <label htmlFor="body">Content</label>
        <textarea 
          id="body" 
          required 
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </p>

      <p>
        <label htmlFor="author">Author</label>
        <input 
          type="text" 
          id="author" 
          required
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </p>

      <p className={classes.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Submit</button>
      </p>
    </form>
  );
}

export default NewPostForm;
```

### Controlled vs Uncontrolled Components

**Controlled Component** (React manages the value):
```jsx
// The input's value is controlled by React state
<input 
  value={name}                                    // React controls the value
  onChange={(e) => setName(e.target.value)}        // Every keystroke updates state
/>
```

**Uncontrolled Component** (DOM manages the value):
```jsx
// You read the value only when you need it (e.g., on submit)
const nameRef = useRef();

<input ref={nameRef} />

// Later:
const value = nameRef.current.value;
```

> **Recommendation:** Use **controlled components** (with `useState`) for most cases.

---

## 20. Updating State Based on Previous State

### The Problem with Direct State Updates

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    // ❌ WRONG — These don't stack! React batches state updates.
    setCount(count + 1);  // count is still 0 here
    setCount(count + 1);  // count is still 0 here
    setCount(count + 1);  // count is still 0 here
    // Result: count becomes 1, NOT 3!
  }
}
```

### The Solution: Functional State Updates

When your new state depends on the **previous state**, always use the **function form** of the setter.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    // ✅ CORRECT — Use a function that receives the previous state
    setCount((prevCount) => prevCount + 1);  // 0 + 1 = 1
    setCount((prevCount) => prevCount + 1);  // 1 + 1 = 2
    setCount((prevCount) => prevCount + 1);  // 2 + 1 = 3
    // Result: count becomes 3 ✅
  }
}
```

### When to Use Functional Updates

| Situation | Use | Example |
|---|---|---|
| New value **depends on** old value | ✅ Function form | `setCount(prev => prev + 1)` |
| New value is **independent** | Either works | `setName('Alice')` |
| Toggling a boolean | ✅ Function form | `setIsOpen(prev => !prev)` |
| Adding to an array | ✅ Function form | `setItems(prev => [...prev, newItem])` |
| Removing from an array | ✅ Function form | `setItems(prev => prev.filter(...))` |
| Updating an object | ✅ Function form | `setUser(prev => ({...prev, name: 'Bob'}))` |

### Common Patterns

```jsx
// Toggle boolean
setIsOpen((prev) => !prev);

// Add item to array
setPosts((prevPosts) => [newPost, ...prevPosts]);

// Remove item from array
setPosts((prevPosts) => prevPosts.filter(post => post.id !== idToRemove));

// Update item in array
setPosts((prevPosts) => 
  prevPosts.map(post => 
    post.id === idToUpdate ? { ...post, title: 'Updated!' } : post
  )
);

// Update object property
setUser((prevUser) => ({ ...prevUser, name: 'New Name' }));
```

---

## 21. Outputting List Data

### Rendering Arrays with `.map()`

To render a list of data, use JavaScript's `.map()` method to transform each data item into a JSX element.

```jsx
function PostList({ posts }) {
  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>       {/* key is REQUIRED! */}
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <span>By: {post.author}</span>
        </li>
      ))}
    </ul>
  );
}
```

### Using a Child Component in the List

```jsx
function PostList({ posts }) {
  return (
    <ul className="posts">
      {posts.map((post) => (
        <Post 
          key={post.id}           // key goes on the outermost element in map
          title={post.title} 
          body={post.body} 
          author={post.author} 
        />
      ))}
    </ul>
  );
}
```

### The `key` Prop — Why It's Essential

The `key` prop helps React **identify which items have changed, been added, or been removed**. Without it, React has to re-render the entire list.

```jsx
// ✅ Use a unique identifier (id, slug, etc.)
{posts.map((post) => <Post key={post.id} {...post} />)}

// ⚠️ Use index ONLY as a last resort (when list never changes order)
{posts.map((post, index) => <Post key={index} {...post} />)}

// ❌ NEVER: no key at all (React will warn you)
{posts.map((post) => <Post {...post} />)}
```

### Handling Empty Lists

```jsx
function PostList({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <h2>There are no posts yet.</h2>
        <p>Start adding some!</p>
      </div>
    );
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <Post key={post.id} title={post.title} body={post.body} />
      ))}
    </ul>
  );
}
```

### Spread Props Shorthand

```jsx
// Instead of listing every prop individually:
<Post title={post.title} body={post.body} author={post.author} />

// You can spread the entire object:
<Post {...post} />
// This passes all properties of the post object as individual props
```

---

## 22. Adding a Backend to the React SPA

### Why Do We Need a Backend?

React runs in the **browser** (client-side). To **persist data** (save it permanently), we need a **backend server** with a **database**.

```
┌──────────────┐     HTTP Requests      ┌──────────────┐
│              │  ────────────────────→ │              │
│   React App  │                        │   Backend    │
│  (Frontend)  │  ←──────────────────── │   Server     │
│   Browser    │     HTTP Responses     │  + Database  │
└──────────────┘                        └──────────────┘
```

### Setting Up a Simple Backend

In the course, a simple **Node.js/Express** backend is provided:

```
project/
├── frontend/        ← React app (Vite)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/         ← Node.js server
    ├── app.js
    ├── package.json
    └── data/
        └── posts.json
```

**Backend setup:**
```bash
cd backend
npm install
node app.js    # Starts the backend server on port 8080
```

**Simple Express backend (app.js):**
```javascript
const express = require('express');
const fs = require('fs');
const app = express();

// Enable CORS (allow frontend to talk to backend)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());  // Parse JSON request bodies

// GET endpoint — fetch all posts
app.get('/posts', async (req, res) => {
  const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf-8'));
  res.json({ posts });
});

// POST endpoint — create a new post
app.post('/posts', async (req, res) => {
  const { title, body, author } = req.body;
  const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf-8'));
  const newPost = { id: Date.now().toString(), title, body, author };
  posts.push(newPost);
  fs.writeFileSync('./data/posts.json', JSON.stringify(posts));
  res.status(201).json({ post: newPost });
});

app.listen(8080, () => console.log('Backend running on port 8080'));
```

---

## 23. Sending a POST HTTP Request

### Using `fetch()` to Send Data

```jsx
async function addPostHandler(postData) {
  // Send the data to the backend
  const response = await fetch('http://localhost:8080/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',  // Tell server we're sending JSON
    },
    body: JSON.stringify(postData),         // Convert JS object to JSON string
  });

  const data = await response.json();  // Parse the response
  console.log('Post created:', data);
}
```

### Integrating with the App

```jsx
function App() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function addPostHandler(postData) {
    // 1. Send to backend
    await fetch('http://localhost:8080/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    // 2. Update local state (optimistic update)
    setPosts((prevPosts) => [postData, ...prevPosts]);

    // 3. Close the modal
    setIsModalOpen(false);
  }

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NewPostForm onAddPost={addPostHandler} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <PostList posts={posts} />
    </>
  );
}
```

### Understanding HTTP Methods

| Method | Purpose | Example |
|---|---|---|
| `GET` | Read/Fetch data | Get all posts |
| `POST` | Create new data | Create a new post |
| `PUT`/`PATCH` | Update existing data | Edit a post |
| `DELETE` | Delete data | Remove a post |

---

## 24. Handling Side Effects with `useEffect()`

### What Is a Side Effect?

A **side effect** is any operation that happens **outside of rendering the UI**. Examples:

- Fetching data from an API
- Setting up a timer/interval
- Manually changing the DOM
- Subscribing to events
- Writing to local storage

### The Problem

```jsx
function PostList() {
  const [posts, setPosts] = useState([]);

  // ❌ WRONG — This causes an INFINITE LOOP!
  fetch('http://localhost:8080/posts')
    .then(res => res.json())
    .then(data => setPosts(data.posts));
  // Why infinite loop?
  // 1. Component renders
  // 2. fetch runs → setPosts called
  // 3. State changes → component re-renders
  // 4. fetch runs again → setPosts called again
  // 5. Re-render → fetch → setPosts → re-render... forever!

  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
}
```

### The Solution: `useEffect()`

```jsx
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  // ✅ CORRECT — useEffect controls WHEN the side effect runs
  useEffect(() => {
    // This code runs AFTER the component renders
    async function fetchPosts() {
      const response = await fetch('http://localhost:8080/posts');
      const data = await response.json();
      setPosts(data.posts);
    }

    fetchPosts();
  }, []);  // ← Empty dependency array = run ONLY ONCE (on first render)

  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
}
```

### `useEffect` Syntax

```jsx
useEffect(
  () => {
    // Side effect code goes here
  },
  [dependency1, dependency2]  // Dependency array
);
```

### Dependency Array Behavior

| Dependency Array | When Effect Runs |
|---|---|
| `[]` (empty) | **Once** — after the first render only |
| `[value]` | After first render AND whenever `value` changes |
| `[a, b]` | After first render AND whenever `a` OR `b` changes |
| No array (omitted) | After **every** render (usually not what you want) |

### Examples

```jsx
// Run once on mount (fetch initial data)
useEffect(() => {
  fetchData();
}, []);

// Run when searchTerm changes (search functionality)
useEffect(() => {
  const results = filterItems(searchTerm);
  setFilteredItems(results);
}, [searchTerm]);

// Run when userId changes (fetch user-specific data)
useEffect(() => {
  fetchUserProfile(userId);
}, [userId]);
```

### Cleanup Function

Some effects need cleanup (e.g., removing event listeners, clearing timers):

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup function — runs when component unmounts
  // or before the effect runs again
  return () => {
    clearInterval(timer);
  };
}, []);
```

---

## 25. Handle Loading State

### Showing a Loading Indicator

While data is being fetched, you should show the user that something is happening.

```jsx
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Start as loading
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        
        const response = await fetch('http://localhost:8080/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);  // Stop loading regardless of success/failure
      }
    }

    fetchPosts();
  }, []);

  // Conditional rendering based on state
  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading posts...</p>
        {/* You could also show a spinner component here */}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p>No posts found. Start creating some!</p>;
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ul>
  );
}
```

### State Machine Pattern

```
          ┌──────────┐
          │ LOADING  │  ← Initial state
          └────┬─────┘
               │
        ┌──────┴──────┐
        ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ SUCCESS  │   │  ERROR   │
  │ (data)   │   │ (message)│
  └──────────┘   └──────────┘
```

---

## 26. Understanding & Adding Routing

### What Is Routing?

In a **Single Page Application (SPA)**, you have only one HTML file. **Routing** creates the illusion of multiple pages by:

1. Changing the URL in the browser's address bar
2. Rendering different components based on the URL
3. **Without** actually loading a new page from the server

```
URL: /              → Renders <HomePage />
URL: /posts         → Renders <PostsPage />
URL: /posts/123     → Renders <PostDetailPage />
URL: /about         → Renders <AboutPage />
```

### Installing React Router

```bash
npm install react-router-dom
```

### React Router v6 — Core Concepts

| Concept | What It Does |
|---|---|
| `<BrowserRouter>` | Provides routing context to the app |
| `<Routes>` | Container for all route definitions |
| `<Route>` | Maps a URL path to a component |
| `<Link>` | Creates navigation links (replaces `<a>`) |
| `<NavLink>` | Like Link but adds active styling |
| `<Outlet>` | Renders child routes (for nested layouts) |
| `useNavigate()` | Navigate programmatically |
| `useParams()` | Access URL parameters |
| `loader()` | Fetch data before rendering a route |
| `action()` | Handle form submissions for a route |

---

## 27. Adding Routes

### Basic Route Setup (Modern Approach with `createBrowserRouter`)

```jsx
// main.jsx (or App.jsx)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/posts',
    element: <PostsPage />,
  },
  {
    path: '/posts/:id',         // Dynamic segment
    element: <PostDetailPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

### Alternative: Classic JSX Route Setup

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Page Components

```jsx
// pages/HomePage.jsx
function HomePage() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <p>Browse our latest posts!</p>
    </div>
  );
}

export default HomePage;
```

```
src/
├── pages/              ← Route-level components (pages)
│   ├── HomePage.jsx
│   ├── PostsPage.jsx
│   └── PostDetailPage.jsx
├── components/         ← Reusable UI components
│   ├── Post.jsx
│   ├── PostList.jsx
│   └── Modal.jsx
└── main.jsx
```

---

## 28. Working with Layout Routes

### What Are Layout Routes?

A **layout route** wraps multiple child routes with a **shared layout** (header, sidebar, footer). The child routes render inside the layout using the `<Outlet>` component.

```
┌──────────────────────────────────┐
│          HEADER (shared)         │
├──────────────────────────────────┤
│                                  │
│       <Outlet />                 │  ← Child route renders here
│   (different page content)       │
│                                  │
├──────────────────────────────────┤
│          FOOTER (shared)         │
└──────────────────────────────────┘
```

### Creating a Layout

```jsx
// components/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';

function RootLayout() {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />   {/* Child route components render here */}
      </main>
      <footer>
        <p>© 2024 My Blog</p>
      </footer>
    </>
  );
}

export default RootLayout;
```

### Using Layout Routes in Route Config

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,    // Layout wraps all children
    children: [
      {
        path: '/',               // www.example.com/
        element: <HomePage />,
      },
      {
        path: '/posts',          // www.example.com/posts
        element: <PostsPage />,
      },
      {
        path: '/posts/:id',      // www.example.com/posts/123
        element: <PostDetailPage />,
      },
    ],
  },
]);
```

### Nested Layouts

You can have **layouts inside layouts**:

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,          // Main layout (header + footer)
    children: [
      { index: true, element: <HomePage /> },   // index route = default child
      {
        path: 'posts',
        element: <PostsLayout />,      // Posts-specific layout
        children: [
          { index: true, element: <PostsPage /> },
          { path: ':id', element: <PostDetailPage /> },
        ],
      },
    ],
  },
]);
```

---

## 29. Refactoring Route Components & More Nesting

### Index Routes

An **index route** is the default child route that renders when the parent path matches exactly.

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { 
        index: true,              // Renders at "/" (the parent's path)
        element: <HomePage /> 
      },
      { 
        path: 'posts',            // Renders at "/posts"
        element: <PostsPage />,
        children: [
          {
            path: ':id',          // Renders at "/posts/:id"
            element: <PostDetailPage />
          }
        ]
      },
    ],
  },
]);
```

### Organizing Pages

```
src/
├── pages/
│   ├── HomePage.jsx
│   ├── PostsPage.jsx
│   ├── PostDetailPage.jsx
│   └── NewPostPage.jsx
├── components/
│   ├── layouts/
│   │   └── RootLayout.jsx
│   ├── Post.jsx
│   ├── PostList.jsx
│   ├── NewPostForm.jsx
│   └── Modal.jsx
└── main.jsx
```

---

## 30. Linking & Navigating

### `<Link>` Component (Replaces `<a>`)

```jsx
import { Link } from 'react-router-dom';

function MainHeader() {
  return (
    <header>
      <nav>
        <ul>
          {/* ❌ DON'T use <a> — it causes a full page reload */}
          <li><a href="/posts">Posts</a></li>

          {/* ✅ USE <Link> — it navigates without reloading */}
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
}
```

### `<NavLink>` Component (Active Styling)

`NavLink` is like `Link` but automatically adds an "active" class when the link matches the current URL.

```jsx
import { NavLink } from 'react-router-dom';
import classes from './MainHeader.module.css';

function MainHeader() {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? classes.active : undefined
              }
              end  // "end" means exact match only for "/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/posts" 
              className={({ isActive }) => 
                isActive ? classes.active : undefined
              }
            >
              Posts
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

### Programmatic Navigation with `useNavigate()`

Sometimes you need to navigate **from code** (not from a link click), for example after submitting a form.

```jsx
import { useNavigate } from 'react-router-dom';

function NewPostForm() {
  const navigate = useNavigate();

  async function submitHandler(event) {
    event.preventDefault();
    
    // ... send data to backend ...

    // Navigate to /posts after successful submission
    navigate('/posts');
    
    // Or go back to the previous page:
    // navigate(-1);
    
    // Or replace history (user can't go back):
    // navigate('/posts', { replace: true });
  }

  return (
    <form onSubmit={submitHandler}>
      {/* ... form fields ... */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Navigation Summary

| Method | Use Case |
|---|---|
| `<Link to="/path">` | Basic navigation link |
| `<NavLink to="/path">` | Link with active state styling |
| `useNavigate()` | Navigate from code (after form submit, timeout, etc.) |
| `navigate(-1)` | Go back one step |
| `navigate(1)` | Go forward one step |
| `navigate('/path', { replace: true })` | Navigate without adding to history |

---

## 31. Data Fetching via `loader()`s

### What Are Loaders?

React Router v6.4+ introduced **loaders** — functions that **fetch data BEFORE a route component renders**. This eliminates the need for `useEffect` + loading states in many cases.

```
Traditional (without loader):
1. Navigate to /posts
2. PostsPage renders (empty)
3. useEffect fires
4. Show loading spinner
5. Data arrives
6. Re-render with data

With loader:
1. Navigate to /posts
2. Loader function runs (fetches data)
3. Data arrives
4. PostsPage renders WITH data already available
```

### Defining a Loader

```jsx
// pages/PostsPage.jsx
import { useLoaderData } from 'react-router-dom';
import PostList from '../components/PostList';

function PostsPage() {
  // useLoaderData() gives you the data returned by the loader
  const data = useLoaderData();
  const posts = data.posts;

  return <PostList posts={posts} />;
}

export default PostsPage;

// The loader function — defined in the same file or separately
export async function loader() {
  const response = await fetch('http://localhost:8080/posts');
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const data = await response.json();
  return data;  // This data is available via useLoaderData()
}
```

### Connecting the Loader to the Route

```jsx
// main.jsx
import PostsPage, { loader as postsLoader } from './pages/PostsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'posts',
        element: <PostsPage />,
        loader: postsLoader,       // ← Connect the loader here
      },
    ],
  },
]);
```

### Benefits of Loaders

| Benefit | Explanation |
|---|---|
| **No loading state needed** | Data is ready when the component renders |
| **No useEffect** | Simpler component code |
| **Parallel loading** | Multiple loaders can run simultaneously |
| **Error handling** | Built-in error boundaries |
| **Better UX** | React Router can show a loading indicator automatically |

---

## 32. Submitting Data with `action()`s

### What Are Actions?

**Actions** are the counterpart to loaders — they handle **data mutations** (POST, PUT, DELETE requests). They run when a form is submitted.

### Using React Router's `<Form>` Component

```jsx
// pages/NewPostPage.jsx
import { Form, redirect } from 'react-router-dom';
import classes from './NewPostPage.module.css';

function NewPostPage() {
  return (
    // Use React Router's <Form> instead of regular <form>
    // method="post" tells the action what HTTP method to use
    <Form method="post" className={classes.form}>
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="body">Content</label>
        <textarea id="body" name="body" required rows={3} />
      </p>
      <p>
        <label htmlFor="author">Author</label>
        <input type="text" id="author" name="author" required />
      </p>
      <button type="submit">Create Post</button>
    </Form>
  );
}

export default NewPostPage;

// The action function
export async function action({ request }) {
  // React Router automatically collects form data
  const formData = await request.formData();
  
  const postData = {
    title: formData.get('title'),
    body: formData.get('body'),
    author: formData.get('author'),
  };

  // Send data to backend
  const response = await fetch('http://localhost:8080/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  // Redirect to posts page after successful creation
  return redirect('/posts');
}
```

### Connecting the Action to the Route

```jsx
import NewPostPage, { action as newPostAction } from './pages/NewPostPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'posts',
        element: <PostsPage />,
        loader: postsLoader,
        children: [
          {
            path: 'new',
            element: <NewPostPage />,
            action: newPostAction,      // ← Connect the action here
          },
        ],
      },
    ],
  },
]);
```

### Key Points About Actions

```
User submits <Form> → action() runs → sends HTTP request → redirect

Regular <form>:   Browser sends request → page reloads
React Router <Form>:  React Router intercepts → calls action() → no page reload
```

| Feature | Loader | Action |
|---|---|---|
| Purpose | **Read** data | **Write/mutate** data |
| When it runs | When navigating TO a route | When a `<Form>` is submitted |
| HTTP method | Usually GET | POST, PUT, PATCH, DELETE |
| How to access data | `useLoaderData()` | `useActionData()` |
| Return value | Data for the component | `redirect()` or response data |

---

## 33. Dynamic Routes

### What Are Dynamic Routes?

Dynamic routes have **segments that change** based on the data. For example, each post has a unique ID:

```
/posts/1        → Post with ID 1
/posts/2        → Post with ID 2
/posts/abc123   → Post with ID abc123
```

### Defining Dynamic Routes

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'posts',
        element: <PostsPage />,
        loader: postsLoader,
      },
      {
        path: 'posts/:postId',        // ← :postId is the dynamic segment
        element: <PostDetailPage />,
        loader: postDetailLoader,
      },
    ],
  },
]);
```

### Accessing Dynamic Parameters

#### In a Component (with `useParams`)

```jsx
import { useParams } from 'react-router-dom';

function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;  // Matches the :postId in the route definition

  return <h1>Showing post: {postId}</h1>;
}
```

#### In a Loader (with `params` argument)

```jsx
// pages/PostDetailPage.jsx
import { useLoaderData } from 'react-router-dom';

function PostDetailPage() {
  const post = useLoaderData();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>By: {post.author}</p>
    </div>
  );
}

export default PostDetailPage;

// The loader receives { request, params } automatically
export async function loader({ params }) {
  const postId = params.postId;  // Access the dynamic segment
  
  const response = await fetch(`http://localhost:8080/posts/${postId}`);
  
  if (!response.ok) {
    throw new Error('Could not fetch post details');
  }
  
  const data = await response.json();
  return data.post;
}
```

### Linking to Dynamic Routes

```jsx
import { Link } from 'react-router-dom';

function Post({ id, title, body }) {
  return (
    <li>
      <Link to={`/posts/${id}`}>    {/* Dynamic link */}
        <h3>{title}</h3>
        <p>{body}</p>
      </Link>
    </li>
  );
}

// Or using relative paths:
function Post({ id, title, body }) {
  return (
    <li>
      <Link to={id}>    {/* Relative to current route */}
        <h3>{title}</h3>
        <p>{body}</p>
      </Link>
    </li>
  );
}
```

---

## 34. React Context (Legacy Section)

### What Is React Context?

**Context** provides a way to pass data through the component tree **without having to pass props down manually at every level**. It solves the **"prop drilling"** problem.

### The Prop Drilling Problem

```
App (has user data)
 └── Layout
      └── Sidebar
           └── Navigation
                └── UserMenu (needs user data)

// Without Context: You must pass user data through EVERY component
// App → Layout → Sidebar → Navigation → UserMenu
// Even though Layout, Sidebar, and Navigation don't need the data!
```

### Creating Context

```jsx
// store/favorites-context.js
import { createContext, useState } from 'react';

// 1. Create the context with a default value
const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (meetup) => {},
  removeFavorite: (meetupId) => {},
  isFavorite: (meetupId) => {},
});

// 2. Create a Provider component
export function FavoritesContextProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  function addFavoriteHandler(meetup) {
    setFavorites((prevFavorites) => [...prevFavorites, meetup]);
  }

  function removeFavoriteHandler(meetupId) {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((meetup) => meetup.id !== meetupId)
    );
  }

  function isFavoriteHandler(meetupId) {
    return favorites.some((meetup) => meetup.id === meetupId);
  }

  const context = {
    favorites: favorites,
    totalFavorites: favorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    isFavorite: isFavoriteHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
```

### Providing Context

```jsx
// main.jsx or App.jsx
import { FavoritesContextProvider } from './store/favorites-context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <FavoritesContextProvider>
    <App />
  </FavoritesContextProvider>
);
```

### Consuming Context

```jsx
// Any component, no matter how deeply nested
import { useContext } from 'react';
import FavoritesContext from '../store/favorites-context';

function MeetupItem({ id, title, image, address, description }) {
  const favoritesCtx = useContext(FavoritesContext);

  const isFavorite = favoritesCtx.isFavorite(id);

  function toggleFavoriteHandler() {
    if (isFavorite) {
      favoritesCtx.removeFavorite(id);
    } else {
      favoritesCtx.addFavorite({ id, title, image, address, description });
    }
  }

  return (
    <li>
      <h3>{title}</h3>
      <button onClick={toggleFavoriteHandler}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </li>
  );
}
```

### Displaying Context Data in Header

```jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import FavoritesContext from '../store/favorites-context';

function MainNavigation() {
  const favoritesCtx = useContext(FavoritesContext);

  return (
    <header>
      <nav>
        <Link to="/">All Meetups</Link>
        <Link to="/favorites">
          Favorites ({favoritesCtx.totalFavorites})
        </Link>
      </nav>
    </header>
  );
}
```

### Context vs Props vs State

| Feature | Props | State | Context |
|---|---|---|---|
| **Scope** | Parent → direct child | Within a component | Any component in tree |
| **Direction** | Top-down only | Within component | Global-like |
| **Use for** | Configuring child components | Managing component data | Shared/global data |
| **Prop drilling?** | Can cause it | N/A | Solves it |
| **Examples** | Button label, item data | Form inputs, toggles | Auth, theme, cart |

---

## 35. Module Summary

### Everything We Learned — Quick Reference

```
React Fundamentals
├── Components (building blocks of UI)
├── JSX (HTML-like syntax in JavaScript)
├── Props (passing data parent → child)
├── State (useState — reactive data)
├── Events (onClick, onChange, onSubmit)
├── Conditional Rendering (&& and ternary)
├── List Rendering (.map() with key)
├── CSS Modules (scoped styles)
├── children prop (wrapper/layout components)
├── Lifting State Up (shared state in parent)
└── Updating state based on previous state

Side Effects
├── useEffect() (fetching data, timers, etc.)
├── Dependency array (controls when effect runs)
└── Cleanup function

HTTP Requests
├── fetch() API
├── GET requests (reading data)
├── POST requests (creating data)
└── Loading & error states

Routing (React Router v6)
├── createBrowserRouter
├── Route definitions (path + element)
├── Layout routes (Outlet)
├── Link & NavLink
├── useNavigate (programmatic navigation)
├── Dynamic routes (:param)
├── useParams
├── loader() — data fetching
├── action() — data mutations
└── redirect()

State Management
├── useState (component-level)
├── Lifting state up (sharing between siblings)
└── React Context (app-wide state, avoiding prop drilling)
```

### React Data Flow Cheat Sheet

```
              ┌─────────────┐
              │    Context   │ ← App-wide shared data
              └──────┬───────┘
                     │ useContext()
              ┌──────▼───────┐
              │   Parent     │
              │ Component    │
              │  [state]     │
              └──┬───────┬───┘
        props ↓         ↓ props (function)
    ┌─────────┐    ┌─────────┐
    │ Child A │    │ Child B │
    │(display)│    │ (form)  │
    └─────────┘    └─────────┘
                        │
                  calls prop function
                  (data flows UP)
```

---

## 🔑 Key Hooks Summary

| Hook | Purpose | Example |
|---|---|---|
| `useState` | Manage reactive state | `const [val, setVal] = useState(init)` |
| `useEffect` | Handle side effects | `useEffect(() => {...}, [deps])` |
| `useContext` | Access context data | `const ctx = useContext(MyContext)` |
| `useNavigate` | Navigate programmatically | `const nav = useNavigate()` |
| `useParams` | Access URL parameters | `const { id } = useParams()` |
| `useLoaderData` | Access loader data | `const data = useLoaderData()` |

---

## 📝 Common Patterns Cheat Sheet

```jsx
// 1. Fetch data on mount
useEffect(() => {
  fetch(url).then(r => r.json()).then(setData);
}, []);

// 2. Conditional rendering
{isLoading && <Spinner />}
{!isLoading && data && <DataView data={data} />}
{error && <ErrorMsg message={error} />}

// 3. Form handling
<form onSubmit={(e) => { e.preventDefault(); /* handle */ }}>
  <input value={val} onChange={(e) => setVal(e.target.value)} />
</form>

// 4. List rendering
{items.map(item => <Item key={item.id} {...item} />)}

// 5. Toggle state
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);

// 6. Add to array
setItems(prev => [...prev, newItem]);

// 7. Remove from array
setItems(prev => prev.filter(item => item.id !== targetId));
```

---

> **🎯 Tip:** These notes cover the complete React refresher module. The rest of the course builds on these foundations to teach **Next.js**, which adds server-side rendering, file-based routing, API routes, and more on top of React.