<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $products = Product::all()->keyBy('name');

        $favorites = [
            // Alex's Favorites (2 items)
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'product_id' => $products['Apple iPad 9th Gen (64GB Wi-Fi Space Gray)']->id,
            ],
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'product_id' => $products['Ergonomic Mesh Swivel Desk Chair']->id,
            ],

            // Bella's Favorites (3 items)
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'product_id' => $products['Stewart Calculus Early Transcendentals (8th Ed)']->id,
            ],
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'product_id' => $products['Logitech MX Master 3S Wireless Mouse']->id,
            ],
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'product_id' => $products['Hydro Flask 32oz Wide Mouth Bottle with Straw Cap']->id,
            ],

            // Carlos's Favorites (1 item)
            [
                'user_id' => $users['carlos.gomez@university.edu']->id,
                'product_id' => $products['Trek FX 2 Disc Commuter Hybrid Bike']->id,
            ],

            // Diana's Favorites (2 items)
            [
                'user_id' => $users['diana.patel@university.edu']->id,
                'product_id' => $products['Sony WH-1000XM4 Noise Canceling Headphones']->id,
            ],
            [
                'user_id' => $users['diana.patel@university.edu']->id,
                'product_id' => $products['Official Varsity Embroidered Campus Hoodie (Size M)']->id,
            ],

            // Evan's Favorites (1 item)
            [
                'user_id' => $users['evan.wright@university.edu']->id,
                'product_id' => $products['Principles of Economics (Mankiw 9th Edition)']->id,
            ],
        ];

        foreach ($favorites as $fav) {
            Favorite::firstOrCreate($fav);
        }
    }
}
