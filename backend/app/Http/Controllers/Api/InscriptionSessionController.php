<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\InscriptionSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InscriptionSessionController extends Controller
{
    // Soumettre une inscription (public)
    public function store(Request $request, $formationId)
    {
        try {
            // Vérifier que la formation existe
            $formation = Formation::find($formationId);
            
            if (!$formation) {
                return response()->json([
                    'message' => 'Formation non trouvée'
                ], 404);
            }
            
            // Validation des données selon le type
            $rules = [
                'type_inscription' => 'required|in:enfant,adulte',
                'parent_nom' => 'required|string|max:255',
                'parent_prenom' => 'required|string|max:255',
                'parent_adresse' => 'required|string|max:500',
                'parent_telephone' => 'required|string|max:20',
                'parent_zone' => 'required|string|max:255',
                'session_choisie' => 'required|string|max:255',
                'source' => 'nullable|string|max:255',
            ];
            
            // Règles spécifiques pour enfant
            if ($request->type_inscription === 'enfant') {
                $rules['eleve_nom'] = 'required|string|max:255';
                $rules['eleve_prenom'] = 'required|string|max:255';
                $rules['eleve_age'] = 'required|integer|min:3|max:18';
                $rules['eleve_niveau_etude'] = 'required|string|max:255';
                $rules['eleve_etablissement'] = 'required|string|max:255';
            }
            
            // Règles spécifiques pour adulte
            if ($request->type_inscription === 'adulte') {
                $rules['apprenant_email'] = 'required|email|max:255';
                $rules['format'] = 'required|in:presentiel,en_ligne';
            }
            
            $validator = Validator::make($request->all(), $rules);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Préparer les données de base
            $data = [
                'type_inscription' => $request->type_inscription,
                'formation_id' => $formationId,
                'user_id' => auth()->id(),
                'parent_nom' => $request->parent_nom,
                'parent_prenom' => $request->parent_prenom,
                'parent_adresse' => $request->parent_adresse,
                'parent_telephone' => $request->parent_telephone,
                'parent_zone' => $request->parent_zone,
                'session_choisie' => $request->session_choisie,
                'source' => $request->source,
                'statut' => 'en_attente'
            ];
            
            // Ajouter les champs spécifiques selon le type
            if ($request->type_inscription === 'enfant') {
                $data['eleve_nom'] = $request->eleve_nom;
                $data['eleve_prenom'] = $request->eleve_prenom;
                $data['eleve_age'] = $request->eleve_age;
                $data['eleve_niveau_etude'] = $request->eleve_niveau_etude;
                $data['eleve_etablissement'] = $request->eleve_etablissement;
                // Valeurs null pour les champs adulte
                $data['apprenant_email'] = null;
                $data['format'] = null;
            } else {
                $data['apprenant_email'] = $request->apprenant_email;
                $data['format'] = $request->format;
                // Valeurs null pour les champs enfant
                $data['eleve_nom'] = null;
                $data['eleve_prenom'] = null;
                $data['eleve_age'] = null;
                $data['eleve_niveau_etude'] = null;
                $data['eleve_etablissement'] = null;
            }
            
            // Créer l'inscription
            $inscription = InscriptionSession::create($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Votre inscription a été enregistrée avec succès. Nous vous contacterons sous 48h.',
                'data' => $inscription
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erreur inscription session: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // Récupérer toutes les inscriptions (Admin seulement)
    public function index(Request $request)
    {
        try {
            $query = InscriptionSession::with(['formation', 'user']);
            
            // Filtre par statut
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }
            
            // Filtre par type d'inscription
            if ($request->has('type_inscription')) {
                $query->where('type_inscription', $request->type_inscription);
            }
            
            // Filtre par formation
            if ($request->has('formation_id')) {
                $query->where('formation_id', $request->formation_id);
            }
            
            // Filtre par session choisie
            if ($request->has('session_choisie')) {
                $query->where('session_choisie', $request->session_choisie);
            }
            
            $inscriptions = $query->orderBy('created_at', 'desc')->get();
            
            // Statistiques
            $stats = [
                'total' => InscriptionSession::count(),
                'en_attente' => InscriptionSession::where('statut', 'en_attente')->count(),
                'confirmees' => InscriptionSession::where('statut', 'confirmee')->count(),
                'annulees' => InscriptionSession::where('statut', 'annulee')->count(),
                'enfants' => InscriptionSession::where('type_inscription', 'enfant')->count(),
                'adultes' => InscriptionSession::where('type_inscription', 'adulte')->count(),
            ];
            
            return response()->json([
                'success' => true,
                'data' => $inscriptions,
                'stats' => $stats
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Récupérer une inscription spécifique
    public function show($id)
    {
        try {
            $inscription = InscriptionSession::with(['formation', 'user'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $inscription
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Inscription non trouvée'
            ], 404);
        }
    }
    
    // Mettre à jour le statut (Admin)
    public function updateStatut(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'statut' => 'required|in:en_attente,confirmee,annulee'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $inscription = InscriptionSession::findOrFail($id);
            $inscription->update([
                'statut' => $request->statut
            ]);
            
            $message = match($request->statut) {
                'confirmee' => 'Inscription confirmée avec succès',
                'annulee' => 'Inscription annulée',
                default => 'Statut mis à jour'
            };
            
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $inscription
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }
    
    // Supprimer une inscription (Admin)
    public function destroy($id)
    {
        try {
            $inscription = InscriptionSession::findOrFail($id);
            $inscription->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Inscription supprimée avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }
    
    // Exporter les inscriptions en CSV (Admin)
public function export()
{
    try {
        $inscriptions = InscriptionSession::with('formation')->get();
        
        $filename = 'inscriptions_session_' . date('Y-m-d') . '.csv';
        
        // Ouvrir un fichier temporaire
        $handle = fopen('php://temp', 'w+');
        
        // En-têtes CSV (UTF-8 avec BOM pour Excel)
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
        fputcsv($handle, [
            'ID', 'Type', 'Formation', 'Parent/Prenom', 'Parent/Nom', 'Téléphone', 'Zone',
            'Email', 'Élève/Nom', 'Élève/Prénom', 'Âge', 'Niveau', 'Établissement',
            'Session', 'Format', 'Source', 'Statut', 'Date'
        ]);
        
        foreach ($inscriptions as $i) {
            fputcsv($handle, [
                $i->id,
                $i->type_inscription === 'enfant' ? 'Enfant' : 'Adulte',
                $i->formation->titre ?? 'N/A',
                $i->parent_prenom,
                $i->parent_nom,
                $i->parent_telephone,
                $i->parent_zone,
                $i->apprenant_email ?? 'N/A',
                $i->eleve_nom ?? 'N/A',
                $i->eleve_prenom ?? 'N/A',
                $i->eleve_age ?? 'N/A',
                $i->eleve_niveau_etude ?? 'N/A',
                $i->eleve_etablissement ?? 'N/A',
                $i->session_choisie,
                $i->format === 'presentiel' ? 'Présentiel' : ($i->format === 'en_ligne' ? 'En ligne' : 'N/A'),
                $i->source ?? 'Non précisé',
                $i->statut === 'en_attente' ? 'En attente' : ($i->statut === 'confirmee' ? 'Confirmée' : 'Annulée'),
                $i->created_at->format('d/m/Y H:i')
            ]);
        }
        
        // Lire le contenu
        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);
        
        // Retourner la réponse
        return response($csvContent)
            ->withHeaders([
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]);
            
    } catch (\Exception $e) {
        \Log::error('Erreur export CSV: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'export: ' . $e->getMessage()
        ], 500);
    }
}
}