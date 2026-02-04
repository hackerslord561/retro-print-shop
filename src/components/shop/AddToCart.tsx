"use client";

import { useCart } from "@/lib/store/cart";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

// Update this interface to match what ProductView sends
interface Product {
    id: string;
    variantId: number; // <--- Added this
    title: string;
    price: number;
    image: string;
    size: string;      // <--- Added this
}

export default function AddToCart({ product }: { product: Product }) {
    const addItem = useCart((state) => state.addItem);
    const toggleCart = useCart((state) => state.toggleCart);
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        // Pass all the specific details to the global store
        addItem({
            id: product.id,
            variantId: product.variantId, // Crucial for Printify
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: product.size
        });

        setIsAdded(true);
        toggleCart(); // Automatically open the drawer

        // Reset the button visual state after 2 seconds
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`
        w-full py-4 px-8 rounded-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg
        ${isAdded
                ? "bg-green-600 text-white scale-[0.98]"
                : "bg-retro-denim text-white hover:bg-retro-ink hover:-translate-y-0.5"
            }
      `}
        >
            {isAdded ? (
                <>
                    <Check className="w-5 h-5" />
                    ADDED
                </>
            ) : (
                <>
                    <ShoppingBag className="w-5 h-5" />
                    ADD TO CART
                </>
            )}
        </button>
    );
}