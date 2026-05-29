<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            $table->string('session_choisie')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('inscriptions_session', function (Blueprint $table) {
            $table->string('session_choisie')->nullable(false)->change();
        });
    }
};