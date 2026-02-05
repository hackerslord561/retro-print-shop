import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import PaginatedGrid from "@/components/shop/PaginatedGrid";
import { ArrowDown } from "lucide-react";
import CategoryCarousel from "@/components/shop/CategoryCarousel";

// Revalidate data every 60 seconds so new products appear automatically
export const revalidate = 60;

async function getProducts() {
    try {
        // Fetch only Published products, ordered by newest first
        // Note: You might need a composite index in Firebase for 'isPublished' + 'updatedAt'
        // If that fails, remove orderBy for now.
        const q = query(
            collection(db, "products"),
            where("isPublished", "==", true),
            orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any[];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function HomePage() {
    const products = await getProducts();

    return (
        <div className="bg-white min-h-screen">

            {/* --- HERO SECTION --- */}
            <section className="relative h-[60vh] flex items-center justify-center bg-retro-ink overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-retro-mustard rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-retro-terracotta rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center space-y-6 px-4">
          <span className="inline-block py-1 px-3 border border-retro-mustard text-retro-mustard text-xs font-bold tracking-[0.2em] uppercase">
            New Collection 2026
          </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-retro-cream tracking-tight">
                        TIMELESS <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-retro-mustard to-retro-terracotta">THREADS</span>
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                        Curated vintage clothing from the heart of Kumasi.
                        Sustainable fashion that tells a story.
                    </p>
                    <a href="#shop" className="inline-flex items-center gap-2 mt-4 text-retro-cream font-bold border-b-2 border-retro-mustard pb-1 hover:text-retro-mustard transition-colors">
                        SHOP NOW <ArrowDown className="w-4 h-4" />
                    </a>
                </div>
            </section>
            <CategoryCarousel />

            {/* --- SHOP SECTION --- */}
            <section id="shop" className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-retro-ink mb-2">Latest Drops</h2>
                        <div className="h-1 w-20 bg-retro-terracotta"></div>
                    </div>
                    <p className="hidden md:block text-retro-denim font-medium text-sm">
                        Showing {products.length} results
                    </p>
                </div>

                {/* The New Organized Grid */}
                <PaginatedGrid products={products} />

            </section>
        </div>
    );
}