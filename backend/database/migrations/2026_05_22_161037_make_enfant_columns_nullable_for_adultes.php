<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            // Rendre les champs enfant nullable
            $table->string('eleve_nom')->nullable()->change();
            $table->string('eleve_prenom')->nullable()->change();
            $table->integer('eleve_age')->nullable()->change();
            $table->string('eleve_niveau_etude')->nullable()->change();
            $table->string('eleve_etablissement')->nullable()->change();
            
            // S'assurer que les champs adulte sont aussi nullable
            $table->string('apprenant_email')->nullable()->change();
            $table->enum('format', ['presentiel', 'en_ligne'])->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            $table->string('eleve_nom')->nullable(false)->change();
            $table->string('eleve_prenom')->nullable(false)->change();
            $table->integer('eleve_age')->nullable(false)->change();
            $table->string('eleve_niveau_etude')->nullable(false)->change();
            $table->string('eleve_etablissement')->nullable(false)->change();
            $table->string('apprenant_email')->nullable(false)->change();
            $table->enum('format', ['presentiel', 'en_ligne'])->nullable(false)->change();
        });
    }
};