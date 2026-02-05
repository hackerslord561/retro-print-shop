import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-retro-ink text-retro-cream pt-16 pb-8 border-t-8 border-retro-mustard relative z-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* Brand Column */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight text-white">OMNI VINTAGE</h2>
                    <p className="text-sm opacity-60 leading-relaxed">
                        Redefining retro fashion with sustainable, on-demand printing.
                        Quality threads, timeless designs, zero waste.
                    </p>
                    <div className="flex gap-4 pt-2">
                        {[Instagram, Twitter, Facebook].map((Icon, i) => (
                            <a key={i} href="#" className="p-2 bg-white/10 rounded-full hover:bg-retro-terracotta transition-colors">
                                <Icon className="w-5 h-5 text-white" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-retro-mustard mb-6 tracking-widest uppercase text-xs">Shop</h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><Link href="/new-arrivals" className="hover:text-retro-terracotta transition-colors">New Arrivals</Link></li>
                        <li><Link href="/best-sellers" className="hover:text-retro-terracotta transition-colors">Best Sellers</Link></li>
                        <li><Link href="/accessories" className="hover:text-retro-terracotta transition-colors">Accessories</Link></li>
                        <li><Link href="/search" className="hover:text-retro-terracotta transition-colors">Search</Link></li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h3 className="font-bold text-retro-mustard mb-6 tracking-widest uppercase text-xs">Support</h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><Link href="/privacy-policy" className="hover:text-retro-terracotta transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-retro-terracotta transition-colors">Terms of Service</Link></li>
                        <li><Link href="/shipping" className="hover:text-retro-terracotta transition-colors">Shipping Info</Link></li>
                        <li><Link href="/returns" className="hover:text-retro-terracotta transition-colors">Returns</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs opacity-40">
                <p>© {currentYear} OMNI Vintage. Built with ❤️ by Hackerslord Studios. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span>VISA</span>
                    <span>MASTERCARD</span>
                    <span>PAYPAL</span>
                </div>
            </div>
        </footer>
    );
}