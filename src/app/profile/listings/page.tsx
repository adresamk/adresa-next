"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cx } from "class-variance-authority";
import {
  AlertCircle,
  Edit,
  EyeOff,
  MousePointerClick,
  Trash,
} from "lucide-react";
import { useState } from "react";

const user = {
  type: "agency",
  properties: [
    {
      id: "2544387",
      uniqueListingNumber: "2544387",
      type: "apartment",
      area: 60,
      createdAt: "1 Јун 2024",
      postedAt: null,
      completed: false,
      views: null,
      visible: false,
      mainImage: "/assets/demo-property-bg.png",
    },
    {
      id: "2544387",
      uniqueListingNumber: "2544387",
      type: "apartment",
      area: 60,
      createdAt: "1 Јун 2024",
      postedAt: "1 Јун 2024",
      completed: false,
      views: 2563,
      visible: false,
      mainImage: "/assets/demo-property-bg.png",
    },
  ],
};
export default function ProfileListingsPage() {
  const [searchFilter, setSearchFilter] = useState("");
  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">My Listings</h3>
      <Separator className="my-3" />
      {user.type === "agency" && (
        <div className="flex justify-between items-center my-2">
          <Input
            className="max-w-[300px]"
            type="search"
            placeholder="Search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <Button
            variant={"outline"}
            className="text-brand-light-blue border-brand-light-blue hover:text-brand-dark-blue"
          >
            {" "}
            Upload CSV{" "}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-5">
        {user.properties
          .filter((e) => {
            // some logic where we can use searchFilter
            return e;
          })
          .map((p) => (
            <div className="flex gap-3 h-[190px] shadow-md">
              <div className="w-4/12 min-w-[250px]">
                <img
                  src={p.mainImage}
                  alt="Property image"
                  className={cx(
                    "w-full h-full bg-cover  rounded-tr-none rounded-br-none",
                    !p.postedAt && "opacity-70"
                  )}
                />
              </div>
              <div className="w-6/12 flex flex-col pl-3">
                <p>Listing: {p.uniqueListingNumber}</p>
                <h4 className=" my-4 font-semibold">
                  {p.type}, {p.area} m2
                </h4>
                <p className="text-xs">
                  created at {p.createdAt} | published at {p.postedAt}
                </p>
                <div className="h-8 mt-auto py-8 flex items-center">
                  {!p.postedAt ? (
                    <div className="flex gap-3 items-center">
                      <AlertCircle stroke="orange" />{" "}
                      <span>Fill in all the required fields!</span>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center">
                      <MousePointerClick fill="blue" />{" "}
                      <span className="font-bold text-brand-light-blue">
                        {p.views} views
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-3/12 flex flex-col justify-between py-3">
                <div className="flex justify-between  text-xs">
                  {!p.postedAt ? (
                    <Button
                      variant={"ghost"}
                      className="text-xs px-2 "
                    >
                      <Edit className="mr-2" /> Edit
                    </Button>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className="text-xs  px-2"
                    >
                      <EyeOff className="mr-2" /> Hide
                    </Button>
                  )}
                  <Button
                    variant={"ghost"}
                    className="text-red-400 hover:text-red-600 text-xs px-2"
                  >
                    <Trash className="mr-2" /> Delete
                  </Button>
                </div>
                <Button
                  variant={p.postedAt ? "outline" : "default"}
                  className={cx(
                    " w-full",
                    p.postedAt &&
                      "text-brand-light-blue border-brand-light-blue hover:text-brand-dark-blue"
                  )}
                >
                  {p.postedAt ? "Edit" : "Publish"}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}