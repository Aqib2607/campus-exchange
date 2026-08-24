<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Resources\ReportResource;

class ReportController extends Controller
{
    public function mine(Request $request)
    {
        $reports = Report::where('reporter_id', $request->user()->id)->get();
        return response()->json([
            'success' => true,
            'data' => ReportResource::collection($reports)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_type' => 'required|in:product,user',
            'target_id' => 'required|integer',
            'reason' => 'required|in:Spam,Inappropriate Content,Misleading Listing,Suspicious User,Other',
            'description' => 'nullable|string'
        ]);

        if ($validated['target_type'] === 'user' && $validated['target_id'] == $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Cannot report yourself'], 400);
        }

        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'reported_user_id' => $validated['target_type'] === 'user' ? $validated['target_id'] : null,
            'product_id' => $validated['target_type'] === 'product' ? $validated['target_id'] : null,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? '',
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted',
            'data' => new ReportResource($report)
        ], 201);
    }
}
