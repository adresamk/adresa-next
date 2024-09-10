// src/auth.ts
import prisma from "@/lib/db";
import { Lucia, User, Session } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "process";
// const adapter = new BetterSQLite3Adapter(db); // your adapter

// const client = new PrismaClient();
// const adapter = new PrismaAdapter(client.session, client.user);

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      id: attributes.id,
      //   hashedPassword: attributes.hashedPassword,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }
    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(
          result.session.id
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);
// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
interface DatabaseUserAttributes {
  id: string;
  email: string;
  hashedPassword: string;
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
