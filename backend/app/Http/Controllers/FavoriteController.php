<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\FavoriteResource;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with('product.category')->where('user_id', $request->user()->id)->get();
        return response()->json([
            'success' => true,
            'data' => FavoriteResource::collection($favorites)
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Product is already in favorites'
            ], 400);
        }

        $favorite = Favorite::create([
            'user_id' => $request->user()->id,
            'product_id' => $product->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Added to favorites',
            'data' => new FavoriteResource($favorite)
        ], 201);
    }

    public function destroy(Request $request, Product $product)
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if (!$favorite) {
            return response()->json([
                'success' => false,
                'message' => 'Product is not in favorites'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'success' => true,
            'message' => 'Removed from favorites'
        ]);
    }
}
