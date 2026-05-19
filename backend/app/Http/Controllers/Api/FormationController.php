<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; // Ajouté

class FormationController extends Controller
{
    public function index(Request $request)
    {
        $query = Formation::query();
        if ($request->get('mode') === 'vitrine') {
            $query->where('statut', 'actif');
        }
        if ($request->has('cible')) {
            $query->where('public_cible', $request->cible);
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
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

        $data = $request->all();

        if ($request->hasFile('image')) {
            $result = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'pschool/formations'
            ]);
            $data['image'] = $result->getSecurePath();
        }

        $formation = Formation::create($data);

        return response()->json([
            'message' => 'Formation créée avec succès sur le Cloud',
            'formation' => $formation
        ], 201);
    }
public function update(Request $request, $id)
{
    try {
        $formation = Formation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required',
            'duree' => 'required|string',
            'nb_modules' => 'required',
            'categorie' => 'required|string',
            'public_cible' => 'required|string',
            'statut' => 'required|in:actif,inactif', 
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'titre', 'description', 'prix', 'duree', 
            'nb_modules', 'categorie', 'public_cible', 'statut'
        ]);

        if ($request->hasFile('image')) {
            // CORRECTION ICI : Utilisation du helper direct au lieu de la méthode sur l'objet File
            $uploadedFileUrl = cloudinary()->upload($request->file('image')->getRealPath(), [
                'folder' => 'pschool/formations'
            ])->getSecurePath();
            
            $data['image'] = $uploadedFileUrl;
        }

        $formation->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Mise à jour réussie sur le Cloud', 
            'formation' => $formation
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
        $formation = Formation::find($id);
        if ($formation) {
            $formation->delete();
            return response()->json(['message' => 'Supprimée'], 200);
        }
        return response()->json(['message' => 'Non trouvée'], 404);
    }

    public function show($id)
    {
        $formation = Formation::find($id);
        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }
        if ($formation->statut === 'inactif' && !auth()->check()) {
            return response()->json(['message' => 'Cette formation n\'est pas accessible au public.'], 403);
        }
        return response()->json($formation, 200);
    }

    public function getFormateurFormations()
    {
        $formations = Formation::where('formateur_id', auth()->id())->get();
        return response()->json($formations, 200);
    }
}