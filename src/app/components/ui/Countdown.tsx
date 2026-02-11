"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";

export type CountdownDate = { day: number; month: number; year: number };

type TimeRemaining = { days: number; hours: number; minutes: number; seconds: number };

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function calcRemaining(target: Date): TimeRemaining {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

export function Countdown({ to, showColons = false }: { to: CountdownDate; showColons?: boolean }) {
  const { t } = useI18n();
  const target = useMemo(() => new Date(to.year, to.month - 1, to.day), [to.day, to.month, to.year]);
  const [left, setLeft] = useState<TimeRemaining>(() => calcRemaining(target));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(calcRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts: Array<{ label: string; value: string }> = [
    { label: t("timer.days"), value: pad2(left.days) },
    { label: t("timer.hours"), value: pad2(left.hours) },
    { label: t("timer.minutes"), value: pad2(left.minutes) },
    { label: t("timer.seconds"), value: pad2(left.seconds) },
  ];

  return (
    <div className="flex items-end gap-3">
      {parts.map((p, idx) => (
        <div key={p.label} className="flex items-end gap-3">
          <div className="text-center">
            <div className="text-[11px] font-medium text-muted-foreground">{p.label}</div>
            <div className="text-xl font-semibold tracking-tight text-foreground">{p.value}</div>
          </div>
          {showColons && idx !== parts.length - 1 ? (
            <div className="pb-1 text-xl font-semibold text-primary">:</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

