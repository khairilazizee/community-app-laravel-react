<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->timestamps();

            $table->unique(['community_id', 'type', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_categories');
    }
};
