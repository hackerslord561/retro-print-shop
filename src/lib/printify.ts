const BASE_URL = 'https://api.printify.com/v1';
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const API_TOKEN = process.env.PRINTIFY_API_TOKEN;

if (!SHOP_ID || !API_TOKEN) {
    throw new Error("Missing Printify Environment Variables");
}

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
};

export async function getProducts() {
    const res = await fetch(`${BASE_URL}/shops/${SHOP_ID}/products.json`, {
        headers,
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function createPrintifyOrder(orderData: any) {
    const res = await fetch(`${BASE_URL}/shops/${SHOP_ID}/orders.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Printify Error:", data);
        throw new Error(data.message || 'Failed to create order on Printify');
    }

    return data;
}