"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function ValentinesTheme() {
    const [hearts, setHearts] = useState<{ id: number; left: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate hearts on mount
        const newHearts = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position
            delay: Math.random() * 5,  // Random animation delay
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* 1. CHANGED z-0 to z-50: Now it sits ON TOP of the white background.
          2. pointer-events-none: Ensures users can click "through" the hearts to the buttons below.
      */}

            {/* Side Borders */}
            <div className="absolute top-0 left-0 w-2 h-full bg-pink-500/20 hidden md:block" />
            <div className="absolute top-0 right-0 w-2 h-full bg-pink-500/20 hidden md:block" />

            {/* Floating Hearts */}
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute bottom-0 text-pink-400/60 animate-float"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        fontSize: `${Math.random() * 20 + 20}px`
                    }}
                >
                    <Heart fill="currentColor" />
                </div>
            ))}
        </div>
    );
}