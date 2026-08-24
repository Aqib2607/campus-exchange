<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Http\Resources\MessageResource;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;
        if ($conversation->user_one_id !== $userId && $conversation->user_two_id !== $userId) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()->orderBy('created_at', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => MessageResource::collection($messages)
        ]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;
        if ($conversation->user_one_id !== $userId && $conversation->user_two_id !== $userId) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string'
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'message' => $validated['body']
        ]);

        $conversation->touch(); // Update last_message_at via updated_at

        return response()->json([
            'success' => true,
            'message' => 'Message sent',
            'data' => new MessageResource($message)
        ], 201);
    }
}
