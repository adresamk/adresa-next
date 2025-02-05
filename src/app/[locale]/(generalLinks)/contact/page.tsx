import { Metadata } from "next";

interface ContactProps {}
export const metadata: Metadata = {
  title: "Контакт | Adresa.mk",
  description: "Контакт",
};
export default async function Contact({}: ContactProps) {
  return <div>Contact works</div>;
}
