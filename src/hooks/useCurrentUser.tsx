import { create } from "zustand";
import { User, Agency, Account } from "@prisma/client";
import { deleteCookie } from "@/lib/utils";
import { redirect } from "next/navigation";
export type GetCurrentUserResult = {
  account: Account | null;
  isAuthenticated: boolean;
  user: User | null;
  agency: Agency | null;
  admin: null;
};
interface CurrentUserState {
  account: Account | null;
  admin: null;
  user: User | null;
  agency: Agency | null;
  isAuthenticated: boolean;
  setCurrentUser: (data: GetCurrentUserResult) => void;
  logout: () => void;
}

export const useCurrentUser = create<CurrentUserState>((set) => ({
  account: null,
  admin: null,
  user: null,
  agency: null,
  isAuthenticated: false,
  setCurrentUser: (data) =>
    set({
      user: data.user,
      agency: data.agency,
      isAuthenticated: data.isAuthenticated,
      account: data.account,
      admin: data.admin,
    }),
  logout: () => {
    console.log("logout");
    set({
      isAuthenticated: false,
      account: null,
      user: null,
      agency: null,
      admin: null,
    });
    deleteCookie("auth-session");
    redirect("/");
  },
}));
