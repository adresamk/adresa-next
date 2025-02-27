"use client";

import UserControls from "./UserControls";
import AuthOptionsPopup from "./AuthOptionsPopup";
import AuthButNoProfilePopup from "./AuthButNoProfilePopup";
import { Agency, User } from "@prisma/client";

export default function AuthUserControls({
  authState,
}: {
  authState: {
    user: User | null;
    agency: Agency | null;
    isAuthenticated: boolean;
    // isLoading: boolean;
  };
}) {
  // if (authState.isLoading) {
  //   return (
  //     <Avatar>
  //       <AvatarFallback>
  //         <Loader2Icon className="animate-spin" />
  //       </AvatarFallback>
  //     </Avatar>
  //   ); // Or return a loading spinner/skeleton
  // }

  if (authState.user) {
    return <UserControls user={authState.user} />;
  }

  if (authState.agency) {
    return <UserControls agency={authState.agency} />;
  }

  if (authState.isAuthenticated && !authState.user && !authState.agency) {
    return <AuthButNoProfilePopup />;
  }

  return <AuthOptionsPopup />;
}
