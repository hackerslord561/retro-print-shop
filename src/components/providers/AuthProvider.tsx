"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- 1. UPDATED LOGIN ---
    const login = async (email: string, pass: string) => {
        // A. Sign in with Client SDK (Google/Firebase)
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);

        // B. Get the ID Token
        const idToken = await userCredential.user.getIdToken();

        // C. Send to our API to swap for a Session Cookie
        await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });

        // D. Refresh router to apply cookie changes
        router.refresh();
    };

    // --- 2. UPDATED LOGOUT ---
    const logout = async () => {
        // A. Sign out from Client SDK
        await signOut(auth);

        // B. Tell API to destroy cookie
        await fetch("/api/auth/logout", { method: "POST" });

        setUser(null);
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);