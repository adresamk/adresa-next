"use client";

import { useEffect, useState, useRef } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Check initial online status
    const initialOfflineStatus = !window.navigator.onLine;
    setIsOffline(initialOfflineStatus);
    if (initialOfflineStatus) {
      setHasBeenOffline(true);
      dialogRef.current?.showModal();
    }

    const handleOnline = () => {
      setIsOffline(false);
      // Auto reload when connection is restored
      //   window.location.reload();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setHasBeenOffline(true);
      dialogRef.current?.showModal();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-[100dvh] w-[100vw] bg-transparent p-0"
    >
      <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="mx-4 rounded-lg bg-white p-6 text-center shadow-xl">
          <WifiOff className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">
            {isOffline ? "You are offline" : "Connection restored"}
          </h2>
          <p className="mb-4 text-gray-600">
            {isOffline
              ? "Please check your internet connection and try again"
              : "Click the button below to reload the page"}
          </p>
          <button
            onClick={() => window.location.reload()}
            disabled={isOffline}
            className="rounded bg-blue-500 px-4 py-2 text-white enabled:hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reload Page
          </button>
        </div>
      </div>
    </dialog>
  );
}
