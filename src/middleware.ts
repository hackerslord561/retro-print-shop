import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const path = request.nextUrl.pathname;

    // 1. Protect Admin Routes
    if (path.startsWith('/admin')) {

        // --- THE FIX: BREAK THE LOOP ---
        // If user is accessing the login page, let them through unconditionally.
        // We let the Client Component decide if they should be redirected to Dashboard.
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // For all other admin pages (dashboard, settings, etc),
        // if NO session cookie exists, block access.
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};