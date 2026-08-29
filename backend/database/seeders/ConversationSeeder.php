<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $products = Product::all()->keyBy('name');

        $conversations = [
            // Thread 1: Bella (Buyer) & Alex (Seller) on TI-84 Calculator
            [
                'product_id' => $products['TI-84 Plus CE Color Graphing Calculator']->id,
                'user_one_id' => $users['bella.chen@university.edu']->id,
                'user_two_id' => $users['alex.rivers@university.edu']->id,
            ],

            // Thread 2: Carlos (Buyer) & Alex (Seller) on Stewart Calculus Book
            [
                'product_id' => $products['Stewart Calculus Early Transcendentals (8th Ed)']->id,
                'user_one_id' => $users['carlos.gomez@university.edu']->id,
                'user_two_id' => $users['alex.rivers@university.edu']->id,
            ],

            // Thread 3: Carlos (Buyer) & Bella (Seller) on Organic Chemistry Book
            [
                'product_id' => $products['Organic Chemistry As a Second Language (Klein)']->id,
                'user_one_id' => $users['carlos.gomez@university.edu']->id,
                'user_two_id' => $users['bella.chen@university.edu']->id,
            ],

            // Thread 4: Diana (Buyer) & Alex (Seller) on Sony Headphones
            [
                'product_id' => $products['Sony WH-1000XM4 Noise Canceling Headphones']->id,
                'user_one_id' => $users['diana.patel@university.edu']->id,
                'user_two_id' => $users['alex.rivers@university.edu']->id,
            ],
        ];

        foreach ($conversations as $conv) {
            Conversation::firstOrCreate($conv);
        }
    }
}
