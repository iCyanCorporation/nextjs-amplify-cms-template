import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource";

// functions
import { sayHello } from "./functions/send-mail/resource.js";

defineBackend({
  auth,
  data,
  storage,
  sayHello,
});
