<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            $table->enum('type_inscription', ['enfant', 'adulte'])->default('enfant')->after('id');
            $table->string('apprenant_email')->nullable()->after('parent_telephone');
            $table->enum('format', ['presentiel', 'en_ligne'])->nullable()->after('session_choisie');
        });
    }

    public function down()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            $table->dropColumn(['type_inscription', 'apprenant_email', 'format']);
        });
    }
};