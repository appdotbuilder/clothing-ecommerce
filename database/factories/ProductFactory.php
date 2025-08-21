<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        $price = $this->faker->randomFloat(2, 19.99, 299.99);
        $comparePrice = $this->faker->boolean(30) ? $price + $this->faker->randomFloat(2, 10, 50) : null;

        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(15),
            'sku' => strtoupper($this->faker->bothify('SKU-###???')),
            'price' => $price,
            'compare_price' => $comparePrice,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'track_inventory' => true,
            'sizes' => $this->faker->randomElement([
                ['XS', 'S', 'M', 'L', 'XL'],
                ['S', 'M', 'L', 'XL', 'XXL'],
                ['28', '30', '32', '34', '36', '38'],
                null
            ]),
            'colors' => $this->faker->randomElement([
                [
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Navy', 'hex' => '#1f2937']
                ],
                [
                    ['name' => 'Red', 'hex' => '#dc2626'],
                    ['name' => 'Blue', 'hex' => '#2563eb'],
                    ['name' => 'Green', 'hex' => '#16a34a']
                ],
                null
            ]),
            'images' => [
                'https://via.placeholder.com/600x800?text=Product+Image+1',
                'https://via.placeholder.com/600x800?text=Product+Image+2'
            ],
            'featured_image' => 'https://via.placeholder.com/600x800?text=Featured+Image',
            'category_id' => Category::factory(),
            'is_featured' => $this->faker->boolean(20),
            'is_active' => $this->faker->boolean(95),
            'weight' => $this->faker->randomFloat(2, 0.1, 2.0),
            'meta_data' => [
                'material' => $this->faker->randomElement(['Cotton', 'Polyester', 'Wool', 'Denim', 'Silk']),
                'care_instructions' => 'Machine wash cold, tumble dry low',
            ],
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }
}