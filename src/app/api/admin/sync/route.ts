import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("--- STARTING SMART SYNC ---");

        const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
        const TOKEN = process.env.PRINTIFY_API_TOKEN;

        // 1. Debug Config
        if (!SHOP_ID || !TOKEN) {
            return NextResponse.json({
                error: "Missing Config",
                details: "Check .env.local for PRINTIFY_SHOP_ID and PRINTIFY_API_TOKEN"
            }, { status: 500 });
        }

        // 2. Fetch Products
        const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=100`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // 3. Catch & Show Specific Printify Error
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ PRINTIFY ERROR:", response.status, errorText);
            return NextResponse.json({
                error: "Printify API Failed",
                status: response.status,
                details: errorText
            }, { status: response.status });
        }

        const output = await response.json();
        const products = output.data;

        // 4. Initialize Firebase Admin
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
            const tags = product.tags || [];

            // Guess "Brand"
            let brand = "Generic";
            if (product.title.includes("Gildan")) brand = "Gildan";
            else if (product.title.includes("Bella+Canvas")) brand = "Bella+Canvas";
            else if (product.title.includes("Champion")) brand = "Champion";
            else if (product.title.includes("Comfort Colors")) brand = "Comfort Colors";

            // Guess "Category"
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
                brand: brand,
                category: category,
                provider: "Printify",
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