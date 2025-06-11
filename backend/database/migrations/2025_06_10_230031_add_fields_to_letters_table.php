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
        Schema::table('letters', function (Blueprint $table) {
            $table->string('letter_type')->default('General')->after('name');
            $table->enum('status', ['pending', 'approved', 'declined', 'waiting_reviewed'])->default('pending')->after('letter_type');
            $table->date('valid_until')->nullable()->after('status');
            $table->text('description')->nullable()->after('valid_until');
            $table->string('supporting_document')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropColumn(['letter_type', 'status', 'valid_until', 'description', 'supporting_document']);
        });
    }
};
