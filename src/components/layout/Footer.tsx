"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, ArrowUp } from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-retro-denim text-retro-cream border-t-4 border-retro-mustard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                {/* Adjusted Grid: 2 Columns now (Brand + Links) instead of 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/10 pb-12">

                    {/* Brand Section - Takes up more space now */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tighter text-retro-cream hover:text-retro-mustard transition-colors">
                VINTAGE<span className="text-retro-terracotta">.</span>INK
              </span>
                        </Link>
                        <p className="text-retro-cream/60 max-w-sm leading-relaxed">
                            Curated designs for the modern nostalgic. Printed on premium cotton, delivered worldwide.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Navigation Links - Aligned to the right on desktop */}
                    <div className="md:text-right flex flex-col md:items-end">
                        <h3 className="text-retro-mustard font-bold uppercase tracking-wider mb-6 text-sm">Shop</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/">All Products</FooterLink>
                            <FooterLink href="#">New Arrivals</FooterLink>
                            <FooterLink href="#">Accessories</FooterLink>
                            <FooterLink href="#">Gift Cards</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-retro-cream/40 font-mono">
                    <p>© {new Date().getFullYear()} VINTAGE INK STUDIOS. ALL RIGHTS RESERVED.</p>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
                        <Link href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-1 hover:text-retro-mustard transition-colors group"
                        >
                            TOP <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Helper Components
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-retro-mustard hover:text-retro-denim transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-retro-cream/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
            >
                {children}
            </Link>
        </li>
    );
}