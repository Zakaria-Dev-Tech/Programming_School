<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Notifications\CustomResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs qui peuvent être remplis (Mass Assignment).
     * AJOUT : 'parent_id' pour lier l'enfant au parent dans la même table.
     */
    protected $fillable = [
        'username',
        'nom',
        'email',
        'telephone',
        'password',
        'type',      // 'apprenant' ou 'parent'
        'role',      // 'user', 'admin', 'formateur'
        'parent_id', 
        'age',
        'nom_ecole',
        'niveau_etude',
        'formations_interet', 
        'localite',
        'statut'
    ];

    /**
     * Les types de données à caster.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'formations_interet' => 'array',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * RELATIONS
     */

    /**
     * Pour le Parent : Récupère ses enfants (qui sont aussi des Users)
     */
    public function enfants(): HasMany
    {
        // On lie l'utilisateur à lui-même via parent_id
        return $this->hasMany(User::class, 'parent_id');
    }

    /**
     * Pour l'Enfant : Récupère son Parent
     */
 public function parent() {
    return $this->belongsTo(User::class, 'parent_id');
}

    /**
     * Historique brut des inscriptions
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class, 'user_id');
    }

    /**
     * Pour l'Apprenant : Récupère directement les objets Formations
     * C'est cette relation qui remplit ton tableau de bord (Total Formations, etc.)
     */
    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'inscriptions', 'user_id', 'formation_id')
                    ->withTimestamps(); // Optionnel : si ta table pivot a des dates
    }
    public function sendPasswordResetNotification($token)
{
    $this->notify(new CustomResetPassword($token));
}
}