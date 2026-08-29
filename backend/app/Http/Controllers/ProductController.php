<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['user', 'category']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $paginator = $query->paginate(24);
        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total()
            ]
        ]);
    }

    public function mine(Request $request)
    {
        $products = Product::with(['user', 'category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products)
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['user', 'category']);
        return response()->json([
            'success' => true,
            'data' => new ProductResource($product)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:New,Like New,Good,Fair',
            'location' => 'required|string',
            'contact_information' => 'required|string',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $validated['image'] = '/storage/' . $path;
        } else {
            $validated['image'] = 'placeholder.png';
        }

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'available';

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product created',
            'data' => new ProductResource($product)
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'condition' => 'sometimes|in:New,Like New,Good,Fair',
            'location' => 'sometimes|string',
            'contact_information' => 'sometimes|string',
            'status' => 'sometimes|in:available,sold',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated',
            'data' => new ProductResource($product)
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted'
        ]);
    }
}
