"use client";
import { Button } from "@/components/ui/button";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { UploadedImageData } from "@/types/listing.types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AgencyLogoUpload({
  existingLogo,
}: {
  existingLogo: UploadedImageData | null | undefined;
}) {
  const [logo, setLogo] = useState<UploadedImageData | null>(
    existingLogo || null,
  );
  const logoDataStringified = logo ? JSON.stringify(logo) : "";
  const t = useTranslations();

  return (
    <div className="relative">
      <input
        type="text"
        name="logo"
        required
        className="sr-only absolute left-12 top-6"
        value={logoDataStringified}
        onChange={() => {}}
      />

      {!logo ? (
        <UploadDropzone
          className={cn(
            "ut-label:leading-4",
            !logo && "border-1 border-red-400",
            "w-full",
          )}
          content={{
            label: ({}) => {
              return (
                <span
                  className={cn("text-sm leading-3", !logo && "text-red-400")}
                >
                  {t("agency.profile.details.logoUploadLabel")}
                </span>
              );
            },
            button: ({ ready, isUploading, uploadProgress, files }) => {
              console.log({ ready, isUploading, uploadProgress, files });
              return (
                <span className={cn("inline-flex items-center gap-2")}>
                  {isUploading &&
                    `${t("common.actions.isUploading")}... ${uploadProgress}%`}
                  {!logo &&
                    !isUploading &&
                    uploadProgress === 0 &&
                    files.length === 0 &&
                    t("common.actions.select")}
                  {logo &&
                    !isUploading &&
                    uploadProgress === 0 &&
                    files.length === 0 &&
                    t("common.actions.change")}
                  {!isUploading &&
                    uploadProgress === 0 &&
                    files.length === 1 &&
                    t(`common.actions.upload`)}
                </span>
              );

              // return <span>{}</span>;
            },
            allowedContent: () => {
              return (
                <span>
                  {t("agency.profile.details.logoUploadAllowedContent")}
                </span>
              );
            },
          }}
          endpoint="agencyLogoUpload"
          onClientUploadComplete={async (res) => {
            // Do something with the response
            console.log("Files: ", res);
            // here on res we have a value key, that should be used for deleting the files
            // afterwards so maybe add this to the db as well?
            const file = res[0];
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

            setLogo(res[0] as UploadedImageData);

            // alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.url}
            className="mt-4 aspect-video h-[160px] w-full rounded border border-slate-600 object-contain p-4"
            alt="Agency Logo"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLogo(null)}
          >
            {t("common.actions.change")}
          </Button>
        </>
      )}
    </div>
  );
}
