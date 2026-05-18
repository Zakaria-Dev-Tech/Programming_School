<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\Enfant; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
   public function getStats()
{
    try {
        // 1. Comptes de base sécurisés
        $totalAdultes = DB::table('inscriptions')
            ->join('users', 'inscriptions.user_id', '=', 'users.id')
            ->whereNotIn('users.role', ['parent', 'admin'])
            ->distinct('inscriptions.user_id')
            ->count();
            
        $totalEnfants = DB::table('users')->whereNotNull('parent_id')->count();
        $totalFormations = DB::table('formations')->count();
        
        $totalRevenus = DB::table('inscriptions')
            ->where('statut_paiement', 'paye')
            ->sum('montant_paye');

        // 2. Évolution mensuelle sécurisée (Compatible MySQL & SQLite)
        $toutesInscriptions = DB::table('inscriptions')
            ->where('updated_at', '>=', now()->subMonths(5))
            ->orderBy('updated_at', 'asc')
            ->get();

        $evolutionData = [];
        // On initialise les 5 derniers mois à 0 pour éviter le NaN dans le graphique
        for ($i = 4; $i >= 0; $i--) {
            $moisNom = now()->subMonths($i)->translatedFormat('M'); // ex: "mai"
            $evolutionData[$moisNom] = ['mois' => ucfirst($moisNom), 'revenus' => 0, 'inscriptions' => 0];
        }

        foreach ($toutesInscriptions as $ins) {
            $moisIns = \Carbon\Carbon::parse($ins->updated_at)->translatedFormat('M');
            if (isset($evolutionData[$moisIns])) {
                if ($ins->statut_paiement === 'paye') {
                    $evolutionData[$moisIns]['revenus'] += (int)$ins->montant_paye;
                }
                $evolutionData[$moisIns]['inscriptions']++;
            }
        }

        // 3. Répartition par formation sécurisée
        $formations = DB::table('formations')->get();
        $formationsDonnees = [];

        foreach ($formations as $f) {
            $adultesCount = DB::table('inscriptions')
                ->join('users', 'inscriptions.user_id', '=', 'users.id')
                ->where('inscriptions.formation_id', $f->id)
                ->whereNull('users.parent_id')
                ->count();

            $enfantsCount = DB::table('inscriptions')
                ->join('users', 'inscriptions.user_id', '=', 'users.id')
                ->where('inscriptions.formation_id', $f->id)
                ->whereNotNull('users.parent_id')
                ->count();

            $formationsDonnees[] = [
                'name' => $f->titre,
                'Adultes' => $adultesCount,
                'Enfants' => $enfantsCount
            ];
        }

        return response()->json([
            'totalApprenants' => $totalAdultes + $totalEnfants,
            'totalFormations' => $totalFormations,
            'totalRevenus' => (int)($totalRevenus ?? 0),
            'totalEnfants' => $totalEnfants, 
            'totalAdultes' => $totalAdultes,
            'donneesEvolution' => array_values($evolutionData),
            'donneesFormations' => $formationsDonnees
        ], 200);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage(), 'line' => $e->getLine()], 500);
    }
}

    public function getFormateurDashboard()
    {
        $formateurId = auth()->id();
        $formationIds = Formation::where('formateur_id', $formateurId)->pluck('id');

        if ($formationIds->isEmpty()) {
            return response()->json([
                'stats' => ['apprenants' => 0, 'formations' => 0, 'reussite' => '0%'],
                'apprenants' => []
            ]);
        }

        // 1. Nombre total d'inscriptions
        $totalInscriptions = DB::table('inscriptions')
            ->whereIn('formation_id', $formationIds)
            ->count();

        // 2. Nombre d'apprenants ayant terminé (ex: progression > 80%)
        $apprenantsTermines = DB::table('inscriptions')
            ->whereIn('formation_id', $formationIds)
            ->where('progression', '>=', 80) // Seuil de réussite
            ->count();

        // 3. Calcul du pourcentage de réussite
        $tauxReussite = $totalInscriptions > 0 
            ? round(($apprenantsTermines / $totalInscriptions) * 100) 
            : 0;

        // 4. Liste des apprenants (identique à avant)
        $suiviApprenants = DB::table('inscriptions')
            ->join('users', 'inscriptions.user_id', '=', 'users.id')
            ->join('formations', 'inscriptions.formation_id', '=', 'formations.id')
            ->whereIn('inscriptions.formation_id', $formationIds)
            ->select(
                'users.id',
                'users.nom as nom',
                'formations.titre as formation',
                'inscriptions.progression',
                'inscriptions.updated_at as derniereActivite'
            )
            ->orderBy('inscriptions.updated_at', 'desc')
            ->get();

        return response()->json([
            'stats' => [
                'apprenants' => DB::table('inscriptions')->whereIn('formation_id', $formationIds)->distinct('user_id')->count(),
                'formations' => $formationIds->count(),
                'reussite' => $tauxReussite . '%',
            ],
            'apprenants' => $suiviApprenants
        ]);
    }
}