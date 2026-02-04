"use client";

import { usePaystackPayment } from "react-paystack";
import { Loader2, ArrowRight } from "lucide-react";

interface CheckoutButtonProps {
    amount: number; // In GHS
    email: string;
    validateForm: () => boolean; // Function to check if inputs are valid
    onSuccess: (reference: any) => void;
    onClose: () => void;
    isProcessing: boolean;
}

export default function CheckoutButton({
                                           amount,
                                           email,
                                           validateForm,
                                           onSuccess,
                                           onClose,
                                           isProcessing
                                       }: CheckoutButtonProps) {

    // Paystack Configuration
    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: Math.ceil(amount * 100), // Convert GHS to Pesewas (Integer)
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
    };

    const initializePayment = usePaystackPayment(config);

    const handleClick = () => {
        // 1. Run the validation function passed from the parent
        if (!validateForm()) {
            return; // Stop if form is invalid
        }

        // 2. Open Paystack
        initializePayment({ onSuccess, onClose });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isProcessing}
            className="w-full py-4 bg-retro-denim text-white font-bold tracking-widest hover:bg-retro-ink transition-all flex items-center justify-center gap-2 rounded-sm disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...
                </>
            ) : (
                <>
                    PAY NOW <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}