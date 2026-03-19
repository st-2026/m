"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import {
  getStoredLocale,
  setLocaleCookie,
  setStoredLocale,
} from "@/lib/i18n/locale";

export function LocaleSync() {
  const locale = useLocale();
  const router = useRouter();
  const didSync = useRef(false);

  useEffect(() => {
    if (didSync.current) return;
    didSync.current = true;

    const stored = getStoredLocale();
    const telegram = stored;
    const resolved = stored || telegram || defaultLocale;

    setStoredLocale(resolved);
    setLocaleCookie(resolved);

    if (resolved !== locale) {
      setTimeout(() => {
        router.refresh();
      }, 0);
    }
  }, [locale, router]);

  return null;
}
