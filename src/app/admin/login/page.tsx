"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
    const { user, login, logout } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    // --- SESSION RESTORATION ---
    useEffect(() => {
        const restoreSession = async () => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();

                    const res = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idToken }),
                    });

                    if (res.ok) {
                        // Success: Force reload to apply cookie
                        window.location.href = "/admin";
                    } else {
                        console.error("Server rejected session");
                        // Safety Valve: Log out to prevent infinite loop
                        await logout();
                        setIsVerifying(false);
                    }
                } catch (err) {
                    console.error("Session restore failed", err);
                    await logout();
                    setIsVerifying(false);
                }
            } else {
                // No user, ready to login
                setIsVerifying(false);
            }
        };

        // Small delay to ensure Firebase Auth is initialized
        const timer = setTimeout(() => {
            restoreSession();
        }, 500);

        return () => clearTimeout(timer);
    }, [user, logout]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login(email, password);
            // Logic continues in useEffect above
        } catch (err: any) {
            console.error(err);
            setError("Invalid email or password.");
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-retro-cream text-retro-denim">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold tracking-widest animate-pulse">VERIFYING SESSION...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-retro-cream px-4">
            <div className="max-w-md w-full bg-white p-8 border-2 border-retro-denim shadow-[8px_8px_0px_0px_rgba(74,108,140,1)]">
                <h1 className="text-3xl font-bold text-retro-ink mb-2">Admin Portal</h1>
                <p className="text-retro-denim mb-6">Enter your credentials to manage the shop.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm font-bold border border-red-200 mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-retro-ink mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 border-retro-cream-dark focus:border-retro-denim outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-retro-ink mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-2 border-retro-cream-dark focus:border-retro-denim outline-none transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-retro-denim text-white font-bold tracking-widest hover:bg-retro-ink transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "ACCESS DASHBOARD"}
                    </button>
                </form>
            </div>
        </div>
    );
}