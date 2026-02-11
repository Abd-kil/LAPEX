"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { AuthSplitLayout } from "@/app/components/sections/auth/AuthSplitLayout";
import { withLocale } from "@/app/lib/i18n/routing";

export function LoginContent() {
  const { locale, t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthSplitLayout imageAlt={t("a11y.authSideImageAlt")}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("auth.loginTitle")}</h1>
      <p className="mt-2 text-sm text-foreground/70">{t("auth.enterDetails")}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.email")}</label>
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.emailOrUsername")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.password")}</label>
          <input
            type="password"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90" type="submit">
          {t("auth.login")}
        </button>

        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition hover:bg-muted/20"
          type="button"
        >
          <Image src="/images/google-logo.png" alt="" width={16} height={16} className="h-4 w-4" />
          {t("auth.googleSignup")}
        </button>

        <p className="pt-2 text-center text-sm text-foreground/75">
          {t("auth.dontHaveAccount")}{" "}
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={withLocale(locale, "/sign-up")}>
            {t("auth.signup")}
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}

