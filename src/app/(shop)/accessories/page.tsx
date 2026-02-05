import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 3600;

async function getAccessoryProducts() {
    const q = query(collection(db, "products"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    // Filter for Accessories only (exclude main clothing if desired, or keep all)
    // Logic: Group ALL items by Provider
    const grouped: Record<string, any[]> = {};

    products.forEach(p => {
        // Categories to consider "Accessories"
        const isAccessory = ["Mugs", "Stickers", "Phone Cases", "Bags", "Accessories"].includes(p.category);

        // Or if you want to show EVERYTHING grouped by provider, remove the 'if' check below
        if (isAccessory) {
            const provider = p.provider || "Standard Fulfillment";
            if (!grouped[provider]) grouped[provider] = [];
            grouped[provider].push(p);
        }
    });

    return grouped;
}

export default async function AccessoriesPage() {
    const providerGroups = await getAccessoryProducts();
    const providers = Object.keys(providerGroups).sort();

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-retro-ink mb-4">ACCESSORIES</h1>
                <p className="text-retro-denim">Curated items grouped by our trusted print partners.</p>
            </div>

            {providers.length > 0 ? (
                providers.map((provider) => (
                    <section key={provider} className="mb-20">
                        <h2 className="text-2xl font-bold text-retro-ink mb-6 border-l-4 border-retro-terracotta pl-4">
                            Fulfilled by {provider}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {providerGroups[provider].map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-xl text-retro-denim">No accessories found in the catalog yet.</p>
                </div>
            )}
        </div>
    );
}