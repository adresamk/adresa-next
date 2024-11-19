"use client";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";

export default function AgencyLogoUpload({
  existingLogo,
}: {
  existingLogo: string | null | undefined;
}) {
  const [logo, setLogo] = useState(existingLogo || "");
  return (
    <div>
      <input
        type="text"
        name="logoUrl"
        className="hidden"
        value={logo}
        onChange={() => {}}
      />
      <UploadDropzone
        endpoint="agencyLogoUpload"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          console.log("Files: ", res);
          // here on res we have a value key, that should be used for deleting the files
          // afterwards so maybe add this to the db as well?

          setLogo(res[0].url);
          // alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo || ""} width={200} height={130} alt="Agency Logo" />
      )}
    </div>
  );
}
