<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display the checkout form.
     */
    public function index()
    {
        $cart = $this->getCart();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty!');
        }

        $cart->load('items.product');

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Process the checkout and create order.
     */
    public function store(StoreOrderRequest $request)
    {
        $cart = $this->getCart();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty!');
        }

        $cart->load('items.product');

        // Calculate totals
        $subtotal = $cart->total_amount;
        $taxAmount = $subtotal * 0.08; // 8% tax
        $shippingAmount = $subtotal >= 100 ? 0 : 10; // Free shipping over $100
        $totalAmount = $subtotal + $taxAmount + $shippingAmount;

        // Create order
        $order = Order::create([
            'order_number' => $this->generateOrderNumber(),
            'user_id' => auth()->id(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'currency' => 'USD',
            'billing_address' => $request->billing_address,
            'shipping_address' => $request->shipping_address ?? $request->billing_address,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
        ]);

        // Create order items
        foreach ($cart->items as $cartItem) {
            $order->items()->create([
                'product_id' => $cartItem->product_id,
                'product_name' => $cartItem->product->name,
                'product_sku' => $cartItem->product->sku,
                'quantity' => $cartItem->quantity,
                'size' => $cartItem->size,
                'color' => $cartItem->color,
                'unit_price' => $cartItem->price,
                'total_price' => $cartItem->price * $cartItem->quantity,
            ]);

            // Update product stock
            if ($cartItem->product->track_inventory) {
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }
        }

        // Clear the cart
        $cart->items()->delete();

        return Inertia::render('checkout/success', [
            'order' => $order->load('items'),
        ]);
    }

    /**
     * Get current user's cart.
     */
    protected function getCart(): ?Cart
    {
        if (auth()->check()) {
            return Cart::where('user_id', auth()->id())->first();
        }

        $sessionId = session()->getId();
        return Cart::where('session_id', $sessionId)->first();
    }

    /**
     * Generate a unique order number.
     */
    protected function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-' . date('Y') . '-' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}