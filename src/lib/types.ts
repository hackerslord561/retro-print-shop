export interface PrintifyImage {
    src: string;
    variant_ids: number[];
    position: string;
}

export interface PrintifyVariant {
    id: number;
    price: number;
    title: string; // e.g., "L / Black"
    is_enabled: boolean;
}

export interface PrintifyProduct {
    id: string;
    title: string;
    description: string;
    tags: string[];
    images: PrintifyImage[];
    variants: PrintifyVariant[];
}

export interface CartItem {
    productId: string;
    variantId: number;
    quantity: number;
    title: string;
    price: number;
    image: string;
}

export interface ShippingAddress {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string; // ISO 2 code (e.g., "GH")
    region: string;
    address1: string;
    city: string;
    zip: string;
}

export interface CreateOrderRequest {
    paymentReference: string; // Paystack reference
    shipping: ShippingAddress;
    items: CartItem[];
}