import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // for extra 2 sec delay simulation
//   throw new Error("failed while fetching!"); // for custom error simulation
  return db.prepare("SELECT * FROM meals").all();
}
