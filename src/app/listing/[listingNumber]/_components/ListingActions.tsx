import LikeListingButton from "@/app/search/_components/LikeListingButton";
import { Button } from "@/components/ui/button";
import { SerializedListing } from "@/lib/types";

import {
  EyeOff,
  Heart,
  Mail,
  NotebookText,
  Printer,
  Share,
  Share2,
} from "lucide-react";

export default function ListingActions({
  listing,
}: {
  listing: SerializedListing;
}) {
  return (
    <ul className="mt-2 flex h-10 items-center gap-2.5 p-0 md:ml-auto md:mt-0">
      <li>
        <Button
          size={"icon"}
          title="Print the Listing"
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Printer />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Share"
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Share2 />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Notes"
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <NotebookText />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Hide"
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <EyeOff />
        </Button>
      </li>{" "}
      <li>
        <LikeListingButton
          listingId={listing.id}
          // isFavorite={isFavorited}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        />
      </li>{" "}
      <li className="contact-button">
        <Button title="Send Message">
          Send Message <Mail className="ml-2" />
        </Button>
      </li>
    </ul>
  );
}
