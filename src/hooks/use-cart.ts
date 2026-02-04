import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (itemId: number) => void; // Using variantId as unique key
    clearCart: () => void;
    toggleCart: () => void;
    total: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.variantId === data.variantId);

                if (existingItem) {
                    // If item exists, just increase quantity
                    return set({
                        items: currentItems.map((item) =>
                            item.variantId === data.variantId
                                ? { ...item, quantity: item.quantity + data.quantity }
                                : item
                        )
                    });
                }

                set({ items: [...get().items, data] });
                set({ isOpen: true }); // Open cart when item is added
            },

            removeItem: (id: number) => {
                set({ items: get().items.filter((item) => item.variantId !== id) });
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set({ isOpen: !get().isOpen }),

            total: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'retro-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);