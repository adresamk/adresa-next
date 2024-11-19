"use client";

import { SelectDemo } from "@/components/shared/SelectDemo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check, Info } from "lucide-react";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { ListingContactData } from "@/lib/types";

const contactHoursOptions = [
  { label: "Anytime", value: "anytime" },
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
];
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export default function Step7({ listing }: { listing: Listing }) {
  const contactData: ListingContactData =
    listing.contactData && JSON.parse(listing.contactData);

  const [firstName, setFirstName] = useState(
    contactData?.firstName || ""
  );
  const [lastName, setLastName] = useState(
    contactData?.lastName || ""
  );
  const [phone, setPhone] = useState(contactData?.phone || "");
  const [email, setEmail] = useState(contactData?.email || "");
  const [contactHours, setContactHours] = useState(
    contactData?.contactHours || "anytime"
  );
  const emailVerified = contactData?.emailVerified;
  return (
    <div className="p-2">
      <input
        type="string"
        className="hidden"
        defaultValue="7"
        name="step"
      />

      <h2 className="text-lg">Contact Details</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="firstName">
          First name <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your first name"
        />
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="lastName">
          Last name <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Your last name"
        />
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="phone">
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(389)77 777 777 "
        />
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="contactHours">Contact Hours</Label>
        <SelectDemo
          name="contactHours"
          value={contactHours}
          options={contactHoursOptions}
          onClick={(e) => setContactHours(e)}
        />
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          required
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@google.com "
        />
        {emailVerified && email && (
          <div className="items-center flex gap-3 bg-green-300 p-4 rounded">
            <Check />
            <span>Email verified</span>
          </div>
        )}

        <div className="text-sm flex justify-between">
          <span>Your email will not be published</span>
          <Popover>
            <PopoverTrigger>
              <div className="cursor-pointer underline text-blue-400">
                Learn More
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className=" max-w-[400px] p-0"
            >
              <div className="p-4">
                <h2 className="font-semibold mb-1">
                  Why is your email hidden?
                </h2>
                <div className="text-sm">
                  Users interested in your property will be able to
                  fill in a contact form to send you emails, without
                  the need to know your email address.
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-3 py-2 pr-2 text-slate-500 items-center">
          <div className="p-4">
            <Info fill="gray" color="white" />{" "}
          </div>
          <span className="text-sm">
            The security of your information is important for us. We
            will verify your phone number by using the one-time code
            you will receive by phone or SMS.
          </span>
        </div>
      </div>
    </div>
  );
}
