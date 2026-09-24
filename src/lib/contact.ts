/** Shared between the contact form (client) and its server action. Plain data only. */
export type ContactState =
  | { status: "idle" }
  | { status: "success"; name: string; ms: number }
  | { status: "invalid"; fields: string[]; values: Record<string, string> }
  | { status: "error"; code: number; message: string; values: Record<string, string> };

export const initialContactState: ContactState = { status: "idle" };
