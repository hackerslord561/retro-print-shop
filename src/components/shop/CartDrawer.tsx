"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { X, Minus, Plus, Trash2, Lock } from "lucide-react";
import axios from "axios";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// --- DYNAMIC IMPORT ---
import dynamic from "next/dynamic";

// We import the button with ssr: false to prevent "window is not defined"
const CheckoutButton = dynamic(() => import("./CheckoutButton"), {
    ssr: false,
    loading: () => (
        <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold text-center rounded-sm animate-pulse">
            LOADING SECURE PAYMENT...
        </div>
    )
});

export default function CartDrawer() {
    const {
        items,
        removeItem,
        updateQuantity,
        isOpen,
        toggleCart,
        getCartTotal,
        clearCart
    } = useCart();

    const [isMounted, setIsMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(15.50); // Default fallback

    // Shipping Form State
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
        country: "GH",
        phone: ""
    });

    // 1. Fetch Data & Hydrate
    useEffect(() => {
        setIsMounted(true);
        useCart.persist.rehydrate();

        const fetchRate = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExchangeRate(docSnap.data().exchangeRate);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate, using default.");
            }
        };

        if (isOpen) {
            fetchRate();
        }
    }, [isOpen]);

    // 2. Calculate Totals
    const totalUSD = getCartTotal();
    const totalGHS = totalUSD * exchangeRate;

    // 3. Handlers
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validation Function (Passed to CheckoutButton)
    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone || !formData.city) {
            alert("Please fill in all shipping details so we can deliver your order.");
            return false;
        }
        if (!formData.email || !formData.email.includes("@")) {
            alert("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const onSuccess = async (reference: any) => {
        setIsProcessing(true);
        try {
            // Send Order to API (Firebase + Printify)
            await axios.post("/api/orders/create", {
                reference: reference.reference,
                ...formData, // Spread all form fields
                items: items,
                totalUSD: totalUSD,
                totalGHS: totalGHS,
                status: "paid"
            });

            clearCart();
            toggleCart();
            alert("Order successful! You will receive a confirmation email shortly.");
        } catch (error) {
            console.error("Order creation failed:", error);
            alert("Payment successful, but we couldn't save the order. Please contact support.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isMounted) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-retro-ink/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={toggleCart}
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`
          fixed top-0 right-0 h-full w-full sm:w-[450px] bg-retro-cream border-l-4 border-retro-denim shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="p-6 border-b border-retro-cream-dark flex items-center justify-between bg-white/50">
                    <h2 className="text-2xl font-bold text-retro-ink tracking-tight">Your Cart</h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-retro-terracotta hover:text-white rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 min-h-[50vh]">
                            <div className="w-16 h-16 bg-retro-denim/10 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-retro-denim" />
                            </div>
                            <p className="text-retro-ink font-medium">Your cart is empty.</p>
                            <button
                                onClick={toggleCart}
                                className="text-retro-denim underline hover:text-retro-mustard"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Items List */}
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="h-24 w-24 bg-white border border-retro-cream-dark rounded-sm flex-shrink-0 relative overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-contain w-full h-full p-1"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-retro-ink text-sm leading-tight mb-1 line-clamp-1">{item.title}</h3>
                                                <p className="text-xs text-retro-denim uppercase font-bold tracking-wider">Size: {item.size || "Standard"}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-retro-cream-dark rounded-sm bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-retro-denim hover:text-white transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 text-xs font-bold text-retro-ink">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-retro-denim hover:text-white transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3">
                          <span className="font-bold text-retro-ink text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Form */}
                            <div className="border-t border-retro-cream-dark pt-6 space-y-4">
                                <h3 className="font-bold text-retro-denim uppercase text-xs tracking-wider flex items-center gap-2">
                                    Shipping Details
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInput}
                                        className="p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                    />
                                    <input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInput}
                                        className="p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                    />
                                </div>

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInput}
                                    className="w-full p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                />

                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleInput}
                                    className="w-full p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                />

                                <input
                                    name="address"
                                    placeholder="Street Address (e.g. KNUST Campus)"
                                    value={formData.address}
                                    onChange={handleInput}
                                    className="w-full p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="city"
                                        placeholder="City (e.g. Kumasi)"
                                        value={formData.city}
                                        onChange={handleInput}
                                        className="p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                    />
                                    <input
                                        name="zip"
                                        placeholder="Zip / Postal Code"
                                        value={formData.zip}
                                        onChange={handleInput}
                                        className="p-3 bg-white border border-retro-cream-dark rounded-sm text-sm focus:border-retro-denim outline-none"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer & Checkout */}
                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-retro-cream-dark shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6 p-4 bg-retro-cream/20 rounded-sm border border-retro-cream-dark">
                            <div className="flex justify-between text-retro-denim text-sm">
                                <span>Subtotal (USD)</span>
                                <span className="font-medium">${totalUSD.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-400 border-b border-dashed border-gray-300 pb-2 mb-2">
                                <span>Exchange Rate</span>
                                <span className="font-mono">1 USD ≈ {exchangeRate.toFixed(2)} GHS</span>
                            </div>

                            <div className="flex justify-between items-end text-retro-ink">
                                <span className="font-bold">Total to Pay</span>
                                <div className="text-right">
                  <span className="block text-2xl font-bold text-retro-terracotta">
                    GHS {totalGHS.toFixed(2)}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button (Dynamic) */}
                        <CheckoutButton
                            amount={totalGHS}
                            email={formData.email}
                            validateForm={validateForm}
                            onSuccess={onSuccess}
                            onClose={() => setIsProcessing(false)}
                            isProcessing={isProcessing}
                        />

                        <div className="mt-4 flex justify-center gap-2 grayscale opacity-50">
                            <span className="text-[10px] font-mono">SECURED BY PAYSTACK</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}