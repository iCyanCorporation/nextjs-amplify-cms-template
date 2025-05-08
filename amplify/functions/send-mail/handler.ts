import { sendSESEmail } from "./helpers/sendSESEmail";
import type { Schema } from "../../data/resource";

export const handler: Schema["sendEmail"]["functionHandler"] = async (
  event
) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { name, myEmail, emailAddresses, subject, bodyText } =
      event.arguments;
    if (!name || !myEmail || !emailAddresses || !subject || !bodyText) {
      throw new Error("Missing required parameters");
    }
    const toEmailAddresses = emailAddresses.filter(
      (email): email is string => email !== null
    );
    await sendSESEmail(myEmail, toEmailAddresses, subject, bodyText);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }

  return "Hello world";
};
