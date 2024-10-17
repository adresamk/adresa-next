import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
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
  listing: Listing;
}) {
  return (
    <ul className="flex p-0 h-10 gap-2.5 items-center md:ml-auto mt-2 md:mt-0">
      <li>
        <Button
          size={"icon"}
          title="Print the Listing"
          variant={"outline"}
          className="text-brand-light-blue hover:text-brand-dark-blue border border-gray-500"
        >
          <Printer />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Share"
          variant={"outline"}
          className="text-brand-light-blue hover:text-brand-dark-blue border border-gray-500"
        >
          <Share2 />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Notes"
          variant={"outline"}
          className="text-brand-light-blue hover:text-brand-dark-blue border border-gray-500"
        >
          <NotebookText />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Hide"
          variant={"outline"}
          className="text-brand-light-blue hover:text-brand-dark-blue border border-gray-500"
        >
          <EyeOff />
        </Button>
      </li>{" "}
      <li>
        <Button
          size={"icon"}
          title="Add to Favorites"
          variant={"outline"}
          className="text-brand-light-blue hover:text-brand-dark-blue border border-gray-500"
        >
          <Heart />
        </Button>
      </li>{" "}
      <li className="contact-button">
        <Button title="Send Message">
          Send Message <Mail className="ml-2" />
        </Button>
      </li>
    </ul>
  );
}
