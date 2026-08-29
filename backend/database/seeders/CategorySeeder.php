<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Textbooks & Course Materials',
            'Electronics & Gadgets',
            'Dorm Furniture & Decor',
            'Bikes & Campus Transit',
            'School Supplies & Calculators',
            'Clothing & University Gear',
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }
    }
}
