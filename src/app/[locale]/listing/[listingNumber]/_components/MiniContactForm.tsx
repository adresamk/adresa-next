"use client";
import RevealButton from "@/components/shared/RevealButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SerializedListing } from "@/lib/types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("");

  return (
    <div className="rounded border border-blue-300 p-0 transition-all duration-300 ease-in">
      <div className="overflow-auto">
        <h3 className="my-3 mb-3 px-6 text-xl">{t("common.contact.label")}</h3>
        <form className="px-6 py-2" action="">
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="name">
              {t("common.contact.firstName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("common.contact.firstNamePlaceholder")}
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="last-name">
              {t("common.contact.lastName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="last-name"
              name="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("common.contact.lastNamePlaceholder")}
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="tel">
              {t("common.contact.phone")}{" "}
              <span className="text-red-500">*</span>
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
              {t("common.contact.email")}{" "}
              <span className="text-red-500">*</span>
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
              {t("common.contact.message")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              required
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button>{t("common.contact.sendMessage")}</Button>
        </form>
        {agency && (
          <div className="border-t-2 px-5 py-4">
            <>
              <div className="flex gap-2">
                <div className="grid place-items-center rounded bg-slate-200 px-3 py-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
          </div>
        )}
      </div>
    </div>
  );
}
