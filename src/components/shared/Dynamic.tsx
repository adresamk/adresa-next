"use client";
import { getCurrentUser } from "@/lib/sessions";
import AuthUserControls from "../AuthUserControls/AuthUserControls";
import LocaleSwitcher from "../LocaleSwitcher";
import NewListingButton from "../NewListingButton";
import React, { Suspense, useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Agency } from "@prisma/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface DynamicProps {}

// Example of a dynamically imported component
// const DynamicComponent = React.lazy(() => import("./SomeComponent"));

export default function Dynamic({}: DynamicProps) {
  const authState = useCurrentUser((state) => state);

  return (
    <>
      <NewListingButton isAuthenticated={authState.isAuthenticated} />
      <LocaleSwitcher />
      <AuthUserControls authState={authState} />
    </>
  );
}
