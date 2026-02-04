import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import crypto from 'crypto';

// --- NEW: Handle Browser Visits (GET) ---
// This lets you open the link in Chrome to verify the server is running
export async function GET() {
    return NextResponse.json({
        status: "online",
        message: "Printify Webhook Listener is active and waiting for POST events."
    });
}

// --- EXISTING: Handle Printify Events (POST) ---
export async function POST(req: Request) {
    console.log("--- WEBHOOK RECEIVED ---");

    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-pfy-signature');
        const secret = process.env.PRINTIFY_WEBHOOK_SECRET;

        // 1. Debug Logs (Check Vercel Logs to see these)
        console.log("Secret Configured:", !!secret);

        // If you are testing via Postman without a signature, this helps debug
        if (!signature) {
            console.log("⚠️ No signature found in headers");
        }

        if (!secret || !signature) {
            console.error("❌ Missing Secret or Signature");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Verify Signature
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        // Compare buffers safely
        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            console.error("❌ Invalid Signature. Expected:", expectedSignature, "Got:", signature);
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const { type, resource } = body;
        console.log("Event Type:", type);

        if (type === 'product:publish:succeeded' || type === 'product:updated') {

            console.log(`Attempting to sync product: ${resource.title}`);

            // 3. Initialize Admin SDK
            try {
                const adminApp = await initAdmin();
                const adminDb = adminApp.firestore();

                // Printify sends cents, we convert to dollars
                const price = resource.variants[0]?.price ? resource.variants[0].price / 100 : 0;

                // Handle image logic
                const defaultImage = resource.images.find((img: any) => img.is_default)?.src || resource.images[0]?.src;

                await adminDb.collection("products").doc(resource.id).set({
                    id: resource.id,
                    title: resource.title,
                    description: resource.description,
                    price: price,
                    image: defaultImage,
                    images: resource.images,
                    variants: resource.variants,
                    tags: resource.tags,
                    updatedAt: new Date(),
                    isPublished: true
                });

                console.log("✅ SUCCESS: Product saved to Firestore");
            } catch (dbError) {
                console.error("❌ FIREBASE ERROR:", dbError);
                return NextResponse.json({ success: false, error: "Database Error" });
            }

            return NextResponse.json({ success: true, message: "Synced" });
        }

        return NextResponse.json({ message: "Event ignored" });

    } catch (error) {
        console.error("❌ CRITICAL WEBHOOK ERROR:", error);
        // Return 200 to stop Printify from retrying indefinitely
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 200 });
    }
}