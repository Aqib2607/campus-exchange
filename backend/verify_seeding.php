<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Favorite;
use App\Models\PurchaseRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Report;

echo "========================================\n";
echo "DATABASE SEEDING VERIFICATION REPORT\n";
echo "========================================\n\n";

// 1. Table Counts
$userCount = User::count();
$catCount = Category::count();
$prodCount = Product::count();
$favCount = Favorite::count();
$reqCount = PurchaseRequest::count();
$convCount = Conversation::count();
$msgCount = Message::count();
$repCount = Report::count();

echo "TABLE RECORD COUNTS:\n";
echo " - Users: $userCount\n";
echo " - Categories: $catCount\n";
echo " - Products: $prodCount\n";
echo " - Favorites: $favCount\n";
echo " - Purchase Requests: $reqCount\n";
echo " - Conversations: $convCount\n";
echo " - Messages: $msgCount\n";
echo " - Reports: $repCount\n\n";

// 2. User Accounts Check
echo "USER ACCOUNTS CHECK:\n";
$users = User::all();
foreach ($users as $u) {
    echo sprintf(" - [%d] %s (%s) | Role: %s | Status: %s\n", $u->id, $u->name, $u->email, $u->role, $u->status);
}
echo "\n";

// 3. User Data Isolation Check
echo "USER DATA ISOLATION MATRIX:\n";
foreach ($users as $u) {
    $myListings = Product::where('user_id', $u->id)->count();
    $myActiveListings = Product::where('user_id', $u->id)->where('status', 'available')->count();
    $mySoldListings = Product::where('user_id', $u->id)->where('status', 'sold')->count();
    $myFavorites = Favorite::where('user_id', $u->id)->count();
    $mySentReqs = PurchaseRequest::where('buyer_id', $u->id)->count();
    $myRecvReqs = PurchaseRequest::where('seller_id', $u->id)->count();
    $myConvs = Conversation::where('user_one_id', $u->id)->orWhere('user_two_id', $u->id)->count();

    echo sprintf(
        "User: %-25s | Listings: %d (Avail: %d, Sold: %d) | Favs: %d | Sent Req: %d | Recv Req: %d | Convs: %d\n",
        $u->email,
        $myListings,
        $myActiveListings,
        $mySoldListings,
        $myFavorites,
        $mySentReqs,
        $myRecvReqs,
        $myConvs
    );
}
echo "\n";

// 4. Invariant Checks
echo "RELATIONAL INVARIANT VERIFICATION:\n";

// Check Sold Products match accepted requests
$soldProducts = Product::where('status', 'sold')->get();
foreach ($soldProducts as $p) {
    $acceptedReq = PurchaseRequest::where('product_id', $p->id)->where('status', 'accepted')->first();
    if ($acceptedReq) {
        echo " [PASS] Sold Product #{$p->id} ('{$p->name}') has matching accepted PurchaseRequest #{$acceptedReq->id} (Buyer ID: {$acceptedReq->buyer_id})\n";
    } else {
        echo " [FAIL] Sold Product #{$p->id} has NO accepted PurchaseRequest!\n";
    }
}

// Check Message Senders are conversation participants
$allMsgs = Message::with('conversation')->get();
$msgErrors = 0;
foreach ($allMsgs as $m) {
    $c = $m->conversation;
    if ($m->sender_id != $c->user_one_id && $m->sender_id != $c->user_two_id) {
        echo " [FAIL] Message #{$m->id} sender #{$m->sender_id} is NOT in conversation #{$c->id} (Participants: {$c->user_one_id}, {$c->user_two_id})\n";
        $msgErrors++;
    }
}
if ($msgErrors === 0) {
    echo " [PASS] All $msgCount Messages belong strictly to conversation participants (user_one_id or user_two_id).\n";
}

// Check Clean Student has strictly zero records
$clean = User::where('email', 'chloe.clean@university.edu')->first();
if ($clean) {
    $cleanListings = Product::where('user_id', $clean->id)->count();
    $cleanFavs = Favorite::where('user_id', $clean->id)->count();
    $cleanSentReqs = PurchaseRequest::where('buyer_id', $clean->id)->count();
    $cleanRecvReqs = PurchaseRequest::where('seller_id', $clean->id)->count();
    $cleanConvs = Conversation::where('user_one_id', $clean->id)->orWhere('user_two_id', $clean->id)->count();

    if ($cleanListings === 0 && $cleanFavs === 0 && $cleanSentReqs === 0 && $cleanRecvReqs === 0 && $cleanConvs === 0) {
        echo " [PASS] Clean Student Control Account ('chloe.clean@university.edu') has verified zero-state across all tables (0, 0, 0, 0, 0).\n";
    } else {
        echo " [FAIL] Clean Student has non-zero records!\n";
    }
}

echo "\n========================================\n";
echo "VERIFICATION COMPLETE\n";
echo "========================================\n";
