"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Shirt } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { toggleCart, items } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    // Hydration fix for cart count
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <nav className="sticky top-0 z-30 bg-retro-cream border-b-4 border-retro-denim px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-retro-denim text-white p-2 rounded-sm group-hover:bg-retro-ink transition-colors">
                    <Shirt className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-retro-ink tracking-tighter leading-none group-hover:text-retro-terracotta transition-colors">
                        VINTAGE
                    </h1>
                    <p className="text-[10px] font-bold text-retro-denim tracking-widest uppercase">
                        Est. 2026
                    </p>
                </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <Link href="/collections" className="hidden md:block font-bold text-retro-ink hover:text-retro-terracotta hover:underline decoration-2 underline-offset-4">
                    COLLECTIONS
                </Link>
                <Link href="/about" className="hidden md:block font-bold text-retro-ink hover:text-retro-terracotta hover:underline decoration-2 underline-offset-4">
                    ABOUT
                </Link>

                <button
                    onClick={toggleCart}
                    className="relative p-2 hover:bg-retro-denim/10 rounded-full transition-colors"
                >
                    <ShoppingBag className="w-6 h-6 text-retro-ink" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-retro-terracotta text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-retro-cream">
              {itemCount}
            </span>
                    )}
                </button>
            </div>
        </nav>
    );
}