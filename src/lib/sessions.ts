"use server";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  AccountType,
  type Account,
  type Agency,
  type Session,
  type User,
} from "@prisma/client";
import prismadb from "./db";
import { cookies } from "next/headers";
import { cache } from "react";

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
const extraTime = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function createSession(
  token: string,
  accountId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    accountId,
    expiresAt: new Date(Date.now() + extraTime),
  };
  await prismadb.session.create({
    data: session,
  });
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prismadb.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      account: true,
    },
  });
  if (result === null) {
    return { session: null, account: null };
  }
  const { account, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prismadb.session.delete({ where: { id: sessionId } });
    return { session: null, account: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - extraTime / 2) {
    session.expiresAt = new Date(Date.now() + extraTime);
    await prismadb.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, account };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prismadb.session.delete({ where: { id: sessionId } });
}

export type SessionValidationResult =
  | { session: Session; account: Account }
  | { session: null; account: null };

export const getCurrentSession: () => Promise<SessionValidationResult> = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value ?? null;
    if (token === null) {
      return { session: null, account: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);
type Admin = {};
type GetCurrentUserResult = {
  account: Account | null;
  isAuthenticated: boolean;
  user: User | null;
  agency: Agency | null;
  admin: Admin | null;
};

export async function getCurrentUser(): Promise<GetCurrentUserResult> {
  const { account, session } = await getCurrentSession();
  // console.log("Account", account, "Session", session);
  if (session === null) {
    return {
      isAuthenticated: account ? true : false,
      account,
      user: null,
      agency: null,
      admin: null,
    };
  }
  if (account.role === AccountType.USER) {
    const user = await prismadb.user.findUnique({
      where: {
        accountId: account.id,
      },
    });
    return {
      isAuthenticated: account ? true : false,
      account,
      user,
      agency: null,
      admin: null,
    };
  }
  if (account.role === AccountType.AGENCY) {
    const agency = await prismadb.agency.findUnique({
      where: {
        accountId: account.id,
      },
    });

    return {
      isAuthenticated: account ? true : false,
      account,
      user: null,
      agency,
      admin: null,
    };
  }
  if (account.role === AccountType.ADMIN) {
    const admin = {};

    return {
      isAuthenticated: account ? true : false,
      account,
      user: null,
      agency: null,
      admin: null,
    };
  }
  throw new Error("Invalid account role");
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
  accountUuid?: string,
): Promise<void> {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set("auth_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
  // set the cookie to indicate that the user is logged in
  // this is used to check if the user is logged in without having to validate the session token
  if (accountUuid) {
    cookieStore.set("auth-cookie-exists", accountUuid, {
      httpOnly: false,
      expires: expiresAt,
    });
  }
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("auth-cookie-exists", "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
  });
}
