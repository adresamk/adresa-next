"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Listing } from "@prisma/client";

import {
  getTranslatedMunicipalityOptions,
  getTranslatedMunicipalityPlaces,
  TranslatedOption,
} from "@/lib/data/macedonia/importantData";

import MapPinSetup from "./MapPinSetup";
import { getLocaleFromCookies } from "@/utils/cookies";
import { useTranslations } from "next-intl";

export default function Step2({ listing }: { listing: Listing }) {
  const locale = getLocaleFromCookies();
  const [municipality, setMunicipality] = useState(listing.municipality);
  const [place, setPlace] = useState(listing.place);

  const [placeOptions, setPlaceOptions] = useState<TranslatedOption[]>(() => {
    if (listing.municipality) {
      return getTranslatedMunicipalityPlaces(listing.municipality, locale);
    }
    return [];
  });

  const [address, setAddress] = useState(listing.address);

  const t = useTranslations();
  const municipalityOptions = getTranslatedMunicipalityOptions(locale);

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
          const populatedPlacesOptions = getTranslatedMunicipalityPlaces(
            municipalityId,
            locale,
          );
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
      {(listing.place || place) && (
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
      {(listing.address || address) && (
        <MapPinSetup
          listing={listing}
          municipality={municipality}
          populatedPlace={place}
        />
      )}
    </div>
  );
}
