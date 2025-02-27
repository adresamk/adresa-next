import SignUpAgencyForm from "../signup-agency/SignUpAgencyForm";
import { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export const metadata: Metadata = {
  title: "Регистрација",
  description: "Регистрирај се на Adresa.mk",
};
export default function SignUp() {
  return <SignUpForm />;
}
