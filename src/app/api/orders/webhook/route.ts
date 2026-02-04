import { NextResponse } from 'next/server';
import crypto from 'crypto';

// You get this secret from your Printify Dashboard -> Settings -> Connections -> Webhooks
const WEBHOOK_SECRET = process.env.PRINTIFY_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();

        // 1. Verify the Signature (Security First)
        // Printify sends a signature in the headers to prove it's them.
        const signature = req.headers.get('x-printify-signature');

        if (!WEBHOOK_SECRET) {
            console.error('Missing PRINTIFY_WEBHOOK_SECRET in .env.local');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // Create a hash of the body using your secret
        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = 'sha256=' + hmac.update(bodyText).digest('hex');

        // Compare their signature with our generated one
        if (signature !== digest) {
            console.warn('Invalid Webhook Signature. Potential attack.');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 2. Parse the Event
        const event = JSON.parse(bodyText);
        const { topic, resource } = event;

        // 3. Handle "Shipment Created"
        if (topic === 'order:shipment:created') {
            const orderId = resource.id;
            // Check if shipments array exists and has items
            const shipment = resource.shipments && resource.shipments.length > 0 ? resource.shipments[0] : null;

            if (shipment) {
                const trackingNumber = shipment.number;
                const trackingUrl = shipment.url;

                console.log(`📦 ORDER SHIPPED! Order: ${orderId}, Tracking: ${trackingNumber}`);

                // ---------------------------------------------------------
                // TODO: SEND EMAIL TO CUSTOMER
                // This is where you would use an email service (like Resend or SendGrid)
                // to email the customer their tracking link.
                // Email is found in: resource.address_to.email
                // ---------------------------------------------------------
            }
        }

        // Respond 200 OK so Printify knows we received it and stops retrying
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}