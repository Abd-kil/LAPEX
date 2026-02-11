"use client";

import Link from "next/link";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { withLocale } from "@/app/lib/i18n/routing";

export function SiteFooter() {
  const { locale, t } = useI18n();

  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-foreground">{t("footer.account")}</h4>
            <ul className="space-y-2 text-foreground/75">
              <li>
                <Link className="transition hover:text-foreground" href={withLocale(locale, "/")}>
                  {t("footer.shop")}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-foreground" href={withLocale(locale, "/favorite")}>
                  {t("footer.favorite")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-foreground">{t("footer.quickLink")}</h4>
            <ul className="space-y-2 text-foreground/75">
              <li>{t("footer.privacyPolicy")}</li>
              <li>{t("footer.termsOfUse")}</li>
              <li>{t("footer.faq")}</li>
              <li>
                <Link className="transition hover:text-foreground" href={withLocale(locale, "/contact")}>
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}

