<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->keyBy('email');
        $categories = Category::all()->keyBy('name');

        $products = [
            // Student A (Alex Rivers) Products
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'category_id' => $categories['Textbooks & Course Materials']->id,
                'name' => 'Stewart Calculus Early Transcendentals (8th Ed)',
                'description' => 'Standard textbook used for MATH 101/102. Clean interior with minimal highlighting in Chapters 1-3. Includes practice problem sets.',
                'price' => 45.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
                'location' => 'Science Library 2nd Floor',
                'contact_information' => 'Text Alex at (555) 234-5678 or meet near circulation desk.',
                'status' => 'available',
            ],
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'category_id' => $categories['Electronics & Gadgets']->id,
                'name' => 'Sony WH-1000XM4 Noise Canceling Headphones',
                'description' => 'Midnight black Sony WH-1000XM4 in pristine condition. Outstanding active noise cancellation for library study sessions. Includes travel case and cables.',
                'price' => 160.00,
                'condition' => 'Like New',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'location' => 'Student Union Lounge',
                'contact_information' => 'Email alex.rivers@university.edu or message on Campus Exchange.',
                'status' => 'available',
            ],
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'category_id' => $categories['Bikes & Campus Transit']->id,
                'name' => 'Trek FX 2 Disc Commuter Hybrid Bike',
                'description' => 'Matte charcoal 21-speed commuter bike with disc brakes. Recently tuned up with new brake pads and lubricated chain. Ideal for quick cross-campus rides.',
                'price' => 280.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
                'location' => 'North Quad Bike Racks',
                'contact_information' => 'Call or text (555) 234-5678 to arrange a test ride.',
                'status' => 'available',
            ],
            [
                'user_id' => $users['alex.rivers@university.edu']->id,
                'category_id' => $categories['School Supplies & Calculators']->id,
                'name' => 'TI-84 Plus CE Color Graphing Calculator',
                'description' => 'Rechargeable color graphing calculator with Python support. Approved for SAT/ACT/AP exams and undergraduate engineering & stats classes. Sold with USB charging cable.',
                'price' => 65.00,
                'condition' => 'Like New',
                'image' => 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
                'location' => 'Math & Engineering Building',
                'contact_information' => 'alex.rivers@university.edu',
                'status' => 'sold',
            ],

            // Student B (Bella Chen) Products
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'category_id' => $categories['Dorm Furniture & Decor']->id,
                'name' => 'Ergonomic Mesh Swivel Desk Chair',
                'description' => 'Breathable mesh backrest with pneumatic seat height adjustment and smooth caster wheels. Extremely comfortable for long studying sessions in dorms.',
                'price' => 55.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1580481077195-c3a82da912e3?auto=format&fit=crop&w=800&q=80',
                'location' => 'East Campus Tower Lobby',
                'contact_information' => 'Text Bella at (555) 345-6789. Can help carry down to lobby.',
                'status' => 'available',
            ],
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'category_id' => $categories['Clothing & University Gear']->id,
                'name' => 'Official Varsity Embroidered Campus Hoodie (Size M)',
                'description' => 'Heavyweight fleece hoodie in navy blue with gold university crest embroidery. Unworn with original tags attached. Oversized comfortable fit.',
                'price' => 30.00,
                'condition' => 'New',
                'image' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                'location' => 'University Center',
                'contact_information' => 'bella.chen@university.edu',
                'status' => 'available',
            ],
            [
                'user_id' => $users['bella.chen@university.edu']->id,
                'category_id' => $categories['Textbooks & Course Materials']->id,
                'name' => 'Organic Chemistry As a Second Language (Klein)',
                'description' => 'Essential companion workbook for CHEM 201 & 202. First Semester Topics, 5th Edition. No missing pages, binding in solid shape.',
                'price' => 25.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
                'location' => 'Chemistry Annex',
                'contact_information' => 'Text (555) 345-6789',
                'status' => 'sold',
            ],

            // Student C (Carlos Gomez) Products
            [
                'user_id' => $users['carlos.gomez@university.edu']->id,
                'category_id' => $categories['Electronics & Gadgets']->id,
                'name' => 'Apple iPad 9th Gen (64GB Wi-Fi Space Gray)',
                'description' => '10.2-inch Retina display with True Tone. Comes paired with Apple Pencil (1st Gen) and magnetic smart cover. Perfect for GoodNotes/Notability note taking.',
                'price' => 220.00,
                'condition' => 'Like New',
                'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                'location' => 'West Village Common Room',
                'contact_information' => 'carlos.gomez@university.edu or (555) 456-7890',
                'status' => 'available',
            ],
            [
                'user_id' => $users['carlos.gomez@university.edu']->id,
                'category_id' => $categories['Textbooks & Course Materials']->id,
                'name' => 'Principles of Economics (Mankiw 9th Edition)',
                'description' => 'Comprehensive intro econ textbook for ECON 101/102. Softcover edition with slight shelf wear on corners. Text is crisp and clean throughout.',
                'price' => 40.00,
                'condition' => 'Fair',
                'image' => 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
                'location' => 'Business School Atrium',
                'contact_information' => 'Text Carlos at (555) 456-7890',
                'status' => 'available',
            ],
            [
                'user_id' => $users['carlos.gomez@university.edu']->id,
                'category_id' => $categories['Dorm Furniture & Decor']->id,
                'name' => 'Adjustable Clamp-On Desk Lamp with USB Port',
                'description' => 'Sleek anodized aluminum LED desk lamp with 5 color temperatures and dimmable brightness. Clamps securely onto any dorm bed frame or desk shelf.',
                'price' => 18.00,
                'condition' => 'Like New',
                'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
                'location' => 'Undergraduate Library',
                'contact_information' => 'carlos.gomez@university.edu',
                'status' => 'available',
            ],

            // Student D (Diana Patel) Products
            [
                'user_id' => $users['diana.patel@university.edu']->id,
                'category_id' => $categories['School Supplies & Calculators']->id,
                'name' => 'Hydro Flask 32oz Wide Mouth Bottle with Straw Cap',
                'description' => 'TempShield double-wall vacuum insulation keeps drinks ice cold for 24 hours. Brand new, never used, matte black finish.',
                'price' => 20.00,
                'condition' => 'New',
                'image' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
                'location' => 'Campus Recreation Center',
                'contact_information' => 'Text Diana at (555) 567-8901',
                'status' => 'available',
            ],
            [
                'user_id' => $users['diana.patel@university.edu']->id,
                'category_id' => $categories['Bikes & Campus Transit']->id,
                'name' => 'Kryptonite Evolution Mini-7 Heavy Duty U-Lock',
                'description' => '13mm hardened max-performance steel shackle with 4ft KryptoFlex double loop cable. Comes with 3 stainless steel keys.',
                'price' => 35.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80',
                'location' => 'South Tower Security Desk',
                'contact_information' => 'diana.patel@university.edu',
                'status' => 'available',
            ],

            // Student E (Evan Wright) Products
            [
                'user_id' => $users['evan.wright@university.edu']->id,
                'category_id' => $categories['Electronics & Gadgets']->id,
                'name' => 'Logitech MX Master 3S Wireless Mouse',
                'description' => 'Ergonomic performance mouse with 8K DPI sensor and quiet clicks. USB-C rechargeable and pairs across 3 devices.',
                'price' => 50.00,
                'condition' => 'Like New',
                'image' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
                'location' => 'CS Lab Building B',
                'contact_information' => 'evan.wright@university.edu',
                'status' => 'available',
            ],
            [
                'user_id' => $users['evan.wright@university.edu']->id,
                'category_id' => $categories['Dorm Furniture & Decor']->id,
                'name' => 'College Dorm Mini Fridge & Freezer (1.7 cu ft)',
                'description' => 'Compact refrigerator with freezer compartment and reversible door. Whisper-quiet compressor perfect for shared dorm rooms.',
                'price' => 75.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
                'location' => 'University Commons Courtyard',
                'contact_information' => 'Text Evan at (555) 678-9012',
                'status' => 'available',
            ],
            [
                'user_id' => $users['evan.wright@university.edu']->id,
                'category_id' => $categories['Textbooks & Course Materials']->id,
                'name' => 'Campbell Biology (12th Edition Hardcover)',
                'description' => 'Complete biology textbook for BIO 110/111. High quality color diagrams and glossary. Sturdy hardcover binding in excellent condition.',
                'price' => 50.00,
                'condition' => 'Good',
                'image' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
                'location' => 'Biology Sciences Hall',
                'contact_information' => 'evan.wright@university.edu',
                'status' => 'available',
            ],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }
    }
}
