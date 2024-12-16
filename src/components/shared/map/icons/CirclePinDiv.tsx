import { cn } from "@/lib/utils";

interface CirclePinDivProps {}
export default function CirclePinDiv({}: CirclePinDivProps) {
  return (
    <div
      className={cn(
        "h-[18px] w-[18px] rounded-full border border-white bg-brand-light-blue text-transparent",
      )}
    ></div>
  );
}
