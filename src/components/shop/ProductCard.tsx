import Link from "next/link";
import Image from "next/image";
import AddToCart from "./AddToCart";

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    variants?: any[];
}

export default function ProductCard({ product }: { product: Product }) {
    const imageUrl = product.image || "https://placehold.co/400";

    return (
        <div className="group relative">
            <Link href={`/product/${product.id}`} className="block">

                {/* CHANGED TO bg-gray-400: Darker gray for better white-shirt contrast */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-400 border-2 border-retro-denim rounded-sm">
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                    />

                    <div className="absolute top-2 left-2 bg-retro-mustard text-retro-ink text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-retro-ink">
                        New
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-retro-ink group-hover:text-retro-terracotta transition-colors line-clamp-1">
                            {product.title}
                        </h3>
                        <p className="mt-1 text-sm text-retro-denim font-medium">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="mt-4">
                <AddToCart
                    product={{
                        id: product.id,
                        variantId: product.variants?.[0]?.id || 0,
                        title: product.title,
                        price: product.price,
                        image: imageUrl,
                        size: "L"
                    }}
                />
            </div>
        </div>
    );
}