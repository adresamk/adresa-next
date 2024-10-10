"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Listing, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Edit,
  EyeOff,
  MousePointerClick,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { UserRoles } from "@/global/data";
import Link from "next/link";

export default function MyListingsList({
  listings,
  user,
}: {
  listings: Listing[];
  user: User;
}) {
  const [searchFilter, setSearchFilter] = useState("");
  return (
    <>
      {user.role === UserRoles.AGENCY && (
        <div className="flex justify-between items-center my-2">
          <Input
            className="max-w-[300px]"
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search"
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
        {listings
          .filter((e: Listing) => {
            // some logic where we can use searchFilter
            return e;
          })
          .map((p: Listing) => (
            <div
              key={p.id}
              className="flex gap-3 h-[190px] border  shadow-md rounded-md"
            >
              <div className="w-4/12 min-w-[250px]">
                <img
                  src={p.mainImage || ""}
                  alt="Property image"
                  className={cn(
                    "w-full h-full bg-cover rounded-tl-md rounded-bl-md  rounded-tr-none rounded-br-none",
                    !p.publishedAt && "opacity-70 grayscale"
                  )}
                />
              </div>
              <div className="w-6/12 flex flex-col ">
                <p className="text-sm">Listing: {p.listingNumber}</p>
                {/* <p className="text-[8px]">UserId: {p.userId}</p> */}
                <h4 className=" my-4 font-semibold">
                  <span className="capitalize">{p.type}</span>,{" "}
                  {p.area} m2
                </h4>
                <p className="text-xs">
                  created at {p.createdAt.toLocaleString()} |
                  published at {p.publishedAt?.toLocaleString()}
                </p>
                <div className="h-8 mt-auto py-8 flex items-center">
                  {!p.publishedAt ? (
                    <div className="flex gap-3 items-center">
                      <AlertCircle stroke="orange" />{" "}
                      <span>Fill in all the required fields!</span>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center">
                      <MousePointerClick fill="blue" />{" "}
                      <span className="font-bold text-brand-light-blue">
                        {0} views
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-3/12 flex flex-col justify-between py-3 pr-2">
                <div className="flex justify-between  text-xs">
                  {!p.publishedAt ? (
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
                  variant={p.publishedAt ? "outline" : "default"}
                  className={cn(
                    " w-full",
                    p.publishedAt &&
                      "text-brand-light-blue border-brand-light-blue hover:text-brand-dark-blue"
                  )}
                >
                  {p.publishedAt ? "Edit" : "Publish"}
                </Button>
              </div>
            </div>
          ))}
        <div className="flex gap-3 h-[190px] border  shadow-md rounded-md items-center justify-center">
          <Link href={"/listing/new"}>
            <Button
              size={"lg"}
              className="uppercase text-brand-light-blue bg-white border border-brand-light-blue hover:text-brand-light-blue hover:bg-slate-50"
            >
              Create new listing
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
