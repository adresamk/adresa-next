import { Button } from "@/components/ui/button";
import { BellPlus } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useActionState, useEffect, useState } from "react";
import { RadioGroupDemo } from "../RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSavedSearch } from "@/actions/savedSearches";
import { useFormState } from "react-dom";
const notificationIntervalOptions = ["daily", "weekly", "live"];

export default function CreateSavedSearch() {
  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] =
    useState(false);
  const [areNotificationsOn, setareNotificationsOn] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [response, formAction] = useFormState(
    createSavedSearch,
    null
  );
  //effect description
  useEffect(() => {
    setSearchParams(window.location.href.split("/search?")[1]);
    //   const searchParams = '/search' + window.location.href.split('/search?')[1]
  }, []);

  //effect description
  useEffect(() => {
    if (response?.success) {
      setIsSavedSearchModalOpen(false);
    }
  }, [response]);
  return (
    <>
      <Button
        onClick={() => {
          setIsSavedSearchModalOpen(true);
        }}
      >
        <BellPlus className="mr-2" /> Save Search
      </Button>
      <SmartOverlay
        isOpen={isSavedSearchModalOpen}
        onClose={() => setIsSavedSearchModalOpen(false)}
        title="Save search"
        description="You can recieve notifications when new listings match your search criteria"
        innerScroll
        footerJSX={null}
      >
        <div className="flex px-2 flex-col gap-3">
          <form action={formAction}>
            <input
              type="text"
              className="hidden"
              name="searchParams"
              defaultValue={searchParams}
            />
            <Label htmlFor="name">Search Name</Label>
            <Input
              placeholder="Your longitude"
              required
              minLength={3}
              maxLength={50}
              defaultValue={""}
              name="name"
              id={"name"}
            />
            <div className="my-2">
              <img
                width={380}
                height={230}
                src="/assets/saved-search-map-polygon2.png"
                alt="saved search polygon img"
              />
            </div>
            <div className="flex items-center gap-3 ">
              <Label htmlFor="isNotificationOn" className="text-xl">
                Notifications
              </Label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="hidden"
                  name="isNotificationOn"
                  value={areNotificationsOn ? "on" : "off"}
                />
                <Input
                  className=""
                  type="checkbox"
                  checked={areNotificationsOn}
                  onChange={(e) => {
                    setareNotificationsOn(e.target.checked);
                  }}
                  id={"isNotificationOn"}
                />
                <span className="text-base">
                  {areNotificationsOn ? "on" : "off"}
                </span>
              </div>
            </div>
            <RadioGroupDemo
              name="notificationInterval"
              defaultValue={notificationIntervalOptions[1]}
              title=""
              values={notificationIntervalOptions}
            />
            <div className="flex justify-end items-center w-full">
              <Button
                onClick={() => {
                  // saveSearch
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </SmartOverlay>
    </>
  );
}
