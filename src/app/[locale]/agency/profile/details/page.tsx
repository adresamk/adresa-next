import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { Info } from "lucide-react";
import AgencyLogoUpload from "./_components/AgencyLogoUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateAgencyDetails } from "@/server/actions/user.actions";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";

type Params = Promise<Record<string, string>>;

export default async function AgencyProfileDetailsPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  console.log(params);

  const { session, account } = await getCurrentSession();

  console.log("Session", session, "Account", account);

  if (!session || !account) {
    redirect({
      href: "/",
      locale: "mk",
    });
  }

  const { isAuthorized, agency } = await getCurrentUser();

  console.log("Current User", isAuthorized, agency);
  // First Time Here, they need to setup profile

  return (
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">Profile Info</h3>

      <Alert className="mb-4 mt-10">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-slate-900">
          These information will be displayed on your profile page and the
          listings you own.
        </AlertDescription>
      </Alert>
      <form
        action={async (formData: FormData) => {
          "use server";
          const result = await updateAgencyDetails(formData);
          if (result && result.error) {
            // Handle error (e.g., show a notification)
          }
        }}
        className="py-2"
        // action={updateAgencyDetails}
      >
        {/* Agency Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="name">
            Agency Name <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="name"
            defaultValue={agency?.name || ""}
            name="name"
            placeholder="Name"
          />
        </div>

        {/* Agency Adress */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="address">
            Agency Adress <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="address"
            defaultValue={agency?.address || ""}
            name="address"
            placeholder="Address"
          />
        </div>

        {/* Agency Logo */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="logoUrl">
            Agency Logo <span className="text-red-500">*</span>
          </Label>
          <AgencyLogoUpload existingLogo={agency?.logoUrl} />
          {/* <Input
            id="logoUrl"
            required
            defaultValue={agency?.logoUrl || ""}
            name="logoUrl"
            placeholder="logoUrl"
          />
           */}
        </div>

        {/* Agency Website */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="website">Agency Website</Label>
          <Input
            id="website"
            defaultValue={agency?.website || ""}
            name="website"
            placeholder="Website"
          />
        </div>

        {/* Agency Phone */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="phone">Agency Phone</Label>
          <Input
            id="phone"
            defaultValue={agency?.phone || ""}
            name="phone"
            placeholder="Phone"
          />
        </div>

        {/* Agency Description */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="description">Agency Description</Label>
          <Textarea
            rows={5}
            id="description"
            defaultValue={agency?.description || ""}
            name="description"
            placeholder="Description shown on your profile page explaining what you do"
          />
        </div>

        {/* Agency Short Description */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="shortDescription">Agency Short Description</Label>
          <Input
            id="shortDescription"
            defaultValue={agency?.shortDescription || ""}
            name="shortDescription"
            placeholder="One sentace explaining what you do"
          />
        </div>

        {/* Agency Map Coordinates*/}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="gpsLocation">Agency Map Coordinates</Label>
          <Input
            id="gpsLocation"
            defaultValue={agency?.gpsLocation || ""}
            name="gpsLocation"
            placeholder="Ex(Lng, Lat): 41.9981, 21.4254"
          />
        </div>

        {/* Agency Branding */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="branding">Agency Branding Details</Label>
          <Input
            id="branding"
            defaultValue={agency?.branding || ""}
            name="branding"
            placeholder="This will get a custom design soon for managing the branding of the agency"
          />
        </div>

        <h3 className="my-4 text-lg font-semibold">Contact Person</h3>
        {/* Contact Person Full Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonFullName">
            Contact Person Full Name
          </Label>
          <Input
            id="contactPersonFullName"
            defaultValue={agency?.contactPersonFullName || ""}
            name="contactPersonFullName"
            placeholder="Name and Surname"
          />
        </div>

        {/* Contact Person Email  */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonEmail">Contact Person Email</Label>
          <Input
            id="contactPersonEmail"
            defaultValue={agency?.contactPersonEmail || ""}
            name="contactPersonEmail"
            placeholder="Email"
          />
        </div>

        {/* Contact Person Phone  */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonPhone">Contact Person Phone</Label>
          <Input
            id="contactPersonPhone"
            defaultValue={agency?.contactPersonPhone || ""}
            name="contactPersonPhone"
            placeholder="+389 XX XXX XXX"
          />
        </div>

        <h3 className="my-4 text-lg font-semibold">Work Hours</h3>
        {/* Contact Person Full Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="workHours">Work hours</Label>
          <Textarea
            rows={6}
            id="workHours"
            defaultValue={
              agency?.workHours ||
              `Monday-Friday 
08:00-17:00 
Saturday 
08:00-13:00 
Sunday
Closed`
            }
            name="workHours"
          />
        </div>

        <Button>Save</Button>
      </form>
    </div>
  );
}
