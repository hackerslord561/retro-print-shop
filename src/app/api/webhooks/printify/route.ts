import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin'; // Switch to Admin SDK
import crypto from 'crypto';

interface PrintifyWebhookBody {
    type: string;
    shop_id: number;
    resource: {
        id: string;
        title: string;
        description: string;
        images: { src: string; is_default: boolean }[];
        variants: { id: number; price: number; title: string }[];
        tags: string[];
    };
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-pfy-signature');
        const secret = process.env.PRINTIFY_WEBHOOK_SECRET;

        if (!secret || !signature) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify Signature
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        const body: PrintifyWebhookBody = JSON.parse(rawBody);
        const { type, resource } = body;

        if (type === 'product:publish:succeeded' || type === 'product:updated') {

            // --- ADMIN SDK INITIALIZATION ---
            // This instance bypasses ALL Firestore security rules
            const adminApp = await initAdmin();
            const adminDb = adminApp.firestore();

            const defaultImage = resource.images.find((img) => img.is_default)?.src || resource.images[0]?.src;
            const price = resource.variants[0]?.price ? resource.variants[0].price / 100 : 0;

            // Use adminDb (not the client db)
            await adminDb.collection("products").doc(resource.id).set({
                id: resource.id,
                title: resource.title,
                description: resource.description,
                price: price,
                image: defaultImage,
                images: resource.images,
                variants: resource.variants,
                tags: resource.tags,
                // Admin SDK uses specific timestamp format
                updatedAt: new Date(),
                isPublished: true
            });

            return NextResponse.json({ success: true, message: "Synced" });
        }

        return NextResponse.json({ message: "Event ignored" });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}