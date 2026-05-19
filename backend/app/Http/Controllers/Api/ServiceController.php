<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'statut' => 'required|in:actif,inactif',
                'color' => 'nullable|string',
                'whatsapp_message' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except('image');

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('services', 'public');
                $data['image'] = asset('storage/' . $path);
            }

            $service = Service::create($data);

            return response()->json([
                'message' => 'Service créé avec succès',
                'service' => $service
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur store service: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'statut' => 'sometimes|required|in:actif,inactif',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method', 'image']);

            if ($request->hasFile('image')) {
                if ($service->image) {
                    $oldPath = str_replace(asset('storage/'), '', $service->image);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                $path = $request->file('image')->store('services', 'public');
                $data['image'] = asset('storage/' . $path);
            }

            $service->update($data);

            return response()->json([
                'message' => 'Service mis à jour avec succès', 
                'service' => $service
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur update service: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $service = Service::find($id);
            
            if ($service) {
                if ($service->image) {
                    $oldPath = str_replace(asset('storage/'), '', $service->image);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                $service->delete();
                return response()->json(['message' => 'Service supprimé avec succès'], 200);
            }

            return response()->json(['message' => 'Service non trouvé'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['message' => 'Service non trouvé'], 404);
            }
            return response()->json($service, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}