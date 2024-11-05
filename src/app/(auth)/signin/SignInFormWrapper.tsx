"use client";
import { useRouter } from "next/navigation";
import { signIn } from "./actions";
import { Form } from "@/components/Form";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleSignIn(prevState: any, formData: FormData) {
    const result = await signIn(prevState, formData);

    if (result?.success) {
      router.back();
    }

    return result;
  }

  return <Form action={handleSignIn}>{children}</Form>;
}
