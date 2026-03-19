import { DepositForm } from "./DepositForm";
import { DepositGuide } from "./DepositGuide";
import { SupportSection } from "./SupportSection";

export default function MobileDepositPage() {
  return (
    <div className="bg-background  pb-18 custom-scrollbar overflow-y-auto max-h-screen px-4 items-stretch justify-start mx-auto flex flex-col py-4">
      <div className=" w-full">
        <DepositForm />
      </div>
      <div className="mt-6">
        <DepositGuide />
      </div>
      <div className="mt-8">
        <SupportSection />
      </div>
    </div>
  );
}
