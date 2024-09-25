import { Listing } from "@prisma/client";

export default function MyListingsListList({
  listings,
}: {
  listings: Listing[];
}) {
  return <div>MyListingsListList works</div>;
}
