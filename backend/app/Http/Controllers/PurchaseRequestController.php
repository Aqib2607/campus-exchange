<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\PurchaseRequestResource;
use Illuminate\Support\Facades\DB;

class PurchaseRequestController extends Controller
{
    public function sent(Request $request)
    {
        $requests = PurchaseRequest::where('buyer_id', $request->user()->id)->get();
        return response()->json([
            'success' => true,
            'data' => PurchaseRequestResource::collection($requests)
        ]);
    }

    public function received(Request $request)
    {
        $requests = PurchaseRequest::where('seller_id', $request->user()->id)->get();
        return response()->json([
            'success' => true,
            'data' => PurchaseRequestResource::collection($requests)
        ]);
    }

    public function store(Request $request, Product $product)
    {
        if ($product->status !== 'available') {
            return response()->json(['success' => false, 'message' => 'Product is not available.'], 400);
        }

        if ($product->user_id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'You cannot request your own product.'], 400);
        }

        $existing = PurchaseRequest::where('buyer_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return response()->json(['success' => false, 'message' => 'You already have a pending request for this product.'], 400);
        }

        $validated = $request->validate([
            'message' => 'nullable|string'
        ]);

        $purchaseRequest = PurchaseRequest::create([
            'product_id' => $product->id,
            'buyer_id' => $request->user()->id,
            'seller_id' => $product->user_id,
            'message' => $validated['message'] ?? null,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Purchase request sent',
            'data' => new PurchaseRequestResource($purchaseRequest)
        ], 201);
    }

    public function accept(Request $request, PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->seller_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($purchaseRequest->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Request is not pending'], 400);
        }

        DB::transaction(function () use ($purchaseRequest) {
            $product = Product::lockForUpdate()->find($purchaseRequest->product_id);
            
            if ($product->status !== 'available') {
                throw new \Exception("Product already sold");
            }

            $purchaseRequest->update(['status' => 'accepted']);
            $product->update(['status' => 'sold']);

            // Reject all other pending requests for this product
            PurchaseRequest::where('product_id', $product->id)
                ->where('id', '!=', $purchaseRequest->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Request accepted and product marked as sold',
            'data' => new PurchaseRequestResource($purchaseRequest->fresh())
        ]);
    }

    public function reject(Request $request, PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->seller_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($purchaseRequest->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Request is not pending'], 400);
        }

        $purchaseRequest->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Request rejected',
            'data' => new PurchaseRequestResource($purchaseRequest)
        ]);
    }
}
