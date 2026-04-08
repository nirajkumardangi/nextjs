import Link from "next/link";

export default function MealsPage() {
  return (
    <>
      <h1>All Meals</h1>
      <main>
        <p>
          <Link href="/meals/meals-1">Meals 1</Link>
        </p>
        <p>
          <Link href="/meals/meals-3">Meals 2</Link>
        </p>
        <p>
          <Link href="/meals/meals-2">Meals 3</Link>
        </p>
      </main>
    </>
  );
}
