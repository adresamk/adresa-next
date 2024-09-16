"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Opis Description
export default function Step5() {
  const [description, setDescription] = useState("");
  const [translation, setTranslation] = useState("");
  return (
    <div className="p-2">
      <input type="string" className="hidden" value="5" name="step" />

      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Detailed description for the property
        </Label>

        <div className="">
          <Textarea
            className="pb-2"
            rows={10}
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <div className="mt-1 text-sm text-slate-400">
            {description.length}/5000 characters
          </div>
          <Button className="mt-3">Translate to</Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <div className="flex gap-3">
          <Label htmlFor="description">Translation </Label>
        </div>

        <div className="">
          <Textarea
            className="pb-2"
            rows={10}
            id="description"
            value={translation}
            onChange={(e) => {
              setTranslation(e.target.value);
            }}
          />
          <div className="mt-1 text-sm text-slate-400">
            {translation.length}/5000 characters
          </div>
        </div>
      </div>
    </div>
  );
}
