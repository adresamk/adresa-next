"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn } from "@/server/actions/auth.actions";
import { useRouter, usePathname } from "next/navigation";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      // Revalidate all router cache
      // router.refresh();

      // Check if we're in a modal route (contains @modal)
      console.log("pathname", pathname);

      router.back();
      // } else {
      // router.push("/");
      // }
    }
  }, [state.success, router, pathname]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
