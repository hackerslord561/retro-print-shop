"use client";

import Link from "next/link";
import { ShoppingBag, Search, Shirt } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { toggleCart, items } = useCart();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => setIsMounted(true), []);

    const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="sticky top-0 z-40 bg-retro-cream border-b-4 border-retro-denim px-4 md:px-8 py-4 shadow-xl">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="bg-retro-denim text-white p-2 rounded-sm group-hover:bg-retro-ink transition-colors">
                        <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-retro-ink tracking-tighter leading-none">
                            OMNI VINTAGE
                        </h1>
                        <p className="text-[10px] font-bold text-retro-denim tracking-[0.3em] uppercase">
                            EST. 2026
                        </p>
                    </div>
                </Link>

                {/* Search Bar (Hidden on small mobile) */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex relative">
                    <input
                        type="text"
                        placeholder="Search for hoodies, mugs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 bg-white border-2 border-retro-denim/20 rounded-full focus:outline-none focus:border-retro-denim focus:ring-1 focus:ring-retro-denim transition-all placeholder:text-gray-400 font-medium"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-retro-denim hover:text-retro-terracotta">
                        <Search className="w-5 h-5" />
                    </button>
                </form>

                {/* Links & Cart */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex gap-6 text-sm font-extrabold tracking-wide text-retro-ink">
                        <Link href="/new-arrivals" className="hover:text-retro-terracotta hover:underline decoration-2 underline-offset-4 transition-all">
                            NEW IN
                        </Link>
                        <Link href="/best-sellers" className="hover:text-retro-terracotta hover:underline decoration-2 underline-offset-4 transition-all">
                            BRANDS
                        </Link>
                        <Link href="/accessories" className="hover:text-retro-terracotta hover:underline decoration-2 underline-offset-4 transition-all">
                            ACCESSORIES
                        </Link>
                    </div>

                    <button
                        onClick={toggleCart}
                        className="relative p-2 hover:bg-retro-denim/10 rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-6 h-6 text-retro-ink" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-retro-terracotta text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-retro-cream animate-bounce">
                {itemCount}
              </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="w-full mt-4 md:hidden">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search store..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border-2 border-retro-denim/20 rounded-lg focus:outline-none focus:border-retro-denim"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-retro-denim">
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </nav>
    );
}