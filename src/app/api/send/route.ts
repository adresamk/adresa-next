import EmailTemplate from "../../../../emails/invite";
import { Resend } from "resend";
import { render } from "@react-email/render";
import AdresaWelcomeEmail from "../../../../emails/adresa-welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, response: Response) {
  // rate limit

  // authorization

  try {
    const { userName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Adresa <onboarding@resend.dev>",
      to: ["macesmajli@gmail.com"],
      subject: "Welcome to Adresa",
      html: await render(AdresaWelcomeEmail({ userName })),
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
