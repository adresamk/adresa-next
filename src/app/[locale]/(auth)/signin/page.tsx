import SignInForm from "./SignInForm";

interface SignInPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  return <SignInForm searchParams={params} />;
}
