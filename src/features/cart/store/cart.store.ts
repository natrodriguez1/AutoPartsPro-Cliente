import { create } from 'zustand';
import { persist } from "zustand/middleware";
import type { CartState } from '../types/cart';
import { getDiscountPercentage } from "../data/discountCodes";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistItems: [],
      itemsEliminados: [],
      discountCode: "",
      discountPercentage: 0,

      add: (p, qty = 1) =>
        set((s) => {
          const i = s.items.findIndex((it) => it.id === p.id);
          if (i >= 0) {
            const next = [...s.items];
            next[i] = { ...next[i], cantidad: next[i].cantidad + qty };
            return { items: next };
          }
          return { items: [...s.items, { ...p, cantidad: qty }] };
        }),

      updateQty: (id, qty) =>
        set((s) => {
          if (qty <= 0) return s;
          return { items: s.items.map((it) => (it.id === id ? { ...it, cantidad: qty } : it)) };
        }),

      applyDiscount: (code) => {
        const clean = code.trim();
        const pct = getDiscountPercentage(clean);
        if (!pct) return { ok: false };

        set({ discountCode: clean, discountPercentage: pct });
        return { ok: true, percentage: pct };
      },

      clearDiscount: () => set({ discountCode: "", discountPercentage: 0 }),

      remove: (id) =>
        set((s) => {
          const removed = s.items.find((it) => it.id === id);
          if (!removed) return s;

          return {
            items: s.items.filter((it) => it.id !== id),
            itemsEliminados: [removed, ...s.itemsEliminados].slice(0, 5),
          };
        }),

      restore: (id) =>
        set((s) => {
          const item = s.itemsEliminados.find((it) => it.id === id);
          if (!item) return s;

          // si ya existe, no dupliques
          const exists = s.items.some((it) => it.id === id);
          return {
            items: exists ? s.items : [item, ...s.items],
            itemsEliminados: s.itemsEliminados.filter((it) => it.id !== id),
          };
        }),



      toggleWishlist: (p) =>
        set((s) => {
          const exists = s.wishlistItems.some((x) => x.id === p.id);
          return {
            wishlistItems: exists ? s.wishlistItems.filter((x) => x.id !== p.id) : [p, ...s.wishlistItems],
          };
        }),

      clear: () => set({ items: [], wishlistItems: [], itemsEliminados: [], discountCode: "", discountPercentage: 0, }),
    }),
    { 
      name: "autoparts_cart_v1",
      partialize: (s) => ({ 
        items: s.items, 
        wishlistItems: s.wishlistItems,
        discountCode: s.discountCode,
        discountPercentage: s.discountPercentage, 
      }),
    }
  )
);