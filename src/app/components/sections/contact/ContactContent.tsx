"use client";

import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconMail, IconPhone } from "@/app/components/ui/Icon";

export function ContactContent() {
  const { t } = useI18n();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-border bg-background p-6">
        <div className="space-y-5">
          <div>
            <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <IconPhone className="h-5 w-5" />
              </span>
              {t("contact.callUs")}
            </h3>
            <p className="mt-3 text-sm text-foreground/75">{t("contact.callUsText")}</p>
            <p className="mt-2 text-sm font-medium text-foreground">+963999999999</p>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <IconMail className="h-5 w-5" />
              </span>
              {t("contact.writeToUs")}
            </h3>
            <p className="mt-3 text-sm text-foreground/75">{t("contact.writeToUsText")}</p>
            <p className="mt-3 text-sm text-foreground/75">
              {t("contact.orSendEmail")}
              <br />
              customer@lapex.com
              <br />
              support@lapex.com
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-background p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="h-11 rounded-xl border border-border bg-muted/20 px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
              placeholder={t("contact.form.name")}
              name="name"
              type="text"
            />
            <input
              className="h-11 rounded-xl border border-border bg-muted/20 px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
              placeholder={t("contact.form.email")}
              name="email"
              type="email"
            />
            <input
              className="h-11 rounded-xl border border-border bg-muted/20 px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
              placeholder={t("contact.form.phone")}
              name="phone"
              type="tel"
            />
          </div>

          <textarea
            className="min-h-[180px] w-full rounded-2xl border border-border bg-muted/20 p-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("contact.form.message")}
            name="message"
            rows={10}
          />

          <div className="flex justify-end">
            <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90" type="submit">
              {t("common.sendMessage")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

