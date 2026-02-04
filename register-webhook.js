require('dotenv').config({ path: '.env.local' });
const https = require('https');

// --- CONFIGURATION ---
const SHOP_ID = process.env.PRINTIFY_SHOP_ID; // Get this from your .env or API
const TOKEN = process.env.PRINTIFY_API_TOKEN;
const WEBHOOK_URL = "https://retro-print-shop.vercel.app/api/webhooks/printify"; // Your LIVE Vercel URL
const SECRET = process.env.PRINTIFY_WEBHOOK_SECRET; // You choose this. Use "openssl rand -hex 20" or just type a long random string.

if (!SHOP_ID || !TOKEN || !SECRET) {
    console.error("❌ Missing secrets in .env.local");
    process.exit(1);
}

// --- THE PAYLOAD ---
const data = JSON.stringify({
    topic: "product:publish:succeeded",
    url: WEBHOOK_URL,
    secret: SECRET
});

const options = {
    hostname: 'api.printify.com',
    path: `/v1/shops/${SHOP_ID}/webhooks.json`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Webhook Registered Successfully!');
            console.log('Response:', JSON.parse(responseBody));
            console.log('\nIMPORTANT: Add this to your .env.local:');
            console.log(`PRINTIFY_WEBHOOK_SECRET=${SECRET}`);
        } else {
            console.error('❌ Failed to register webhook.');
            console.error('Status:', res.statusCode);
            console.error('Response:', responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();