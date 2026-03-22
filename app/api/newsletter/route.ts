import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (res.status === 201) {
    return NextResponse.json({ success: true });
  }

  // 409 = already subscribed — treat as success
  if (res.status === 409) {
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(
    { error: data?.detail || "Failed to subscribe" },
    { status: res.status }
  );
}
