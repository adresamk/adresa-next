"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { UploadButton } from "@/lib/uploadthing";

import ImagesPreview from "./ImagesPreview";
import { attachImagesToListing } from "@/server/actions/listing.actions";

export default function Step6({ listing }: { listing: Listing }) {
  const [ytLink, setYtLink] = useState(listing.videoLink || "");
  const [images, setImages] = useState<any[]>(listing.images || []);
  const ytLinkRegex =
    /^(?:https?:\/\/)?(?:(?:www|m)\.)?((?:youtube\.com|youtu.be)\/(?:watch\?v=)?)([\w\-_]+)(?:\?[^#]*)?$/;
  // const validYtLink = ytLinkRegex.test(ytLink);
  const [left, right] = ytLink.split("v=");
  const validYtLink =
    left.startsWith("https://www.youtube.com/watch?") && right.length === 11;
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="6" name="step" />

      <h2 className="text-lg">Images and Video</h2>
      <Separator className="my-2 mt-4" />

      {/* <CustomImageUpload /> */}
      <div className="w-max">
        <UploadButton
          endpoint="listingImagesUpload"
          onClientUploadComplete={async (res) => {
            // Do something with the response
            console.log("Files: ", res);
            // here on res we have a value key, that should be used for deleting the files
            // afterwards so maybe add this to the db as well?
            const imagesAttachingToListing = await attachImagesToListing(
              [...images, ...res.map((file) => file.url)],
              listing.listingNumber,
            );

            console.log("imagesAttachingToListing: ", imagesAttachingToListing);

            if (imagesAttachingToListing.success) {
              setImages([...images, ...res.map((file) => file.url)]);
            }
            // alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
      <ImagesPreview images={images} setImages={setImages} />

      <div className="mt-4 flex flex-col gap-2">
        <Label htmlFor="videoLink"> Link to YouTube video</Label>
        <span className="text-xs text-gray-500">
          ex: https://www.youtube.com/watch?v=[videoID]{" "}
        </span>
        <Input
          id="videoLink"
          name="videoLink"
          pattern={ytLinkRegex.source}
          placeholder="https://www.youtube.com/watch?v=[videoID]"
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
