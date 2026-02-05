"use client";

import Link from "next/link";
import { Shirt, Coffee, Smartphone, Sticker, Tag } from "lucide-react";

const categories = [
    { name: "T-shirts", icon: Shirt, href: "/search?q=t-shirt" },
    { name: "Hoodies", icon: Tag, href: "/search?q=hoodie" },
    { name: "Mugs", icon: Coffee, href: "/search?q=mug" },
    { name: "Phone Cases", icon: Smartphone, href: "/search?q=case" },
    { name: "Stickers", icon: Sticker, href: "/search?q=sticker" },
];

export default function CategoryCarousel() {
    return (
        <section className="py-12 bg-gray-50 border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-extrabold text-center text-retro-ink mb-10 font-heading">
                    SHOP BY CATEGORY
                </h2>

                <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white border-2 border-retro-denim rounded-lg shadow-sm hover:shadow-md hover:border-retro-terracotta transition-all duration-300"
                        >
                            <div className="p-3 rounded-full bg-retro-cream group-hover:bg-retro-terracotta group-hover:text-white transition-colors mb-3">
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-sm text-retro-ink tracking-wide group-hover:text-retro-terracotta">
                {cat.name}
              </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}