import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UploadedImageData } from "@/types/listing.types";
import axios from "axios";
import { attachImagesToListing } from "@/server/actions/listing.actions";
import { Listing } from "@prisma/client";

export default function ImagesPreview({
  images,
  setImages,
  listing,
}: {
  images: UploadedImageData[];
  setImages: (images: UploadedImageData[]) => void;
  listing: Listing;
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

  const handleDelete = async (image: UploadedImageData, index: number) => {
    try {
      await axios.delete("/api/uploadthing", {
        data: {
          url: image.url,
          key: image.key,
        },
      });
      const newImages = images.filter((_, idx) => idx !== index);
      const { success } = await attachImagesToListing(
        newImages,
        listing.listingNumber,
      );
      if (success) {
        setImages(newImages);
      }
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {images.length === 0 && (
        <div className="text-center text-sm text-gray-500">{t("noImages")}</div>
      )}
      <div className="mt-3 flex w-full flex-row flex-wrap gap-4 overflow-hidden">
        {previewImages.map((image, idx) => {
          const isDragging = draggedIndex === idx;
          const isHovered = hoverIndex === idx;

          return (
            <div
              key={image.url + idx}
              className={cn(
                "inline-flex max-w-[48%] basis-[48%] cursor-move gap-1 py-0 transition-all duration-300 ease-in-out",
                isDragging && "object-fill opacity-50",
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
              <div className="relative block aspect-video w-full rounded border-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={t("propertyImageAlt", { index: idx + 1 })}
                  className="object-fit relative inset-0 h-full min-w-full rounded"
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
                  onClick={() => handleDelete(image, idx)}
                  className="absolute right-2 top-2 rounded-full bg-slate-100/90 p-2 text-black hover:bg-slate-200"
                >
                  <Trash2Icon className="h-4 w-5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
