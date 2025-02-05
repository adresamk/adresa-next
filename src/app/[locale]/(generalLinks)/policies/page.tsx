import { Metadata } from "next";

interface PoliciesProps {}
export const metadata: Metadata = {
  title: "Политики | Adresa.mk",
  description: "Политики",
};
export default async function Policies({}: PoliciesProps) {
  return <div>Policies works</div>;
}
