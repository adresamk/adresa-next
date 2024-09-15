import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
interface PropertyImage {
  url: string;
  isMain: boolean;
  position: number;
}
export default function Step6() {
  const [ytLink, setYtLink] = useState("");
  const [images, setImages] = useState<PropertyImage[]>([
    {
      url: "/assets/demo-property-bg.png",
      isMain: true,
      position: 1,
    },
    {
      url: "/assets/demo-property-bg.png",
      isMain: false,
      position: 2,
    },
    {
      url: "/assets/demo-property-bg.png",
      isMain: false,
      position: 3,
    },
    {
      url: "/assets/demo-property-bg.png",
      isMain: false,
      position: 4,
    },
    {
      url: "/assets/demo-property-bg.png",
      isMain: false,
      position: 5,
    },
    {
      url: "/assets/demo-property-bg.png",
      isMain: false,
      position: 6,
    },
  ]);
  return (
    <div className="p-2">
      <input type="string" className="hidden" value="6" name="step" />

      <h2 className="text-lg">Images and Video</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span>Images for your property</span>
          <span>3/15</span>
        </div>
        <div>
          <Button size={"sm"}>Upload</Button>
        </div>
        <div className="h-[400px] grid gap-4  grid-cols-2 overflow-y-auto">
          {images.map((i) => {
            return (
              <div key={i.url} className="relative">
                <img
                  src={i.url}
                  className="rounded"
                  width={325}
                  height={198}
                />
                {i.isMain && (
                  <div className="absolute bottom-2 w-full">
                    <div
                      className=" 
                    rounded text-center  mx-2 bg-slate-100/80 p-1  text-black hover:bg-slate-200
                    "
                    >
                      Main Image
                    </div>
                  </div>
                )}
                <Button className="rounded-full bg-slate-100/90 p-2 absolute top-2 right-2 text-black hover:bg-slate-200">
                  <Trash2Icon className="w-5 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Label htmlFor="yt-link"> Link to YouTube video</Label>
        <Input
          id="yt-link"
          name="yt-link"
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
