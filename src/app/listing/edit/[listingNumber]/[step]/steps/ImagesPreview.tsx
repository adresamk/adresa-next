import React, { useState } from "react";
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

      <div className="h-[400px] grid gap-4  grid-cols-2 overflow-y-auto">
        {images.map((imageUrl, idx) => {
          return (
            <div key={imageUrl} className="relative border">
              <img
                src={imageUrl}
                className=" w-32 h-32 rounded"
                width={325}
                height={198}
              />
              {idx === 0 && (
                <div className="absolute bottom-2 w-full">
                  <div
                    className=" 
            rounded text-center  mx-2 bg-slate-100/80 p-1  text-black hover:bg-slate-200
            "
                  >
                    Main Image
                  </div>
                </div>
              )}
              <Button className="rounded-full bg-slate-100/90 p-2 absolute top-2 right-2 text-black hover:bg-slate-200">
                <Trash2Icon className="w-5 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
