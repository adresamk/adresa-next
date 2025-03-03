import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="inset-0 z-50 flex h-[calc(100vh-100px)] max-h-screen items-center justify-center bg-transparent">
      <Loader2 className="animate-spin" />
    </div>
  );
}
