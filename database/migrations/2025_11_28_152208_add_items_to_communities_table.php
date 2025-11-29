<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->string('banner_image')->nullable()->after('description');
            $table->string('logo_image')->nullable()->after('banner_image');
            $table->string('website')->nullable()->after('logo_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn('banner_image');
            $table->dropColumn('logo_image');
            $table->dropColumn('website');
        });
    }
};
