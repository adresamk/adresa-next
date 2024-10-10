import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import { updateUserInfo } from "./actions";

export default async function ProfileInfoPage() {
  // we always expect user because of the layout auth
  const user = await getUser();
  // if (!user) {
  //   redirect("/signin?redirect=/profile/info");
  // }
  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">Profile Info</h3>
      <form className=" py-2" action={updateUserInfo}>
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="firstName">
            First name <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="firstName"
            defaultValue={user?.firstName || ""}
            name="firstName"
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
            defaultValue={user?.lastName || ""}
            placeholder="Your last name"
          />
        </div>

        <h3 className="text-2xl font-semibold mb-3 mt-5 ">
          Contact Info
        </h3>

        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="phone">
            Telephone <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="phone"
            name="phone"
            defaultValue={user?.phone || ""}
            placeholder="(389)77 777 777 "
          />
        </div>

        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="email">Email</Label>
          <Input
            required
            id="email"
            name="email"
            defaultValue={user?.email || ""}
            disabled
          />
        </div>

        <Button>Save</Button>
      </form>
    </div>
  );
}
