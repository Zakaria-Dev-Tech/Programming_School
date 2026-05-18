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
    $query = Formation::query();


    if ($request->get('mode') === 'vitrine') {
        $query->where('statut', 'actif');
    }

    // Filtre optionnel par public cible
    if ($request->has('cible')) {
        $query->where('public_cible', $request->cible);
    }

    // Retourne les formations triées (les plus récentes en premier)
    return response()->json($query->orderBy('id', 'desc')->get());
}
    //Crée une nouvelle formation
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
            $path = $request->file('image')->store('formations', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $formation = Formation::create($data);

        return response()->json([
            'message' => 'Formation créée avec succès',
            'formation' => $formation
        ], 201);
    }

    //Met à jour une formation (incluant le changement de statut)
     
    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'duree' => 'required|string',
            'nb_modules' => 'required|integer|min:0',
            'categorie' => 'required|string',
            'public_cible' => 'required|string',
            'statut' => 'required|in:actif,inactif', 
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image'); 

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image physiquement
            if ($formation->image) {
                $oldPath = str_replace(asset('storage/'), '', $formation->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            // Stocker la nouvelle
            $path = $request->file('image')->store('formations', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $formation->update($data);

        return response()->json([
            'message' => 'Mise à jour réussie', 
            'formation' => $formation
        ], 200);
    }

    //Supprime une formation
     
    public function destroy($id)
    {
        $formation = Formation::find($id);
        if ($formation) {
            if ($formation->image) {
                $oldPath = str_replace(asset('storage/'), '', $formation->image);
                Storage::disk('public')->delete($oldPath);
            }
            $formation->delete();
            return response()->json(['message' => 'Supprimée'], 200);
        }
        return response()->json(['message' => 'Non trouvée'], 404);
    }

    //Affiche les détails d'une formation spécifique
     
    public function show($id)
    {
        $formation = Formation::find($id);

        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }

        // Sécurité supplémentaire : si un visiteur lambda essaie d'accéder à une formation masquée via l'URL directement
        if ($formation->statut === 'inactif' && !auth()->check()) {
            return response()->json(['message' => 'Cette formation n\'est pas accessible au public.'], 403);
        }

        return response()->json($formation, 200);
    }

    
     //Liste des formations d'un formateur spécifique
     
    public function getFormateurFormations()
    {
        $formations = Formation::where('formateur_id', auth()->id())->get();
        return response()->json($formations, 200);
    }

  
    public function cours()
    {
        return $this->hasMany(Cours::class)->orderBy('ordre', 'asc');
    }
}