"use client";

import {
  FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconMail, IconPhone } from "@/app/components/ui/Icon";
import { TurnstileWidget } from "@/app/components/ui/TurnstileWidget";
import {
  ContactFieldErrorKey,
  ContactFieldErrors,
  ContactFormField,
  getContactFieldErrors,
} from "@/app/lib/contact/validate";
import { ContactInfo } from "@/app/lib/constants/models";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type FormStatus = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: ContactFormField[] = ["name", "email", "message", "phone"];

function fieldInputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-xl border bg-muted/20 px-3 text-sm outline-none ring-ring/40 transition focus:ring-2 disabled:opacity-60",
    hasError
      ? "border-destructive focus:border-destructive/70 focus:ring-destructive/20"
      : "border-border focus:border-primary/50",
  ].join(" ");
}

export function ContactContent({ contactInfo }: { contactInfo: ContactInfo }) {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    setTurnstileKey((key) => key + 1);
  }, []);

  const fieldErrorMessage = (key: ContactFieldErrorKey) =>
    t(`contact.form.errors.${key}`);

  const clearFieldError = (field: ContactFormField) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const focusFirstInvalidField = (errors: ContactFieldErrors) => {
    const firstField = FIELD_ORDER.find((field) => errors[field]);
    if (!firstField) {
      return;
    }
    const element = formRef.current?.elements.namedItem(firstField);
    if (element instanceof HTMLElement) {
      element.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setFormError("");

    if (!TURNSTILE_SITE_KEY) {
      setStatus("error");
      setFormError(t("contact.form.notConfigured"));
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    const errors = getContactFieldErrors(payload);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      focusFirstInvalidField(errors);
      return;
    }

    setFieldErrors({});

    if (!turnstileToken) {
      setStatus("error");
      setFormError(t("contact.form.captchaRequired"));
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          website: formData.get("website"),
          turnstileToken,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        setStatus("error");
        setFormError(result.error ?? t("contact.form.error"));
        resetTurnstile();
        return;
      }

      setStatus("success");
      form.reset();
      resetTurnstile();
    } catch {
      setStatus("error");
      setFormError(t("contact.form.error"));
    }
  };

  const isSubmitting = status === "submitting";

  const renderFieldError = (field: ContactFormField) => {
    const errorKey = fieldErrors[field];
    if (!errorKey) {
      return null;
    }

    return (
      <p
        id={`contact-${field}-error`}
        className="mt-1 text-xs text-destructive"
        role="alert"
      >
        {fieldErrorMessage(errorKey)}
      </p>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-border bg-background p-6">
        <div className="space-y-5">
          {contactInfo.phone && (
            <div>
              <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <IconPhone className="h-5 w-5" />
                </span>
                {t("contact.callUs")}
              </h3>
              <p className="mt-3 text-sm text-foreground/75">
                {t("contact.callUsText")}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </p>
            </div>
          )}

          {(contactInfo.email ||
            contactInfo.secondary_email ||
            contactInfo.ads_email) && (
            <div className="border-t border-border pt-5">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <IconMail className="h-5 w-5" />
                </span>
                {t("contact.writeToUs")}
              </h3>
              <p className="mt-3 text-sm text-foreground/75">
                {t("contact.writeToUsText")}
              </p>
              <p className="mt-3 text-sm text-foreground/75">
                {t("contact.orSendEmail")}
                <br />
                {contactInfo.email && (
                  <>
                    <a href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                    <br />
                  </>
                )}
                {contactInfo.secondary_email && (
                  <>
                    <a href={`mailto:${contactInfo.secondary_email}`}>
                      {contactInfo.secondary_email}
                    </a>
                    <br />
                  </>
                )}
                {contactInfo.ads_email && (
                  <>
                    <a href={`mailto:${contactInfo.ads_email}`}>
                      {contactInfo.ads_email}
                    </a>
                    <br />
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-background p-6">
        <form
          ref={formRef}
          className="space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <p className="text-xs text-foreground/60">{t("contact.form.requiredHint")}</p>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                {t("contact.form.name")} <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-name"
                className={fieldInputClass(!!fieldErrors.name)}
                name="name"
                type="text"
                maxLength={100}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                onChange={() => clearFieldError("name")}
              />
              {renderFieldError("name")}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                {t("contact.form.email")} <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-email"
                className={fieldInputClass(!!fieldErrors.email)}
                name="email"
                type="email"
                maxLength={254}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                onChange={() => clearFieldError("email")}
              />
              {renderFieldError("email")}
            </div>

            <div>
              <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                {t("contact.form.phone")}
              </label>
              <input
                id="contact-phone"
                className={fieldInputClass(!!fieldErrors.phone)}
                name="phone"
                type="tel"
                maxLength={30}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
                onChange={() => clearFieldError("phone")}
              />
              {renderFieldError("phone")}
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
              {t("contact.form.message")} <span className="text-destructive">*</span>
            </label>
            <textarea
              id="contact-message"
              className={[
                "min-h-[180px] w-full rounded-2xl border bg-muted/20 p-3 text-sm outline-none ring-ring/40 transition focus:ring-2 disabled:opacity-60",
                fieldErrors.message
                  ? "border-destructive focus:border-destructive/70 focus:ring-destructive/20"
                  : "border-border focus:border-primary/50",
              ].join(" ")}
              name="message"
              rows={10}
              maxLength={2000}
              disabled={isSubmitting}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
              onChange={() => clearFieldError("message")}
            />
            {renderFieldError("message")}
          </div>

          {TURNSTILE_SITE_KEY ? (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                {t("contact.form.captchaLabel")}{" "}
                <span className="text-destructive">*</span>
              </p>
              <TurnstileWidget
                key={turnstileKey}
                siteKey={TURNSTILE_SITE_KEY}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
          ) : (
            <p className="text-sm text-destructive">
              {t("contact.form.notConfigured")}
            </p>
          )}

          {status === "success" && (
            <p className="text-sm text-green-600" role="status">
              {t("contact.form.success")}
            </p>
          )}

          {status === "error" && formError && (
            <p className="text-sm text-destructive text-red-500" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end">
            <button
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting || !TURNSTILE_SITE_KEY}
            >
              {isSubmitting ? t("contact.form.sending") : t("common.sendMessage")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
