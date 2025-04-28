import type { Schema } from "../../data/resource";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-northeast-1" }); // Change region as needed

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  const { name } = event.arguments;

  const params = {
    Destination: {
      ToAddresses: ["icyan.contact@gmail.com"], // Replace with your recipient
    },
    Message: {
      Body: {
        Text: {
          Data: `Hello, ${name}! This is a test email from SES.`,
        },
      },
      Subject: {
        Data: "Test Email from SES",
      },
    },
    Source: "icyan.contact@gmail.com", // Replace with your verified sender
  };

  try {
    await ses.send(new SendEmailCommand(params));
    return `Email sent to ${params.Destination.ToAddresses[0]} for ${name}`;
  } catch (error) {
    console.error("SES send error:", error);
    throw new Error("Failed to send email");
  }
};
