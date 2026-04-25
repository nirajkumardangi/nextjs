# 📘 Module 8: Next.js App Optimizations

---

## Table of Contents

1. [Module Introduction](#1-module-introduction)
2. [Using the Next.js Image Component](#2-using-the-nextjs-image-component)
3. [Understanding the Next.js Image Component](#3-understanding-the-nextjs-image-component)
4. [Controlling the Image Size](#4-controlling-the-image-size)
5. [Working with Priority Images & More Settings](#5-working-with-priority-images--more-settings)
6. [Loading Unknown Images](#6-loading-unknown-images)
7. [Configuring CSS For Images With The "fill" Prop](#7-configuring-css-for-images-with-the-fill-prop)
8. [Using An Image Loader & Cloudinary Resizing](#8-using-an-image-loader--cloudinary-resizing)
9. [Page Metadata - An Introduction](#9-page-metadata---an-introduction)
10. [Configuring Static Page Metadata](#10-configuring-static-page-metadata)
11. [Configuring Dynamic Page Metadata](#11-configuring-dynamic-page-metadata)
12. [Understanding Layout Metadata](#12-understanding-layout-metadata)
13. [Module Summary](#13-module-summary)

---

## 1. Module Introduction

### Why Optimization Matters

Building a working app is one thing — building a **fast, performant, SEO-friendly** app is another. This module covers the built-in optimization tools Next.js provides, which would otherwise require significant manual effort.

> **Think about it this way:** You could hand-optimize every image yourself — compress it, serve different sizes to different devices, convert to WebP, add lazy loading. Or you could let Next.js do all of that automatically with one component. That's what this module is about — letting Next.js do the heavy lifting.

```
Without Optimization:                  With Next.js Optimization:
─────────────────────                  ──────────────────────────
❌ Large images = slow load            ✅ Automatic compression
❌ Same image for all devices          ✅ Responsive sizes
❌ Old formats (JPEG, PNG)             ✅ Modern formats (WebP, AVIF)
❌ Images load immediately             ✅ Lazy loading (load when visible)
❌ Layout shift as images load         ✅ Space reserved (no CLS)
❌ No SEO metadata                     ✅ Rich metadata for search engines
❌ Poor social media previews          ✅ Open Graph tags
```

### What You'll Learn

```
Module 8 Topics:
┌────────────────────────────────────────────────────────┐
│                                                         │
│  Image Optimization                                     │
│  ├── The <Image> component                              │
│  ├── Local vs remote images                             │
│  ├── Controlling size (width, height, fill)             │
│  ├── Priority loading (LCP optimization)                │
│  ├── Unknown dimension images                           │
│  ├── Custom image loaders                               │
│  └── Cloudinary integration                             │
│                                                         │
│  Metadata & SEO                                         │
│  ├── Static metadata (export const metadata)            │
│  ├── Dynamic metadata (generateMetadata function)       │
│  └── Layout metadata inheritance                        │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Using the Next.js Image Component

### Why Not Just Use `<img>`?

The native HTML `<img>` tag works — but it has significant performance drawbacks that directly impact your app's speed and user experience.

```html
<!-- ❌ Regular HTML img tag — no optimization -->
<img src="/images/hero.jpg" alt="Hero image" />

Problems with <img />: ├── Loads the FULL SIZE image (could be 5MB!) ├── Loads
even when off-screen (wasted bandwidth) ├── Doesn't automatically use modern
formats (WebP, AVIF) ├── No built-in responsive sizing ├── No blur placeholder
while loading └── Can cause Cumulative Layout Shift (CLS) — content jumps
```

### Using Next.js `<Image>` Component

```jsx
// ✅ Next.js Image component — fully optimized
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <Image
        src="/images/hero.jpg" // Path to image in public/ folder
        alt="Hero image" // REQUIRED for accessibility
        width={800} // Display width in pixels
        height={600} // Display height in pixels
      />
    </div>
  );
}
```

### What `<Image>` Does Automatically

```
The Next.js <Image> component automatically:

1. Resizes images
   └── Serves the RIGHT SIZE for each device
       Mobile: smaller image → faster download
       Desktop: larger image → higher quality

2. Converts format
   └── Converts to WebP or AVIF (modern formats)
       JPEG 500KB → WebP 150KB (70% smaller, same quality!)

3. Lazy loading
   └── Images off-screen are NOT loaded until user scrolls to them
       Saves bandwidth, speeds up initial page load

4. Prevents Layout Shift (CLS)
   └── Reserves the exact space for the image BEFORE it loads
       Content doesn't jump around as images appear

5. On-demand optimization
   └── Images are optimized when FIRST requested, then CACHED
       Not during build time — scales to any number of images
```

---

## 3. Understanding the Next.js Image Component

### Two Types of Images

Next.js `<Image>` handles two fundamentally different scenarios:

```
Type 1: LOCAL Images (in your project)
├── Stored in the public/ folder
├── OR imported as JavaScript modules
└── Next.js KNOWS the dimensions at build time

Type 2: REMOTE Images (from URLs)
├── Stored on external servers (Cloudinary, S3, CDN)
├── Or from your own API
└── Next.js does NOT know the dimensions beforehand
```

### Local Images — Two Ways to Use

#### Method 1: Public Folder Reference

```jsx
// Image stored at: public/images/hero.jpg
import Image from "next/image";

export default function HeroSection() {
  return (
    <Image
      src="/images/hero.jpg" // Path relative to public/
      alt="Hero section image"
      width={1200}
      height={600}
    />
  );
}
```

#### Method 2: Direct Import (Recommended for Local Images)

```jsx
// Import the image like a module
import Image from "next/image";
import heroImage from "@/public/images/hero.jpg";
// OR
import heroImage from "../public/images/hero.jpg";

export default function HeroSection() {
  return (
    <Image
      src={heroImage} // ← Pass the imported object (not a string)
      alt="Hero section image"
      // NO width/height needed! Next.js reads them from the imported file
    />
  );
}
```

**Why import is better:**

```
With public/ path string:
  src="/images/hero.jpg"
  → You MUST manually provide width and height
  → If you type the wrong path, you only find out at runtime
  → No TypeScript checking

With import:
  src={heroImage}
  → Width and height are AUTOMATICALLY detected (from the file)
  → If the file doesn't exist, build FAILS immediately
  → TypeScript can check it
  → Better developer experience!
```

### Remote Images

```jsx
// For images from external URLs, you MUST provide width and height
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl} // "https://cloudinary.com/..."
      alt={product.name}
      width={400} // REQUIRED for remote images
      height={300} // REQUIRED for remote images
    />
  );
}
```

### Security: Configuring Allowed Remote Domains

For remote images, Next.js requires you to **whitelist the allowed domains** in `next.config.js`. This prevents attackers from using your image optimization server to process arbitrary URLs.

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com", // AWS S3
        pathname: "/my-bucket/**", // Specific bucket only
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## 4. Controlling the Image Size

### The `width` and `height` Props

These props tell Next.js the **intended display size** of the image:

```jsx
// These set the DISPLAY size (CSS layout size)
// NOT necessarily the actual file dimensions
<Image
  src="/images/photo.jpg"
  alt="Photo"
  width={800} // Display width: 800px
  height={600} // Display height: 600px
/>
```

> **Important:** `width` and `height` set the ASPECT RATIO and BASE SIZE. They control how much space the image takes in the layout, but the actual file served might be larger or smaller depending on the user's screen.

### How Next.js Serves Different Sizes

Next.js is smart about serving the right image size. Internally, it generates multiple versions:

```
You set: width={800} height={600}

Next.js generates and serves:
├── 320px wide version → for small mobile screens
├── 640px wide version → for larger mobile screens
├── 800px wide version → for the exact specified size
├── 1200px wide version → for high-DPI (Retina) displays
└── More as needed...

On a 375px mobile: Serves 320px image (tiny file = fast!)
On a 1440px desktop: Serves 800px image (right size)
On a 2880px Retina: Serves 1200px image (crisp quality)
```

### Responsive Images with `sizes`

For images that change size based on viewport, use the `sizes` prop:

```jsx
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // On mobile: takes 100% of viewport width
  // On tablet: takes 50% of viewport width
  // On desktop: takes 33% of viewport width
/>
```

### Aspect Ratio Enforcement

The `width` and `height` props also enforce the **aspect ratio**:

```jsx
// If your CSS makes the image smaller, the aspect ratio is preserved
<Image
  src="/images/portrait.jpg"
  alt="Portrait"
  width={400}
  height={600} // 2:3 aspect ratio locked in
  style={{ width: "200px", height: "auto" }} // Scale down but keep ratio
/>
```

### Using `style` vs `className`

```jsx
// ✅ Using className with CSS Modules
import classes from './product.module.css';

<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={200}
  className={classes.productImage}
/>

// ✅ Using inline style
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={200}
  style={{
    width: '100%',
    height: 'auto',    // Maintain aspect ratio
    borderRadius: '8px',
    objectFit: 'cover',
  }}
/>
```

---

## 5. Working with Priority Images & More Settings

### The `priority` Prop — Critical for Performance

The `priority` prop tells Next.js that this image is **critically important** and should be loaded as soon as possible — without lazy loading.

```jsx
// Hero image — always above the fold, should load immediately
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority    // ← Load this image immediately (no lazy loading)
/>

// Product image in a list — can be lazy loaded (default)
<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={200}
  // No priority — lazy loaded when it enters the viewport
/>
```

### Why `priority` Matters: The LCP Metric

```
LCP = Largest Contentful Paint
    = The time it takes for the largest visible element to appear

Web Performance Goal: LCP < 2.5 seconds

Common Issue:
  Hero image is the largest element on the page
  Without priority, it's lazy loaded
  Lazy loading delays LCP!
  Google Core Web Vitals score suffers

Solution:
  Add priority to the hero image
  It loads eagerly (immediately)
  LCP improves dramatically
```

### When to Use `priority`

```
✅ Use priority for:
├── Hero/banner images (above the fold)
├── Logo in header (always visible)
├── Product images on product pages (main content)
└── Any image that is visible WITHOUT scrolling

❌ Don't use priority for:
├── Images in scrollable lists
├── Images below the fold
├── Gallery images
└── Most list item images
```

### Other Important Settings

```jsx
<Image
  src="/images/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  // Quality: 1-100, default is 75
  // Higher = better looking but larger file
  quality={90} // For hero images where quality matters
  quality={50} // For thumbnails where size matters more
  // Placeholder: 'blur' shows a blurred version while loading
  placeholder="blur"
  blurDataURL="data:image/..." // Required if using 'blur' with remote images
  // For imported local images, blurDataURL is automatic
  // For remote images, you must provide blurDataURL yourself

  // Unoptimized: Skip all Next.js optimization (rarely needed)
  unoptimized={false} // Default: false (optimization is ON)
  // Override default loading strategy
  loading="eager" // Load immediately (same effect as priority for loading)
  loading="lazy" // Default: lazy load
/>
```

### The Blur Placeholder

```jsx
// For LOCAL imported images — blur placeholder is automatic!
import profilePhoto from '@/public/images/profile.jpg';

<Image
  src={profilePhoto}
  alt="Profile"
  width={200}
  height={200}
  placeholder="blur"  // ← Works automatically for imported images!
/>

// For REMOTE images — you must provide the blur data URL
<Image
  src="https://cloudinary.com/..."
  alt="Product"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  // This is a tiny, base64-encoded, very blurred version of the image
/>
```

---

## 6. Loading Unknown Images

### The Problem: Dynamic Images with Unknown Dimensions

Sometimes you don't know the image dimensions at code-writing time:

```
Scenarios where dimensions are unknown:
├── Images uploaded by users (any size!)
├── Images from a CMS (can be any dimensions)
├── Images from third-party APIs
└── Images from a database (stored URL, not actual file)
```

```jsx
// ❌ This won't work well — unknown dimensions!
<Image
  src={post.imageUrl}     // Could be any size!
  alt={post.title}
  width={???}             // Don't know!
  height={???}            // Don't know!
/>
```

### Solution 1: The `fill` Prop

The `fill` prop makes the image fill its **parent container**, removing the need for explicit width/height:

```jsx
// The image fills the parent container
<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <Image
    src={post.imageUrl}
    alt={post.title}
    fill // ← No width/height needed!
    style={{ objectFit: "cover" }} // How to fill the container
  />
</div>
```

### How `fill` Works

```
Without fill (normal flow):
  Image has intrinsic size → Takes its natural space in the layout

With fill:
  Image is ABSOLUTELY POSITIONED within its nearest POSITIONED ancestor
  Image fills 100% width AND 100% height of that ancestor

  Parent MUST have:
  ├── position: relative (or absolute, fixed, sticky)
  └── explicit height (or the parent won't have any height!)
```

### `objectFit` Options for `fill` Images

```css
/* How the image fills the container */
object-fit: cover     /* Fill completely, CROP if needed (most common) */
object-fit: contain   /* Fit inside WITHOUT cropping (may have empty space) */
object-fit: fill      /* Stretch to fill (distorts image) */
object-fit: none      /* No resizing (image shown at native size) */
```

```jsx
// Most common: cover (crops to fill)
<Image src={url} alt="Photo" fill style={{ objectFit: 'cover' }} />

// For product images: contain (shows full product, no crop)
<Image src={product.image} alt="Product" fill style={{ objectFit: 'contain' }} />
```

---

## 7. Configuring CSS For Images With The "fill" Prop

### The Required CSS Pattern

When using `fill`, the parent container needs specific CSS:

```jsx
// components/post-image.js
import Image from "next/image";
import classes from "./post-image.module.css";

export default function PostImage({ src, alt }) {
  return (
    <div className={classes.imageContainer}>
      <Image src={src} alt={alt} fill className={classes.image} />
    </div>
  );
}
```

```css
/* post-image.module.css */

/* Parent container — MUST have these styles */
.imageContainer {
  position: relative; /* ← REQUIRED: makes it the reference for fill */
  width: 100%; /* Width of the container */
  height: 300px; /* ← REQUIRED: explicit height (otherwise 0!) */
  overflow: hidden; /* Clips the image to the container */
  border-radius: 8px; /* Optional: rounded corners */
}

/* The image itself */
.image {
  object-fit: cover; /* Fill and crop */
  object-position: center; /* Center the image (default) */
  transition: transform 0.3s ease;
}

/* Optional: hover effect */
.imageContainer:hover .image {
  transform: scale(1.05);
}
```

### Responsive Container Heights

```css
/* Different heights for different screen sizes */
.imageContainer {
  position: relative;
  width: 100%;
  height: 200px; /* Mobile: shorter */
}

@media (min-width: 768px) {
  .imageContainer {
    height: 350px; /* Tablet: taller */
  }
}

@media (min-width: 1200px) {
  .imageContainer {
    height: 500px; /* Desktop: tallest */
  }
}
```

### Aspect Ratio Trick

Instead of fixed height, use `aspect-ratio` to maintain proportions:

```css
.imageContainer {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* Always a 16:9 ratio, regardless of width */
  /* No need to set height! aspect-ratio handles it */
}
```

```css
/* Common aspect ratios */
aspect-ratio: 16 / 9; /* Widescreen video */
aspect-ratio: 4 / 3; /* Standard photo */
aspect-ratio: 1 / 1; /* Square */
aspect-ratio: 3 / 4; /* Portrait photo */
aspect-ratio: 21 / 9; /* Ultrawide */
```

### Common Pattern: Card with Image

```jsx
// components/post-card.js
import Image from "next/image";
import Link from "next/link";
import classes from "./post-card.module.css";

export default function PostCard({ post }) {
  return (
    <article className={classes.card}>
      <div className={classes.imageWrapper}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className={classes.image}
        />
      </div>
      <div className={classes.content}>
        <h2>{post.title}</h2>
        <p>{post.summary}</p>
        <Link href={`/posts/${post.slug}`}>Read More</Link>
      </div>
    </article>
  );
}
```

```css
/* post-card.module.css */
.card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.imageWrapper {
  position: relative; /* Required for fill */
  aspect-ratio: 16 / 9; /* Responsive proportional height */
  overflow: hidden;
}

.image {
  object-fit: cover; /* Fill and crop to fit */
  transition: transform 0.3s ease;
}

.card:hover .image {
  transform: scale(1.05); /* Subtle zoom on hover */
}

.content {
  padding: 1.5rem;
}
```

---

## 8. Using An Image Loader & Cloudinary Resizing

### What Is an Image Loader?

By default, Next.js optimizes images using its own built-in optimization server. But you can replace this with a **custom image loader** — a function that generates the image URL.

> **Mental model:** Think of the loader as a URL factory. Instead of "give me this image," you say "give me this image at 800px wide in WebP format" — and the loader builds the URL that serves exactly that.

```
Default Next.js Loader:
  Your image URL → Next.js optimization server → Optimized image

Custom Loader (e.g., Cloudinary):
  Your image URL → Your loader function → Cloudinary URL with transformations → Optimized image
```

### Why Use a Custom Loader?

```
Benefits of Custom Loader (e.g., Cloudinary):
├── Images served from Cloudinary's global CDN (faster delivery)
├── Cloudinary handles resizing, format conversion, quality
├── Next.js server doesn't need to process images (less load)
├── Advanced transformations (filters, watermarks, AI-based cropping)
└── Unlimited image bandwidth (no self-hosting limits)

When to use:
├── Large-scale apps with many images
├── When you need advanced image transformations
├── When you want CDN-delivered images globally
└── When you're already using Cloudinary for storage
```

### Creating a Cloudinary Loader

```javascript
// lib/cloudinary-loader.js

export default function cloudinaryLoader({ src, width, quality }) {
  // src: the image public_id or URL stored in your database
  // width: the desired width (set by Next.js based on device)
  // quality: image quality (1-100, default 75)

  const params = [
    "f_auto", // Auto format (WebP, AVIF, etc.)
    "c_limit", // Don't upscale beyond original
    `w_${width}`, // Set width
    `q_${quality || "auto"}`, // Set quality
  ];

  // Build the Cloudinary URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // If src is a full Cloudinary URL, extract the public ID
  // If src is just the public ID, use it directly
  const publicId = extractPublicId(src);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${publicId}`;
}

function extractPublicId(src) {
  // If it's already just an ID, return it
  if (!src.startsWith("http")) return src;

  // Extract the public ID from the full Cloudinary URL
  // "https://res.cloudinary.com/my-cloud/image/upload/v1234/my-image.jpg"
  //                                                              ↑ This part
  const parts = src.split("/upload/");
  return parts[1];
}
```

### Using the Loader with the Image Component

#### Option 1: Per-Image Loader

```jsx
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";

export default function ProductImage({ imageUrl }) {
  return (
    <Image
      loader={cloudinaryLoader} // ← Use custom loader for this image
      src={imageUrl} // Cloudinary public_id or URL
      alt="Product image"
      width={800}
      height={600}
    />
  );
}
```

#### Option 2: Global Loader (Applies to All Images)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.js", // Path to your loader
    // Now ALL <Image> components use Cloudinary!
  },
};

module.exports = nextConfig;
```

### Complete Cloudinary Integration Example

```javascript
// lib/cloudinary-loader.js
export default function cloudinaryLoader({ src, width, quality }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const transformations = [
    `w_${width}`, // Width
    `q_${quality || "auto"}`, // Quality
    "f_auto", // Auto format (WebP/AVIF)
    "c_fill", // Crop mode
    "g_auto", // Smart gravity (AI-based centering)
  ].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${src}`;
}
```

```jsx
// components/meal-image.js
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";

export default function MealImage({ meal }) {
  return (
    <div className="meal-image-container">
      <Image
        loader={cloudinaryLoader}
        src={meal.imagePublicId} // e.g., "meals/pasta-carbonara"
        alt={meal.title}
        fill
        className="meal-image"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
```

### How Cloudinary URL Transformation Works

```
Base URL:
https://res.cloudinary.com/MY_CLOUD/image/upload/[TRANSFORMATIONS]/[PUBLIC_ID]

Example — Original URL stored in DB:
"meals/pasta-carbonara"

Generated URL for 800px device:
https://res.cloudinary.com/my-cloud/image/upload/w_800,q_auto,f_auto/meals/pasta-carbonara

Generated URL for 400px mobile:
https://res.cloudinary.com/my-cloud/image/upload/w_400,q_auto,f_auto/meals/pasta-carbonara

Generated URL for 1600px Retina:
https://res.cloudinary.com/my-cloud/image/upload/w_1600,q_auto,f_auto/meals/pasta-carbonara

Result:
└── Each device gets the PERFECT size — smaller files, faster loading!
```

---

## 9. Page Metadata - An Introduction

### What Is Metadata and Why Does It Matter?

**Metadata** is information about your page that appears in the `<head>` tag of the HTML — not visible on the page itself, but critically important for:

```
Why metadata matters:
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  1. SEO (Search Engine Optimization)                    │
│     └── Google, Bing index your page title/description  │
│         Better metadata = higher search rankings        │
│                                                          │
│  2. Social Media Sharing                                 │
│     └── When someone shares your link on Twitter/       │
│         Facebook/LinkedIn, they see a "card" with       │
│         title, description, and image                   │
│         (Open Graph protocol)                           │
│                                                          │
│  3. Browser Tab                                          │
│     └── The text shown in the browser tab               │
│                                                          │
│  4. Browser Bookmarks                                    │
│     └── When a user bookmarks your page                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### What Metadata Looks Like in HTML

```html
<!-- This is what Next.js generates in <head> -->
<head>
  <title>Pasta Carbonara - NextLevel Food</title>
  <meta name="description" content="A creamy Italian pasta dish..." />

  <!-- Open Graph (Facebook, LinkedIn sharing) -->
  <meta property="og:title" content="Pasta Carbonara" />
  <meta property="og:description" content="A creamy Italian pasta dish..." />
  <meta property="og:image" content="https://example.com/pasta.jpg" />
  <meta property="og:url" content="https://example.com/meals/pasta" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pasta Carbonara" />
  <meta name="twitter:description" content="A creamy Italian pasta dish..." />
  <meta name="twitter:image" content="https://example.com/pasta.jpg" />
</head>
```

### Next.js Approach: Metadata API

Instead of manually writing `<head>` tags, Next.js provides a clean **Metadata API**:

```jsx
// You write this:
export const metadata = {
  title: "My Page",
  description: "Page description",
};

// Next.js automatically generates:
// <title>My Page</title>
// <meta name="description" content="Page description" />
```

---

## 10. Configuring Static Page Metadata

### Basic Static Metadata

Add metadata to any `page.js` or `layout.js` by exporting a `metadata` object:

```jsx
// app/about/page.js
export const metadata = {
  title: "About Us - NextLevel Food",
  description: "Learn about our community of food lovers and recipe sharers.",
};

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We are a community of food lovers!</p>
    </main>
  );
}
```

### Full Metadata Options

```jsx
// app/meals/page.js
export const metadata = {
  // Basic
  title: "Browse Meals - NextLevel Food",
  description: "Browse delicious meals shared by our community.",

  // Keywords (less important for modern SEO but still valid)
  keywords: ["food", "recipes", "cooking", "meals"],

  // Author
  authors: [{ name: "NextLevel Food Team" }],

  // Open Graph (for social media sharing)
  openGraph: {
    title: "Browse Our Delicious Meals",
    description: "Discover recipes shared by food lovers worldwide.",
    url: "https://nextlevel-food.com/meals",
    siteName: "NextLevel Food",
    images: [
      {
        url: "https://nextlevel-food.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextLevel Food — Browse Meals",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Browse Our Delicious Meals",
    description: "Discover recipes shared by food lovers worldwide.",
    images: ["https://nextlevel-food.com/og-image.jpg"],
    creator: "@nextlevelfood",
  },

  // Robots (tell search engines how to index)
  robots: {
    index: true, // Allow indexing (default)
    follow: true, // Follow links (default)
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Canonical URL (tells search engines the "official" URL)
  alternates: {
    canonical: "https://nextlevel-food.com/meals",
  },
};
```

### The Title Template

Instead of manually adding your site name to every title, use a **title template** in the root layout:

```jsx
// app/layout.js
export const metadata = {
  // Template: %s is replaced by the child page's title
  title: {
    template: "%s - NextLevel Food",
    default: "NextLevel Food", // Used when no title is set
  },
  description: "Delicious meals, shared by a food-loving community.",
};

// app/about/page.js
export const metadata = {
  title: "About Us",
  // Becomes: "About Us - NextLevel Food" (template applied!)
};

// app/meals/page.js
export const metadata = {
  title: "Browse Meals",
  // Becomes: "Browse Meals - NextLevel Food"
};

// app/page.js (home)
// No title set → Uses default: "NextLevel Food"
```

---

## 11. Configuring Dynamic Page Metadata

### The Problem: Static Metadata Can't Know Dynamic Values

For pages with dynamic data (like individual blog posts or products), you can't use a static `metadata` object because the content depends on the data:

```jsx
// ❌ This DOESN'T WORK — you don't know the meal title here!
export const metadata = {
  title: params.slug, // ← params is not available at module level!
};
```

### The Solution: `generateMetadata()` Function

```jsx
// app/meals/[slug]/page.js
import { getMeal } from "@/lib/meals";
import { notFound } from "next/navigation";

// ✅ This DOES WORK — async function receives params
export async function generateMetadata({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    // Becomes: "Pasta Carbonara - NextLevel Food" (with template)

    description: meal.summary,
  };
}

// The page component
export default function MealDetailPage({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  return (
    <article>
      <h1>{meal.title}</h1>
      <p>{meal.summary}</p>
    </article>
  );
}
```

### How `generateMetadata` Works

```
What happens when Next.js renders the page:

1. Request arrives for /meals/pasta-carbonara
2. Next.js calls generateMetadata({ params: { slug: 'pasta-carbonara' } })
3. generateMetadata fetches meal data from the database
4. generateMetadata returns the metadata object
5. Next.js generates the <head> with this metadata
6. Then Next.js renders the page component
7. Complete HTML (with correct <head>) is sent to the browser
```

### Data Fetching in Both Functions

When both `generateMetadata` and the page component fetch the same data, Next.js is smart enough to **deduplicate** the requests (Request Memoization!):

```jsx
// app/meals/[slug]/page.js
import { getMeal } from "@/lib/meals";

// Both functions call getMeal — but it's only queried ONCE
// (thanks to React cache() or fetch deduplication)
export async function generateMetadata({ params }) {
  const meal = getMeal(params.slug); // Call 1
  if (!meal) notFound();
  return { title: meal.title, description: meal.summary };
}

export default async function MealDetailPage({ params }) {
  const meal = getMeal(params.slug); // Call 2 — MEMOIZED!
  if (!meal) notFound();

  return (
    <article>
      <h1>{meal.title}</h1>
    </article>
  );
}
```

### Full Dynamic Metadata Example

```jsx
// app/meals/[slug]/page.js
import { getMeal } from "@/lib/meals";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    return {
      title: "Meal Not Found",
      description: "The requested meal could not be found.",
    };
  }

  return {
    title: meal.title,
    description: meal.summary,
    openGraph: {
      title: meal.title,
      description: meal.summary,
      images: [
        {
          url: meal.image, // Cloudinary or local image URL
          width: 1200,
          height: 630,
          alt: meal.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: meal.title,
      description: meal.summary,
      images: [meal.image],
    },
  };
}

export default async function MealDetailPage({ params }) {
  const meal = getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  return (
    <article>
      <header>
        <div style={{ position: "relative", height: "400px" }}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <h1>{meal.title}</h1>
        <p>by {meal.creator}</p>
      </header>
      <p dangerouslySetInnerHTML={{ __html: meal.instructions }} />
    </article>
  );
}
```

---

## 12. Understanding Layout Metadata

### How Metadata Inheritance Works

Metadata in Next.js follows a **cascade** — just like CSS. Child page metadata **overrides** parent layout metadata for the same fields.

```
Metadata Priority (highest to lowest):
Page metadata > Nearest layout > Parent layout > Root layout
```

### Metadata Merging

```jsx
// app/layout.js (Root Layout)
export const metadata = {
  title: {
    template: "%s | My App",
    default: "My App",
  },
  description: "Welcome to my application.",
  openGraph: {
    siteName: "My App",
    type: "website",
  },
};

// app/blog/layout.js (Blog Section Layout)
export const metadata = {
  // Doesn't set title — inherits template from root
  openGraph: {
    type: "article", // Overrides 'website' from root
  },
};

// app/blog/[slug]/page.js (Individual Post)
export const metadata = {
  title: "My Blog Post", // Becomes: "My Blog Post | My App" (template applied)
  description: "This is my specific post description.", // Overrides root
};
```

### What Gets Merged vs Overridden

```
Merging rules:
├── Same field = CHILD OVERRIDES parent
│   Root: description = "General description"
│   Page: description = "Specific description"
│   Result: "Specific description" (page wins)
│
├── Objects are MERGED (not replaced entirely)
│   Root:  openGraph: { siteName: 'My App', type: 'website' }
│   Page:  openGraph: { type: 'article' }
│   Result: openGraph: { siteName: 'My App', type: 'article' }
│   (siteName from root + type from page)
│
└── Arrays are REPLACED (not merged)
    Root:  openGraph.images = [image1]
    Page:  openGraph.images = [image2]
    Result: openGraph.images = [image2] (page completely replaces)
```

### Practical Layout Metadata Strategy

```jsx
// app/layout.js — Root: Set site-wide defaults
export const metadata = {
  title: {
    template: "%s - NextLevel Food",
    default: "NextLevel Food", // Fallback when no page title set
  },
  description: "Delicious meals, shared by a food-loving community.",
  openGraph: {
    siteName: "NextLevel Food",
    url: "https://nextlevel-food.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nextlevelfood",
  },
};

// app/meals/layout.js — Section: Override for meals section
export const metadata = {
  // No title — inherits template
  openGraph: {
    type: "article", // All meal pages are articles
  },
};

// app/meals/page.js — Page: Set page-specific metadata
export const metadata = {
  title: "Browse Meals", // "Browse Meals - NextLevel Food"
  description: "Explore our collection of community recipes.",
};

// app/meals/[slug]/page.js — Dynamic page
export async function generateMetadata({ params }) {
  const meal = getMeal(params.slug);
  return {
    title: meal.title, // "Pasta Carbonara - NextLevel Food"
    description: meal.summary,
    openGraph: {
      images: [{ url: meal.image }], // Specific image for this meal
    },
  };
}
```

---

## 13. Module Summary

### Everything Covered in This Module

```
Module 8: Next.js App Optimizations — Complete Summary
═══════════════════════════════════════════════════════════════

🖼️ IMAGE OPTIMIZATION
├── Use <Image> from 'next/image' (NEVER bare <img>)
│
├── Local Images
│   ├── String path: src="/images/photo.jpg" + width + height
│   └── Imported: import img from './photo.jpg' → src={img} (no dimensions needed)
│
├── Remote Images
│   ├── Must provide width and height
│   ├── Must whitelist domain in next.config.js (remotePatterns)
│   └── Security: prevents abuse of optimization server
│
├── Key Props
│   ├── width, height — Display size + aspect ratio
│   ├── fill — Image fills parent container (no width/height needed)
│   ├── priority — Eager loading (use for above-fold images)
│   ├── quality — 1-100, default 75
│   ├── placeholder="blur" — Show blurred version while loading
│   ├── sizes — Responsive image hints
│   └── loader — Custom URL generation function
│
├── fill Requirements
│   ├── Parent: position: relative
│   ├── Parent: explicit height (or aspect-ratio)
│   └── Image: object-fit: cover (usually)
│
├── When to use priority:
│   ├── ✅ Hero images
│   ├── ✅ Above-fold images
│   └── ❌ Lazy-loaded lists
│
└── Custom Loaders (Cloudinary)
    ├── Function: ({ src, width, quality }) => url
    ├── Per-image: loader={myLoader}
    └── Global: in next.config.js → loaderFile

🏷️ METADATA & SEO
├── Two Types:
│   ├── Static: export const metadata = { ... }
│   └── Dynamic: export async function generateMetadata({ params }) { }
│
├── Where to Define:
│   ├── page.js — Page-specific metadata
│   └── layout.js — Section defaults (inherited by pages)
│
├── Common Fields:
│   ├── title — Browser tab + search result heading
│   ├── description — Search result snippet
│   ├── openGraph — Social media sharing (Facebook, LinkedIn)
│   └── twitter — Twitter Card sharing
│
├── Title Template (in root layout):
│   └── title: { template: '%s - Site Name', default: 'Site Name' }
│
├── Metadata Cascade:
│   ├── Child overrides parent for same field
│   ├── Objects are merged (shallow)
│   └── Arrays are replaced
│
└── generateMetadata:
    ├── Must be async function
    ├── Receives { params, searchParams }
    ├── Can fetch data (deduplicated with page)
    └── Returns metadata object
```

### Quick Reference Card

```jsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOCAL IMAGE (IMPORTED — BEST PRACTICE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import Image from 'next/image';
import heroImg from '@/public/images/hero.jpg';

<Image
  src={heroImg}          // Auto dimensions
  alt="Hero"
  priority               // Above-fold: load immediately
  sizes="100vw"
/>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REMOTE IMAGE (FROM URL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<Image
  src="https://res.cloudinary.com/..."
  alt="Product"
  width={800}            // Required!
  height={600}           // Required!
  quality={85}
/>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILL MODE (UNKNOWN DIMENSIONS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<div style={{ position: 'relative', aspectRatio: '16/9' }}>
  <Image
    src={imageUrl}
    alt="Photo"
    fill
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOM LOADER (CLOUDINARY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// lib/cloudinary-loader.js
export default function loader({ src, width, quality }) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},q_${quality || 'auto'},f_auto/${src}`;
}

// Usage:
<Image loader={myLoader} src="meals/pasta" alt="Pasta" width={800} height={600} />

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATIC METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const metadata = {
  title: 'Page Title',
  description: 'Page description for SEO.',
  openGraph: {
    title: 'Social Media Title',
    description: 'Social sharing description.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DYNAMIC METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateMetadata({ params }) {
  const data = await getData(params.id);
  if (!data) return { title: 'Not Found' };
  return {
    title: data.title,
    description: data.summary,
    openGraph: { images: [{ url: data.image }] },
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TITLE TEMPLATE (in root layout)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/layout.js
export const metadata = {
  title: {
    template: '%s | My Site',     // %s = child page title
    default: 'My Site',           // Used when no page title
  },
  description: 'My site description.',
};

// app/about/page.js
export const metadata = {
  title: 'About',   // Becomes: "About | My Site"
};
```

### Decision Guide

```
Which image approach should I use?
├── Local image in public/ folder → Import + src={imported}
├── Local image, path from database → src="/path" + width + height
├── Remote image, known dimensions → width + height props
├── Remote image, unknown dimensions → fill + positioned parent
├── Many remote images, CDN needed → Custom loader (Cloudinary)
└── Hero/banner image → Any above + priority prop

Which metadata approach should I use?
├── Same content on all pages → layout.js static metadata
├── Known content at code time → page.js static metadata
├── Content from URL params/database → generateMetadata() function
├── Site-wide title formatting → title template in root layout
└── Social media sharing → openGraph + twitter fields
```

---

> **🎯 Key Takeaways:**
>
> - **Never use bare `<img>` in Next.js** — always use `<Image>` for automatic optimization
> - **Import local images** when possible — dimensions are detected automatically and missing files fail at build time
> - **Use `priority`** on above-the-fold images to improve LCP (Core Web Vitals)
> - **Use `fill`** for images with unknown dimensions — parent must have `position: relative` and explicit height
> - **Custom loaders** (Cloudinary) are powerful for CDN-delivered, transformed images
> - **Static metadata** is simple and powerful for most pages
> - **`generateMetadata()`** handles dynamic pages where content varies
> - The **title template** in root layout saves you from repeating the site name everywhere
> - **Metadata cascades** — child pages override parent layouts for the same fields
