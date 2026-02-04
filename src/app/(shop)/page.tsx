import Image from "next/image";
import Link from "next/link";

// 1. Fetch Products from Printify API
async function getProducts() {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const token = process.env.PRINTIFY_API_TOKEN;

    if (!shopId || !token) return [];

    try {
        const res = await fetch(
            `https://api.printify.com/v1/shops/${shopId}/products.json`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 }, // Cache for 1 hour to keep it fast
            }
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        // Filter out "hidden" products if needed
        return data.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function Home() {
    const products = await getProducts();

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="bg-retro-denim text-retro-cream py-20 px-4 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 animate-slide-up">
                        WEAR THE <span className="text-retro-mustard">NOSTALGIA</span>
                    </h1>
                    <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto mb-8 font-light">
                        Premium threads inspired by the golden age of design.
                        Limited runs. Timeless aesthetic.
                    </p>
                    <a href="#shop" className="inline-block bg-retro-terracotta text-white font-bold py-4 px-10 rounded-sm hover:bg-white hover:text-retro-denim transition-all shadow-lg transform hover:-translate-y-1">
                        SHOP COLLECTION
                    </a>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-retro-mustard rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-retro-cream rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Product Grid */}
            <div id="shop" className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12 border-b-2 border-retro-denim/10 pb-4">
                    <h2 className="text-3xl font-bold text-retro-ink">Latest Drops</h2>
                    <span className="text-retro-denim font-mono text-sm">{products.length} PRODUCTS FOUND</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>No products found. Sync your Printify store in the admin panel!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {products.map((product: any) => {
                            // --- PRICE FIX ---
                            // 1. Get price in cents from the first variant
                            const priceInCents = product.variants?.[0]?.price || 0;
                            // 2. Convert to Dollars
                            const priceUSD = priceInCents / 100;

                            const image = product.images?.[0]?.src || "/placeholder.jpg";

                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group block"
                                >
                                    <div className="relative bg-white aspect-[4/5] overflow-hidden rounded-sm border border-retro-cream-dark shadow-sm transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(74,108,140,0.2)]">
                                        <Image
                                            src={image}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-retro-ink/0 group-hover:bg-retro-ink/5 transition-colors duration-300" />
                                    </div>

                                    <div className="mt-4 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-retro-ink group-hover:text-retro-denim transition-colors line-clamp-1">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">Unisex Premium Cotton</p>
                                        </div>
                                        {/* Display Price in USD */}
                                        <span className="font-bold text-retro-terracotta">
                       ${priceUSD.toFixed(2)}
                     </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}