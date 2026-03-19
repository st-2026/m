import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function DepositGuide() {
  const t = useTranslations("depositGuide");
  return (
    <Card className="bg-background border-border rounded-xl p-0">
      <div className="p-4">
        <h3 className="text-foreground text-base font-semibold mb-2">
          {t("title")}
        </h3>
        <div className="rounded-lg overflow-hidden mb-4 relative">
          <div className="bg-black flex items-center justify-center h-[220px]">
            <Image
              src="/deposit-demo.png"
              alt={t("imageAlt")}
              width={180}
              height={320}
              className="object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-60 rounded-full p-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <ol className="list-decimal pl-5 text-sm text-foreground font-medium space-y-2">
          <li>
            {t("steps.deposit.title")}
            <br />
            <span className="text-muted-foreground text-xs font-normal">
              {t("steps.deposit.desc")}
            </span>
          </li>
          <li>
            {t("steps.confirmation.title")}
            <br />
            <span className="text-muted-foreground text-xs font-normal">
              {t("steps.confirmation.desc")}
            </span>
          </li>
          <li>
            {t("steps.paste.title")}
            <br />
            <span className="text-muted-foreground text-xs font-normal">
              {t("steps.paste.desc")}
            </span>
          </li>
        </ol>
      </div>
    </Card>
  );
}
