import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

// 1. Define Strict Schema (Blocks injection attacks & bad data)
const OrderSchema = z.object({
    reference: z.string(),
    email: z.string().email(),
    items: z.array(z.any()), // You can make this stricter if you want
    totalUSD: z.number().positive(),
    totalGHS: z.number().positive(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(5),
    city: z.string().min(1),
    zip: z.string().min(1),
    phone: z.string().min(1),
    country: z.string().default("GH"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 2. Validate Input Data
        const result = OrderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid data format', details: result.error }, { status: 400 });
        }

        const data = result.data;

        // 3. SECURITY CHECK: Verify Payment with Paystack Server-to-Server
        // This prevents "Fake Payment" attacks
        const paystackSecret = process.env.PAYSTACK_SECRET_KEY; // You need to add this to .env.local

        if (!paystackSecret) {
            console.error("Missing Paystack Secret Key");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${data.reference}`, {
            headers: { Authorization: `Bearer ${paystackSecret}` }
        });

        const verifyData = await verifyRes.json();

        // If Paystack says "No", we say "No"
        if (!verifyData.status || verifyData.data.status !== 'success') {
            return NextResponse.json({ error: 'Payment verification failed. Hack attempt blocked.' }, { status: 401 });
        }

        // Optional: Check if amount paid matches cart total (allow small float diffs)
        // const paidAmount = verifyData.data.amount / 100;
        // if (Math.abs(paidAmount - data.totalGHS) > 1.00) { ... }

        // 4. If Valid, Proceed with Printify & Firebase

        // --- Printify Logic ---
        const printifyPayload = {
            external_id: data.reference,
            label: `Order ${data.reference.slice(-6)}`,
            line_items: data.items.map((item: any) => ({
                product_id: item.id,
                variant_id: item.variantId,
                quantity: item.quantity
            })),
            shipping_method: 1,
            send_shipping_notification: true,
            address_to: {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                country: data.country,
                region: "",
                address1: data.address,
                city: data.city,
                zip: data.zip
            }
        };

        let printifyOrderId = null;
        const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
        const TOKEN = process.env.PRINTIFY_API_TOKEN;

        if (SHOP_ID && TOKEN) {
            try {
                const printifyRes = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${TOKEN}`
                    },
                    body: JSON.stringify(printifyPayload)
                });

                const printifyData = await printifyRes.json();
                if (printifyRes.ok) printifyOrderId = printifyData.id;
            } catch (err) {
                console.error("Printify Sync Error:", err);
            }
        }

        // --- Firebase Save ---
        const orderRef = await addDoc(collection(db, 'orders'), {
            paymentReference: data.reference,
            paystackId: verifyData.data.id, // Store real Paystack ID
            customerEmail: data.email,
            items: data.items,
            amountUSD: data.totalUSD,
            amountGHS: data.totalGHS,
            status: 'paid',
            printifyOrderId: printifyOrderId,
            shippingAddress: {
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                city: data.city,
                zip: data.zip,
                country: data.country
            },
            createdAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true, orderId: orderRef.id });

    } catch (error) {
        console.error("Security/System Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}