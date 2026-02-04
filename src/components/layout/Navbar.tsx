"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
    const cart = useCart();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for local storage data
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 w-full z-50 border-b border-retro-denim/10 bg-retro-cream/80 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center space-x-2">
            <span className="text-2xl font-bold text-retro-denim tracking-tighter group-hover:text-retro-mustard transition-colors duration-300">
              VINTAGE<span className="text-retro-terracotta">.</span>INK
            </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={cart.toggleCart}
                            className="relative p-2 rounded-full hover:bg-retro-denim/10 transition-colors"
                        >
                            <ShoppingBag className="w-6 h-6 text-retro-ink" />
                            {mounted && cart.items.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-retro-cream bg-retro-terracotta rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cart.items.length}
                </span>
                            )}
                        </button>

                        <button className="md:hidden">
                            <Menu className="w-6 h-6 text-retro-ink" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}