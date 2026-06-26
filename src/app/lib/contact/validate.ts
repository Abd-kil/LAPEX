export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export type ContactFormField = "name" | "email" | "phone" | "message";

export type ContactFieldErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "phoneTooLong"
  | "messageRequired"
  | "messageTooShort";

export type ContactFieldErrors = Partial<
  Record<ContactFormField, ContactFieldErrorKey>
>;

export type ContactFormValidationResult =
  | { ok: true; data: ContactFormPayload }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getContactFieldErrors(body: unknown): ContactFieldErrors {
  if (!body || typeof body !== "object") {
    return { message: "messageRequired" };
  }

  const { name, email, phone, message } = body as Record<string, unknown>;
  const errors: ContactFieldErrors = {};

  if (typeof name !== "string" || name.trim().length < 1) {
    errors.name = "nameRequired";
  } else if (name.length > 100) {
    errors.name = "nameRequired";
  }

  if (typeof email !== "string" || email.trim().length < 1) {
    errors.email = "emailRequired";
  } else if (email.length > 254 || !EMAIL_PATTERN.test(email.trim())) {
    errors.email = "emailInvalid";
  }

  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string" || phone.length > 30) {
      errors.phone = "phoneTooLong";
    }
  }

  if (typeof message !== "string" || message.trim().length < 1) {
    errors.message = "messageRequired";
  } else if (message.trim().length < 10 || message.length > 2000) {
    errors.message = "messageTooShort";
  }

  return errors;
}

export function validateContactForm(
  body: unknown
): ContactFormValidationResult {
  const fieldErrors = getContactFieldErrors(body);
  const firstError = Object.values(fieldErrors)[0];

  if (firstError) {
    const messages: Record<ContactFieldErrorKey, string> = {
      nameRequired: "Name is required (max 100 characters).",
      emailRequired: "Email is required.",
      emailInvalid: "A valid email address is required.",
      phoneTooLong: "Phone number is too long.",
      messageRequired: "Message is required.",
      messageTooShort: "Message must be between 10 and 2000 characters.",
    };
    return { ok: false, error: messages[firstError] };
  }

  const { name, email, phone, message } = body as Record<string, unknown>;

  return {
    ok: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      phone:
        typeof phone === "string" && phone.trim().length > 0
          ? phone.trim()
          : undefined,
      message: (message as string).trim(),
    },
  };
}
