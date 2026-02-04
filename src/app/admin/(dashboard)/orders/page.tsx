"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Package, Loader2, ExternalLink, CheckCircle, Clock } from "lucide-react";

// Define the shape of our order
interface Order {
    id: string;
    customerEmail: string;
    items: any[];
    amountGHS: number;
    status: string;
    createdAt: any;
    printifyOrderId: string | null;
    paymentReference: string;
    shippingAddress: any;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from Firebase on load
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-retro-denim" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-retro-ink">Orders</h1>
                <span className="bg-retro-cream-dark px-3 py-1 text-sm font-bold rounded-full">
          {orders.length} Total
        </span>
            </div>

            <div className="bg-white border border-retro-cream-dark shadow-sm rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-retro-cream/30 border-b border-retro-cream-dark text-retro-denim uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total (GHS)</th>
                        <th className="p-4">Printify Status</th>
                        <th className="p-4">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400">No orders found yet.</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-retro-ink">
                                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                </td>

                                <td className="p-4">
                                    <div className="space-y-1">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs">
                                                <span className="font-bold bg-retro-denim/10 px-1 rounded text-retro-denim">x{item.quantity}</span>
                                                <span className="truncate max-w-[150px]">{item.title}</span>
                                                <span className="text-gray-400">({item.size})</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                <td className="p-4 font-bold text-retro-terracotta">
                                    {order.amountGHS?.toFixed(2)}
                                </td>

                                <td className="p-4">
                                    {order.printifyOrderId ? (
                                        <a
                                            href={`https://printify.com/app/store/orders/${order.printifyOrderId}`} // Note: This link format might vary based on Printify updates
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200 hover:bg-green-100"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Synced: #{order.printifyOrderId}
                                        </a>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-200">
                        <Clock className="w-3 h-3" /> Not Synced
                      </span>
                                    )}
                                </td>

                                <td className="p-4 text-gray-500 text-xs">
                                    {order.createdAt?.toDate().toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}