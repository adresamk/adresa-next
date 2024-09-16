"use client";
import { UploadButton } from "@/lib/uploadthing";

export default function UploadThing() {
  return (
    <div>
      <UploadButton
        endpoint="listingImagesUpload"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
