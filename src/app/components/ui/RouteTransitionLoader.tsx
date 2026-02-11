"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingLogo from "@/app/components/ui/LoadingLogo";
import Loading from "@/app/[locale]/loading";

const MIN_VISIBLE_MS = 150;
const FAILSAFE_HIDE_MS = 4000;

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const isFirstRender = useRef(true);
  const startTimeRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current);
      failsafeTimeoutRef.current = null;
    }
  };

  const showLoader = () => {
    clearTimeouts();
    startTimeRef.current = Date.now();
    setIsVisible(true);
    failsafeTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      startTimeRef.current = null;
      failsafeTimeoutRef.current = null;
    }, FAILSAFE_HIDE_MS);
  };

  const hideLoader = () => {
    const startTime = startTimeRef.current;
    if (startTime === null) {
      setIsVisible(false);
      return;
    }

    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
    clearTimeouts();
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      startTimeRef.current = null;
      hideTimeoutRef.current = null;
    }, delay);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    hideLoader();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-no-loader="true"]')) return;

      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.getAttribute("data-no-loader") === "true") return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const isSamePath =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (isSamePath && url.hash) return;

      showLoader();
    };

    const handlePopState = () => {
      showLoader();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearTimeouts();
    };
  }, []);

  if (!isVisible) return null;
  return <Loading />;
}
