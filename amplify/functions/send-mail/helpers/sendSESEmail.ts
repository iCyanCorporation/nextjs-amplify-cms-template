import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
const sesClient = new SESv2Client();
import { env } from "process";

export const sendSESEmail = async (
  myEmail: string,
  toEmailAddresses: string[],
  subject: string,
  bodyText: string
) => {
  console.log("Sending email....");

  // const myEmail = env.FROM_EMAIL_ADDRESS;
  if (!myEmail) {
    throw new Error("FROM_EMAIL_ADDRESS environment variable is not set.");
  }
  if (!Array.isArray(toEmailAddresses) || toEmailAddresses.length === 0) {
    throw new Error("No recipient email addresses provided.");
  }

  // Send as multipart/alternative for both plain text and HTML
  const rawMessage = `From: ${myEmail}
To: ${toEmailAddresses.join(", ")}
Cc: ${myEmail}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary_alt"

--boundary_alt
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

This email requires an HTML-compatible email client.

--boundary_alt
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

${bodyText}

--boundary_alt--`;

  const sendEmailParams = {
    Content: {
      Raw: {
        Data: Buffer.from(rawMessage),
      },
    },
  };

  const sendEmailCommand = new SendEmailCommand(sendEmailParams);

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log(`Email sent successfully. Message ID: ${result.MessageId}`);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
