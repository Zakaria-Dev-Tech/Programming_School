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
        $service = Service::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // On ne s'occupe plus de supprimer l'ancienne image locale car on passe au Cloud
            $result = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'pschool/services'
            ]);
            $data['image'] = $result->getSecurePath();
        }

        $service->update($data);

        return response()->json([
            'message' => 'Service mis à jour avec succès sur le Cloud', 
            'service' => $service
        ]);
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