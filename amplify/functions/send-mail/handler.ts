import { sendSESEmail } from "./helpers/sendSESEmail";

// Lambda handler for AWS Amplify Function
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse recipient(s) from event body, fallback to default
    const body = event.body ? JSON.parse(event.body) : {};
    const toEmailAddresses: string[] = body.toEmailAddresses || ["icyan.contact@gmail.com"];
    await sendSESEmail(toEmailAddresses);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message || "Unknown error" })
    };
  }
};
