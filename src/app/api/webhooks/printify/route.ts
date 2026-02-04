import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import crypto from 'crypto';

// 1. Browser Test (GET)
// This lets you visit the link in Chrome to verify it's online
export async function GET() {
    return NextResponse.json({
        status: "online",
        message: "Webhook is active. Send a POST request to trigger event."
    });
}

// 2. Printify Event (POST)
export async function POST(req: Request) {
    console.log("--- WEBHOOK RECEIVED ---");

    try {
        // A. Parse Headers & Body
        // We need the raw text for signature verification, NOT json()
        const rawBody = await req.text();
        const signature = req.headers.get('x-pfy-signature');
        const secret = process.env.PRINTIFY_WEBHOOK_SECRET;

        console.log("Secret Configured:", !!secret);

        // B. Safety Checks
        if (!secret) {
            console.error("❌ MISSING SECRET: Add PRINTIFY_WEBHOOK_SECRET to Vercel Env Vars.");
            // We return 200 anyway to stop Printify from retrying forever
            return NextResponse.json({ error: "Configuration Error" }, { status: 200 });
        }

        if (!signature) {
            console.error("⚠️ No signature found. (If you are testing manually, this is expected)");
            // Only block if we strictly require it, but for now let's just log it
        }

        // C. Verify Signature (HMAC SHA256)
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        if (signature && signature !== expectedSignature) {
            console.error("⚠️ SIGNATURE MISMATCH");
            console.error(`Expected: ${expectedSignature}`);
            console.error(`Received: ${signature}`);
            // Note: We are logging this but allowing execution to continue
            // to ensure your data gets saved while you debug the secret key.
        }

        // D. Process Data
        const body = JSON.parse(rawBody);
        const { type, resource } = body;
        console.log("Event:", type);

        if (type === 'product:publish:succeeded' || type === 'product:updated') {
            console.log(`Syncing Product: ${resource.title}`);

            // E. Save to Firebase (Wrapped in Try/Catch so it doesn't crash request)
            try {
                const adminApp = await initAdmin();
                const adminDb = adminApp.firestore();

                // Convert cents to dollars
                const price = resource.variants[0]?.price ? resource.variants[0].price / 100 : 0;

                // Find default image safely
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

                console.log("✅ SUCCESS: Saved to Firestore");
            } catch (dbError: any) {
                console.error("❌ DATABASE ERROR:", dbError.message);
                // Printify doesn't care about our DB error, so we still say "Success" to them
            }
        } else {
            console.log("ℹ️ Event ignored (not a publish event)");
        }

        // F. The "Golden Rule": ALWAYS return 200 to Printify
        // This tells Printify "We got it, stop retrying"
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("❌ CRITICAL SERVER ERROR:", error.message);
        // Even in a crash, return 200 so Printify stops the loop
        return NextResponse.json({ success: false }, { status: 200 });
    }
}