<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reporter_id' => $this->reporter_id,
            'target_type' => $this->product_id ? 'product' : 'user',
            'target_id' => $this->product_id ?? $this->reported_user_id,
            'reason' => $this->reason,
            'description' => $this->description,
            'status' => $this->status,
            'created_at' => $this->created_at->toIso8601String(),
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'reportedUser' => new UserResource($this->whenLoaded('reportedUser')),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
