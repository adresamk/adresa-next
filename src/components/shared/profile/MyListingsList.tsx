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
import { ListingContactData } from "@/lib/types";
import ListingDeleteButton from "../listing/ListingDeleteButton";
import ListingVisibilityButton from "../listing/ListingVisibilityButton";

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
          .filter((l: Listing) => {
            // some logic where we can use searchFilter
            return l;
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
          )

          .map((l: Listing) => {
            // check against all require fields
            const contactData = l.contactData
              ? JSON.parse(l.contactData)
              : null;

            const hasRequiredFieldsLeft =
              !l.type ||
              !l.manucipality ||
              !l.place ||
              !l.district ||
              !l.address ||
              !l.price ||
              !l.area ||
              !contactData.email ||
              !contactData.phone ||
              !contactData.firstName ||
              !contactData.lastName;

            return (
              <div
                key={l.id + l.isVisible.toString()}
                className="flex min-h-[202px] border  shadow-md rounded-md"
              >
                <div className="w-4/12 min-w-[250px]">
                  <img
                    src={l.mainImage || ""}
                    alt="Property image"
                    className={cn(
                      "max-h-[200px] object-cover w-full h-full bg-cover rounded-tl-md rounded-bl-md  rounded-tr-none rounded-br-none",
                      hasRequiredFieldsLeft && "opacity-50"
                    )}
                  />
                </div>
                <div className="w-8/12 p-5 flex flex-col">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      <Link href={`/listing/${l.listingNumber}`}>
                        Listing: {l.listingNumber}
                      </Link>
                    </p>
                    <div className="flex  justify-end  text-xs ">
                      {!l.publishedAt ? (
                        <Link
                          href={`/listing/edit/${l.listingNumber}/whatever`}
                        >
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="text-xs px-2 "
                          >
                            <Edit className="mr-2" /> Edit
                          </Button>
                        </Link>
                      ) : (
                        <ListingVisibilityButton listing={l} />
                      )}
                      <ListingDeleteButton listingId={l.id} />
                    </div>
                  </div>
                  <div>
                    <Link href={`/listing/${l.listingNumber}`}>
                      <h4 className="my-4 font-semibold">
                        <span className="capitalize">{l.type}</span>,{" "}
                        {l.area} m2
                      </h4>
                    </Link>
                    <p className="text-xs">
                      <span>
                        created at {l.createdAt.toLocaleString()}
                      </span>{" "}
                      |
                      <span>
                        published at {l.publishedAt?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between mt-auto items-center">
                    <div className="">
                      {hasRequiredFieldsLeft ? (
                        <div className="flex gap-3 items-center">
                          <AlertCircle stroke="orange" />{" "}
                          <span>
                            Fill in all the required fields!
                          </span>
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
                    <div className="min-w-[120px]">
                      {l.isPublished && (
                        <Link
                          href={`/listing/edit/${l.listingNumber}/whatever`}
                        >
                          <Button
                            variant={"outline"}
                            className={"w-full text-brand-light-blue"}
                          >
                            Edit
                          </Button>
                        </Link>
                      )}
                      {!l.isPublished && (
                        <Button className="w-full text-white border-brand-light-blue hover:text-brand-dark-blue">
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
