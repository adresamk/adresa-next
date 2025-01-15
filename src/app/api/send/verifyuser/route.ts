import { Resend } from "resend";
import { render } from "@react-email/render";
import VerifyUserEmail from "../../../../../emails/verfiy-user";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log("I am called to send verif email");
  // rate limit

  // authorization

  try {
    const { userName, verificationLink, email } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Adresa <no-reply@adresa.mk>",
      to: [email],
      subject: "Verify your account on Adresa",
      html: await render(VerifyUserEmail({ userName, verificationLink })),
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
