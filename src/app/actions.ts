"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { profile } from "@/content/profile";
import type { ContactState } from "@/lib/contact";
import { sendEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/spam";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(4000),
});

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const started = Date.now();
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: people never see this field; bots fill it. Pretend success.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", name: values.name.split(" ")[0] || "there", ms: Date.now() - started };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return { status: "invalid", fields, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      code: 429,
      message: `Too many messages in a short time. Please try again later, or email ${profile.email}.`,
      values,
    };
  }

  const m = parsed.data;
  try {
    await sendEmail({
      to: process.env.CONTACT_TO_EMAIL ?? profile.email,
      replyTo: m.email,
      subject: `Portfolio message from ${m.name}`,
      text: [`Name: ${m.name}`, `Email: ${m.email}`, "", m.message].join("\n"),
    });
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      code: 502,
      message: `Your message couldn't be sent. Please try again, or email ${profile.email} directly.`,
      values,
    };
  }

  return { status: "success", name: m.name.split(" ")[0] ?? m.name, ms: Date.now() - started };
}
