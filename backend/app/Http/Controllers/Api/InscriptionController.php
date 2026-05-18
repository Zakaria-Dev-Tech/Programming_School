<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class InscriptionController extends Controller
{

public function index()
{
    try {
        
        $inscriptions = Inscription::with(['user.parent', 'formation'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($ins) {
                $u = $ins->user;
                $f = $ins->formation;

                // On vérifie si c'est un enfant en regardant si un parent_id existe
                $typeApprenant = ($u && $u->parent_id) ? 'enfant' : 'adulte';

                return [
                    'id' => $ins->id,
                    'apprenant_nom' => $u ? $u->nom : 'Utilisateur supprimé',
                    'apprenant_type' => $typeApprenant,
                    
                    
                    'parent_nom' => ($u && $u->parent) ? $u->parent->nom : 'N/A',

                    
                   'apprenant_age' => $u->age,
                    'apprenant_nom_ecole' => $u->nom_ecole,
                    'apprenant_niveau' => $u->niveau_etude,
                    'apprenant_localite_ecole' => $u->localite,

                    'formation_titre' => $f ? $f->titre : 'Formation inexistante',
                    'date_inscription' => $ins->date_inscription ?? $ins->created_at,
                    'montant' => $ins->montant_paye ?? ($f ? $f->prix : 0),
                    'statut' => $ins->statut,
                    'statut_paiement' => $ins->statut_paiement ?? 'essai',
                    'mode_paiement' => $ins->mode_paiement
                    
                ];
            });

        return response()->json($inscriptions);

    } catch (\Exception $e) {
        
        return response()->json([
            'error' => 'Erreur Serveur 500',
            'message' => $e->getMessage(),
            'line' => $e->getLine()
        ], 500);
    }
}

    // Inscriptions de l'utilisateur connecté
    public function mesInscriptions()
    {
        $inscriptions = Inscription::with(['formation'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($inscriptions);
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'formation_id' => 'required|exists:formations,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier si déjà inscrit
        $existe = Inscription::where('user_id', auth()->id())
            ->where('formation_id', $request->formation_id)
            ->exists();

        if ($existe) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cette formation'], 409);
        }

        $formation = Formation::find($request->formation_id);
        
        $inscription = Inscription::create([
            'user_id' => auth()->id(),
            'formation_id' => $request->formation_id,
            'date_inscription' => now(),
           'statut' => 'confirmee',
            'statut_paiement' => 'essai',
            'montant_paye' => $formation->prix,
            
        ]);

        return response()->json([
            'message' => 'Inscription créée avec succès',
            'inscription' => $inscription->load('formation')
        ], 201);
    }

  
public function valider($id)
{
   
    $realId = str_replace(['adulte_', 'enfant_'], '', $id);

    if (str_starts_with($id, 'enfant_')) {
        $enfant = \App\Models\Enfant::findOrFail($realId);
        $enfant->update(['statut' => 'confirmee']); 
        return response()->json(['message' => 'Inscription enfant validée']);
    }

   
    $inscription = Inscription::findOrFail($realId);
    $inscription->update(['statut' => 'confirmee']);
    
    return response()->json(['message' => 'Inscription validée']);
}
    // Annuler une inscription (admin)
    public function annuler($id)
{  
    $realId = str_replace(['adulte_', 'enfant_'], '', $id);

    if (str_starts_with($id, 'enfant_')) {
        $enfant = \App\Models\Enfant::findOrFail($realId);
        $enfant->update(['statut' => 'annulee']);
        return response()->json(['message' => 'Inscription enfant annulée']);
    }

    $inscription = Inscription::findOrFail($realId);
    $inscription->update(['statut' => 'annulee']);
    
    return response()->json(['message' => 'Inscription annulée']);
}

    // Terminer une formation (apprenant)
    public function terminer($id)
    {
        $inscription = Inscription::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $inscription->update(['statut' => 'terminee']);
        
        return response()->json(['message' => 'Félicitations ! Formation terminée']);
    }

    // Supprimer une inscription (admin)
public function destroy($id)
{
    $realId = str_replace(['adulte_', 'enfant_'], '', $id);

    if (str_starts_with($id, 'enfant_')) {
        $enfant = \App\Models\Enfant::findOrFail($realId);
        $enfant->delete(); 
        return response()->json(['message' => 'Inscription enfant supprimée']);
    }

    $inscription = Inscription::findOrFail($realId);
    $inscription->delete();
    
    return response()->json(['message' => 'Inscription supprimée']);
}

public function getSuiviEnfant($enfantId)
{
 
    $enfant = User::where('id', $enfantId)
                  ->where('parent_id', auth()->id())
                  ->firstOrFail();

   
    $inscriptions = Inscription::with('formation')
        ->where('user_id', $enfant->id)
        ->get();

    return response()->json([
        'enfant' => $enfant,
        'inscriptions' => $inscriptions
    ]);
}

    // AJOUT COMPTABLE POUR GESTIONPAIEMENTS.JSX
    public function getAllTransactionsAdmin()
    {
        try {
            $transactions = DB::table('inscriptions')
                ->join('users', 'inscriptions.user_id', '=', 'users.id')
                ->join('formations', 'inscriptions.formation_id', '=', 'formations.id')
                ->select([
                    'inscriptions.id',
                    'users.nom as apprenant',
                    'formations.titre as formation',
                    'inscriptions.montant_paye as montant',
                    'inscriptions.mode_paiement as mode',
                    'inscriptions.updated_at as date',
                    'inscriptions.statut_paiement as statut',
                    'inscriptions.transaction_id as transactionId',
                    'users.telephone as telephone'
                ])
                ->orderBy('inscriptions.updated_at', 'desc')
                ->get()
                ->map(function($item) {
                    if ($item->statut === 'paye') {
                        $item->statut = 'valide';
                    }
                    
                    if (!$item->mode && $item->statut === 'essai') {
                        $item->mode = 'essai';
                    } elseif (!$item->mode) {
                        $item->mode = 'orange_money';
                    }

                    if (!$item->transactionId) {
                        $item->transactionId = 'N/A';
                    }

                    return $item;
        });

            return response()->json($transactions, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}