<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ConversationResource;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $conversations = Conversation::with(['product.category', 'userOne', 'userTwo'])
            ->where(function ($query) use ($userId) {
                $query->where('user_one_id', $userId)
                      ->orWhere('user_two_id', $userId);
            })
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ConversationResource::collection($conversations)
        ]);
    }

    public function show(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;
        if ($conversation->user_one_id !== $userId && $conversation->user_two_id !== $userId) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new ConversationResource($conversation)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'user_two_id' => 'required|exists:users,id',
        ]);

        if ($validated['user_two_id'] === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Cannot create a conversation with yourself.'], 400);
        }

        // Check if exists
        $existing = Conversation::where('product_id', $validated['product_id'])
            ->where(function ($query) use ($validated, $request) {
                $query->where(function ($q) use ($validated, $request) {
                    $q->where('user_one_id', $request->user()->id)
                      ->where('user_two_id', $validated['user_two_id']);
                })->orWhere(function ($q) use ($validated, $request) {
                    $q->where('user_one_id', $validated['user_two_id'])
                      ->where('user_two_id', $request->user()->id);
                });
            })->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Conversation already exists',
                'data' => new ConversationResource($existing)
            ]);
        }

        $conversation = Conversation::create([
            'product_id' => $validated['product_id'],
            'user_one_id' => $request->user()->id,
            'user_two_id' => $validated['user_two_id']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Conversation created',
            'data' => new ConversationResource($conversation)
        ], 201);
    }
}
