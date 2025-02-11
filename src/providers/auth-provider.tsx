"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCurrentUser } from "@/lib/sessions";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        setCurrentUser({
          ...data,
          admin: null, // Ensure admin is explicitly set to null to match expected type
        });
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setCurrentUser({
          isAuthenticated: false,
          account: null,
          user: null,
          agency: null,
          admin: null,
        });
      }
    };

    initAuth();
  }, [setCurrentUser]);

  return <>{children}</>;
}
