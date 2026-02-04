"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    Shirt
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="h-full flex flex-col justify-between p-6">
            {/* Top Section */}
            <div>
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="bg-retro-cream text-retro-ink p-2 rounded-sm">
                        <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-retro-cream tracking-tight leading-none">
                            VINTAGE
                        </h1>
                        <p className="text-[10px] font-bold text-retro-terracotta tracking-widest uppercase">
                            Admin Panel
                        </p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        // Check if current path matches strictly or is a sub-path
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group
                  ${isActive
                                    ? "bg-retro-cream text-retro-ink font-bold shadow-md transform translate-x-1"
                                    : "text-retro-cream/70 hover:bg-retro-denim/50 hover:text-white"
                                }
                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-retro-terracotta" : "group-hover:text-retro-mustard"}`} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="pt-6 border-t border-retro-denim/30">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-retro-terracotta hover:bg-retro-terracotta/10 rounded-sm transition-colors font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
                <p className="text-[10px] text-center text-retro-cream/30 mt-4 uppercase tracking-widest">
                    v1.0.0 Stable
                </p>
            </div>
        </div>
    );
}