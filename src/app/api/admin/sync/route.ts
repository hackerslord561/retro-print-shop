import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("--- STARTING SMART SYNC ---");

        const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
        const TOKEN = process.env.PRINTIFY_API_TOKEN;

        if (!SHOP_ID || !TOKEN) {
            return NextResponse.json({ error: "Missing Config" }, { status: 500 });
        }

        // 1. Fetch Products
        const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=100`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Printify API Failed");

        const output = await response.json();
        const products = output.data;

        const adminApp = await initAdmin();
        const adminDb = adminApp.firestore();
        const batch = adminDb.batch();

        let count = 0;

        for (const product of products) {
            const docRef = adminDb.collection("products").doc(product.id);

            const defaultVariant = product.variants[0];
            const price = defaultVariant ? defaultVariant.price / 100 : 0;

            // Find Default Image
            const defaultImageObj = product.images.find((img: any) => img.is_default) || product.images[0];
            const defaultImage = defaultImageObj ? defaultImageObj.src : "";

            // --- SMART CATEGORIZATION ---
            // We assume tags contain useful info like "T-shirt", "Mug", "Gildan", etc.
            const tags = product.tags || [];

            // Attempt to guess "Brand" from Title (common in Printify, e.g., "Gildan 5000")
            let brand = "Generic";
            if (product.title.includes("Gildan")) brand = "Gildan";
            else if (product.title.includes("Bella+Canvas")) brand = "Bella+Canvas";
            else if (product.title.includes("Champion")) brand = "Champion";
            else if (product.title.includes("Comfort Colors")) brand = "Comfort Colors";

            // Attempt to guess "Category" from Tags/Title
            let category = "Accessories";
            const lowerTitle = product.title.toLowerCase();
            if (tags.includes("T-shirt") || lowerTitle.includes("tee") || lowerTitle.includes("t-shirt")) category = "T-shirts";
            else if (tags.includes("Hoodie") || lowerTitle.includes("hoodie")) category = "Hoodies";
            else if (tags.includes("Mug") || lowerTitle.includes("mug")) category = "Mugs";
            else if (tags.includes("Phone Case") || lowerTitle.includes("case")) category = "Phone Cases";

            batch.set(docRef, {
                id: product.id,
                title: product.title,
                description: product.description,
                price: price,
                image: defaultImage,
                images: product.images,
                variants: product.variants,
                tags: tags,
                brand: brand,        // NEW: For Best Sellers Page
                category: category,  // NEW: For Carousel
                provider: "Printify", // Placeholder, Printify API doesn't always give provider name clearly in list view
                updatedAt: new Date(),
                isPublished: true
            });

            count++;
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            count: count,
            message: "Smart Sync complete! Brands and Categories updated."
        });

    } catch (error: any) {
        console.error("❌ SYNC ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}