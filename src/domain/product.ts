export type ProductCore = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isSale?: boolean;
  salePercentage?: number;
};