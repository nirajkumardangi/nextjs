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
