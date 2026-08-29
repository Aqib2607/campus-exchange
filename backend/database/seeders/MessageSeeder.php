<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $products = Product::all()->keyBy('name');

        // Fetch Conversations by Product
        $calcProduct = $products['TI-84 Plus CE Color Graphing Calculator'];
        $convCalc = Conversation::where('product_id', $calcProduct->id)->first();

        $calculusBook = $products['Stewart Calculus Early Transcendentals (8th Ed)'];
        $convCalculus = Conversation::where('product_id', $calculusBook->id)->first();

        $chemBook = $products['Organic Chemistry As a Second Language (Klein)'];
        $convChem = Conversation::where('product_id', $chemBook->id)->first();

        $headphones = $products['Sony WH-1000XM4 Noise Canceling Headphones'];
        $convHeadphones = Conversation::where('product_id', $headphones->id)->first();

        $now = Carbon::now();

        // 1. Messages for TI-84 Calculator (Bella & Alex)
        if ($convCalc) {
            $msgList1 = [
                [
                    'conversation_id' => $convCalc->id,
                    'sender_id' => $users['bella.chen@university.edu']->id,
                    'message' => 'Hey Alex! Is the TI-84 Plus CE calculator still available for purchase?',
                    'created_at' => $now->copy()->subHours(6)->addMinutes(5),
                    'updated_at' => $now->copy()->subHours(6)->addMinutes(5),
                ],
                [
                    'conversation_id' => $convCalc->id,
                    'sender_id' => $users['alex.rivers@university.edu']->id,
                    'message' => 'Hi Bella! Yes it is. Battery holds a charge great and comes with the charging cable.',
                    'created_at' => $now->copy()->subHours(6)->addMinutes(12),
                    'updated_at' => $now->copy()->subHours(6)->addMinutes(12),
                ],
                [
                    'conversation_id' => $convCalc->id,
                    'sender_id' => $users['bella.chen@university.edu']->id,
                    'message' => 'Awesome, I just submitted an official purchase request. Could we meet at the Math & Engineering Building around 3 PM today?',
                    'created_at' => $now->copy()->subHours(5)->addMinutes(20),
                    'updated_at' => $now->copy()->subHours(5)->addMinutes(20),
                ],
                [
                    'conversation_id' => $convCalc->id,
                    'sender_id' => $users['alex.rivers@university.edu']->id,
                    'message' => 'I just accepted your purchase request! 3 PM outside the Math building main lobby works perfectly.',
                    'created_at' => $now->copy()->subHours(5)->addMinutes(28),
                    'updated_at' => $now->copy()->subHours(5)->addMinutes(28),
                ],
                [
                    'conversation_id' => $convCalc->id,
                    'sender_id' => $users['bella.chen@university.edu']->id,
                    'message' => 'Sounds great, see you there!',
                    'created_at' => $now->copy()->subHours(5)->addMinutes(30),
                    'updated_at' => $now->copy()->subHours(5)->addMinutes(30),
                ],
            ];
            foreach ($msgList1 as $m) {
                Message::create($m);
            }
        }

        // 2. Messages for Stewart Calculus Book (Carlos & Alex)
        if ($convCalculus) {
            $msgList2 = [
                [
                    'conversation_id' => $convCalculus->id,
                    'sender_id' => $users['carlos.gomez@university.edu']->id,
                    'message' => 'Hi Alex, does this Calculus book have lots of notes or highlighting in the chapters?',
                    'created_at' => $now->copy()->subHours(4)->addMinutes(10),
                    'updated_at' => $now->copy()->subHours(4)->addMinutes(10),
                ],
                [
                    'conversation_id' => $convCalculus->id,
                    'sender_id' => $users['alex.rivers@university.edu']->id,
                    'message' => 'Hey Carlos, only very minor yellow highlighting in Chapters 1-3. All exercise problem sets at the end of chapters are unmarked.',
                    'created_at' => $now->copy()->subHours(4)->addMinutes(18),
                    'updated_at' => $now->copy()->subHours(4)->addMinutes(18),
                ],
                [
                    'conversation_id' => $convCalculus->id,
                    'sender_id' => $users['carlos.gomez@university.edu']->id,
                    'message' => 'Perfect. I sent a purchase request through the platform. Can meet you at the Science Library tomorrow.',
                    'created_at' => $now->copy()->subHours(3)->addMinutes(45),
                    'updated_at' => $now->copy()->subHours(3)->addMinutes(45),
                ],
            ];
            foreach ($msgList2 as $m) {
                Message::create($m);
            }
        }

        // 3. Messages for Organic Chemistry (Carlos & Bella)
        if ($convChem) {
            $msgList3 = [
                [
                    'conversation_id' => $convChem->id,
                    'sender_id' => $users['carlos.gomez@university.edu']->id,
                    'message' => 'Hi Bella, taking CHEM 201 next quarter and would love to buy this Klein workbook.',
                    'created_at' => $now->copy()->subDays(1)->addHours(2),
                    'updated_at' => $now->copy()->subDays(1)->addHours(2),
                ],
                [
                    'conversation_id' => $convChem->id,
                    'sender_id' => $users['bella.chen@university.edu']->id,
                    'message' => 'Hi Carlos! It was a huge lifesaver for my exams. Request accepted! When are you on campus?',
                    'created_at' => $now->copy()->subDays(1)->addHours(2)->addMinutes(15),
                    'updated_at' => $now->copy()->subDays(1)->addHours(2)->addMinutes(15),
                ],
                [
                    'conversation_id' => $convChem->id,
                    'sender_id' => $users['carlos.gomez@university.edu']->id,
                    'message' => 'Picked it up yesterday at Chemistry Annex. Thanks again for the quick meetup!',
                    'created_at' => $now->copy()->subHours(20),
                    'updated_at' => $now->copy()->subHours(20),
                ],
                [
                    'conversation_id' => $convChem->id,
                    'sender_id' => $users['bella.chen@university.edu']->id,
                    'message' => 'You got it! Best of luck with organic chemistry this term.',
                    'created_at' => $now->copy()->subHours(19),
                    'updated_at' => $now->copy()->subHours(19),
                ],
            ];
            foreach ($msgList3 as $m) {
                Message::create($m);
            }
        }

        // 4. Messages for Sony Headphones (Diana & Alex)
        if ($convHeadphones) {
            $msgList4 = [
                [
                    'conversation_id' => $convHeadphones->id,
                    'sender_id' => $users['diana.patel@university.edu']->id,
                    'message' => 'Hi Alex, do these headphones come with the hard zip case and the 3.5mm headphone cable?',
                    'created_at' => $now->copy()->subHours(2)->addMinutes(5),
                    'updated_at' => $now->copy()->subHours(2)->addMinutes(5),
                ],
                [
                    'conversation_id' => $convHeadphones->id,
                    'sender_id' => $users['alex.rivers@university.edu']->id,
                    'message' => 'Hi Diana, yes! The original case, 3.5mm gold-plated aux cable, and airline adapter are all included in pristine condition.',
                    'created_at' => $now->copy()->subHours(2)->addMinutes(14),
                    'updated_at' => $now->copy()->subHours(2)->addMinutes(14),
                ],
            ];
            foreach ($msgList4 as $m) {
                Message::create($m);
            }
        }
    }
}
