import SignInForm from "./SignInForm";
import { Metadata } from "next";

export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export const metadata: Metadata = {
  title: "Најва",
  description: "Најва на корисничкиот профил на Adresa.mk",
};

interface SignInPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  return <SignInForm searchParams={params} />;
}
