import type { ContactFormPayload } from "@/app/lib/contact/validate";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTelegramMessage(data: ContactFormPayload): string {
  const lines = [
    "<b>📩 New LAPEX contact message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(data.name)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
  ];

  if (data.phone) {
    lines.push(`<b>Phone:</b> ${escapeHtml(data.phone)}`);
  }

  lines.push("", `<b>Message:</b>`, escapeHtml(data.message));

  return lines.join("\n");
}

export async function sendContactMessage(
  data: ContactFormPayload
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram bot is not configured.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatTelegramMessage(data),
        parse_mode: "HTML",
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Telegram API error:", errorBody);
    throw new Error("Failed to deliver message.");
  }
}
