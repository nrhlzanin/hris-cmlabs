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
            // Add indexes for faster queries
            $table->index(['user_id', 'overtime_date'], 'idx_user_date');
            $table->index(['user_id', 'status'], 'idx_user_status');
            $table->index(['overtime_date'], 'idx_overtime_date');
            $table->index(['status'], 'idx_status');
            $table->index(['created_at'], 'idx_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('overtimes', function (Blueprint $table) {
            // Drop indexes when rolling back
            $table->dropIndex('idx_user_date');
            $table->dropIndex('idx_user_status');
            $table->dropIndex('idx_overtime_date');
            $table->dropIndex('idx_status');
            $table->dropIndex('idx_created_at');
        });
    }
};
