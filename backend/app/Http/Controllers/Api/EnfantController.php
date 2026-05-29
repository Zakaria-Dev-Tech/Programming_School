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
use Laravel\Sanctum\PersonalAccessToken;

class EnfantController extends Controller
{
    public function index()
    {
        return response()->json(User::where('parent_id', auth()->id())->get());
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            
            // Validation des données
            $validator = Validator::make($request->all(), [
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'age' => 'required|integer|min:3|max:18',
                'niveau_etude' => 'required|string',
                'nom_ecole' => 'nullable|string',
                'localite_ecole' => 'nullable|string',
                'formations_interet' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            // Générer un username unique
            $baseUsername = strtolower($request->prenom . '.' . $request->nom);
            $username = $baseUsername;
            $counter = 1;
            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter;
                $counter++;
            }
            
            $plainPassword = 'pschool2026';
            
            // Création du compte dans 'users'
            $userEnfant = User::create([
                'nom' => $request->prenom . ' ' . $request->nom,
                'username' => $username,
                'email' => $username . '@pschool.ci',
                'password' => Hash::make($plainPassword),
                'type' => 'apprenant',
                'role' => 'user',
                'parent_id' => auth()->id(), 
                'age' => $request->age,
                'nom_ecole' => $request->nom_ecole,
                'niveau_etude' => $request->niveau_etude,
                'localite' => $request->localite_ecole,
                'statut' => 'actif'
            ]);

            // Générer un token d'accès pour l'enfant
            $token = $userEnfant->createToken('enfant-token')->plainTextToken;

            // Inscription automatique aux formations d'intérêt
            if ($request->has('formations_interet') && !empty($request->formations_interet)) {
                $formations = Formation::whereIn('titre', $request->formations_interet)->get();

                foreach ($formations as $formation) { 
                    DB::table('inscriptions')->insert([
                        'user_id' => $userEnfant->id,
                        'formation_id' => $formation->id,
                        'montant_paye' => $formation->prix,
                        'date_inscription' => now(),
                        'statut' => 'confirmee', 
                        'statut_paiement' => 'essai', 
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Enfant inscrit avec succès',
                'data' => $userEnfant,
                'credentials' => [
                    'username' => $username,
                    'password' => $plainPassword,
                     'access_token' => $token ,
                ]
            ], 201);
        });
    }

    // Supprimer un enfant
    public function destroy($id)
    {
        try {
            $enfant = User::where('id', $id)
                ->where('parent_id', auth()->id())
                ->firstOrFail();
            
            // Supprimer d'abord les inscriptions de l'enfant
            DB::table('inscriptions')->where('user_id', $enfant->id)->delete();
            
            // Puis supprimer l'enfant
            $enfant->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Enfant supprimé avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }

    // Récupérer le statut financier de tous les enfants de ce parent
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

    // Simuler l'action du guichet CinetPay pour le parent
    public function simulateParentPayment(Request $request)
    {
        $request->validate([
            'inscription_id' => 'required|integer'
        ]);

        try {
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