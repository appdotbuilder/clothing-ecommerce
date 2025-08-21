import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

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
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductsPageProps {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
        min_price?: string;
        max_price?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex() {
    const { products, categories, filters } = usePage<ProductsPageProps>().props;

    const handleAddToCart = (productId: number) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppShell>
            <Head title="Products - StyleHub" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">🛍️ Browse Products</h1>
                    
                    {/* Filter bar */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="font-medium">Filter by category:</span>
                            <Link
                                href="/products"
                                className={`px-3 py-1 rounded-full text-sm ${
                                    !filters.category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        filters.category === category.slug
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
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
                {products.links.length > 3 && (
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
        </AppShell>
    );
}