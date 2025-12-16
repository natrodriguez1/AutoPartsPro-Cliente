import type { ProductCore } from "@/domain/product";


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

  discountCode: string;
  discountPercentage: number;
  applyDiscount: (code: string) => { ok: boolean; percentage?: number };
  clearDiscount: () => void;

  toggleWishlist: (p: ProductCore) => void;
  clear: () => void;
}