"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import CustomImageUpload from "./CustomImageUpload";
import UploadThing from "./UploadThing";

export default function Step6() {
  const [ytLink, setYtLink] = useState("");

  return (
    <div className="p-2">
      <input type="string" className="hidden" value="6" name="step" />

      <h2 className="text-lg">Images and Video</h2>
      <Separator className="my-2 mt-4" />

      {/* <CustomImageUpload /> */}
      <UploadThing />
      <div className="flex flex-col gap-2 mt-4">
        <Label htmlFor="videoLink"> Link to YouTube video</Label>
        <Input
          id="videoLink"
          name="videoLink"
          placeholder="https://www.youtube.com/watch?v=[videID]"
          value={ytLink}
          onChange={(e) => {
            setYtLink(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
