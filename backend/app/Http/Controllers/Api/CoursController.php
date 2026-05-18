<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Auth;

class CoursController extends Controller
{
    
     
    public function getByFormation($formationId)
    {
        $formation = Formation::findOrFail($formationId);
        
    
        return response()->json($formation->cours, 200);
    }

    public function store(Request $request)
    {
     
        $validator = Validator::make($request->all(), [
            'formation_id' => 'required|exists:formations,id',
            'titre'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'ordre'        => 'integer',
           
            'fichier'      => 'required|file|mimes:mp4,mov,avi,pdf,doc,docx|max:102400',
            'statut' => 'nullable|string|in:actif,inactif',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        
        $formation = Formation::findOrFail($request->formation_id);
        if ($formation->formateur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->except('fichier');

      
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $extension = $file->getClientOriginalExtension();
            
         
            $vibe = in_array($extension, ['mp4', 'mov', 'avi']) ? 'videos' : 'documents';
            $path = $file->store("cours/{$vibe}", 'public');
            
      
            $data['contenu_url'] = asset('storage/' . $path);
        }

       
        $cours = Cours::create($data);

        return response()->json([
            'message' => 'Chapitre ajouté avec succès',
            'cours' => $cours
        ], 201);
    }

  //Supprimer un cours
    public function destroy($id)
{
    $cours = Cours::findOrFail($id);

 
    $filePath = str_replace(asset('storage/'), '', $cours->contenu_url);
    if (Storage::disk('public')->exists($filePath)) {
        Storage::disk('public')->delete($filePath);
    }

  
    $cours->delete();

    return response()->json(['message' => 'Chapitre supprimé avec succès']);
}
public function update(Request $request, $id)
{
    $cours = Cours::findOrFail($id);
    
    
    $request->validate([
        'titre'       => 'required|string|max:255', 
        'fichier'     => 'nullable|file|mimes:mp4,pdf,doc,docx|max:102400',
        'description' => 'nullable|string',
        'ordre'       => 'nullable|integer',
        'statut'      => 'nullable|string|in:actif,inactif',
    ]);

    
    $data = $request->only(['titre', 'description', 'ordre', 'statut']); 

    if ($request->hasFile('fichier')) {
        $oldPath = str_replace(asset('storage/'), '', $cours->contenu_url);
        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $file = $request->file('fichier');
        $extension = $file->getClientOriginalExtension();
        $folder = ($extension === 'mp4') ? 'videos' : 'documents';
        $path = $file->store("cours/{$folder}", 'public');
        $data['contenu_url'] = asset('storage/' . $path);
    }

  
    $cours->update($data);

    return response()->json([
        'success' => true,
        'message' => 'Chapitre mis à jour avec succès',
        'cours'   => $cours
    ]);
}
public function getContenuPourApprenant($formationId)
{
    try {
        $userId = auth()->id();

        // 1. Récupérer l'inscription avec les nouveaux champs de notre migration
        $inscription = DB::table('inscriptions')
            ->where('user_id', $userId)
            ->where('formation_id', $formationId)
            ->first();

        if (!$inscription) {
            return response()->json(['message' => 'Inscription non trouvée'], 403);
        }
        
        $dernierCoursFini = DB::table('cours_completions')
            ->where('user_id', $userId)
            ->where('formation_id', $formationId)
            ->orderBy('created_at', 'desc')
            ->first();
     
        $cours = DB::table('cours')
            ->where('formation_id', $formationId)
            ->where('statut', 'actif')
            ->orderBy('ordre', 'asc')
            ->get();

        // 2. Retourner les données complètes à React
        return response()->json([
            'cours' => $cours,
            'progression' => $inscription->progression ?? 0,
            'formation_nom' => DB::table('formations')->where('id', $formationId)->value('titre'),
            'dernier_cours_id' => $dernierCoursFini ? $dernierCoursFini->cours_id : null,
            
            // AJOUTS POUR LE PAYWALL REQUIS PAR LE COMPOSANT REACT :
            'statut_paiement' => $inscription->statut_paiement ?? 'essai', // Valeur par défaut si nul
            'formation_prix' => $inscription->montant ?? 150000          // Prix enregistré lors de l'inscription
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Erreur SQL: ' . $e->getMessage()], 500);
    }
}
public function terminerCours($coursId)
{
    try {
        $userId = auth()->id();
        
        $cours = DB::table('cours')->where('id', $coursId)->first();
        if (!$cours) return response()->json(['error' => 'Cours non trouvé'], 404);

        DB::table('cours_completions')->updateOrInsert(
            ['user_id' => $userId, 'cours_id' => $coursId],
            [
                'formation_id' => $cours->formation_id,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

   
        $totalCours = DB::table('cours')
            ->where('formation_id', $cours->formation_id)
            ->where('statut', 'actif')
            ->count();

     
        $coursFinis = DB::table('cours_completions')
            ->join('cours', 'cours_completions.cours_id', '=', 'cours.id')
            ->where('cours_completions.user_id', $userId)
            ->where('cours.formation_id', $cours->formation_id)
            ->where('cours.statut', 'actif') 
            ->count();

        
        $pourcentage = ($totalCours > 0) ? round(($coursFinis / $totalCours) * 100) : 0;
        if ($pourcentage > 100) $pourcentage = 100; 

        DB::table('inscriptions')
            ->where('user_id', $userId)
            ->where('formation_id', $cours->formation_id)
            ->update(['progression' => $pourcentage]);

        return response()->json([
            'success' => true,
            'progression' => $pourcentage,
            'message' => 'Cours validé avec succès !'
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}