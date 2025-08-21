<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '555-0123',
            'address' => [
                'address_line_1' => '123 Admin St',
                'city' => 'Admin City',
                'state' => 'CA',
                'postal_code' => '90210',
                'country' => 'United States',
            ],
            'email_verified_at' => now(),
        ]);

        // Create test customer
        $customer = User::create([
            'name' => 'John Doe',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'phone' => '555-0456',
            'address' => [
                'address_line_1' => '456 Customer Ave',
                'city' => 'Customer City',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'United States',
            ],
            'email_verified_at' => now(),
        ]);

        // Create additional customers
        User::factory(10)->customer()->create();

        // Create categories
        $categories = [
            ['name' => 'T-Shirts', 'description' => 'Comfortable and stylish t-shirts for everyday wear'],
            ['name' => 'Jeans', 'description' => 'High-quality denim jeans in various fits and styles'],
            ['name' => 'Dresses', 'description' => 'Elegant dresses for any occasion'],
            ['name' => 'Jackets', 'description' => 'Stylish jackets and outerwear'],
            ['name' => 'Sneakers', 'description' => 'Trendy sneakers and casual footwear'],
            ['name' => 'Accessories', 'description' => 'Complete your look with our accessories'],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => \Illuminate\Support\Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'is_active' => true,
            ]);

            // Create products for each category
            Product::factory(8)->create([
                'category_id' => $category->id,
                'is_active' => true,
            ]);

            // Create some featured products
            Product::factory(2)->featured()->create([
                'category_id' => $category->id,
                'is_active' => true,
            ]);
        }

        // Create some sample orders
        $customers = User::customers()->get();
        
        foreach ($customers->take(5) as $user) {
            $order = Order::factory()->create([
                'user_id' => $user->id,
            ]);

            // Add order items
            $products = Product::inRandomOrder()->take(random_int(1, 4))->get();
            
            foreach ($products as $product) {
                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $product->price,
                ]);
            }
        }
    }
}