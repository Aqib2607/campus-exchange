<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password123');

        // Admin Supervisor
        User::create([
            'name' => 'Campus Admin',
            'email' => 'admin@university.edu',
            'password' => $password,
            'role' => 'admin',
            'status' => 'active',
            'contact_information' => 'Campus Life Admin Center Room 302 · admin@university.edu',
            'profile_image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Student A - Alex Rivers (Active Seller & Buyer)
        User::create([
            'name' => 'Alex Rivers',
            'email' => 'alex.rivers@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 234-5678 · North Quad Hall 4B',
            'profile_image' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Student B - Bella Chen (Active Student Seller/Buyer)
        User::create([
            'name' => 'Bella Chen',
            'email' => 'bella.chen@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 345-6789 · East Campus Tower 12A',
            'profile_image' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Student C - Carlos Gomez (Tech & Books Seller)
        User::create([
            'name' => 'Carlos Gomez',
            'email' => 'carlos.gomez@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 456-7890 · West Village Apt 204',
            'profile_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Student D - Diana Patel (Campus Buyer & Reviewer)
        User::create([
            'name' => 'Diana Patel',
            'email' => 'diana.patel@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 567-8901 · South Tower Suite 901',
            'profile_image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Student E - Evan Wright (General Student)
        User::create([
            'name' => 'Evan Wright',
            'email' => 'evan.wright@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 678-9012 · University Commons 15',
            'profile_image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);

        // Clean Student - Chloe Miller (Zero data control account to verify genuine zero-state rendering)
        User::create([
            'name' => 'Chloe Miller',
            'email' => 'chloe.clean@university.edu',
            'password' => $password,
            'role' => 'student',
            'status' => 'active',
            'contact_information' => '(555) 789-0123 · Freshman Hall 101',
            'profile_image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
            'email_verified_at' => now(),
        ]);
    }
}
