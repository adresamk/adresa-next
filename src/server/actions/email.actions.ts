"use server";

export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
) {
  console.log("verificationLink 2 ", verificationLink);
  console.log(process.env.NEXT_PUBLIC_URL);
  console.log({ email, verificationLink });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send/verifyuser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: email, email, verificationLink }),
    },
  );

  console.log("response", response);
  // console.log("response", response);

  if (!response.ok) {
    console.log("response", response);
    // throw new Error("Failed to send verification email");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  console.log("Verification email sent successfully");
  return true;
}

export async function sendResetPasswordEmail(
  email: string,
  resetPasswordLink: string,
) {
  console.log("resetPasswordLink ", resetPasswordLink);

  // const emailTemp = "macesmajli@gmail.com";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send/resetpassword`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, resetPasswordLink }),
    },
  );
}
