import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { Info } from "lucide-react";
import AgencyLogoUpload from "./_components/AgencyLogoUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateAgencyDetails } from "./actions";

export default async function AgencyProfileDetailsPage() {
  const user = await getUser();
  if (!user || !user.agencyId) {
    return <div>Unauthorized</div>;
  }
  const agency = await prismadb.agency.findFirst({
    where: {
      id: user.agencyId,
    },
  });

  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">Profile Info</h3>

      <Alert className="mt-10 mb-4">
        <Info className="h-4 w-4 " />
        <AlertDescription className="text-slate-900">
          These information will be displayed on your profile page and
          the listings you own.
        </AlertDescription>
      </Alert>
      <form action={updateAgencyDetails} className="py-2">
        {/* Agency Name */}
        <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="website">Agency Website</Label>
          <Input
            id="website"
            defaultValue={agency?.website || ""}
            name="website"
            placeholder="Website"
          />
        </div>

        {/* Agency Phone */}
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="phone">Agency Phone</Label>
          <Input
            id="phone"
            defaultValue={agency?.phone || ""}
            name="phone"
            placeholder="Phone"
          />
        </div>

        {/* Agency Description */}
        <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="shortDescription">
            Agency Short Description
          </Label>
          <Input
            id="shortDescription"
            defaultValue={agency?.shortDescription || ""}
            name="shortDescription"
            placeholder="One sentace explaining what you do"
          />
        </div>

        {/* Agency Map Coordinates*/}
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="gpsLocation">Agency Map Coordinates</Label>
          <Input
            id="gpsLocation"
            defaultValue={agency?.gpsLocation || ""}
            name="gpsLocation"
            placeholder="Ex(Lng, Lat): 41.9981, 21.4254"
          />
        </div>

        {/* Agency Branding */}
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="branding">Agency Branding Details</Label>
          <Input
            id="branding"
            defaultValue={agency?.branding || ""}
            name="branding"
            placeholder="This will get a custom design soon for managing the branding of the agency"
          />
        </div>

        <h3 className="font-semibold my-4 text-lg">Contact Person</h3>
        {/* Contact Person Full Name */}
        <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="contactPersonEmail">
            Contact Person Email
          </Label>
          <Input
            id="contactPersonEmail"
            defaultValue={agency?.contactPersonEmail || ""}
            name="contactPersonEmail"
            placeholder="Email"
          />
        </div>

        {/* Contact Person Phone  */}
        <div className="flex flex-col gap-3 mb-2">
          <Label htmlFor="contactPersonPhone">
            Contact Person Phone
          </Label>
          <Input
            id="contactPersonPhone"
            defaultValue={agency?.contactPersonPhone || ""}
            name="contactPersonPhone"
            placeholder="+389 XX XXX XXX"
          />
        </div>

        <h3 className="font-semibold my-4 text-lg">Work Hours</h3>
        {/* Contact Person Full Name */}
        <div className="flex flex-col gap-3 mb-2">
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
