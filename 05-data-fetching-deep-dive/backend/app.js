import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const DUMMY_NEWS = [
  {
    id: "n1",
    slug: "will-ai-replace-humans",
    title: "Will AI Replace Humans?",
    image: "ai-robot.jpg",
    date: "2021-07-01",
    content:
      "Since late 2022 AI is on the rise and therefore many people worry whether AI will replace humans...",
  },
  {
    id: "n2",
    slug: "beaver-plague",
    title: "A Plague of Beavers",
    image: "beaver.jpg",
    date: "2022-05-01",
    content: "Beavers are taking over the world...",
  },
  {
    id: "n3",
    slug: "couple-cooking",
    title: "Spend more time together!",
    image: "couple-cooking.jpg",
    date: "2024-03-01",
    content: "Cooking together is a great way...",
  },
  {
    id: "n4",
    slug: "hiking",
    title: "Hiking is the best!",
    image: "hiking.jpg",
    date: "2024-01-01",
    content: "Hiking is a great way...",
  },
  {
    id: "n5",
    slug: "landscape",
    title: "The beauty of landscape",
    image: "landscape.jpg",
    date: "2022-07-01",
    content: "Landscape photography is a great way...",
  },
];

const app = express();
app.use(cors());

let db;

// ✅ Initialize DB (async now)
async function initDb() {
  db = await open({
    filename: "data.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      title TEXT,
      content TEXT,
      date TEXT,
      image TEXT
    )
  `);

  const row = await db.get("SELECT COUNT(*) as count FROM news");

  if (row.count === 0) {
    for (const news of DUMMY_NEWS) {
      await db.run(
        "INSERT INTO news (slug, title, content, date, image) VALUES (?, ?, ?, ?, ?)",
        [news.slug, news.title, news.content, news.date, news.image],
      );
    }
  }
}

// ✅ Routes (async now)
app.get("/news", async (req, res) => {
  try {
    const news = await db.all("SELECT * FROM news");
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ✅ Start server AFTER DB is ready
initDb().then(() => {
  app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
  });
});
