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
            $table->enum('approval_status', ['pending', 'approved', 'declined'])->default('pending')->after('supporting_evidence');
            $table->unsignedBigInteger('approved_by')->nullable()->after('approval_status');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->text('admin_notes')->nullable()->after('approved_at');
            $table->boolean('is_manual_entry')->default(false)->after('admin_notes');
            
            $table->foreign('approved_by')->references('id_users')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('check_clocks', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'approval_status',
                'approved_by', 
                'approved_at',
                'admin_notes',
                'is_manual_entry'
            ]);
        });
    }
};
