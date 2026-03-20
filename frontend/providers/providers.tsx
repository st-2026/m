"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { LocaleSync } from "./locale-sync";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth.provider";

interface ProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

const Provider = ({ children, locale, messages }: ProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryProvider>
          <AuthProvider>
            <LocaleSync />
            {children}
          </AuthProvider>
        </QueryProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Provider;
