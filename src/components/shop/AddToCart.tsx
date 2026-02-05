"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { ShoppingBag, Check } from "lucide-react";

interface ProductToAdd {
    id: string;
    variantId: number;
    title: string;
    price: number;
    image: string;
    size: string;
}

export default function AddToCart({ product }: { product: ProductToAdd }) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addItem({ ...product, quantity: 1 });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`
        w-full flex items-center justify-center gap-2 font-black uppercase tracking-wider transition-all duration-300 rounded-sm border-2
        /* MOBILE STYLES (Default): Smaller text, tighter padding */
        text-xs py-2 px-4 
        /* DESKTOP STYLES (md:): Larger text, comfortable padding */
        md:text-sm md:py-3 md:px-6
        
        ${isAdded
                ? "bg-green-600 text-white border-green-600"
                : "bg-retro-ink text-white border-retro-ink hover:bg-retro-terracotta hover:border-retro-terracotta"
            }
      `}
        >
            {isAdded ? (
                <>
                    <Check className="w-4 h-4" /> Added
                </>
            ) : (
                <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
            )}
        </button>
    );
}