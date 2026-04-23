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
          height={330}
        />
        <h1>{newsItem.title}</h1>
        <time dateTime={newsItem.date}>{newsItem.date}</time>
      </header>
      <p>{newsItem.content}</p>
    </article>
  );
}
