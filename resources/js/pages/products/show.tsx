import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    price: number;
    compare_price: number | null;
    stock_quantity: number;
    sizes: string[] | null;
    colors: Array<{ name: string; hex: string }> | null;
    images: string[] | null;
    featured_image: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ProductShowPageProps {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow() {
    const { product, relatedProducts } = usePage<ProductShowPageProps>().props;
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppShell>
            <Head title={`${product.name} - StyleHub`} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-8xl">👔</span>
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.slice(0, 4).map((image, index) => (
                                    <div key={index} className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-2xl">👔</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div>
                        <nav className="text-sm text-gray-500 mb-4">
                            <span>Home</span> / <span>{product.category.name}</span> / <span>{product.name}</span>
                        </nav>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.compare_price && (
                                <span className="text-xl text-gray-500 line-through">
                                    ${product.compare_price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {product.short_description && (
                            <p className="text-gray-600 mb-6">{product.short_description}</p>
                        )}

                        {/* Size Selection */}
                        {product.sizes && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded ${
                                                selectedSize === size
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`px-4 py-2 border rounded flex items-center space-x-2 ${
                                                selectedColor === color.name
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color.hex }}
                                            ></div>
                                            <span>{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400"
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:border-gray-400"
                                >
                                    +
                                </button>
                                <span className="text-sm text-gray-500 ml-4">
                                    {product.stock_quantity} in stock
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="mb-8">
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                            >
                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                            </Button>
                        </div>

                        {/* Product Description */}
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <div className="text-gray-600">
                                {product.description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-3">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">🔗 Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${relatedProduct.slug}`}>
                                        <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                            <span className="text-4xl">👔</span>
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/products/${relatedProduct.slug}`}>
                                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{relatedProduct.name}</h3>
                                        </Link>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${relatedProduct.price.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => router.post(route('cart.store'), {
                                                    product_id: relatedProduct.id,
                                                    quantity: 1,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                })}
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
                )}
            </div>
        </AppShell>
    );
}