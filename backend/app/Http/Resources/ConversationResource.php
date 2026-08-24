<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'participant_ids' => [$this->user_one_id, $this->user_two_id],
            'last_message_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
