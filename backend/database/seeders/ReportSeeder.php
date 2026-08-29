<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $products = Product::all()->keyBy('name');

        $reports = [
            // Report 1: Product Report (Pending)
            [
                'reporter_id' => $users['alex.rivers@university.edu']->id,
                'reported_user_id' => $users['carlos.gomez@university.edu']->id,
                'product_id' => $products['Principles of Economics (Mankiw 9th Edition)']->id,
                'reason' => 'Misleading Listing',
                'description' => 'Listing claims 9th edition in title, but some internal problem set appendices are from the 8th edition.',
                'status' => 'pending',
            ],

            // Report 2: User Report (Resolved)
            [
                'reporter_id' => $users['diana.patel@university.edu']->id,
                'reported_user_id' => $users['evan.wright@university.edu']->id,
                'product_id' => null,
                'reason' => 'Suspicious User',
                'description' => 'User proposed off-platform payment via an unfamiliar external link rather than meeting on campus in person.',
                'status' => 'resolved',
            ],

            // Report 3: Spam Report (Resolved)
            [
                'reporter_id' => $users['bella.chen@university.edu']->id,
                'reported_user_id' => $users['carlos.gomez@university.edu']->id,
                'product_id' => null,
                'reason' => 'Spam',
                'description' => 'Multiple automated duplicate inquiries received regarding listing discount within a 5-minute window.',
                'status' => 'resolved',
            ],
        ];

        foreach ($reports as $rep) {
            Report::create($rep);
        }
    }
}
