import { Resend } from "resend";
import { readResendApiKey } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient() {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = readResendApiKey();

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}
