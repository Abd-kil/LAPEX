"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { AuthSplitLayout } from "@/app/components/sections/auth/AuthSplitLayout";
import { withLocale } from "@/app/lib/i18n/routing";

export function SignUpContent() {
  const { locale, t } = useI18n();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");

  const usernameRegex = useMemo(() => /^[a-zA-Z0-9._-]{3,16}$/, []);
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const passwordRegex = useMemo(() => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, []);

  const validateUsername = () => {
    const ok = usernameRegex.test(username);
    setUsernameMsg(ok ? "" : t("validation.username"));
    return ok;
  };

  const validateEmail = () => {
    const ok = emailRegex.test(email);
    setEmailMsg(ok ? "" : t("validation.email"));
    return ok;
  };

  const validatePassword = () => {
    const ok = passwordRegex.test(password);
    setPasswordMsg(ok ? "" : t("validation.password"));
    return ok;
  };

  const validateConfirm = () => {
    const ok = confirmPassword === password;
    setConfirmMsg(ok ? "" : t("validation.confirmPassword"));
    return ok;
  };

  return (
    <AuthSplitLayout imageAlt={t("a11y.authSideImageAlt")}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("auth.signupTitle")}</h1>
      <p className="mt-2 text-sm text-foreground/70">{t("auth.enterDetails")}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const ok = [validateUsername(), validateEmail(), validatePassword(), validateConfirm()].every(Boolean);
          void ok;
        }}
      >
        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.username")}</label>
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validateUsername}
          />
          {usernameMsg ? <p className="text-xs text-primary">{usernameMsg}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.email")}</label>
          <input
            type="email"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
          />
          {emailMsg ? <p className="text-xs text-primary">{emailMsg}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.password")}</label>
          <input
            type="password"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
          {passwordMsg ? <p className="text-xs text-primary">{passwordMsg}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/80">{t("auth.confirmPassword")}</label>
          <input
            type="password"
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
            placeholder={t("auth.confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validateConfirm}
          />
          {confirmMsg ? <p className="text-xs text-primary">{confirmMsg}</p> : null}
        </div>

        <button className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90" type="submit">
          {t("auth.createAccount")}
        </button>

        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition hover:bg-muted/20"
          type="button"
        >
          <Image src="/images/google-logo.png" alt="" width={16} height={16} className="h-4 w-4" />
          {t("auth.googleSignup")}
        </button>

        <p className="pt-2 text-center text-sm text-foreground/75">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={withLocale(locale, "/login")}>
            {t("auth.login")}
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}

