import { initAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    // 1. If no cookie, strict redirect to login
    if (!sessionCookie) {
        redirect("/admin/login");
    }

    // 2. Verify cookie validity with Firebase Admin
    try {
        const admin = await initAdmin();
        await admin.auth().verifySessionCookie(sessionCookie, true);
    } catch (error) {
        // If cookie is fake/expired, destroy it and kick user out
        redirect("/admin/login");
    }

    // 3. Render the Dashboard (Sidebar + Content)
    return (
        <div className="flex min-h-screen bg-retro-cream">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-retro-ink text-retro-cream hidden md:block border-r border-retro-denim fixed h-full inset-y-0 z-50">
                <AdminSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}