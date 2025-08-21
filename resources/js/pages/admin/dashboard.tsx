import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    items: Array<{
        id: number;
        product_name: string;
        quantity: number;
    }>;
}

interface AdminDashboardProps {
    stats: {
        total_orders: number;
        pending_orders: number;
        total_products: number;
        total_customers: number;
        total_revenue: number;
    };
    recentOrders: Order[];
    [key: string]: unknown;
}

export default function AdminDashboard() {
    const { stats, recentOrders } = usePage<AdminDashboardProps>().props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppShell>
            <Head title="Admin Dashboard - StyleHub" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🏢 Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome to StyleHub admin panel. Monitor your store performance and manage orders.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="text-2xl mb-2">📦</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_orders.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="text-2xl mb-2">⏳</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-semibold text-yellow-600">{stats.pending_orders.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="text-2xl mb-2">👕</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_products.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="text-2xl mb-2">👥</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Customers</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_customers.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-semibold text-green-600">{formatCurrency(stats.total_revenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/orders"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                            <div className="text-2xl mr-4">📋</div>
                            <div>
                                <h3 className="font-medium text-gray-900">Manage Orders</h3>
                                <p className="text-sm text-gray-500">View and update order statuses</p>
                            </div>
                        </Link>

                        <Link
                            href="/products"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                            <div className="text-2xl mr-4">🛍️</div>
                            <div>
                                <h3 className="font-medium text-gray-900">Browse Products</h3>
                                <p className="text-sm text-gray-500">View product catalog</p>
                            </div>
                        </Link>

                        <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="text-2xl mr-4">📊</div>
                            <div>
                                <h3 className="font-medium text-gray-600">Analytics (Coming Soon)</h3>
                                <p className="text-sm text-gray-400">Advanced reporting features</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">📦 Recent Orders</h2>
                            <Link
                                href="/admin/orders"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View all orders →
                            </Link>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.user?.name || 'Guest'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.user?.email || 'No email'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.items.reduce((total, item) => total + item.quantity, 0)} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {recentOrders.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            No orders found.
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}