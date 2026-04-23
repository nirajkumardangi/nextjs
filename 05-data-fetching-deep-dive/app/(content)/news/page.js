"use client";

import NewsList from "@/components/news-list";
import { useEffect, useState } from "react";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/news");

      if (!response.ok) {
        setError("Failed to fetch news!");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      const data = await response.json();
      setNews(data);
    }

    fetchNews();
  }, []);

  console.log(news);

  if (isLoading) {
    return <p>News is loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  let newsContent;

  if (news) {
    newsContent = <NewsList news={news} />;
  }

  return (
    <>
      <h1>News Page</h1>
      {newsContent}
    </>
  );
}
