import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/printify';

export async function GET() {
    try {
        const data = await getProducts();
        // Return just the data array
        return NextResponse.json(data.data || []);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to load products' },
            { status: 500 }
        );
    }
}