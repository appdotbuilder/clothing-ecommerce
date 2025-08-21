<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        $quantity = $this->faker->numberBetween(1, 3);
        $unitPrice = $product->price;
        $totalPrice = $unitPrice * $quantity;

        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => $quantity,
            'size' => $this->faker->randomElement(['XS', 'S', 'M', 'L', 'XL', null]),
            'color' => $this->faker->randomElement(['Black', 'White', 'Navy', 'Red', 'Blue', null]),
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
        ];
    }
}