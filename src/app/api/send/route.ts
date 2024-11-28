import EmailTemplate from "../../../../emails/invite";
import { Resend } from "resend";
import { render } from "@react-email/render";
import AdresaWelcomeEmail from "../../../../emails/adresa-welcome";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Adresa <onboarding@resend.dev>",
      to: ["macesmajli@gmail.com"],
      subject: "Welcome to Adresa",
      html: await render(AdresaWelcomeEmail({ userName })), // render doesn't need to be awaited
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 },
    );
  }
}
