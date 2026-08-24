<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Report;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReportResource;

class AdminController extends Controller
{
    public function statistics()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_products' => Product::count(),
                'available_products' => Product::where('status', 'available')->count(),
                'sold_products' => Product::where('status', 'sold')->count(),
                'total_requests' => PurchaseRequest::count(),
                'total_reports' => Report::count(),
                'total_categories' => Category::count(),
            ]
        ]);
    }

    public function users()
    {
        return response()->json([
            'success' => true,
            'data' => UserResource::collection(User::all())
        ]);
    }

    public function blockUser(Request $request, User $user)
    {
        $user->update(['status' => 'blocked']);
        return response()->json([
            'success' => true,
            'message' => 'User blocked successfully'
        ]);
    }

    public function deleteUser(Request $request, User $user)
    {
        $user->delete();
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function products()
    {
        return response()->json([
            'success' => true,
            'data' => ProductResource::collection(Product::all())
        ]);
    }

    public function deleteProduct(Request $request, Product $product)
    {
        $product->delete();
        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function reports()
    {
        return response()->json([
            'success' => true,
            'data' => ReportResource::collection(Report::all())
        ]);
    }

    public function resolveReport(Request $request, Report $report)
    {
        $report->update(['status' => 'resolved']);
        return response()->json([
            'success' => true,
            'message' => 'Report resolved successfully'
        ]);
    }
}
