<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of all orders for admin.
     */
    public function index(Request $request)
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }
        $query = Order::with(['user', 'items'])
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->paginate(15);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified order for admin.
     */
    public function show(Order $order)
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }
        $order->load(['user', 'items.product']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the order status.
     */
    public function update(Request $request, Order $order)
    {
        // Check if user is admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $updateData = ['status' => $request->status];

        // Set timestamps based on status
        if ($request->status === 'shipped' && $order->status !== 'shipped') {
            $updateData['shipped_at'] = now();
        }

        if ($request->status === 'delivered' && $order->status !== 'delivered') {
            $updateData['delivered_at'] = now();
        }

        if ($request->filled('notes')) {
            $updateData['notes'] = $request->notes;
        }

        $order->update($updateData);

        return redirect()->back()->with('success', 'Order status updated successfully!');
    }
}