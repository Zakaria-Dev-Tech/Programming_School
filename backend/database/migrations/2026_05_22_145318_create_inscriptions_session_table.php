<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inscriptions_session', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Infos parent/tuteur - tous en string sans valeurs par défaut
            $table->string('parent_nom');
            $table->string('parent_prenom');
            $table->string('parent_adresse');
            $table->string('parent_telephone');
            $table->string('parent_zone');  // Pas de valeurs par défaut
            
            // Infos élève
            $table->string('eleve_nom');
            $table->string('eleve_prenom');
            $table->integer('eleve_age');
            $table->string('eleve_niveau_etude');
            $table->string('eleve_etablissement');
            
            // Session choisie - simple string
            $table->string('session_choisie');
            
            // Source d'information
            $table->string('source')->nullable();
            
            // Statut avec valeur par défaut (nécessaire pour la logique)
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee'])->default('en_attente');
            
            // Paiement
            $table->string('reference_paiement')->nullable();
            $table->decimal('montant_paye', 10, 2)->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inscriptions_session');
    }
};