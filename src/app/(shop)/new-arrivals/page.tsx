import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import PaginatedGrid from "@/components/shop/PaginatedGrid";

// Revalidate every minute so new drops appear quickly
export const revalidate = 60;

async function getNewArrivals() {
    try {
        const q = query(
            collection(db, "products"),
            where("isPublished", "==", true),
            orderBy("updatedAt", "desc"),
            limit(50) // Limit to 50 newest items
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

export default async function NewArrivalsPage() {
    const products = await getNewArrivals();

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12 text-center">
                <span className="text-retro-terracotta font-bold tracking-widest uppercase text-sm">Just Dropped</span>
                <h1 className="text-4xl md:text-5xl font-black text-retro-ink mt-2 mb-4">NEW ARRIVALS</h1>
                <p className="text-retro-denim max-w-2xl mx-auto">
                    Fresh from the press. Be the first to rock our latest vintage-inspired designs.
                </p>
            </div>

            <PaginatedGrid products={products} />
        </div>
    );
}