<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'required|string|max:20',
            'sujet' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Contact::create($request->all());

        return response()->json([
            'message' => 'Votre message a bien été enregistré.'
        ], 201);
    }

    
    public function index()
    {
        try {
            // Vérification de sécurité pour l'admin
            if (auth()->user()->role !== 'admin') {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }

            // Récupère les messages (les non-lus en premier)
            $messages = Contact::orderBy('lu', 'asc')
                               ->orderBy('created_at', 'desc')
                               ->get();

            return response()->json($messages, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleLu($id)
    {
        try {
            if (auth()->user()->role !== 'admin') {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }

            $message = Contact::findOrFail($id);
            $message->lu = !$message->lu; 
            $message->save();

            return response()->json([
                'message' => 'Statut du message mis à jour',
                'contact' => $message
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}