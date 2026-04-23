import NewsList from "./news-list";
import { getAllNews } from "@/lib/news";

export default async function NewsListWrapper() {
  // This async component fetches data
  const news = await getAllNews();
  return <NewsList news={news} />;
}
