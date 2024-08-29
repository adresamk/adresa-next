import { Product } from "../../types/types";
import products from "../../data/products.json";

export default function getAllListings(
  search: string = ""
): Promise<Product[]> {
  console.log("this is the search on the server", search);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        products.products.filter((product) => {
          return (
            filterByName(product, search) ||
            filterByCategory(product, search) ||
            filterByPrice(product, search)
          );
        })
      );
    }, 200);
  });
}

function filterByName(product: Product, search: string) {
  return product.title.toLowerCase().includes(search.toLowerCase());
}

function filterByCategory(product: Product, search: string) {
  return product.category
    .toLowerCase()
    .includes(search.toLowerCase());
}

function filterByPrice(product: Product, search: string) {
  return product.price.toString().includes(search);
}
