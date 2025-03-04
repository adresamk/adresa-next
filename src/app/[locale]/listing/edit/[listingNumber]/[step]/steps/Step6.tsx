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

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const compressImageALot = async (file: File) => {
  const fileSizeMB = file.size / (1024 * 1024);
  const fileSizeKB = file.size / 1024;
  const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

  // Skip compression for small files (less than 150KB)
  if (fileSizeKB < 150) {
    return file;
  }

  // First convert to canvas to enable WebP conversion
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(bitmap, 0, 0);

  // Always use aggressive quality setting
  const quality = 0.2;

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

  // Always apply maximum compression
  const compressedFile = await imageCompression(
    new File([webpBlob], webpFileName, { type: "image/webp" }),
    {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      alwaysKeepResolution: true,
      initialQuality: quality,
      maxIteration: 20,
    },
  );

  return compressedFile;
};

const analyzeImage = async (file: File) => {
  const img = await createImageBitmap(file);
  console.log("Image analysis:", {
    fileName: file.name,
    fileType: file.type,
    fileSize: (file.size / (1024 * 1024)).toFixed(2) + "MB",
    width: img.width,
    height: img.height,
    aspectRatio: (img.width / img.height).toFixed(2),
    deviceType: isMobileDevice() ? "mobile" : "desktop",
    lastModified: new Date(file.lastModified).toISOString(),
  });
};

const compressImage = async (file: File) => {
  await analyzeImage(file);
  const fileSizeMB = file.size / (1024 * 1024);
  const fileSizeKB = file.size / 1024;
  const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

  console.log("Initial file name: " + file.name);
  console.log("Initial file type: " + file.type);
  console.log("Initial file size in MB: " + fileSizeMB.toFixed(2));
  console.log("Initial file size in KB: " + fileSizeKB.toFixed(2));

  // Skip compression for small files (less than 150KB)
  if (fileSizeKB < 150) {
    console.log("File too small, skipping compression");
    return file;
  }

  // Load image to get dimensions
  const img = await createImageBitmap(file);
  const { width, height } = img;

  console.log("Image dimensions:", { width, height });

  // Determine if pre-compression is needed based on file characteristics
  const needsPreCompression =
    fileSizeMB > 3 || // Large file size
    width > 4000 || // Very wide
    height > 4000 || // Very tall
    width * height > 4000 * 3000; // High total pixel count

  let workingFile = file;

  if (needsPreCompression) {
    console.log("Large image detected, applying pre-compression");
    workingFile = await imageCompression(file, {
      maxSizeMB: 1, // Reduce by at least 50% but cap at 2MB
      maxWidthOrHeight: 1920, // Reasonable size for web
      useWebWorker: true,
      alwaysKeepResolution: true,
      initialQuality: 0.3,
      maxIteration: 15,
      fileType: "image/webp",
    });

    console.log(
      `After pre-compression: sizeMB: ${(workingFile.size / (1024 * 1024)).toFixed(2)}`,
    );
  }

  // Convert to WebP and apply final compression
  const bitmap = await createImageBitmap(workingFile);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(bitmap, 0, 0);

  const quality = 0.2;

  const webpBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/webp",
      quality,
    );
  });

  console.log(
    `After WebP conversion: sizeMB: ${(webpBlob.size / (1024 * 1024)).toFixed(2)}`,
  );

  // If WebP conversion resulted in a larger file, revert to first pass result
  if (webpBlob.size > workingFile.size) {
    console.log("WebP conversion increased size, using first pass result");
    return workingFile;
  }
  console.log(
    "WebP conversion did not increase size, continuing with final compression",
  );

  // Final compression pass
  const compressedFile = await imageCompression(
    new File([webpBlob], webpFileName, { type: "image/webp" }),
    {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      alwaysKeepResolution: true,
      initialQuality: quality,
      maxIteration: 15,
    },
  );

  console.log(
    `Final compressed size: sizeMB: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}`,
  );

  return compressedFile;
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
