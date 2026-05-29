<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\InscriptionSessionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\EnfantController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PasswordResetController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/login-badge', [AuthController::class, 'loginBadge']);
Route::post('/contact', [ContactController::class, 'store']);

   Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// routes/api.php
Route::get('/formations/{id}/contenu', [CoursController::class, 'getContenuFormation'])
     ->middleware('auth:sanctum');
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{id}', [FormationController::class, 'show']);
Route::get('/formateurs', [AuthController::class, 'getFormateurs']);
Route::post('/formations/{formationId}/inscription-session', [InscriptionSessionController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
   
    Route::apiResource('users', UserController::class);
     Route::get('/enfants', [EnfantController::class, 'index']);
    Route::post('/enfants', [EnfantController::class, 'store']);
    Route::delete('/enfants/{id}', [EnfantController::class, 'destroy']);
    Route::get('/parent/suivi-enfant/{enfantId}', [InscriptionController::class, 'getSuiviEnfant']);
    
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put('/formations/{id}', [FormationController::class, 'update']); 
    Route::delete('/formations/{id}', [FormationController::class, 'destroy']);
    Route::get('/formateur/formations', [FormationController::class, 'getFormateurFormations']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);  
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/formateur/stats-dashboard', [DashboardController::class, 'getFormateurDashboard']);
    Route::get('/inscriptions', [InscriptionController::class, 'index']);
    Route::get('/mes-inscriptions', [InscriptionController::class, 'mesInscriptions']);
    Route::post('/inscriptions', [InscriptionController::class, 'store']);
    Route::put('/inscriptions/{id}/valider', [InscriptionController::class, 'valider']);
    Route::put('/inscriptions/{id}/annuler', [InscriptionController::class, 'annuler']);
    Route::put('/inscriptions/{id}/terminer', [InscriptionController::class, 'terminer']);
    Route::delete('/inscriptions/{id}', [InscriptionController::class, 'destroy']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/formations/{formationId}/cours', [CoursController::class, 'getByFormation']);
    Route::post('/cours', [CoursController::class, 'store']);
    Route::delete('/cours/{id}', [CoursController::class, 'destroy']);
    Route::put('/cours/{id}', [CoursController::class, 'update']);
    Route::get('/apprenant/formation/{id}/contenu', [CoursController::class, 'getContenuPourApprenant']);
    Route::post('/cours/{id}/terminer', [CoursController::class, 'terminerCours']);
    // Routes Quiz
    Route::post('/formations/cours/{coursId}/quiz', [QuizController::class, 'store']); 
    Route::get('/formations/cours/{coursId}/quiz', [QuizController::class, 'show']);   
    Route::post('/quizzes/{quizId}/verifier', [QuizController::class, 'verifier']);   
    Route::post('/formateur/notifications/envoyer', [NotificationController::class, 'envoyerNotification']);
    Route::get('/apprenant/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/lire', [NotificationController::class, 'marquerCommeLu']);
    Route::post('/payment/simulate', [App\Http\Controllers\Api\PaymentSimulationController::class, 'simulate']);
    Route::get('/parent/enfants/inscriptions', [EnfantController::class, 'getInscriptionsEnfants']);
    Route::post('/payment/simulate-parent', [EnfantController::class, 'simulateParentPayment']);
    Route::get('/admin/transactions', [InscriptionController::class, 'getAllTransactionsAdmin']);

    Route::get('/admin/messages', [ContactController::class, 'index']);
    Route::put('/admin/messages/{id}/toggle-lu', [ContactController::class, 'toggleLu']);

     Route::get('/inscriptions-session', [InscriptionSessionController::class, 'index']);
    Route::get('/inscriptions-session/{id}', [InscriptionSessionController::class, 'show']);
    Route::put('/inscriptions-session/{id}/statut', [InscriptionSessionController::class, 'updateStatut']);
    Route::delete('/inscriptions-session/{id}', [InscriptionSessionController::class, 'destroy']);
    Route::get('/inscriptions-session/export/csv', [InscriptionSessionController::class, 'export']);

 
});