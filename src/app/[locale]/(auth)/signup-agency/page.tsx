import SignUpAgencyForm from "./SignUpAgencyForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрација за агенција",
  description: "Регистрација на агенција на Adresa.mk",
};
export default function SignUpAgencyPage() {
  return <SignUpAgencyForm />;
}
