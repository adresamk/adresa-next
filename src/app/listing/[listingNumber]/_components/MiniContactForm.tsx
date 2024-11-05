"use client";
import RevealButton from "@/components/shared/RevealButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { ListingWithOwnerAndAgency, SerializedListing } from "@/lib/types";

export default function MiniContactForm({
  listing,
}: {
  listing: SerializedListing;
}) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("macesmajli@gmail.com");
  const agency = listing.owner.agency;

  return (
    <div className="rounded border border-blue-300 p-0 transition-all duration-300 ease-in">
      <div className="overflow-auto">
        <h3 className="my-3 mb-3 px-6 text-xl">Contact</h3>
        <form className="px-6 py-2" action="">
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="name">
              First name <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="last-name">
              Last name <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="last-name"
              name="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="tel">
              Telephone <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="tel"
              name="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="(389)77 777 777 "
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@google.com "
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              required
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button>Send message</Button>
        </form>
        <div className="border-t-2 px-5 py-4">
          {agency && (
            <>
              <div className="flex gap-2">
                <div className="grid place-items-center rounded bg-slate-200 px-3 py-1.5">
                  <img
                    width={100}
                    height={64}
                    src={agency.logoUrl || ""}
                    alt={agency.name + " Logo"}
                  />
                </div>
                <div>
                  <p className="mb-1 text-sm leading-4">
                    {agency.shortDescription}
                  </p>
                  <p className="text-xl font-semibold">{agency.name}</p>
                </div>
              </div>
              <div className="my-2 flex flex-wrap items-center">
                <RevealButton usecase="website" value={agency.website || ""} />
                <RevealButton
                  usecase="phone"
                  value={agency.contactPersonPhone || ""}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
