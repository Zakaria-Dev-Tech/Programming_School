<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; // Ajouté

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string',
            'color' => 'nullable|string',
            'whatsapp_message' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Upload direct vers Cloudinary
            $result = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'pschool/services'
            ]);
            $data['image'] = $result->getSecurePath(); // URL HTTPS permanente
        }

        $service = Service::create($data);

        return response()->json([
            'message' => 'Service créé avec succès et stocké sur le Cloud',
            'service' => $service
        ], 201);
    }

   public function update(Request $request, $id)
{
    try {
        $service = Service::findOrFail($id); // Remplace Service par ton modèle

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['nom', 'description']);

        if ($request->hasFile('image')) {
            // Utilisation du helper global plus fiable
            $uploadedFileUrl = cloudinary()->upload($request->file('image')->getRealPath(), [
                'folder' => 'pschool/services'
            ])->getSecurePath();
            
            $data['image'] = $uploadedFileUrl;
        }

        $service->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Service mis à jour avec succès', 
            'service' => $service
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Erreur serveur : ' . $e->getMessage()
        ], 500);
    }
}

    public function destroy($id)
    {
        $service = Service::find($id);
        if ($service) {
            $service->delete();
            return response()->json(['message' => 'Service supprimé avec succès'], 200);
        }
        return response()->json(['message' => 'Service non trouvé'], 404);
    }
}