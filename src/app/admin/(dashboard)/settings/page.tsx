"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Save, RefreshCw } from "lucide-react";

export default function AdminSettings() {
    const { logout } = useAuth();

    // State for the Exchange Rate
    const [exchangeRate, setExchangeRate] = useState<string>("15.50");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // 1. Fetch Current Rate on Load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "general"); // Single doc for global settings
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setExchangeRate(docSnap.data().exchangeRate.toString());
                } else {
                    // Initialize if it doesn't exist
                    await setDoc(docRef, { exchangeRate: 15.50 });
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // 2. Save New Rate
    const handleSaveRate = async () => {
        setSaving(true);
        setMessage("");

        try {
            const rateNumber = parseFloat(exchangeRate);
            if (isNaN(rateNumber) || rateNumber <= 0) {
                alert("Please enter a valid number.");
                return;
            }

            await setDoc(doc(db, "settings", "general"), {
                exchangeRate: rateNumber,
                updatedAt: new Date()
            }, { merge: true });

            setMessage("Exchange rate updated successfully!");
            // Hide message after 3 seconds
            setTimeout(() => setMessage(""), 3000);

        } catch (error) {
            console.error("Error saving rate:", error);
            alert("Failed to save. Check your connection.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-retro-ink mb-8">Settings</h1>

            {/* --- CURRENCY SETTINGS --- */}
            <div className="bg-white border border-retro-cream-dark p-6 rounded-sm shadow-sm mb-8">
                <h2 className="text-lg font-bold text-retro-denim mb-4 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Currency Configuration
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-retro-ink mb-2">
                            Exchange Rate (1 USD = ? GHS)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">GHS</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={exchangeRate}
                                    onChange={(e) => setExchangeRate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-retro-cream-dark rounded-sm font-mono text-lg focus:border-retro-denim outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSaveRate}
                                disabled={saving}
                                className="bg-retro-denim text-white px-6 font-bold rounded-sm hover:bg-retro-ink transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                UPDATE
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            This will immediately affect all customer carts.
                        </p>
                        {message && (
                            <p className="text-green-600 text-sm font-bold mt-2 animate-fade-in">
                                ✓ {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- STATUS --- */}
            <div className="bg-white border border-retro-cream-dark p-6 rounded-sm shadow-sm mb-8">
                <h2 className="text-lg font-bold text-retro-denim mb-4 uppercase tracking-wider">System Status</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-sm">
                        <span className="text-sm font-bold text-green-800">Printify API Connection</span>
                        <span className="px-2 py-1 bg-green-200 text-green-900 text-xs font-bold rounded">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-sm">
                        <span className="text-sm font-bold text-green-800">Paystack Payments</span>
                        <span className="px-2 py-1 bg-green-200 text-green-900 text-xs font-bold rounded">LIVE</span>
                    </div>
                </div>
            </div>

            {/* --- DANGER ZONE --- */}
            <div className="bg-white border border-red-100 p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-bold text-red-600 mb-4 uppercase tracking-wider">Admin Access</h2>
                <button
                    onClick={logout}
                    className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 font-bold hover:bg-red-600 hover:text-white transition-colors text-sm"
                >
                    LOG OUT
                </button>
            </div>
        </div>
    );
}