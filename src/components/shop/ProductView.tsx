"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import AddToCart from "./AddToCart";

interface ProductViewProps {
    product: any; // Raw Printify JSON
}

export default function ProductView({ product }: ProductViewProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 1. Parse Sizes from Printify Options
    // Printify options usually look like: [{ name: "Size", values: [...] }, { name: "Color", ... }]
    const sizeOption = product.options?.find((opt: any) => opt.name === "Size" || opt.type === "size");
    const availableSizes = sizeOption ? sizeOption.values : [];

    // Default to the first size available
    const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.id || null);

    // 2. Find Price for Selected Size
    // We look through 'variants' to find the one matching the selected size ID
    const selectedVariant = product.variants.find((v: any) =>
        v.options.includes(selectedSize)
    );

    // Printify price is in cents (USD)
    const priceInCents = selectedVariant ? selectedVariant.price : product.variants[0].price;
    const priceInUSD = priceInCents / 100;

    // 3. Image Carousel Logic
    const images = product.images || [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* --- LEFT: IMAGE CAROUSEL --- */}
            <div className="space-y-4">
                <div className="bg-white p-8 rounded-sm shadow-sm border border-retro-cream-dark flex items-center justify-center relative min-h-[400px] group">

                    {/* Main Image */}
                    <div className="relative w-full aspect-square max-w-[500px]">
                        <Image
                            src={images[currentImageIndex]?.src || "/placeholder.jpg"}
                            alt={product.title}
                            fill
                            className="object-contain transition-all duration-300"
                            priority
                        />
                    </div>

                    {/* Navigation Buttons (Only show if multiple images) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-retro-denim/10 hover:bg-retro-denim hover:text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-retro-denim/10 hover:bg-retro-denim hover:text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img: any, idx: number) => (
                            <button
                                key={img.src}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`
                  relative w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all
                  ${currentImageIndex === idx ? "border-retro-denim ring-1 ring-retro-denim" : "border-transparent hover:border-retro-cream-dark"}
                `}
                            >
                                <Image src={img.src} alt="Thumbnail" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- RIGHT: DETAILS & OPTIONS --- */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-retro-ink tracking-tight mb-4">
                        {product.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-6">
                        <p className="text-3xl font-bold text-retro-terracotta">
                            ${priceInUSD.toFixed(2)}
                        </p>
                        <div className="flex items-center text-yellow-500 text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-gray-400 font-medium">(New Release)</span>
                        </div>
                    </div>
                </div>

                <div
                    className="prose prose-stone text-retro-denim/80 leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Dynamic Size Selector */}
                {availableSizes.length > 0 && (
                    <div className="pt-6 border-t border-retro-cream-dark">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold uppercase text-retro-denim tracking-wider">Select Size</label>
                            <span className="text-xs text-retro-mustard font-bold cursor-pointer hover:underline">Size Guide</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {availableSizes.map((sizeObj: any) => {
                                const isSelected = selectedSize === sizeObj.id;
                                return (
                                    <button
                                        key={sizeObj.id}
                                        onClick={() => setSelectedSize(sizeObj.id)}
                                        className={`
                       min-w-[3rem] h-12 px-4 border-2 flex items-center justify-center font-bold text-sm rounded-sm transition-all
                       ${isSelected
                                            ? "border-retro-denim bg-retro-denim text-white shadow-md transform -translate-y-1"
                                            : "border-retro-cream-dark text-retro-denim hover:border-retro-denim hover:text-retro-ink bg-white"
                                        }
                     `}
                                    >
                                        {sizeObj.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Add to Cart Action */}
                <div className="pt-6">
                    <AddToCart
                        product={{
                            id: product.id,
                            variantId: selectedVariant ? selectedVariant.id : product.variants[0].id, // <--- ADD THIS
                            title: product.title,
                            price: priceInUSD,
                            image: images[0]?.src || "/placeholder.jpg",
                            size: availableSizes.find((s: any) => s.id === selectedSize)?.title || "One Size"
                        }}
                    />
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Prices displayed in USD. Currency converted at checkout.
                    </p>
                </div>
            </div>
        </div>
    );
}