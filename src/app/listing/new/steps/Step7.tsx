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
const contactHoursOptions = [
  { label: "Anytime", value: "anytime" },
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
];
export default function Step7() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("macesmajli@gmail.com");
  const [contactHours, setContactHours] = useState("anytime");
  const emailVerified = true;
  return (
    <div className="p-2">
      <h2 className="text-lg">Contact Details</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-3 mb-2">
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

      <div className="flex flex-col gap-3 mb-2">
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

      <div className="flex flex-col gap-3 mb-2">
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

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="contact-hours">Contact Hours</Label>
        <SelectDemo
          value={contactHours}
          options={contactHoursOptions}
          onClick={(e) => setContactHours(e)}
        />
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Label htmlFor="tel">
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
