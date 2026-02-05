import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import PaginatedGrid from "@/components/shop/PaginatedGrid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering because search params change on every request
export const dynamic = "force-dynamic";

async function searchProducts(term: string) {
    if (!term) return [];

    // Firestore doesn't support full-text search natively.
    // For small catalogs (<500 items), fetching all active items and filtering in JS is fast and effective.
    const q = query(collection(db, "products"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);

    const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    const lowerTerm = term.toLowerCase();

    return allProducts.filter(p =>
        p.title.toLowerCase().includes(lowerTerm) ||
        p.description?.toLowerCase().includes(lowerTerm) ||
        p.category?.toLowerCase().includes(lowerTerm) ||
        p.brand?.toLowerCase().includes(lowerTerm)
    );
}

export default async function SearchPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams; // Next.js 15 requires awaiting searchParams
    const queryTerm = q || "";
    const results = await searchProducts(queryTerm);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-retro-denim hover:text-retro-ink mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Link>

            <div className="mb-10">
                <h1 className="text-3xl font-black text-retro-ink">
                    {queryTerm ? `Results for "${queryTerm}"` : "Search our store"}
                </h1>
                <p className="text-retro-denim mt-2">
                    Found {results.length} items
                </p>
            </div>

            {results.length > 0 ? (
                <PaginatedGrid products={results} />
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-xl font-bold text-gray-400 mb-4">Nothing matched your search.</p>
                    <Link href="/new-arrivals" className="text-retro-terracotta font-bold hover:underline">
                        Check out our New Arrivals instead
                    </Link>
                </div>
            )}
        </div>
    );
}