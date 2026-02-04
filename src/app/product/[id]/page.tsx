import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductView from "@/components/shop/ProductView";

// Helper to fetch single product
async function getProduct(id: string) {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const token = process.env.PRINTIFY_API_TOKEN;

    if (!shopId || !token) return null;

    try {
        const res = await fetch(
            `https://api.printify.com/v1/shops/${shopId}/products/${id}.json`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }
        );

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-retro-denim hover:text-retro-ink font-medium mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
            </Link>

            {/* Load the Client Component with Interactive Logic */}
            <ProductView product={product} />
        </div>
    );
}