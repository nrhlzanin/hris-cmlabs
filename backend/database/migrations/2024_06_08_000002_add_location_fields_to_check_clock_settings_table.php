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
        Schema::table('check_clock_settings', function (Blueprint $table) {
            $table->decimal('office_latitude', 10, 8)->nullable()->after('geo_loc');
            $table->decimal('office_longitude', 11, 8)->nullable()->after('office_latitude');
            $table->integer('location_radius')->default(1000)->after('office_longitude'); // radius in meters
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('check_clock_settings', function (Blueprint $table) {
            $table->dropColumn([
                'office_latitude',
                'office_longitude',
                'location_radius'
            ]);
        });
    }
};