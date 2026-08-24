<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'buyer_id' => $this->buyer_id,
            'seller_id' => $this->seller_id,
            'status' => $this->status,
            'message' => $this->message,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
