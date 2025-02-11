import SignInForm from "@/app/[locale]/(auth)/signin/SignInForm";
import { Modal2 } from "@/components/shared/Modal2";
import { Metadata } from "next";

interface ModalSigninPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ModalSigninPage({
  searchParams,
}: ModalSigninPageProps) {
  const params = await searchParams;
  return (
    <Modal2>
      <SignInForm searchParams={params} />
    </Modal2>
  );
}
