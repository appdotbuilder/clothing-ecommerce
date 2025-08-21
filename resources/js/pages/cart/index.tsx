import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface CartItem {
    id: number;
    quantity: number;
    size: string | null;
    color: string | null;
    price: number;
    product: {
        id: number;
        name: string;
        slug: string;
        featured_image: string | null;
        stock_quantity: number;
    };
}

interface Cart {
    id: number;
    items: CartItem[];
    total_amount: number;
    total_items: number;
}

interface CartPageProps {
    cart: Cart | null;
    [key: string]: unknown;
}

export default function CartIndex() {
    const { cart } = usePage<CartPageProps>().props;

    const updateQuantity = (cartItemId: number, quantity: number) => {
        if (quantity < 1) return;
        
        router.patch(route('cart.update', cartItemId), {
            quantity: quantity,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const removeItem = (cartItemId: number) => {
        router.delete(route('cart.destroy', cartItemId), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getTotalPrice = (item: CartItem) => {
        return item.price * item.quantity;
    };

    if (!cart || cart.items.length === 0) {
        return (
            <AppShell>
                <Head title="Shopping Cart - StyleHub" />
                
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <Link
                            href="/"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <Head title="Shopping Cart - StyleHub" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">🛒 Shopping Cart</h1>
                    <div className="text-sm text-gray-500">
                        {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {cart.items.map((item, index) => (
                                <div key={item.id} className={`p-6 ${index !== cart.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <div className="flex items-start space-x-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">👔</span>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <Link 
                                                href={`/products/${item.product.slug}`}
                                                className="font-semibold text-gray-900 hover:text-blue-600"
                                            >
                                                {item.product.name}
                                            </Link>
                                            
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock_quantity}
                                                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Price and Remove */}
                                                <div className="flex items-center space-x-4">
                                                    <span className="font-bold text-lg">
                                                        ${getTotalPrice(item).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cart.total_items} items)</span>
                                    <span className="font-medium">${cart.total_amount.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cart.total_amount >= 100 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            '$10.00'
                                        )}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (8%)</span>
                                    <span className="font-medium">${(cart.total_amount * 0.08).toFixed(2)}</span>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-lg font-semibold">
                                            ${(cart.total_amount + (cart.total_amount >= 100 ? 0 : 10) + (cart.total_amount * 0.08)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {cart.total_amount >= 100 && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 text-sm">
                                        🎉 Congratulations! You qualify for free shipping!
                                    </p>
                                </div>
                            )}

                            <Button
                                asChild
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                            >
                                <Link href="/checkout">
                                    Proceed to Checkout 🚀
                                </Link>
                            </Button>

                            <Link
                                href="/"
                                className="block text-center text-blue-600 hover:text-blue-800 mt-4 text-sm"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}