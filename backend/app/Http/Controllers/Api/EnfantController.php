<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EnfantController extends Controller
{
    public function index()
    {
        return response()->json(User::where('parent_id', auth()->id())->get());
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            
            // 1. Création du compte dans 'users'
            $username = strtolower($request->prenom) . rand(100, 999);
            $userEnfant = User::create([
                'nom' => $request->prenom . ' ' . $request->nom,
                'username' => $username,
                'email' => $username . '@pschool.ci',
                'password' => Hash::make('pschool2026'),
                'type' => 'apprenant',
                'role' => 'user',
                'parent_id' => auth()->id(), 
                'age' => $request->age,
                'nom_ecole' => $request->nom_ecole,
                'niveau_etude' => $request->niveau_etude,
                'localite' => $request->localite_ecole, 
            ]);

            // 2. Inscription automatique aux formations d'intérêt
            if ($request->has('formations_interet')) {
                $formations = \App\Models\Formation::whereIn('titre', $request->formations_interet)->get();

                foreach ($formations as $formation) { 
                    DB::table('inscriptions')->insert([
                        'user_id' => $userEnfant->id,
                        'formation_id' => $formation->id,
                        'montant' => $formation->prix, // Changé selon la colonne de ta migration
                        'date_inscription' => now(),
                        
                        // FLUX CORRIGÉ : Accès direct pour commencer l'apprentissage
                        'statut' => 'confirmee', 
                        'statut_paiement' => 'essai', 
                        
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'credentials' => [
                    'username' => $username,
                    'password' => 'pschool2026'
                ]
            ], 201);
        });
    }

    // NOUVEAU : Récupérer le statut financier de tous les enfants de ce parent
    public function getInscriptionsEnfants()
    {
        try {
            $parentId = auth()->id();

            $frais = DB::table('inscriptions')
                ->join('users', 'inscriptions.user_id', '=', 'users.id')
                ->join('formations', 'inscriptions.formation_id', '=', 'formations.id')
                ->where('users.parent_id', $parentId)
                ->select(
                    'inscriptions.id',
                    'inscriptions.statut_paiement',
                   'inscriptions.montant_paye as montant',
                    'users.nom as enfant_nom',
                    'formations.titre as formation_titre'
                )
                ->orderBy('inscriptions.id', 'desc')
                ->get();

            return response()->json($frais, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // NOUVEAU : Simuler l'action du guichet CinetPay pour le parent
    public function simulateParentPayment(Request $request)
    {
        $request->validate([
            'inscription_id' => 'required|integer'
        ]);

        try {
            // Optionnel : tu peux vérifier ici que l'inscription appartient bien à un enfant de ce parent
            DB::table('inscriptions')
                ->where('id', $request->inscription_id)
                ->update([
                    'statut_paiement' => 'paye',
                    'transaction_id' => 'SIM-PARENT-' . strtoupper(Str::random(10)),
                    'updated_at' => now()
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Le paiement parent a été validé avec succès.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}