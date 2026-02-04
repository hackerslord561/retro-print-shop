import { NextResponse } from "next/server";
import { initAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const admin = await initAdmin();
    const auth = admin.auth();

    const body = await request.json();
    const { idToken } = body;

    // Session lasts 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        // Exchange the temporary ID token for a Session Cookie
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        const cookieStore = await cookies();

        // --- THE FIX: Cookie Options ---
        cookieStore.set("session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            // Only require HTTPS in production. This fixes Localhost issues.
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Cookie creation failed:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}