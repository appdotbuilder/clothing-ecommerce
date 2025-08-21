<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CartItem>
 */
class CartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        
        return [
            'cart_id' => Cart::factory(),
            'product_id' => $product->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'size' => $this->faker->randomElement(['XS', 'S', 'M', 'L', 'XL', null]),
            'color' => $this->faker->randomElement(['Black', 'White', 'Navy', 'Red', 'Blue', null]),
            'price' => $product->price,
        ];
    }
}