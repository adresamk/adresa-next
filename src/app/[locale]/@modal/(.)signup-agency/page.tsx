import { Modal2 } from "@/components/shared/Modal2";
import SignUpAgencyForm from "../../(auth)/signup-agency/SignUpAgencyForm";
export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
export default function ModalSignUpAgency() {
  return (
    <Modal2>
      <SignUpAgencyForm />
    </Modal2>
  );
}
