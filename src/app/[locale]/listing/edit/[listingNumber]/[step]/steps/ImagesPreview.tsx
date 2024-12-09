import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UploadedImageData } from "@/types/listing.types";

export default function ImagesPreview({
  images,
  setImages,
}: {
  images: UploadedImageData[];
  setImages: (images: UploadedImageData[]) => void;
}) {
  console.log("images: ", images);
  const t = useTranslations("listing.new.progress.steps.media.imagesPreview");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [previewImages, setPreviewImages] =
    useState<UploadedImageData[]>(images);

  useEffect(() => {
    setPreviewImages(images);
  }, [images]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null) return;
    setHoverIndex(index);

    const newPreviewImages = [...images];
    const [draggedImage] = newPreviewImages.splice(draggedIndex, 1);
    newPreviewImages.splice(index, 0, draggedImage);
    setPreviewImages(newPreviewImages);
  };

  const handleDragLeave = () => {
    setHoverIndex(null);
    setPreviewImages(images);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
    setPreviewImages(images);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    setImages(newImages);
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between">
        <span>{t("title")}</span>
        <span>{images.length}/15 </span>
      </div>

      {images.length === 0 && (
        <div className="text-center text-sm text-gray-500">{t("noImages")}</div>
      )}
      <div className="grid max-h-[400px] w-full grid-cols-2 gap-4 overflow-y-auto">
        {previewImages.map((image, idx) => {
          const isDragging = draggedIndex === idx;
          const isHovered = hoverIndex === idx;

          return (
            <div
              key={image.url + idx}
              className={cn(
                "relative cursor-move rounded border-2 transition-all duration-300 ease-in-out",
                isDragging && "opacity-50",
                isHovered && "border-primary",
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDragEnter(idx)}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={t("propertyImageAlt", { index: idx + 1 })}
                className="h-36 min-w-full rounded object-cover"
                width={325}
                height={198}
              />
              {idx === 0 && (
                <div className="absolute bottom-2 w-full">
                  <div className="mx-2 rounded bg-slate-100/80 p-1 text-center text-black hover:bg-slate-200">
                    {t("mainImage")}
                  </div>
                </div>
              )}
              <Button
                type="button"
                onClick={() => handleDelete(idx)}
                className="absolute right-2 top-2 rounded-full bg-slate-100/90 p-2 text-black hover:bg-slate-200"
              >
                <Trash2Icon className="h-4 w-5" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
