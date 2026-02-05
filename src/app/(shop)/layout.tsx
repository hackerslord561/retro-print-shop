import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";
import CookieConsent from "@/components/ui/CookieConsent"; // Import the new component

export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <CookieConsent />
        </>
    );
}