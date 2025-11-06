import { NextResponse } from "next/server";

export async function POST() {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.ALERTS_FROM_EMAIL;
  const to = process.env.ALERTS_FROM_EMAIL; // send to yourself

  if (!key || !from) {
    return NextResponse.json({ ok: false, error: "Missing SENDGRID_API_KEY or ALERTS_FROM_EMAIL" }, { status: 500 });
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
    subject: "Consumables Tracker – Test Email",
    content: [{ type: "text/plain", value: "If you got this, SendGrid is wired correctly. 🎉" }]
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ ok: false, status: res.status, body: text }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}