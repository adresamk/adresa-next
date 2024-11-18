import SignInForm from "@/app/(auth)/signin/SignInForm";
import { Modal2 } from "@/components/shared/Modal2";

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
