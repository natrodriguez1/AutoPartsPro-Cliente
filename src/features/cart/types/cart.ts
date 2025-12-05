import type { ProductCore } from "@/features/catalog/types/product";


export type CartItem = ProductCore  & {
  cantidad: number;
}

export interface CartState {
  items: CartItem[];
  wishlistItems: ProductCore[];
  itemsEliminados: CartItem[];

  add: (p: ProductCore, qty?: number) => void;
  remove: (id: string) => void;
  restore: (id: string) => void;
  updateQty: (id: string, qty: number) => void;

  toggleWishlist: (p: ProductCore) => void;
  clear: () => void;
}