"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { DollarSign, ShoppingBag, Package, ArrowUpRight, Loader2 } from "lucide-react";

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
}

interface Order {
    id: string;
    customerEmail: string;
    amountGHS: number;
    status: string;
    createdAt: any;
    shippingAddress?: {
        firstName: string;
        lastName: string;
    };
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({ totalRevenue: 0, totalOrders: 0 });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch ALL orders to calculate total revenue
                // (In a huge app, you'd aggregate this in a separate stats doc, but this works fine for now)
                const allOrdersRef = collection(db, "orders");
                const allOrdersSnap = await getDocs(allOrdersRef);

                let revenue = 0;
                allOrdersSnap.forEach((doc) => {
                    const data = doc.data();
                    revenue += data.amountGHS || 0;
                });

                // 2. Fetch only the 5 most recent orders for the table
                const recentQuery = query(
                    collection(db, "orders"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const recentSnap = await getDocs(recentQuery);
                const recentData = recentSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));

                setStats({
                    totalRevenue: revenue,
                    totalOrders: allOrdersSnap.size
                });
                setRecentOrders(recentData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-retro-denim animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-retro-ink mb-2">Dashboard</h1>
                <p className="text-retro-denim">Welcome back, Admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-sm shadow-sm border border-retro-cream-dark">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-retro-ink">GHS {stats.totalRevenue.toFixed(2)}</p>
                    <div className="flex items-center text-xs text-green-600 font-bold mt-2">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>Real-time data</span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-sm shadow-sm border border-retro-cream-dark">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-retro-ink">{stats.totalOrders}</p>
                </div>

                {/* Quick Link Card */}
                <div className="bg-retro-denim text-retro-cream p-6 rounded-sm shadow-sm border border-retro-ink">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-white/70 uppercase tracking-wider">System Health</span>
                        <div className="p-2 bg-white/20 rounded-full text-white">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xl font-bold mb-1">Store is Online</p>
                    <p className="text-xs opacity-70">Paystack & Printify connected</p>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border border-retro-cream-dark shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-retro-cream-dark flex justify-between items-center">
                    <h2 className="text-lg font-bold text-retro-ink">Recent Orders</h2>
                    <a href="/admin/orders" className="text-sm font-bold text-retro-denim hover:underline">View All</a>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-retro-cream/30 text-retro-denim uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {recentOrders.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400">
                                No orders yet.
                            </td>
                        </tr>
                    ) : (
                        recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-retro-ink">
                                    {order.shippingAddress?.firstName || "Guest"} {order.shippingAddress?.lastName || ""}
                                    <span className="block text-xs text-gray-400 font-normal">{order.customerEmail}</span>
                                </td>
                                <td className="p-4 font-bold text-retro-terracotta">
                                    GHS {order.amountGHS.toFixed(2)}
                                </td>
                                <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 capitalize">
                      {order.status}
                    </span>
                                </td>
                                <td className="p-4 text-gray-500">
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