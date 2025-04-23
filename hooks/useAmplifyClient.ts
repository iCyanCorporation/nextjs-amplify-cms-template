import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });
export const amplifyClient = generateClient<Schema>();