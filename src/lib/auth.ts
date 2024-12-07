// src/auth.ts
import { Lucia, User, Session, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prismadb from "@/lib/db";
import { cache } from "react";
import { cookies } from "next/headers";
import { Account, AccountType } from "@prisma/client";
import { validateSessionToken, SessionValidationResult } from "./sessions";

const adapter = new PrismaAdapter(prismadb.session, prismadb.account);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(3, "d"),
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    name: "auth-cookie",
    expires: true,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getSessionAttributes(databaseSessionAttributes) {
    return {
      email: databaseSessionAttributes.email,
      id: databaseSessionAttributes.id,
      uuid: databaseSessionAttributes.uuid,
      role: databaseSessionAttributes.role,
    };
  },
});
export async function getUser() {
  "use server";

  const result = await validateRequest();

  // here instead of returning the result, we can go with prisma and get the User object with all the fields on it
  // because up to here we only kinda have access to the id, name etc, but not all the
  // related fields and stuff so if we need that we do that
  if (!result.account) {
    return null;
  }
  const loggedInUser = await prismadb.account.findUnique({
    where: {
      id: Number(result.account.id),
    },
  });
  return loggedInUser;
}
export const validateRequest = cache(
  async (): Promise<
    | { account: Account | User; session: Session }
    | { account: null; session: null }
  > => {
    "use server";

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { account: null, session: null };
    }
    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        // refreshing the session cookie
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
        cookieStore.set("auth-cookie-exists", result.user.id, {
          ...sessionCookie.attributes,
          httpOnly: false,
        });
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
        cookieStore.set("auth-cookie-exists", "", {
          ...sessionCookie.attributes,
          httpOnly: false,
        });
      }
    } catch {}
    console.log(result);

    // edit later
    if (result.session && result.user) {
      return { account: result.user, session: result.session };
    } else {
      return { account: null, session: null };
    }
  },
);
// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}
interface DatabaseSessionAttributes {
  id: number;
  uuid: string;
  email: string;
  role: AccountType;
}

// export const github = new GitHub(
//     env.GITHUB_CLIENT_ID,
//     env.GITHUB_CLIENT_SECRET,
//   );

//   export const googleAuth = new Google(
//     env.GOOGLE_CLIENT_ID,
//     env.GOOGLE_CLIENT_SECRET,
//     `${env.HOST_NAME}/api/login/google/callback`,
//   );
