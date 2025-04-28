import { amplifyClient } from "@/hooks/useAmplifyClient";

import { NextResponse } from "next/server";

// POST /api/send-mail - Send an email
export async function POST(request: Request) {
  const body = await request.json();
  const { to, subject, body: emailBody } = body;

  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const result = await amplifyClient.functions.sendMail.invoke(
    //     { to, subject, body: emailBody },
    //     { authMode: "identityPool", authToken }
    // );

    const result = await amplifyClient.queries.sayHello({
      name: "Amplify",
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
