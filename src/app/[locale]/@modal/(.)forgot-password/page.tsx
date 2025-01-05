import { Modal2 } from "@/components/shared/Modal2";
import ForgotPasswordForm from "../../(auth)/forgot-password/ForgotPasswordForm";

export default async function ModalForgotPasswordPage() {
  return (
    <Modal2>
      <ForgotPasswordForm />
    </Modal2>
  );
}
