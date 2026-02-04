"use client";

import Image from "next/image";
import Link from "next/link";
import { PrintifyProduct } from "@/lib/types";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: PrintifyProduct;
    index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
    // Find the default variant price (usually the first one)
    const price = product.variants[0]?.price || 0;
    // Convert cents to dollars/cedis (Printify returns cents)
    const formattedPrice = (price / 100).toFixed(2);

    // Get the default image (usually checks for is_default, or takes first)
    const imageSrc = product.images.find(img => img.position === "front")?.src || product.images[0]?.src;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative block"
        >
            <Link href={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border-2 border-retro-denim/20 bg-white transition-all duration-300 hover:border-retro-mustard hover:shadow-[4px_4px_0px_0px_rgba(217,180,106,1)]">

                    {/* Image */}
                    <div className="absolute inset-0 bg-retro-cream/10 z-10 opacity-0 group-hover:opacity-20 transition-opacity" />
                    <Image
                        src={imageSrc}
                        alt={product.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Quick Add Overlay (Optional, visually nice) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/90 backdrop-blur-sm z-20 border-t border-retro-denim/10">
                        <p className="text-center font-bold text-retro-denim text-sm">VIEW DETAILS</p>
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-retro-ink group-hover:text-retro-terracotta transition-colors">
                            {product.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Unisex / Cotton</p>
                    </div>
                    <p className="text-lg font-bold text-retro-denim">
                        ${formattedPrice}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}