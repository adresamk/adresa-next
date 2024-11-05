import SignInForm from "./SignInForm";

interface SignInPageProps {
  searchParams: Record<string, string>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  return <SignInForm searchParams={searchParams} />;
}
