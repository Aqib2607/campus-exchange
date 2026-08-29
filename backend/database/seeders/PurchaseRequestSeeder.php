<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\PurchaseRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class PurchaseRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $products = Product::all()->keyBy('name');

        $requests = [
            // Accepted Request 1 (Alex's TI-84 Calculator -> Bella bought it -> Product is SOLD)
            [
                'product_id' => $products['TI-84 Plus CE Color Graphing Calculator']->id,
                'buyer_id' => $users['bella.chen@university.edu']->id,
                'seller_id' => $users['alex.rivers@university.edu']->id,
                'status' => 'accepted',
                'message' => 'Hi Alex, I need this for my Stats midterm this Friday. Can meet at Math building anytime today!',
            ],

            // Accepted Request 2 (Bella's Organic Chemistry -> Carlos bought it -> Product is SOLD)
            [
                'product_id' => $products['Organic Chemistry As a Second Language (Klein)']->id,
                'buyer_id' => $users['carlos.gomez@university.edu']->id,
                'seller_id' => $users['bella.chen@university.edu']->id,
                'status' => 'accepted',
                'message' => 'Taking Chem 201 next quarter, would love to buy this from you!',
            ],

            // Pending Request 3 (Alex's Calculus Book -> Carlos wants to buy)
            [
                'product_id' => $products['Stewart Calculus Early Transcendentals (8th Ed)']->id,
                'buyer_id' => $users['carlos.gomez@university.edu']->id,
                'seller_id' => $users['alex.rivers@university.edu']->id,
                'status' => 'pending',
                'message' => 'Is this still available? Can meet at Science Library tomorrow afternoon.',
            ],

            // Pending Request 4 (Alex's Sony Headphones -> Diana wants to buy)
            [
                'product_id' => $products['Sony WH-1000XM4 Noise Canceling Headphones']->id,
                'buyer_id' => $users['diana.patel@university.edu']->id,
                'seller_id' => $users['alex.rivers@university.edu']->id,
                'status' => 'pending',
                'message' => 'Hey! Would you be willing to take $150 in cash if I pick them up at the Student Union today?',
            ],

            // Rejected Request 5 (Carlos's iPad -> Diana lowballed -> Rejected)
            [
                'product_id' => $products['Apple iPad 9th Gen (64GB Wi-Fi Space Gray)']->id,
                'buyer_id' => $users['diana.patel@university.edu']->id,
                'seller_id' => $users['carlos.gomez@university.edu']->id,
                'status' => 'rejected',
                'message' => 'Can I offer $120 for just the iPad without the Apple pencil?',
            ],

            // Pending Request 6 (Alex's Trek Bike -> Evan wants to test ride)
            [
                'product_id' => $products['Trek FX 2 Disc Commuter Hybrid Bike']->id,
                'buyer_id' => $users['evan.wright@university.edu']->id,
                'seller_id' => $users['alex.rivers@university.edu']->id,
                'status' => 'pending',
                'message' => 'Looking to test ride this around North Quad before purchasing. Let me know if that works!',
            ],
        ];

        foreach ($requests as $req) {
            PurchaseRequest::create($req);
        }
    }
}
