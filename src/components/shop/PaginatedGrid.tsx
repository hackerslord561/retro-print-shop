"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    isPublished?: boolean;
}

export default function PaginatedGrid({ products }: { products: Product[] }) {
    // Config
    const ITEMS_PER_PAGE = 12;

    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    // 1. Calculate Pagination Logic
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const selectedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 2. Handlers
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Smooth scroll to top of grid
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) handlePageChange(currentPage - 1);
    };

    if (!isMounted) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-12">

            {/* --- GRID --- */}
            {selectedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {selectedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-sm">
                    <p className="text-retro-denim font-medium">No products found.</p>
                </div>
            )}

            {/* --- CONTROLS --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16 pb-8">

                    {/* Previous Button */}
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="p-2 border-2 border-retro-denim rounded-sm hover:bg-retro-denim hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-retro-denim"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`
                  w-10 h-10 font-bold text-sm rounded-sm transition-all border-2
                  ${currentPage === page
                                    ? "bg-retro-denim text-white border-retro-denim"
                                    : "bg-white text-retro-denim border-retro-denim/20 hover:border-retro-denim"
                                }
                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="p-2 border-2 border-retro-denim rounded-sm hover:bg-retro-denim hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-retro-denim"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}