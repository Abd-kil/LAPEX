import type { Metadata } from "next";
import { Suspense } from "react";
import { I18nProvider } from "@/app/components/i18n/I18nProvider";
import { SiteFooter } from "@/app/components/layout/SiteFooter";
import { SiteHeader } from "@/app/components/layout/SiteHeader";
import RouteTransitionLoader from "@/app/components/ui/RouteTransitionLoader";
import { getDictionary } from "@/app/lib/i18n/getDictionary";
import { getLocaleFromParams } from "@/app/lib/i18n/getLocaleFromParams";
import { LOCALES } from "@/app/lib/i18n/locales";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "LAPEX",
  description: "Laptop reviews, comparisons, and buying guides",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = getLocaleFromParams(resolvedParams);
  const dict = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} dict={dict}>
      <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-dvh">
        <Suspense fallback={null}>
          <RouteTransitionLoader />
        </Suspense>
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1240px] px-4 py-8">{children}</main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}

