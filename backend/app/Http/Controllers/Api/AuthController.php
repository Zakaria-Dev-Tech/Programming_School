<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Inscription

    public function register(Request $request)
    {
     $validator = Validator::make($request->all(), [
        'type' => 'required|in:apprenant,parent', 
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed|min:8',
        'telephone' => 'required',
        'nom' => 'required|string',
        'formations_interet' => 'required_if:type,apprenant|array',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }
        return DB::transaction(function () use ($request) {
            
            
            $user = User::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'password' => Hash::make($request->password),
                'type' => $request->type,
                'role' => 'user',
                
                'formations_interet' => $request->type === 'apprenant' ? $request->formations_interet : null,
            ]);

         

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès !',
                'token' => $token,
                'user' => $user
            ], 201);
        });
    }

public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|string', 
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // CORRECTION : Permettre la connexion par email OU par username
    $field = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
    
    $user = User::where($field, $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    }
    
    // Vérifier le statut du compte
    if ($user->statut === 'inactif') {
        return response()->json([
            'message' => 'Votre compte est désactivé. Veuillez contacter l\'administrateur.'
        ], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

   
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $code = rand(100000, 999999);

      
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Str::random(60),
                'code' => $code,
                'created_at' => now()
            ]
        );

      
        \Log::info("Code de récupération pour {$request->email} : {$code}");

        return response()->json([
            'success' => true,
            'message' => 'Code envoyé avec succès.'
        ]);
    }

    //  Vérifier le code et changer le mot de passe
    public function resetPasswordWithCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record || Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré.'
            ], 422);
        }

    
        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);

       
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès.'
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.'
            ], 200);
        }

        return response()->json([
            'message' => 'Une erreur est survenue. Veuillez réessayer.'
        ], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Mot de passe réinitialisé avec succès.'
            ], 200);
        }

        return response()->json([
            'message' => 'lien expiré , veuillez réinitialiser'
        ], 400);
    }
    public function getFormateurs()
{
    $formateurs = User::where('role', 'formateur')
        ->orWhere('type', 'formateur')
        ->select('id', 'nom', 'email', 'telephone')
        ->get();

    return response()->json($formateurs);
}
public function loginBadge(Request $request) {
   
    $enfant = Enfant::where('access_token', $request->token)->first();

    if (!$enfant) {
        return response()->json(['message' => 'Badge invalide ou expiré'], 401);
    }

 
    $token = $enfant->createToken('session_eleve')->plainTextToken;

    return response()->json([
        'user' => $enfant,
        'access_token' => $token,
    ]);
}
}