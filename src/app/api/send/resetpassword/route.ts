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

    resend.apiKeys.list;
    const { data, error } = await resend.emails.send({
      from: "Adresa <dev@adresa.mk>",
      to: [email],
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
