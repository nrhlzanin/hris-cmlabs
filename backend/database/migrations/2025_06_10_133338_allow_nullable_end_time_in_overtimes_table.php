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
        Schema::table('overtimes', function (Blueprint $table) {
            // Make end_time and duration_hours nullable to support the new workflow
            // where overtime is initially submitted without end_time
            $table->time('end_time')->nullable()->change();
            $table->decimal('duration_hours', 4, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('overtimes', function (Blueprint $table) {
            // Revert back to not nullable
            $table->time('end_time')->nullable(false)->change();
            $table->decimal('duration_hours', 4, 2)->nullable(false)->change();
        });
    }
};
