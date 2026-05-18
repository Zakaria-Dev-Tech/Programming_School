<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('inscriptions', function (Blueprint $table) {
        // 'essai' = accès gratuit temporaire, 'paye' = accès total débloqué via CinetPay
        $table->string('statut_paiement')->default('essai')->after('statut');
        $table->string('transaction_id')->nullable()->after('statut_paiement');
    });
}

public function down()
{
    Schema::table('inscriptions', function (Blueprint $table) {
        $table->dropColumn(['statut_paiement', 'transaction_id']);
    });
}
};
