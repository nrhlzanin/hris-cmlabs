<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LetterFormat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LetterFormatController extends Controller
{
    /**
     * Get all letter formats with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = LetterFormat::with('letters');

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name_letter', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->byStatus($request->status);
        }

        // Get only active formats if requested
        if ($request->has('active_only') && $request->active_only) {
            $query->active();
        }

        $perPage = $request->get('per_page', 10);
        $letterFormats = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Letter formats retrieved successfully',
            'data' => [
                'letter_formats' => $letterFormats->items(),
                'pagination' => [
                    'current_page' => $letterFormats->currentPage(),
                    'last_page' => $letterFormats->lastPage(),
                    'per_page' => $letterFormats->perPage(),
                    'total' => $letterFormats->total(),
                    'from' => $letterFormats->firstItem(),
                    'to' => $letterFormats->lastItem(),
                ]
            ]
        ], 200);
    }

    /**
     * Store new letter format
     */
    public function store(Request $request): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can create letter formats'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name_letter' => 'required|string|max:255|unique:letter_formats,name_letter',
            'content' => 'required|file|mimes:doc,docx,pdf|max:5120', // 5MB max
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Store the uploaded file
            $contentPath = $request->file('content')->store('letter_formats', 'public');

            $letterFormat = LetterFormat::create([
                'name_letter' => $request->name_letter,
                'content' => $contentPath,
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Letter format created successfully',
                'data' => [
                    'letter_format' => [
                        'id' => $letterFormat->id_letter,
                        'name_letter' => $letterFormat->name_letter,
                        'content_url' => $letterFormat->content_url,
                        'status' => $letterFormat->status,
                        'created_at' => $letterFormat->created_at,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create letter format',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific letter format
     */
    public function show(int $id): JsonResponse
    {
        $letterFormat = LetterFormat::with(['letters', 'employees'])->where('id_letter', $id)->first();

        if (!$letterFormat) {
            return response()->json([
                'success' => false,
                'message' => 'Letter format not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter format retrieved successfully',
            'data' => [
                'letter_format' => [
                    'id' => $letterFormat->id_letter,
                    'name_letter' => $letterFormat->name_letter,
                    'content_url' => $letterFormat->content_url,
                    'status' => $letterFormat->status,
                    'is_active' => $letterFormat->isActive(),
                    'letters_count' => $letterFormat->letters->count(),
                    'employees_count' => $letterFormat->employees->count(),
                    'created_at' => $letterFormat->created_at,
                    'updated_at' => $letterFormat->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update letter format
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can update letter formats'
            ], 403);
        }

        $letterFormat = LetterFormat::where('id_letter', $id)->first();

        if (!$letterFormat) {
            return response()->json([
                'success' => false,
                'message' => 'Letter format not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_letter' => 'sometimes|string|max:255|unique:letter_formats,name_letter,' . $id . ',id_letter',
            'content' => 'sometimes|file|mimes:doc,docx,pdf|max:5120',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only(['name_letter', 'status']);

            // Handle file upload if provided
            if ($request->hasFile('content')) {
                // Delete old file
                if ($letterFormat->content) {
                    Storage::disk('public')->delete($letterFormat->content);
                }
                
                // Store new file
                $contentPath = $request->file('content')->store('letter_formats', 'public');
                $updateData['content'] = $contentPath;
            }

            $letterFormat->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Letter format updated successfully',
                'data' => [
                    'letter_format' => [
                        'id' => $letterFormat->id_letter,
                        'name_letter' => $letterFormat->name_letter,
                        'content_url' => $letterFormat->content_url,
                        'status' => $letterFormat->status,
                        'updated_at' => $letterFormat->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update letter format',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete letter format
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        // Check if user is super admin
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only super admin can delete letter formats'
            ], 403);
        }

        $letterFormat = LetterFormat::where('id_letter', $id)->first();

        if (!$letterFormat) {
            return response()->json([
                'success' => false,
                'message' => 'Letter format not found'
            ], 404);
        }

        // Check if format is being used
        if ($letterFormat->letters()->count() > 0 || $letterFormat->employees()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete letter format that is being used by letters or employees'
            ], 400);
        }

        try {
            // Delete the file
            if ($letterFormat->content) {
                Storage::disk('public')->delete($letterFormat->content);
            }

            $letterFormat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Letter format deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete letter format',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle status (active/inactive)
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can toggle letter format status'
            ], 403);
        }

        $letterFormat = LetterFormat::where('id_letter', $id)->first();

        if (!$letterFormat) {
            return response()->json([
                'success' => false,
                'message' => 'Letter format not found'
            ], 404);
        }

        try {
            $newStatus = $letterFormat->status === 'active' ? 'inactive' : 'active';
            $letterFormat->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => "Letter format status changed to {$newStatus}",
                'data' => [
                    'letter_format' => [
                        'id' => $letterFormat->id_letter,
                        'name_letter' => $letterFormat->name_letter,
                        'status' => $letterFormat->status,
                        'is_active' => $letterFormat->isActive(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download letter format file
     */
    public function download(int $id): JsonResponse
    {
        $letterFormat = LetterFormat::where('id_letter', $id)->first();

        if (!$letterFormat) {
            return response()->json([
                'success' => false,
                'message' => 'Letter format not found'
            ], 404);
        }

        if (!$letterFormat->content || !Storage::disk('public')->exists($letterFormat->content)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Download URL generated',
            'data' => [
                'download_url' => $letterFormat->content_url,
                'filename' => basename($letterFormat->content),
            ]
        ], 200);
    }
}