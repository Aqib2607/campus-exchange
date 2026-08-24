<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Users
        $admin = \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@university.edu',
            'role' => 'admin',
        ]);

        $student1 = \App\Models\User::factory()->create([
            'name' => 'Alice Student',
            'email' => 'alice@university.edu',
            'role' => 'student',
        ]);

        $student2 = \App\Models\User::factory()->create([
            'name' => 'Bob Student',
            'email' => 'bob@university.edu',
            'role' => 'student',
        ]);

        // Categories
        $catBooks = \App\Models\Category::create(['name' => 'Textbooks']);
        $catElectronics = \App\Models\Category::create(['name' => 'Electronics']);
        $catFurniture = \App\Models\Category::create(['name' => 'Furniture']);

        // Products
        $p1 = \App\Models\Product::create([
            'user_id' => $student1->id,
            'category_id' => $catBooks->id,
            'name' => 'Calculus Early Transcendentals',
            'description' => 'Used but in good condition.',
            'price' => 50.00,
            'condition' => 'Good',
            'image' => 'placeholder.png',
            'location' => 'Library',
            'contact_information' => 'Email me',
            'status' => 'available',
        ]);

        $p2 = \App\Models\Product::create([
            'user_id' => $student2->id,
            'category_id' => $catElectronics->id,
            'name' => 'Scientific Calculator',
            'description' => 'Works perfectly.',
            'price' => 20.00,
            'condition' => 'Like New',
            'image' => 'placeholder.png',
            'location' => 'Student Union',
            'contact_information' => 'Text me',
            'status' => 'available',
        ]);

        // Requests
        $req = \App\Models\PurchaseRequest::create([
            'product_id' => $p1->id,
            'buyer_id' => $student2->id,
            'seller_id' => $student1->id,
            'status' => 'pending',
            'message' => 'I can buy it today.'
        ]);

        // Conversation
        $conv = \App\Models\Conversation::create([
            'product_id' => $p1->id,
            'user_one_id' => $student2->id,
            'user_two_id' => $student1->id,
        ]);

        \App\Models\Message::create([
            'conversation_id' => $conv->id,
            'sender_id' => $student2->id,
            'message' => 'Is this still available?'
        ]);
        
        \App\Models\Message::create([
            'conversation_id' => $conv->id,
            'sender_id' => $student1->id,
            'message' => 'Yes it is!'
        ]);
    }
}
