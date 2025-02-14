import "./globals.css";

import { Amplify } from "aws-amplify";
Amplify.configure(outputs);
import outputs from "@/amplify_outputs.json";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
