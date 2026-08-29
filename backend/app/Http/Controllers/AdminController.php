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
        $paginator = User::paginate(50);
        return response()->json([
            'success' => true,
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total()
            ]
        ]);
    }

    public function blockUser(Request $request, User $user)
    {
        $user->forceFill(['status' => 'blocked'])->save();
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
        $paginator = Product::with(['user', 'category'])->paginate(50);
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
        $paginator = Report::with(['reporter', 'reportedUser', 'product.category'])->paginate(50);
        return response()->json([
            'success' => true,
            'data' => ReportResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total()
            ]
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
