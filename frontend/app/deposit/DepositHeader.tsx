import { useTranslations } from "next-intl";

export function DepositHeader() {
  const t = useTranslations("depositHeader");
  return (
    <div className="pt-6 w-full py-2 px-5 ">
      <h2 className="text-foreground text-lg font-semibold">{t("title")}</h2>
    </div>
  );
}
