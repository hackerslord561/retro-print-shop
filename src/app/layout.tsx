import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vintage Shop",
    description: "Best vintage clothing in Kumasi",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {/* Only AuthProvider is needed here */}
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}