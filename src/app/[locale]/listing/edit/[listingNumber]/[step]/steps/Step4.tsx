import { Listing } from "@prisma/client";

export default function Step4({ listing }: { listing: Listing }) {
  return (
    <div>
      <input
        type="string"
        className="hidden"
        defaultValue="4"
        name="step"
      />
      Step4 additional properties missing
    </div>
  );
}
