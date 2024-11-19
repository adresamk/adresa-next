import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export default function ImagesPreview({
  images,
  setImages,
}: {
  images: string[];
  setImages: (images: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>Images for your property</span>
        <span>{images.length}/15</span>
      </div>

      <div className="grid h-[400px] grid-cols-2 gap-4 overflow-y-auto">
        {images.map((imageUrl, idx) => {
          return (
            <div key={imageUrl} className="relative border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`Image for property ${idx}`}
                className="h-32 w-32 rounded"
                width={325}
                height={198}
              />
              {idx === 0 && (
                <div className="absolute bottom-2 w-full">
                  <div className="mx-2 rounded bg-slate-100/80 p-1 text-center text-black hover:bg-slate-200">
                    Main Image
                  </div>
                </div>
              )}
              <Button className="absolute right-2 top-2 rounded-full bg-slate-100/90 p-2 text-black hover:bg-slate-200">
                <Trash2Icon className="h-4 w-5" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
