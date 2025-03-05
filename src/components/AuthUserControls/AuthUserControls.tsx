"use client";

import UserControls from "./UserControls";
import AuthOptionsPopup from "./AuthOptionsPopup";
import AuthButNoProfilePopup from "./AuthButNoProfilePopup";
import { Agency, User } from "@prisma/client";
import AgencyControls from "./AgencyControls";

export default function AuthUserControls({
  authState,
}: {
  authState: {
    user: User | null;
    agency: Agency | null;
    isAuthenticated: boolean;
  };
}) {
  if (authState.user) {
    return <UserControls user={authState.user} />;
  }

  if (authState.agency) {
    return <AgencyControls agency={authState.agency} />;
  }

  if (authState.isAuthenticated && !authState.user && !authState.agency) {
    return <AuthButNoProfilePopup />;
  }

  return <AuthOptionsPopup />;
}
