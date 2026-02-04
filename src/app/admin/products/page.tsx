"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Edit, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { PrintifyProduct } from "@/lib/types";

export default function AdminProducts() {
    const [products, setProducts] = useState<PrintifyProduct[]>([]);
    const [loading, setLoading] = useState(false);

    // Function to Pull fresh data from Printify
    const syncProducts = async () => {
        setLoading(true);
        try {
            // We force a re-fetch from our API
            const res = await fetch("/api/products?refresh=true");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            alert("Failed to sync");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncProducts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-retro-ink">Products</h1>
                <button
                    onClick={syncProducts}
                    disabled={loading}
                    className="flex items-center gap-2 bg-retro-denim text-white px-4 py-2 rounded-md hover:bg-retro-ink transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Syncing..." : "Sync from Printify"}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-medium text-gray-500">Image</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Variants</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
                                    {/* Ensure images-api.printify.com is in next.config.ts */}
                                    <Image
                                        src={product.images[0]?.src || ""}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                            <td className="px-6 py-4 text-gray-500">{product.variants.length} Sizes/Colors</td>
                            <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-3">
                                    <button className="text-gray-400 hover:text-retro-denim">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="text-gray-400 hover:text-retro-denim">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {products.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-500">
                        No products found. Create a product in Printify then click Sync.
                    </div>
                )}
            </div>
        </div>
    );
}