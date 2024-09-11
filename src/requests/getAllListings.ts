import { Product } from "../../types/types";
import { Listing } from "@prisma/client";
import products from "../../data/products.json";
import prismadb from "@/lib/db";

export default async function getAllListings(
  search: string = ""
): Promise<Listing[]> {
  console.log("this is the search on the server", search);

  const listings = await prismadb.listing.findMany();
  console.log("returned listings ; ", listings);
  return listings;
}
