import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import crypto from 'crypto';

// Types for Printify Data
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
        // 1. Get Raw Body (Required for signature verification)
        const rawBody = await req.text();

        // 2. Get Signature from Headers
        const signature = req.headers.get('x-pfy-signature');
        const secret = process.env.PRINTIFY_WEBHOOK_SECRET;

        if (!secret || !signature) {
            console.error("Missing secret or signature");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 3. Verify Signature (HMAC SHA256)
        // We create a hash of the raw body using our secret
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        // Secure timing-safe comparison prevents timing attacks
        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            console.error("Invalid Signature");
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        // 4. Parse JSON (Safe now)
        const body: PrintifyWebhookBody = JSON.parse(rawBody);
        const { type, resource } = body;

        // 5. Handle "Publish Success" or "Update"
        if (type === 'product:publish:succeeded' || type === 'product:updated') {

            console.log(`Synced Product: ${resource.title}`);

            // Extract default image
            const defaultImage = resource.images.find((img) => img.is_default)?.src || resource.images[0]?.src;

            // Convert Price (Cents -> Dollars)
            const price = resource.variants[0]?.price ? resource.variants[0].price / 100 : 0;

            // Save to Firebase
            await setDoc(doc(db, "products", resource.id), {
                id: resource.id,
                title: resource.title,
                description: resource.description,
                price: price,
                image: defaultImage,
                images: resource.images,
                variants: resource.variants,
                tags: resource.tags,
                updatedAt: serverTimestamp(),
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