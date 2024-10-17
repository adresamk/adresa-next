"use client";
import RevealButton from "@/components/shared/RevealButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function MiniContactForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("macesmajli@gmail.com");
  return (
    <div className="p-2 border border-blue-300 rounded shadow">
      <h3 className="text-xl mb-3 px-3">Contact</h3>
      <form className="px-3 py-2" action="">
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

        <div className="flex flex-col gap-3 mb-2">
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

      <div className="border-t-2  px-3 py-1">
        <div className="flex gap-2">
          <div className="px-3 py-1.5 grid place-items-center bg-slate-200 rounded">
            <img src="/assets/agency-logo.png" alt="" />
          </div>
          <div>
            <p className="text-sm">Realestate agency</p>
            <p className="font-semibold text-xl">Agencija Martin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RevealButton usecase="website" value="www.google.com" />
          <RevealButton usecase="phone" value="077 777 777" />
        </div>
      </div>
    </div>
  );
}
