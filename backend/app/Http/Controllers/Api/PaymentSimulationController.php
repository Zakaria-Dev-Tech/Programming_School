<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentSimulationController extends Controller
{
    public function simulate(Request $request)
    {
        try {
            $userId = auth()->id();
            $formationId = $request->input('formation_id');

            if (!$formationId) {
                return response()->json(['message' => 'ID de formation manquant'], 400);
            }

            // 1. Trouver l'inscription en base de données
            $inscription = DB::table('inscriptions')
                ->where('user_id', $userId)
                ->where('formation_id', $formationId)
                ->first();

            if (!$inscription) {
                return response()->json(['message' => 'Inscription introuvable'], 404);
            }

            // 2. Simuler l'action automatique du Webhook CinetPay
            DB::table('inscriptions')
                ->where('user_id', $userId)
                ->where('formation_id', $formationId)
                ->update([
                    'statut_paiement' => 'paye',
                    'transaction_id' => 'SIM-CINET-' . strtoupper(Str::random(10))
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Paiement simulé avec succès !',
                'statut_paiement' => 'paye'
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}