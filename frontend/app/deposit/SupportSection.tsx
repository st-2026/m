import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function SupportSection() {
  const t = useTranslations("depositSupport");
  return (
    <div className="bg-background rounded-xl border border-border p-4 flex items-center gap-3">
      <div className="bg-primary/10 rounded-full p-2">
        <MessageSquare className="w-6 h-6 text-primary" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div className="text-foreground text-base font-semibold">
          {t("title")}
        </div>
        <div className="text-muted-foreground text-xs">{t("subtitle")}</div>
      </div>
      <div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  );
}
