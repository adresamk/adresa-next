"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import CustomImageUpload from "./CustomImageUpload";
import { Listing } from "@prisma/client";
import { UploadButton } from "@/lib/uploadthing";
import {
  ClientUploadedFileData,
  FileUploadData,
} from "uploadthing/types";
import { attachImagesToListing } from "../actions";

export default function Step6({ listing }: { listing: Listing }) {
  const [ytLink, setYtLink] = useState(listing.videoLink || "");
  const [images, setImages] = useState<any[]>(listing.images || []);
  const ytLinkRegex =
    /^(?:https?:\/\/)?(?:(?:www|m)\.)?((?:youtube\.com|youtu.be)\/(?:watch\?v=)?)([\w\-_]+)(?:\?[^#]*)?$/;
  return (
    <div className="p-2">
      <input type="string" className="hidden" value="6" name="step" />

      <h2 className="text-lg">Images and Video</h2>
      <Separator className="my-2 mt-4" />

      {/* <CustomImageUpload /> */}
      <div className="w-max">
        <UploadButton
          endpoint="listingImagesUpload"
          onClientUploadComplete={async (res) => {
            // Do something with the response
            console.log("Files: ", res);
            const imagesAttachingToListing =
              await attachImagesToListing(
                [...images, ...res.map((file) => file.url)],
                listing.listingNumber
              );

            console.log(
              "imagesAttachingToListing: ",
              imagesAttachingToListing
            );

            if (imagesAttachingToListing.success) {
              setImages([...images, ...res.map((file) => file.url)]);
            }
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
      <div className="flex gap-1">
        {images.map((imageUrl, idx) => (
          <img
            key={idx}
            src={imageUrl}
            alt={"Property Image"}
            className="w-32 h-32 rounded"
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-4">
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
        {ytLink && ytLink.match(ytLinkRegex) && (
          <iframe
            width="320"
            height="185"
            src={`https://www.youtube.com/embed/${
              ytLink.split("v=")[1]
            }`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
