import React from "react";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkVerificationTokenInDB } from "@/server/actions/user.actions";
import Link from "next/link";
interface VerifyPageProps {
  searchParams: {
    token: string;
  };
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;

  const { success, error } = await checkVerificationTokenInDB(params.token);
  if (!success && error) {
    return (
      <div>
        <div>{error}</div>
        <Link href="/">Go back to homepage</Link>
      </div>
    );
  }

  return (
    <div>
      Account verified, you can go back to homepage
      <Link href="/">Go back to homepage</Link>
    </div>
  );
}
