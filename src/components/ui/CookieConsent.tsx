"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Small delay for better UX
            setTimeout(() => setShow(true), 2000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-retro-ink text-retro-cream border-t-4 border-retro-terracotta shadow-2xl p-6 md:p-8 md:rounded-t-xl flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-retro-denim rounded-full hidden md:block">
                        <Cookie className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">We value your privacy</h3>
                        <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                            <a href="/privacy-policy" className="underline ml-1 hover:text-retro-mustard">Read Policy</a>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setShow(false)}
                        className="flex-1 md:flex-none py-2 px-6 text-sm font-bold border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none py-2 px-8 text-sm font-bold bg-retro-terracotta text-white rounded-full hover:bg-retro-mustard hover:text-retro-ink transition-colors shadow-lg"
                    >
                        Accept Cookies
                    </button>
                </div>
            </div>
        </div>
    );
}