"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";

import {
  getMunicipalityOptionsTranslated,
  getMunicipalityPlacesTranslated,
  TranslatedOption,
} from "@/lib/data/macedonia/importantData";

import MapPinSetup from "./MapPinSetup";
import { getLocaleFromCookies } from "@/utils/cookies";
import { useTranslations } from "next-intl";
import MapPinSetupClient from "./MapPinSetupClient";

export default function Step2({ listing }: { listing: Listing }) {
  const locale = getLocaleFromCookies();
  const [municipality, setMunicipality] = useState(listing.municipality);
  const [place, setPlace] = useState(listing.place);

  const [placeOptions, setPlaceOptions] = useState<TranslatedOption[]>(() => {
    if (listing.municipality) {
      return getMunicipalityPlacesTranslated(listing.municipality, locale)
        .places;
    }
    return [];
  });

  const [address, setAddress] = useState(listing.address);

  const t = useTranslations();
  const municipalityOptions = getMunicipalityOptionsTranslated(locale);

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="2" name="step" />
      <h2 className="text-lg">
        {t("listing.new.progress.steps.location.title")}
      </h2>
      <Separator className="my-2 mt-4" />
      <InputSelect
        notFoundText={t("listing.new.progress.steps.location.notFoundText")}
        placeholder={t(
          "listing.new.progress.steps.location.municipalityPlaceholder",
        )}
        label={t("listing.new.progress.steps.location.municipality")}
        name="municipality"
        required
        onSelect={(municipalityId) => {
          setMunicipality(municipalityId);
          const populatedPlacesOptions = getMunicipalityPlacesTranslated(
            municipalityId,
            locale,
          ).places;
          setPlaceOptions(populatedPlacesOptions);
          setPlace("");
        }}
        options={municipalityOptions}
        defaultValue={municipality}
      />
      {(listing.municipality || municipality) && (
        <InputSelect
          notFoundText={t(
            "listing.new.progress.steps.location.notFoundPlaceText",
          )}
          placeholder={t(
            "listing.new.progress.steps.location.placePlaceholder",
          )}
          label={t("listing.new.progress.steps.location.place")}
          name="place"
          required
          onSelect={setPlace}
          options={placeOptions}
          defaultValue={place}
        />
      )}
      {(listing.place || place) && (listing.municipality || municipality) && (
        <>
          <Label htmlFor="address">
            {t("listing.new.progress.steps.location.address")}{" "}
            <span className="text-base text-red-500">*</span>{" "}
          </Label>
          <Input
            required
            placeholder={t(
              "listing.new.progress.steps.location.addressPlaceholder",
            )}
            name="address"
            id={"address"}
            value={address || ""}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </>
      )}
      {(listing.place || place) &&
        (listing.municipality || municipality) &&
        (listing.address || address) &&
        municipality &&
        place && (
          <MapPinSetupClient
            listing={listing}
            municipality={municipality}
            place={place}
          />
        )}
    </div>
  );
}
