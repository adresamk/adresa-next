import { Resend } from "resend";
import { render } from "@react-email/render";
import VerifyUserEmail from "../../../../../emails/verfiy-user";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, response: Response) {
  console.log("I am called to send verif email");
  // rate limit

  // authorization

  try {
    const { userName, verificationLink } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Adresa <onboarding@resend.dev>",
      to: ["macesmajli@gmail.com"],
      subject: "Verify your account on Adresa",
      html: await render(VerifyUserEmail({ userName, verificationLink })),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    console.log(data);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
