<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Formation::query();
            if ($request->get('mode') === 'vitrine') {
                $query->where('statut', 'actif');
            }
            if ($request->has('cible')) {
                $query->where('public_cible', $request->cible);
            }
            return response()->json($query->orderBy('id', 'desc')->get());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric',
                'duree' => 'required|string',
                'nb_modules' => 'required|integer|min:0',
                'categorie' => 'required|string',
                'public_cible' => 'required|string',
                'formateur_id' => 'nullable|integer',
                'statut' => 'required|in:actif,inactif', 
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method']);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('formations', $filename, 'public');
                $data['image'] = asset('storage/' . $path);
            }

            $formation = Formation::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Formation créée avec succès',
                'formation' => $formation
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $formation = Formation::find($id);
            
            if (!$formation) {
                return response()->json(['message' => 'Formation non trouvée'], 404);
            }

            $validator = Validator::make($request->all(), [
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'prix' => 'sometimes|required|numeric',
                'duree' => 'sometimes|required|string',
                'nb_modules' => 'sometimes|required|integer|min:0',
                'categorie' => 'sometimes|required|string',
                'public_cible' => 'sometimes|required|string',
                'statut' => 'sometimes|required|in:actif,inactif', 
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->except(['_method', 'image']);

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image
                if ($formation->image) {
                    $oldPath = str_replace(asset('storage/'), '', $formation->image);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('formations', $filename, 'public');
                $data['image'] = asset('storage/' . $path);
            }

            $formation->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Mise à jour réussie', 
                'formation' => $formation
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $formation = Formation::find($id);
            if ($formation) {
                if ($formation->image) {
                    $oldPath = str_replace(asset('storage/'), '', $formation->image);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $formation->delete();
                return response()->json(['message' => 'Supprimée avec succès'], 200);
            }
            return response()->json(['message' => 'Non trouvée'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $formation = Formation::find($id);
        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }
        return response()->json($formation, 200);
    }

    public function getFormateurFormations()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'Non authentifié'], 401);
            }
            $formations = Formation::where('formateur_id', $user->id)->get();
            return response()->json($formations, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}