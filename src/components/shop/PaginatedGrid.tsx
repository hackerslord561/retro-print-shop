"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatedGridProps {
    products: any[];
    itemsPerPage?: number;
}

export default function PaginatedGrid({ products, itemsPerPage = 12 }: PaginatedGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Get current slice of products
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of grid smoothly
        const grid = document.getElementById("product-grid");
        if (grid) {
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div id="product-grid" className="w-full">
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border-2 border-retro-denim rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-retro-denim hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`
                  w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-base font-bold border-2 rounded-sm transition-all
                  ${currentPage === page
                                    ? "bg-retro-denim text-white border-retro-denim"
                                    : "bg-white text-retro-ink border-retro-denim hover:border-retro-terracotta hover:text-retro-terracotta"
                                }
                `}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border-2 border-retro-denim rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-retro-denim hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>

                    <span className="text-xs font-bold text-retro-denim uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
                </div>
            )}
        </div>
    );
}