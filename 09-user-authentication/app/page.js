import AuthForm from "@/components/auth-form";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const formMode = params.mode || "login";

  return <AuthForm mode={formMode} />;
}
