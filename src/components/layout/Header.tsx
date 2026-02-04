"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useEffect, useState } from "react";

export default function Header() {
    const { toggleCart, items } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration mismatch for the badge count
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-retro-cream/80 backdrop-blur-md border-b border-retro-denim/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tighter text-retro-ink hover:text-retro-denim transition-colors"
                >
                    VINTAGE<span className="text-retro-terracotta">.</span>INK
                </Link>

                {/* Cart Trigger Button */}
                <button
                    onClick={toggleCart}
                    className="relative p-2 hover:bg-retro-denim/10 rounded-full transition-colors group"
                    aria-label="Open Cart"
                >
                    <ShoppingCart className="w-6 h-6 text-retro-denim group-hover:text-retro-ink transition-colors" />

                    {/* Item Count Badge */}
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-retro-terracotta text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-fade-in">
              {itemCount}
            </span>
                    )}
                </button>
            </div>
        </header>
    );
}