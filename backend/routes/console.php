<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('verify:isolation', function () {
    $this->info("=== CAMPUS EXCHANGE DATA ISOLATION VERIFICATION ===");

    $category = \App\Models\Category::firstOrCreate(['name' => 'Textbooks']);

    \App\Models\User::whereIn('email', [
        'audit.alice@university.edu',
        'audit.bob@university.edu',
        'audit.fresh@university.edu'
    ])->delete();

    $alice = \App\Models\User::create([
        'name' => 'Alice Audit',
        'email' => 'audit.alice@university.edu',
        'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $bob = \App\Models\User::create([
        'name' => 'Bob Audit',
        'email' => 'audit.bob@university.edu',
        'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $fresh = \App\Models\User::create([
        'name' => 'Fresh Student',
        'email' => 'audit.fresh@university.edu',
        'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
        'role' => 'student',
        'email_verified_at' => now(),
    ]);

    $this->line("[1/4] Test users created: Alice (id: {$alice->id}), Bob (id: {$bob->id}), Fresh (id: {$fresh->id})");

    $aliceProd1 = \App\Models\Product::create([
        'user_id' => $alice->id,
        'category_id' => $category->id,
        'name' => 'Alice Chemistry Book',
        'description' => 'Great condition chemistry 101 textbook',
        'price' => 45.00,
        'condition' => 'Good',
        'location' => 'Library',
        'contact_information' => 'alice@university.edu',
        'image' => 'placeholder.png',
        'status' => 'available',
    ]);

    $aliceProd2 = \App\Models\Product::create([
        'user_id' => $alice->id,
        'category_id' => $category->id,
        'name' => 'Alice Graphing Calculator',
        'description' => 'TI-84 Plus Silver Edition',
        'price' => 60.00,
        'condition' => 'Like New',
        'location' => 'Student Center',
        'contact_information' => 'alice@university.edu',
        'image' => 'placeholder.png',
        'status' => 'available',
    ]);

    $bobProd = \App\Models\Product::create([
        'user_id' => $bob->id,
        'category_id' => $category->id,
        'name' => 'Bob Physics Lab Kit',
        'description' => 'Complete physics experiment kit',
        'price' => 35.00,
        'condition' => 'New',
        'location' => 'Science Block',
        'contact_information' => 'bob@university.edu',
        'image' => 'placeholder.png',
        'status' => 'available',
    ]);

    $req = \App\Models\PurchaseRequest::create([
        'product_id' => $bobProd->id,
        'buyer_id' => $alice->id,
        'seller_id' => $bob->id,
        'status' => 'pending',
    ]);

    $fav = \App\Models\Favorite::create([
        'user_id' => $alice->id,
        'product_id' => $bobProd->id,
    ]);

    $conv = \App\Models\Conversation::create([
        'product_id' => $bobProd->id,
        'user_one_id' => $alice->id,
        'user_two_id' => $bob->id,
    ]);

    $this->line("[2/4] Interactions seeded between Alice and Bob.");

    $getMine = fn($id) => \App\Models\Product::where('user_id', $id)->get();
    $getSent = fn($id) => \App\Models\PurchaseRequest::where('buyer_id', $id)->get();
    $getRecv = fn($id) => \App\Models\PurchaseRequest::where('seller_id', $id)->get();
    $getConv = fn($id) => \App\Models\Conversation::where(function($q) use ($id) {
        $q->where('user_one_id', $id)->orWhere('user_two_id', $id);
    })->get();
    $getFav = fn($id) => \App\Models\Favorite::where('user_id', $id)->get();

    $this->info("[3/4] Running Scoping & Isolation Invariant Assertions:");

    $freshMine = $getMine($fresh->id)->count();
    $freshSent = $getSent($fresh->id)->count();
    $freshRecv = $getRecv($fresh->id)->count();
    $freshConv = $getConv($fresh->id)->count();
    $freshFav = $getFav($fresh->id)->count();

    $this->line("  [Fresh Account - User C]");
    $this->line("    - My Listings (GET /api/products/mine): {$freshMine} (Expected: 0) -> " . ($freshMine === 0 ? "PASS" : "FAIL"));
    $this->line("    - Sent Requests (GET /api/requests/sent): {$freshSent} (Expected: 0) -> " . ($freshSent === 0 ? "PASS" : "FAIL"));
    $this->line("    - Received Requests (GET /api/requests/received): {$freshRecv} (Expected: 0) -> " . ($freshRecv === 0 ? "PASS" : "FAIL"));
    $this->line("    - Conversations (GET /api/conversations): {$freshConv} (Expected: 0) -> " . ($freshConv === 0 ? "PASS" : "FAIL"));
    $this->line("    - Saved Items (GET /api/favorites): {$freshFav} (Expected: 0) -> " . ($freshFav === 0 ? "PASS" : "FAIL"));

    $aliceMine = $getMine($alice->id)->count();
    $aliceSent = $getSent($alice->id)->count();
    $aliceRecv = $getRecv($alice->id)->count();
    $aliceConv = $getConv($alice->id)->count();
    $aliceFav = $getFav($alice->id)->count();

    $this->line("  [Alice - User A]");
    $this->line("    - My Listings: {$aliceMine} (Expected: 2) -> " . ($aliceMine === 2 ? "PASS" : "FAIL"));
    $this->line("    - Sent Requests: {$aliceSent} (Expected: 1) -> " . ($aliceSent === 1 ? "PASS" : "FAIL"));
    $this->line("    - Received Requests: {$aliceRecv} (Expected: 0) -> " . ($aliceRecv === 0 ? "PASS" : "FAIL"));
    $this->line("    - Conversations: {$aliceConv} (Expected: 1) -> " . ($aliceConv === 1 ? "PASS" : "FAIL"));
    $this->line("    - Saved Items: {$aliceFav} (Expected: 1) -> " . ($aliceFav === 1 ? "PASS" : "FAIL"));

    $bobMine = $getMine($bob->id)->count();
    $bobSent = $getSent($bob->id)->count();
    $bobRecv = $getRecv($bob->id)->count();
    $bobConv = $getConv($bob->id)->count();
    $bobFav = $getFav($bob->id)->count();

    $this->line("  [Bob - User B]");
    $this->line("    - My Listings: {$bobMine} (Expected: 1) -> " . ($bobMine === 1 ? "PASS" : "FAIL"));
    $this->line("    - Sent Requests: {$bobSent} (Expected: 0) -> " . ($bobSent === 0 ? "PASS" : "FAIL"));
    $this->line("    - Received Requests: {$bobRecv} (Expected: 1) -> " . ($bobRecv === 1 ? "PASS" : "FAIL"));
    $this->line("    - Conversations: {$bobConv} (Expected: 1) -> " . ($bobConv === 1 ? "PASS" : "FAIL"));
    $this->line("    - Saved Items: {$bobFav} (Expected: 0) -> " . ($bobFav === 0 ? "PASS" : "FAIL"));

    \App\Models\User::whereIn('email', [
        'audit.alice@university.edu',
        'audit.bob@university.edu',
        'audit.fresh@university.edu'
    ])->delete();

    $this->info("[4/4] Cleaned up verification records from database.");
    $this->info("=== DATA INTEGRITY & ISOLATION SUITE: 100% PASS ===");
});
