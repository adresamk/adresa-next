"use client";
import RevealButton from "@/components/shared/RevealButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Listing } from "@prisma/client";
import { Link } from "@/i18n/routing";
import { UploadedImageData } from "@/types/listing.types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFormState, useFormStatus } from "react-dom";
import { saveListingInterest } from "@/server/actions/listing.actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/SubmitButton";

export default function MiniContactForm({ listing }: { listing: Listing }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const loggedInUser = useCurrentUser((store) => store.user);
  const loggedInAgency = useCurrentUser((store) => store.agency);
  const loggedInAccount = useCurrentUser((store) => store.account);
  const [state, formAction, isPending] = useActionState(saveListingInterest, {
    success: false,
    error: null,
  });
  const t = useTranslations("");

  //effect description
  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.firstName && loggedInUser.lastName) {
        setFullName(loggedInUser.firstName + " " + loggedInUser.lastName);
      }
      if (loggedInAccount) {
        setEmail(loggedInAccount.email);
      }
    }
  }, [loggedInUser, loggedInAccount]);

  //effect description
  useEffect(() => {
    if (state.success) {
      toast.success(t("common.notifications.listingInterestMessageSent"));
      if (loggedInUser) {
        if (loggedInUser.firstName && loggedInUser.lastName) {
          setFullName(loggedInUser.firstName + " " + loggedInUser.lastName);
        }
        if (loggedInAccount) {
          setEmail(loggedInAccount.email);
        }
      }
      setPhone("");
      setMessage("");
    }
  }, [state, t, loggedInUser, loggedInAccount]);

  // I know there is an agency or null, but cant bother typing it now
  // @ts-ignore
  const agency = listing.agency;

  return (
    <div
      id="mini-contact-form"
      className="rounded border border-gray-100 bg-white p-0 shadow-xl transition-all duration-300 ease-in"
    >
      <div className="overflow-auto py-3">
        <h3 className="my-3 mb-3 px-6 text-xl">
          {t("common.contact.imInterested")}
        </h3>
        <form className="px-6 py-2" action={formAction}>
          <input type="hidden" name="listingId" value={listing.id} />
          <input
            type="hidden"
            name="senderAccountId"
            value={loggedInAccount?.id || ""}
          />
          <input
            type="hidden"
            name="ownerId"
            value={listing.agencyId || listing.userId || ""}
          />
          <input
            type="hidden"
            name="ownerType"
            value={listing.agencyId ? "agency" : listing.userId ? "user" : ""}
          />
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="fullName">
              {t("common.contact.firstName")} {t("common.words.and")}{" "}
              {t("common.contact.lastName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("common.contact.firstNamePlaceholder")}
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="email">
              {t("common.contact.email")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@google.com "
            />
          </div>
          <div className="mb-2 flex flex-col gap-3">
            <Label htmlFor="phone">{t("common.contact.phone")} </Label>
            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(389)77 777 777 "
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
              rows={5}
              name="message"
              maxLength={3000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <SubmitButton
            className="w-full"
            defaultText={t("common.contact.sendMessage")}
            loadingText={t("common.actions.isSending")}
          />
        </form>
        {agency && (
          <div className="border-t-2 px-5 py-4">
            <>
              <div className="flex gap-2">
                <div className="h-[64px] w-[100px] rounded px-3 py-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-full min-w-full object-fill"
                    width={100}
                    height={60}
                    src={(agency.logo as UploadedImageData)?.url || ""}
                    alt={agency.name + " Logo"}
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/agency/${agency.slug}`}>
                    <p className="text-xl font-semibold hover:underline">
                      {agency.name}
                    </p>
                  </Link>
                  <p className="mb-1 whitespace-pre-line text-sm leading-4">
                    {agency.shortDescription}
                  </p>
                </div>
              </div>
              <div className="my-2 flex flex-wrap items-center">
                <RevealButton
                  usecase="website"
                  value={agency.website || ""}
                  variant="outline"
                />
                <RevealButton
                  usecase="phone"
                  value={agency.contactPersonPhone || ""}
                  variant="outline"
                />
              </div>
            </>
          </div>
        )}
      </div>
    </div>
  );
}
