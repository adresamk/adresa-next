import ForgotPasswordForm from "./ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заборавена лозинка",
  description:
    "Пријава за заборавена лозинка на корисничкиот профил на Adresa.mk и барање нова",
};
export default async function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
