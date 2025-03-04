"use client";
import imageCompression from "browser-image-compression";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { UploadButton } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";

import ImagesPreview from "./ImagesPreview";
import { attachImagesToListing } from "@/server/actions/listing.actions";
import { UploadedFileData } from "uploadthing/types";
import { UploadedImageData } from "@/types/listing.types";
import { Button } from "@/components/ui/button";
const compressImage = async (file: File) => {
  const fileSizeMB = file.size / (1024 * 1024);
  const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

  // First convert to canvas to enable WebP conversion
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(bitmap, 0, 0);

  // Convert to WebP with quality based on file size
  let quality = 0.6;
  if (fileSizeMB < 0.2) {
    quality = 1;
  } else if (fileSizeMB > 2) {
    quality = 0.4;
  }

  // Get WebP blob
  const webpBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/webp",
      quality,
    );
  });

  // Now compress the WebP image if needed
  const afterCompressionFileSizeMB = webpBlob.size / (1024 * 1024);
  let changeableOptions = {};
  let needsFurtherCompression = false;
  if (afterCompressionFileSizeMB > 1) {
    changeableOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      alwaysKeepResolution: true,
      initialQuality: quality,
      maxIteration: 15,
    };
    needsFurtherCompression = true;
  }
  if (afterCompressionFileSizeMB > 0.3 && afterCompressionFileSizeMB < 1) {
    changeableOptions = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      alwaysKeepResolution: true,
      initialQuality: quality,
      maxIteration: 10,
    };
    needsFurtherCompression = true;
  }

  if (needsFurtherCompression) {
    const compressedFile = await imageCompression(
      new File([webpBlob], webpFileName, { type: "image/webp" }),
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        alwaysKeepResolution: true,
        initialQuality: quality,
        maxIteration: 15,
      },
    );
    return compressedFile;
  }

  return new File([webpBlob], webpFileName, { type: "image/webp" });
};

