import SignUpAgencyForm from "./SignUpAgencyForm";
import { Metadata } from "next";

export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export const metadata: Metadata = {
  title: "Регистрација за агенција",
  description: "Регистрација на агенција на Adresa.mk",
};
export default function SignUpAgencyPage() {
  return <SignUpAgencyForm />;
}
