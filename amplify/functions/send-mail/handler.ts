import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
const sesClient = new SESv2Client({ region: "ap-northeast-1" });

export const handler = async () =>
  // fileBuffer: Buffer,
  // toEmailAddresses: string[],
  // fileContentType: string,
  // fileName: string
  {
    const myEmail = "icyan.contact@gmail.com";
    const toEmailAddresses = ["icyan.contact@gmail.com"];
    const params = {
      subject: "Test Email from SESv2",
      content: "This email is a test email.",
    };

    const rawMessage = `From: ${myEmail}
      To: ${toEmailAddresses.join(", ")}
      Subject: ${params.subject}
      MIME-Version: 1.0
      Content-Type: multipart/mixed; boundary="boundary_string"

      --boundary_string
      Content-Type: text/plain; charset=UTF-8
      Content-Transfer-Encoding: 7bit

      ${params.content}
      `;

    try {
      const sendEmailParams = {
        Content: {
          Raw: {
            Data: Buffer.from(rawMessage),
          },
        },
      };
      const sendEmailCommand = new SendEmailCommand(sendEmailParams);
      const result = await sesClient.send(sendEmailCommand);

      console.log(`Email sent successfully. Message ID: ${result.MessageId}`);
    } catch (error) {
      console.error("SESv2 send error:", error);
      throw new Error("Failed to send email");
    }
  };
