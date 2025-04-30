import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
const sesClient = new SESv2Client();
import { env } from "process";

export const sendSESEmail = async (
  toEmailAddresses: string[],
  subject: string,
  bodyText: string
) => {
  console.log("Sending email...");

  const myEmail = env.FROM_EMAIL_ADDRESS;
  if (!myEmail) {
    throw new Error("FROM_EMAIL_ADDRESS environment variable is not set.");
  }
  if (!Array.isArray(toEmailAddresses) || toEmailAddresses.length === 0) {
    throw new Error("No recipient email addresses provided.");
  }

  // NOTE: If you want to attach an MP3, you must add a proper MIME part for the attachment. This example sends only plain text.
  const rawMessage = `From: ${myEmail}
To: ${toEmailAddresses.join(", ")}
Cc: ${myEmail}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary=\"boundary_string\"

--boundary_string
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${bodyText}

--boundary_string--`;

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
