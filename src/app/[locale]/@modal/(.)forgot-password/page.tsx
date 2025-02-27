import { Modal2 } from "@/components/shared/Modal2";
import ForgotPasswordForm from "../../(auth)/forgot-password/ForgotPasswordForm";
export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export default async function ModalForgotPasswordPage() {
  return (
    <Modal2>
      <ForgotPasswordForm />
    </Modal2>
  );
}
