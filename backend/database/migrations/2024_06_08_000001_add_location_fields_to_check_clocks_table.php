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
        Schema::table('check_clocks', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('check_clock_time');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->text('address')->nullable()->after('longitude');
            $table->string('supporting_evidence')->nullable()->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('check_clocks', function (Blueprint $table) {
            $table->dropColumn([
                'latitude',
                'longitude', 
                'address',
                'supporting_evidence'
            ]);
        });
    }
};