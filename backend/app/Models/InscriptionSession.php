<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InscriptionSession extends Model
{
    protected $table = 'inscriptions_session';
    
  protected $fillable = [
    'type_inscription', 
    'formation_id',
    'user_id',
    'parent_nom',
    'parent_prenom',
    'parent_adresse',
    'parent_telephone',
    'parent_zone',
    'apprenant_email',
    'eleve_nom',
    'eleve_prenom',
    'eleve_age',
    'eleve_niveau_etude',
    'eleve_etablissement',
    'session_choisie',
    'format', 
    'source',
    'statut',
    'reference_paiement',
    'montant_paye'
];
    
    protected $casts = [
        'eleve_age' => 'integer',
        'montant_paye' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    // Relations
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    // Accesseurs
    public function getNomCompletParentAttribute(): string
    {
        return $this->parent_nom . ' ' . $this->parent_prenom;
    }
    
    public function getNomCompletEleveAttribute(): string
    {
        return $this->eleve_nom . ' ' . $this->eleve_prenom;
    }
    
    // Statut en français
    public function getStatutTexteAttribute(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'confirmee' => 'Confirmée',
            'annulee' => 'Annulée',
            default => 'Inconnu'
        };
    }
    
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'en_attente' => 'orange',
            'confirmee' => 'green',
            'annulee' => 'red',
            default => 'gray'
        };
    }
    public function inscriptionsSession()
{
    return $this->hasMany(InscriptionSession::class);
}
}