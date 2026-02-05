import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";
import CookieConsent from "@/components/ui/CookieConsent";
import ValentinesTheme from "@/components/ui/ValentinesTheme";

export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ValentinesTheme /> {/* Background Layer */}
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen relative z-10">
                {children}
            </main>
            <Footer />
            <CookieConsent />
        </>
    );
}