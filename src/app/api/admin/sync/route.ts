import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("--- STARTING FULL INVENTORY SYNC ---");

        const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
        const TOKEN = process.env.PRINTIFY_API_TOKEN;

        if (!SHOP_ID || !TOKEN) {
            return NextResponse.json({ error: "Missing Config" }, { status: 500 });
        }

        // --- 1. PAGINATION LOOP ---
        // We fetch pages until we have all products
        let allProducts: any[] = [];
        let currentPage = 1;
        let lastPage = 1;

        do {
            console.log(`Fetching Page ${currentPage}...`);

            const response = await fetch(
                `https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=50&page=${currentPage}`,
                {
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Printify API Error on Page ${currentPage}: ${errorText}`);
            }

            const output = await response.json();

            // Add this page's products to our master list
            allProducts = [...allProducts, ...output.data];

            // Update loop variables
            lastPage = output.last_page;
            currentPage++;

        } while (currentPage <= lastPage);

        console.log(`✅ Fetched total of ${allProducts.length} products.`);

        // --- 2. BATCH SAVE TO FIREBASE ---
        const adminApp = await initAdmin();
        const adminDb = adminApp.firestore();
        const batch = adminDb.batch();

        // Note: Firestore batches have a limit of 500 operations.
        // Since you have ~99 products, one batch is fine.
        // If you grow past 500, we'd need to split this part too.

        let count = 0;

        for (const product of allProducts) {
            const docRef = adminDb.collection("products").doc(product.id);

            const defaultVariant = product.variants[0];
            const price = defaultVariant ? defaultVariant.price / 100 : 0;

            // Find Default Image
            const defaultImageObj = product.images.find((img: any) => img.is_default) || product.images[0];
            const defaultImage = defaultImageObj ? defaultImageObj.src : "";

            // Smart Categorization
            const tags = product.tags || [];

            let brand = "Generic";
            if (product.title.includes("Gildan")) brand = "Gildan";
            else if (product.title.includes("Bella+Canvas")) brand = "Bella+Canvas";
            else if (product.title.includes("Champion")) brand = "Champion";
            else if (product.title.includes("Comfort Colors")) brand = "Comfort Colors";

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
            message: `Successfully synced ${count} products from ${lastPage} pages.`
        });

    } catch (error: any) {
        console.error("❌ SYNC ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}