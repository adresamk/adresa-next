import { Metadata } from "next";

interface TermsOfUseProps {}
export const metadata: Metadata = {
  title: "Услови за користење | Adresa.mk",
  description: "Услови за користење",
};
export default async function TermsOfUse({}: TermsOfUseProps) {
  return <div>TermsOfUse works</div>;
}
