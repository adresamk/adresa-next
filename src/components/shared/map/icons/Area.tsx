import { cn } from "@/lib/utils";

type AreaMultiplier = 0 | 2 | 3 | 5 | 7 | 4 | 6 | 10 | 14 | 9 | 15 | 21;
interface AreaProps {
  multiplier: AreaMultiplier;
  className?: string;
}
export default function Area({ multiplier, className }: AreaProps) {
  if (multiplier === 0) {
    return <div className={cn("area-pin-icon", className)}></div>;
  }
  return (
    <div
      className={cn(
        "area-pin-icon left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/50 text-transparent",
        multiplier === 2 && "h-[40px] w-[40px]", // 20px * 2
        multiplier === 3 && "h-[60px] w-[60px]", // 20px * 3
        multiplier === 4 && "h-[80px] w-[80px]", // 20px * 4
        multiplier === 5 && "h-[125px] w-[125px]", // 25px * 5
        multiplier === 6 && "h-[150px] w-[150px]", // 25px * 6
        multiplier === 7 && "h-[210px] w-[210px]", // 30px * 7
        multiplier === 9 && "h-[270px] w-[270px]", // 30px * 9
        multiplier === 10 && "h-[330px] w-[330px]", // 30px * 10
        multiplier === 14 && "h-[420px] w-[420px]", // 30px * 14
        multiplier === 15 && "h-[450px] w-[450px]", // 30px * 15
        multiplier === 21 && "h-[600px] w-[600px]", // 30px * 21
        className,
      )}
    ></div>
  );
}
