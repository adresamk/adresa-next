import React from "react";
import { checkVerificationTokenInDB } from "@/server/actions/verification.actions";
import Link from "next/link";

interface VerifyPageProps {
  searchParams: Promise<{
    token: string;
  }>; // Updated to be a Promise
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams; // Await the promise

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
