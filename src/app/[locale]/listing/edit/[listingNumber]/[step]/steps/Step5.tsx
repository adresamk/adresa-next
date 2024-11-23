"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { Input } from "@/components/ui/input";

// Opis Description
export default function Step5({ listing }: { listing: Listing }) {
  const [description, setDescription] = useState(listing.description || "");
  const [mkdDescription, setMkdDescription] = useState(
    listing.mkdDescription || "",
  );
  const [albDescription, setAlbDescription] = useState(
    listing.albDescription || "",
  );
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="5" name="step" />

      <h2 className="text-lg">Description</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>

        <div className="">
          <Input
            name="title"
            className="pb-2"
            id="title"
            defaultValue={listing.title || ""}
            maxLength={112}
          />
        </div>

        <Label htmlFor="description">
          Detailed english description for the property
        </Label>

        <div className="">
          <Textarea
            name="description"
            className="pb-2"
            rows={10}
            id="description"
            value={description}
            maxLength={5000}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <div className="mt-1 text-sm text-slate-400">
            {description.length}/5000 characters
          </div>
          <Button type="button" className="mt-3">
            Translate to
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex gap-3">
          <Label htmlFor="mkdDescription">Macedonian Translation </Label>
        </div>

        <div className="">
          <Textarea
            className="pb-2"
            rows={10}
            id="mkdDescription"
            name="mkdDescription"
            value={mkdDescription}
            maxLength={5000}
            onChange={(e) => {
              setMkdDescription(e.target.value);
            }}
          />
          <div className="mt-1 text-sm text-slate-400">
            {mkdDescription.length}/5000 characters
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex gap-3">
          <Label htmlFor="albDescription">Albanian Translation </Label>
        </div>

        <div className="">
          <Textarea
            className="pb-2"
            rows={10}
            maxLength={5000}
            id="albDescription"
            name="albDescription"
            value={albDescription}
            onChange={(e) => {
              setAlbDescription(e.target.value);
            }}
          />
          <div className="mt-1 text-sm text-slate-400">
            {albDescription.length}/5000 characters
          </div>
        </div>
      </div>
    </div>
  );
}
