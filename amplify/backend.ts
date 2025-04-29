import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

// functions
import { sendEmail } from "./functions/send-mail/resource.js";

const backend = defineBackend({
  auth,
  data,
  storage,
  sendEmail,
});

backend.sendEmail.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"],
  })
);
