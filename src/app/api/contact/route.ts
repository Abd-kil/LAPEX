import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/app/lib/contact/rateLimit";
import { validateContactForm } from "@/app/lib/contact/validate";
import { sendContactMessage } from "@/app/lib/telegram/sendContactMessage";
import { verifyTurnstileToken } from "@/app/lib/turnstile/verifyTurnstile";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.TELEGRAM_BOT_TOKEN ||
      !process.env.TELEGRAM_CHAT_ID ||
      !process.env.TURNSTILE_SECRET_KEY
    ) {
      return NextResponse.json(
        { success: false, error: "Contact form is not configured." },
        { status: 503 }
      );
    }

    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: bots that fill hidden fields get a fake success response.
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const turnstileToken =
      typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: "Captcha verification is required." },
        { status: 400 }
      );
    }

    const captchaValid = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!captchaValid) {
      return NextResponse.json(
        { success: false, error: "Captcha verification failed." },
        { status: 400 }
      );
    }

    const validation = validateContactForm(body);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    await sendContactMessage(validation.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
