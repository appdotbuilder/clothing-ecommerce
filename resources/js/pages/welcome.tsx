import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price: number | null;
    featured_image: string;
    is_featured: boolean;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    [key: string]: unknown;
}

interface Cart {
    itemsCount: number;
}

interface WelcomePageProps extends SharedData {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
        min_price?: string;
        max_price?: string;
    };
    cart: Cart;
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth, products, categories, filters, cart } = usePage<WelcomePageProps>().props;

    const handleAddToCart = (productId: number) => {
        // This would typically be handled by a form submission
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('cart.store');
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        
        form.innerHTML = `
            <input type="hidden" name="_token" value="${csrfToken}" />
            <input type="hidden" name="product_id" value="${productId}" />
            <input type="hidden" name="quantity" value="1" />
        `;
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <>
            <Head title="🛍️ StyleHub - Fashion That Inspires">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="text-2xl font-bold text-gray-900">
                                    🛍️ StyleHub
                                </Link>
                                <div className="hidden md:flex space-x-6">
                                    {categories.slice(0, 4).map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/?category=${category.slug}`}
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/cart" 
                                    className="text-gray-600 hover:text-gray-900 relative"
                                >
                                    🛒 Cart
                                    {cart.itemsCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cart.itemsCount}
                                        </span>
                                    )}
                                </Link>
                                
                                {auth.user ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700">Hello, {auth.user.name}!</span>
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl font-bold mb-6">🌟 Fashion That Inspires You</h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Discover the latest trends in clothing, from casual wear to elegant outfits. 
                            Shop with confidence and express your unique style.
                        </p>
                        <div className="flex justify-center space-x-8 text-lg">
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">🚚</span>
                                <span>Free shipping over $100</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">↩️</span>
                                <span>30-day returns</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">⭐</span>
                                <span>Premium quality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Categories */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold text-center mb-8">🛍️ Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/?category=${category.slug}`}
                                className="group text-center"
                            >
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-3xl group-hover:bg-gray-300 transition-colors">
                                    {category.name === 'T-Shirts' && '👕'}
                                    {category.name === 'Jeans' && '👖'}
                                    {category.name === 'Dresses' && '👗'}
                                    {category.name === 'Jackets' && '🧥'}
                                    {category.name === 'Sneakers' && '👟'}
                                    {category.name === 'Accessories' && '👜'}
                                </div>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                {products.data.some(product => product.is_featured) && (
                    <div className="bg-gray-100 py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-center mb-8">✨ Featured Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {products.data.filter(product => product.is_featured).slice(0, 4).map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                            <span className="text-4xl">👔</span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{product.category.name}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    {product.compare_price && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ${product.compare_price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product.id)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* All Products */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold text-center mb-8">🛒 All Products</h2>
                    
                    {/* Filter bar */}
                    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="font-medium">Filter by:</span>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/?category=${category.slug}`}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        filters.category === category.slug
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                            {filters.category && (
                                <Link
                                    href="/"
                                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                    Clear filters ✕
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.data.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/products/${product.slug}`}>
                                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                        <span className="text-4xl">👔</span>
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link href={`/products/${product.slug}`}>
                                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-500 mb-3">{product.category.name}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            {product.compare_price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${product.compare_price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {products.meta.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {products.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">🛍️ StyleHub</h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Your one-stop destination for trendy and affordable fashion. 
                                Discover your style, express your personality, and shop with confidence.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h4 className="font-semibold mb-4">👥 Customer Service</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>📞 1-800-STYLE-HUB</p>
                                    <p>📧 help@stylehub.com</p>
                                    <p>💬 Live Chat 24/7</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">📦 Shipping & Returns</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>🚚 Free shipping over $100</p>
                                    <p>⏰ 2-3 business days</p>
                                    <p>↩️ 30-day returns</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">🔒 Secure Shopping</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>💳 Secure payments</p>
                                    <p>🛡️ Data protection</p>
                                    <p>⭐ Trusted by thousands</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">📱 Follow Us</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>📘 Facebook</p>
                                    <p>📸 Instagram</p>
                                    <p>🐦 Twitter</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
                            <p>© 2024 StyleHub. All rights reserved. Built with ❤️ by{' '}
                                <a 
                                    href="https://app.build" 
                                    target="_blank" 
                                    className="text-blue-400 hover:underline"
                                >
                                    app.build
                                </a>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}