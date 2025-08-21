<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index()
    {
        $cart = $this->getOrCreateCart();
        $cart->load('items.product');

        return Inertia::render('cart/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);
        $cart = $this->getOrCreateCart();

        // Check if item already exists in cart with same product, size, and color
        $cartItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('size', $request->size)
            ->where('color', $request->color)
            ->first();

        if ($cartItem instanceof CartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $request->integer('quantity', 1);
            $cartItem->update([
                'quantity' => $newQuantity,
            ]);
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'size' => $request->size,
                'color' => $request->color,
                'price' => $product->price,
            ]);
        }

        return redirect()->back()->with('success', 'Item added to cart!');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart();

        // Ensure the cart item belongs to the current cart
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return redirect()->back()->with('success', 'Cart updated!');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(CartItem $cartItem)
    {
        $cart = $this->getOrCreateCart();

        // Ensure the cart item belongs to the current cart
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item removed from cart!');
    }

    /**
     * Get or create cart for current user/session.
     */
    protected function getOrCreateCart(): Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate(['user_id' => auth()->id()]);
        }

        $sessionId = session()->getId();
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }
}