import SignUpForm from "@/app/[locale]/(auth)/signup/SignUpForm";
import { Modal2 } from "@/components/shared/Modal2";
export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export default function ModalSignUp() {
  return (
    <Modal2>
      <SignUpForm />
    </Modal2>
  );
}