const compareCompression = (files: File[], compressedFiles: File[]) => {
  files.forEach((originalFile, index) => {
    const compressedFile = compressedFiles[index];
    const originalSizeMB = (originalFile.size / (1024 * 1024)).toFixed(2);
    const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
    const compressionRatio = (
      (1 - compressedFile.size / originalFile.size) *
      100
    ).toFixed(1);

    console.log(`File: ${originalFile.name}`);
    console.log(`  Original size: ${originalSizeMB} MB`);
    console.log(`  Compressed size: ${compressedSizeMB} MB`);
    console.log(`  Compression ratio: ${compressionRatio}%`);
    console.log("---");
  });

  // Log total statistics
  const totalOriginalMB = (
    files.reduce((sum, file) => sum + file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);
  const totalCompressedMB = (
    compressedFiles.reduce((sum, file) => sum + file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);
  const totalCompressionRatio = (
    (1 -
      compressedFiles.reduce((sum, file) => sum + file.size, 0) /
        files.reduce((sum, file) => sum + file.size, 0)) *
    100
  ).toFixed(1);

  console.log("Total Statistics:");
  console.log(`  Original size: ${totalOriginalMB} MB`);
  console.log(`  Compressed size: ${totalCompressedMB} MB`);
  console.log(`  Overall compression ratio: ${totalCompressionRatio}%`);
};
export default function Step6({ listing }: { listing: Listing }) {
  const t = useTranslations("listing.new.progress.steps.media");
  const [ytLink, setYtLink] = useState(listing.videoLink || "");
  const [images, setImages] = useState<UploadedImageData[]>(
    listing.images ? (listing.images as UploadedImageData[]) : [],
  );
  // console.log("2images: ", images);
  // console.log("2images: ", JSON.stringify(images));
  // console.log("2listing: ", listing.images);
  // console.log("2listing: ", JSON.stringify(listing.images));
  const ytLinkRegex =
    /^(?:https?:\/\/)?(?:(?:www|m)\.)?((?:youtube\.com|youtu.be)\/(?:watch\?v=)?)([\w\-_]+)(?:\?[^#]*)?$/;

  const [left, right] = ytLink.split("v=");
  const validYtLink =
    left.startsWith("https://www.youtube.com/watch?") && right.length === 11;

  return (
    <div className="w-full min-w-[526px] p-2">
      <input type="string" className="hidden" defaultValue="6" name="step" />
      <input
        type="hidden"
        className="hidden"
        value={JSON.stringify(images)}
        name="images"
      />

      <h2 className="text-lg">{t("title")}</h2>
      <Separator className="my-2 mt-4" />
      <div className="flex flex-col justify-between">
        <span className="text-sm text-gray-500">
          *{t("uploadHighResolution")}
        </span>
        <span className="my-3 text-sm font-semibold text-gray-500">
          {images.length}/15 {t("uploaded")} | <span>{t("controls")} </span>
        </span>
      </div>

      <div className="w-max">
        <UploadButton
          content={{
            button: () => {
              return <span>{t("chooseFiles")}</span>;
            },
            allowedContent: () => {
              return <span>{t("allowedContent")}</span>;
            },
          }}
          endpoint="listingImagesUpload"
          onClientUploadComplete={async (res) => {
            console.log("Files: ", res);
            const imagesAttachingToListing = await attachImagesToListing(
              [
                ...images,
                ...res.map((file) => {
                  const imageData: UploadedImageData = {
                    url: file.url,
                    name: file.name,
                    size: file.size,
                    key: file.key,
                    lastModified: file.lastModified,
                    appUrl: file.appUrl,
                    customId: file.customId,
                    type: file.type,
                    fileHash: file.fileHash,
                  };

                  return imageData;
                }),
              ],
              listing.listingNumber,
            );

            console.log("imagesAttachingToListing: ", imagesAttachingToListing);

            if (imagesAttachingToListing.success) {
              setImages([
                ...images,
                ...res.map((file) => {
                  const imageData: UploadedImageData = {
                    url: file.url,
                    name: file.name,
                    size: file.size,
                    key: file.key,
                    lastModified: file.lastModified,
                    appUrl: file.appUrl,
                    customId: file.customId,
                    type: file.type,
                    fileHash: file.fileHash,
                  };

                  return imageData;
                }),
              ]);
            }
          }}
          onBeforeUploadBegin={async (files) => {
            // Compress each image before upload
            // console.log("files: ", files[0]);
            // console.log("files: ", files);

            const totalSizeMB =
              files.reduce((total, file) => total + file.size, 0) / 1024 / 1024;
            console.log(`Total compressed files size: ${totalSizeMB} MB`);
            const compressedFiles = await Promise.all(
              files.map(async (file) => await compressImage(file)),
            );
            compareCompression(files, compressedFiles);

            // console.log("compressedFiles: ", compressedFiles[0]);
            // console.log("compressedFiles: ", compressedFiles);
            const totalCompressedSizeMB =
              compressedFiles.reduce((total, file) => total + file.size, 0) /
              1024 /
              1024;
            console.log(
              `Total compressed files size: ${totalCompressedSizeMB} MB`,
            );
            return compressedFiles;
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>

      <ImagesPreview images={images} setImages={setImages} listing={listing} />

      <div className="mt-4 flex flex-col gap-2">
        <Label htmlFor="videoLink">{t("youtubeLink")}</Label>
        <span className="text-xs text-gray-500">{t("youtubeLinkExample")}</span>
        <Input
          id="videoLink"
          name="videoLink"
          pattern={ytLinkRegex.source}
          placeholder={t("youtubeLinkPlaceholder")}
          value={ytLink}
          onChange={(e) => {
            setYtLink(e.target.value);
          }}
        />
        {ytLink && validYtLink && (
          <iframe
            width="320"
            height="185"
            src={`https://www.youtube.com/embed/${ytLink.split("v=")[1]}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
