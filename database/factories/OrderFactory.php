<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 25.00, 500.00);
        $taxAmount = $subtotal * 0.08;
        $shippingAmount = $subtotal >= 100 ? 0 : 10;
        $totalAmount = $subtotal + $taxAmount + $shippingAmount;

        return [
            'order_number' => 'ORD-' . date('Y') . '-' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'currency' => 'USD',
            'billing_address' => [
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'email' => $this->faker->email(),
                'phone' => $this->faker->phoneNumber(),
                'address_line_1' => $this->faker->streetAddress(),
                'address_line_2' => $this->faker->boolean(30) ? $this->faker->streetSuffix() : null,
                'city' => $this->faker->city(),
                'state' => $this->faker->randomElement(['CA', 'NY', 'TX', 'FL', 'IL']),
                'postal_code' => $this->faker->postcode(),
                'country' => 'United States',
            ],
            'shipping_address' => [
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'email' => $this->faker->email(),
                'phone' => $this->faker->phoneNumber(),
                'address_line_1' => $this->faker->streetAddress(),
                'address_line_2' => $this->faker->boolean(30) ? $this->faker->streetSuffix() : null,
                'city' => $this->faker->city(),
                'state' => $this->faker->randomElement(['CA', 'NY', 'TX', 'FL', 'IL']),
                'postal_code' => $this->faker->postcode(),
                'country' => 'United States',
            ],
            'payment_method' => $this->faker->randomElement(['credit_card', 'debit_card', 'paypal']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed']),
            'payment_reference' => $this->faker->uuid(),
            'notes' => $this->faker->boolean(20) ? $this->faker->sentence() : null,
            'shipped_at' => $this->faker->boolean(40) ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'delivered_at' => $this->faker->boolean(20) ? $this->faker->dateTimeBetween('-15 days', 'now') : null,
        ];
    }
}