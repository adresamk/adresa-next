import { deleteSessionTokenCookie } from "@/lib/sessions";
import { logout } from "@/server/actions/auth.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Reset the cookies for auth_session and auth-cookie-exists
  const response = NextResponse.json(await logout(), {
    headers: request.headers,
  });

  response.cookies.set("auth_session", "", { maxAge: -1 });
  response.cookies.set("auth-cookie-exists", "", { maxAge: -1 });

  deleteSessionTokenCookie();
  return response;
}
