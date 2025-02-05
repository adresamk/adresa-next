import { Metadata } from "next";

interface AboutUsProps {}
export const metadata: Metadata = {
  title: "За нас | Adresa.mk",
  description: "За нас",
};
export default async function AboutUs({}: AboutUsProps) {
  return <div>AboutUs works</div>;
}
