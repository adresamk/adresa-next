"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const user = {
  name: "Mario",
  lastName: "Krstevski",
  tel: "077755554",
  email: "test@gmail.com",
};

export default function ProfileContactPage() {
  const [name, setName] = useState(user.name);
  const [lastName, setLastName] = useState(user.lastName);
  const [tel, setTel] = useState(user.tel);
  const [email, setEmail] = useState(user.email);
  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">Profile Info</h3>
      <form className=" py-2" action="">
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

        <h3 className="text-2xl font-semibold mb-3 ">Contact Info</h3>

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

        <Button>Save</Button>
      </form>
    </div>
  );
}
