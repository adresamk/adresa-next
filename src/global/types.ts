export interface BrandingType {
  primary: string;
  secondary?: string;
}
export interface Listing {
  id: string;
  mainImage: string;
  imagesCount: number;
  type: string;
  area: number;
  oldPrice: number | null;
  price: number;
  mode: "sale" | "rent";
  tags: string[];
  location: string;
  postedAt: string;
  agency?: {
    logo: string;
    slug: string;
  };
  user?: {
    logo: string;
    id: string;
  };
  features: {
    [key: string]: number | undefined;
    bathroom?: number;
    ac?: number;
    garage?: number;
  };
  description: string;
  isLiked: boolean;
  isPaidPromo: boolean;
}
