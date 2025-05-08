import { amplifyClient } from "@/hooks/useAmplifyClient";

import { NextResponse } from "next/server";

// POST /api/send-mail - Send an email
export async function POST(request: Request) {
  const body = await request.json();
  const { myEmail, toEmailAddresses, subject, body: bodyText } = body;

  try {
    if (!toEmailAddresses || !subject || !bodyText) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate the input
    const result = await amplifyClient.queries.sendEmail(
      {
        name: "Amplify App",
        myEmail: myEmail,
        emailAddresses: toEmailAddresses,
        subject: subject,
        bodyText: bodyText,
      },
      { authMode: "identityPool" }
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    // Return SES error message for easier debugging
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
