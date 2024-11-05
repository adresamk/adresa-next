import SignInForm from "@/app/(auth)/signin/SignInForm";
import { Modal2 } from "@/components/shared/Modal2";

export default async function ModalSigninPage() {
  return (
    <Modal2>
      <SignInForm searchParams={null} />
    </Modal2>
  );
}
