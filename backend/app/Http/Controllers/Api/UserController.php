<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::orderBy('id', 'desc')->get();
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
public function store(Request $request)
{
    try {
        
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès interdit. Seul l\'administrateur peut créer des utilisateurs manuellement.'], 403);
        }

        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',        
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'role' => 'required|in:user,admin ,formateur,parent,apprenant', 
            'type' => 'required|in:apprenant,parent,formateur',
            'statut' => 'required|in:actif,inactif',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

       
        $user = User::create([
            'nom' => $request->name,                  
            'email' => $request->email,
            'telephone' => $request->telephone,
            'role' => $request->role,  
            'type' => $request->type,  
            'statut' => $request->statut,
            'password' => Hash::make($request->password),
           
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès par l\'administrateur',
            'user' => $user
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function show($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
            
            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
public function update(Request $request, $id)
{
    $user = User::find($id);
    
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }
    
    // 1. Mise à jour des informations de base
    $user->nom = $request->name ?? $request->nom ?? $user->nom;
    $user->email = $request->email ?? $user->email;
    $user->telephone = $request->telephone ?? $user->telephone;
    $user->statut = $request->statut ?? $user->statut;

    // 2. CORRECTION CRUCIALE : Attribution des bonnes clés aux bonnes colonnes
    // Le 'type' reçoit le métier (apprenant, parent, formateur)
    if ($request->has('type')) {
        $user->type = $request->type;
    }
    
    // Le 'role' reçoit les privilèges d'accès (admin, user)
    if ($request->has('role')) {
        $user->role = $request->role;
    }
    
    // 3. Gestion du mot de passe s'il est fourni
    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }
    
    $user->save();
    
    return response()->json([
        'message' => 'Utilisateur modifié avec succès',
        'user' => $user
    ], 200);
}
    public function destroy($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
            
           
            if ($user->id === auth()->id()) {
                return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 403);
            }
            
            $user->delete();
            
            return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getFormateurs()
    {
        try {
            $formateurs = User::where('role', 'formateur')
                ->orWhere('role', 'admin')
                ->orderBy('nom')
                ->get(['id', 'nom as name']); 
            
            return response()->json($formateurs, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}