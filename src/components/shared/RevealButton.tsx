"use client";
import { Globe, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface RevealButtonProps {
  value: string;
  usecase: "website" | "phone";
  variant?: "ghost" | "outline";
}
export default function RevealButton({
  value = "Empty Value",
  usecase,
  variant = "ghost",
}: RevealButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  return (
    <Button
      variant={variant}
      className="min-w-[160px] whitespace-nowrap"
      onClick={() => {
        setIsRevealed(true);
      }}
    >
      {!isRevealed ? (
        <>
          {usecase === "website" && (
            <>
              {" "}
              <Globe className="mr-2" /> Website
            </>
          )}

          {usecase === "phone" && (
            <>
              {" "}
              <Phone className="mr-2" /> Phone
            </>
          )}
        </>
      ) : (
        <>
          {usecase === "website" && (
            <>
              {" "}
              <a href={value} target="_blank">
                {value}
              </a>
            </>
          )}

          {usecase === "phone" && (
            <>
              {" "}
              <a href={"tel:" + value} target="_blank">
                {value}
              </a>
            </>
          )}
        </>
      )}
    </Button>
  );
}
