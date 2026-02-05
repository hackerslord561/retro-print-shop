import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 3600; // Cache for 1 hour

async function getBrandedProducts() {
    const q = query(collection(db, "products"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    // Group by Brand
    const grouped: Record<string, any[]> = {};

    products.forEach(p => {
        // Default to 'Vintage Collection' if brand is missing or Generic
        const brand = (p.brand && p.brand !== "Generic") ? p.brand : "Vintage Collection";
        if (!grouped[brand]) grouped[brand] = [];
        grouped[brand].push(p);
    });

    return grouped;
}

export default async function BestSellersPage() {
    const brandGroups = await getBrandedProducts();
    const brands = Object.keys(brandGroups).sort();

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-retro-ink mb-4">SHOP BY BRAND</h1>
                <p className="text-retro-denim">Premium blanks from the brands you trust.</p>
            </div>

            {brands.map((brand) => (
                <section key={brand} className="mb-20 border-b border-gray-200 pb-12 last:border-0">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-retro-ink uppercase tracking-tight">{brand}</h2>
                        <span className="bg-retro-mustard text-retro-ink text-xs font-bold px-2 py-1 rounded-sm">
              {brandGroups[brand].length} ITEMS
            </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {brandGroups[brand].map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}