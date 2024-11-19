import { Listing } from "@prisma/client";

export default function Step8({ listing }: { listing: Listing }) {
  return (
    <div>
      <input
        type="string"
        className="hidden"
        defaultValue="8"
        name="step"
      />
      <div>Publish listing</div>
      <div>
        <label htmlFor="isPublishedYes">Yes</label>
        <input
          type="radio"
          name="isPublished"
          id="isPublishedYes"
          value="yes"
          defaultChecked={!!listing.isPublished === true}
        />
        <label htmlFor="isPublishedNo">No</label>
        <input
          type="radio"
          name="isPublished"
          id="isPublishedNo"
          defaultChecked={!!listing.isPublished === false}
          value="no"
        />
      </div>
      {/* <div>date range for publishing</div>
      <div>proceed to publish</div>
      <div>payment for special features</div>
      <div>terms and conditions?</div> */}
    </div>
  );
}
