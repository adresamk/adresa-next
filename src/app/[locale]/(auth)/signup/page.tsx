import SignUpAgencyForm from "../signup-agency/SignUpAgencyForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрација",
  description: "Регистрирај се на Adresa.mk",
};
export default function SignUp() {
  return <SignUpAgencyForm />;
}
