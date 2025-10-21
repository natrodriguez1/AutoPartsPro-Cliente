import { create } from 'zustand';
import type { Product } from '@/features/catalog/types/product';
type CartItem = Product & { cantidad: number };

interface CartState {
    items: CartItem[];
    add: (p: Product, qty?: number) => void;
    remove: (id: string) => void;
    clear: () => void;
}
export const useCart = create<CartState>((set) => ({
    items: [],
    add: (p, qty = 1) => set((s) => {
        const i = s.items.findIndex(it => it.id === p.id);
        if (i >= 0) {
            const next = [...s.items];
            next[i] = { ...next[i], cantidad: next[i].cantidad + qty };
            return { items: next };
        }
        return { items: [...s.items, { ...p, cantidad: qty }] };
    }),
    remove: (id) => set((s) => ({ items: s.items.filter(it => it.id !== id) })),
    clear: () => set({ items: [] })
}));