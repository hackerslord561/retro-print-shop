import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-retro-ink text-retro-cream border-t-8 border-retro-terracotta py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">VINTAGE STORE</h2>
                    <p className="text-sm opacity-70 leading-relaxed">
                        Curating the finest retro threads in Kumasi since 2026.
                        We believe in sustainable fashion and timeless style.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="font-bold text-retro-mustard mb-4 tracking-widest uppercase text-sm">Shop</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-retro-terracotta transition-colors">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-retro-terracotta transition-colors">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-retro-terracotta transition-colors">Accessories</a></li>
                        <li><a href="#" className="hover:text-retro-terracotta transition-colors">Sale</a></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="font-bold text-retro-mustard mb-4 tracking-widest uppercase text-sm">Connect</h3>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-retro-cream text-retro-ink rounded-full hover:bg-retro-terracotta hover:text-white transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-retro-cream text-retro-ink rounded-full hover:bg-retro-terracotta hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-retro-cream text-retro-ink rounded-full hover:bg-retro-terracotta hover:text-white transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                    <p className="mt-6 text-xs opacity-50">
                        © 2026 Hackerslord Studios. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}