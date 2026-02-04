import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

// This prevents the route from caching, so it always fetches fresh data
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("--- STARTING MANUAL SYNC ---");

        // 1. Check Credentials
        const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
        const TOKEN = process.env.PRINTIFY_API_TOKEN;

        if (!SHOP_ID || !TOKEN) {
            return NextResponse.json({ error: "Missing PRINTIFY_SHOP_ID or PRINTIFY_API_TOKEN in .env" }, { status: 500 });
        }

        // 2. Fetch All Products from Printify
        const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Printify API Error: ${response.status} ${errorText}`);
        }

        const output = await response.json();
        const products = output.data; // Printify returns { current_page: 1, data: [...] }

        if (!products || products.length === 0) {
            return NextResponse.json({ message: "No products found in this Printify store." });
        }

        // 3. Save to Firebase (Admin Mode)
        const adminApp = await initAdmin();
        const adminDb = adminApp.firestore();
        const batch = adminDb.batch(); // Use batch for faster writing

        let count = 0;

        for (const product of products) {
            const docRef = adminDb.collection("products").doc(product.id);

            // Calculate Price (Printify gives cents, we need dollars)
            // We look for the first variant's price as a baseline
            const defaultVariant = product.variants[0];
            const price = defaultVariant ? defaultVariant.price / 100 : 0;

            // Find Default Image
            const defaultImageObj = product.images.find((img: any) => img.is_default) || product.images[0];
            const defaultImage = defaultImageObj ? defaultImageObj.src : "";

            batch.set(docRef, {
                id: product.id,
                title: product.title,
                description: product.description,
                price: price,
                image: defaultImage,
                images: product.images,
                variants: product.variants,
                tags: product.tags,
                updatedAt: new Date(),
                isPublished: true // We assume if it's in Printify, we want it on the site
            });

            count++;
        }

        // Commit the batch write
        await batch.commit();

        console.log(`✅ Successfully synced ${count} products.`);

        return NextResponse.json({
            success: true,
            count: count,
            message: "Sync complete! Refresh your homepage."
        });

    } catch (error: any) {
        console.error("❌ SYNC ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}