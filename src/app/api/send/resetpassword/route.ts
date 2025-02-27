import { Resend } from "resend";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../../../../../emails/reset-password";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log("I am called to send reset password email");
  // rate limit

  // authorization

  try {
    const { email, resetPasswordLink } = await request.json();

    const fromEmail =
      process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
        ? "onboarding@resend.dev>"
        : "no-reply@adresa.mk";

    const toEmail =
      process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
        ? "macesmajli@gmail.com"
        : email;
    const { data, error } = await resend.emails.send({
      from: `Adresa <${fromEmail}>`,
      to: [toEmail],
      subject: "Reset your password on Adresa",
      html: await render(ResetPasswordEmail({ resetPasswordLink })),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
