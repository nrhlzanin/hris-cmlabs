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
        Schema::create('overtimes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->date('overtime_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('duration_hours', 4, 2); // Total overtime hours
            $table->text('reason'); // Reason for overtime
            $table->text('tasks_completed')->nullable(); // Tasks completed during overtime
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->unsignedBigInteger('approved_by')->nullable(); // Admin who approved
            $table->timestamp('approved_at')->nullable();
            $table->text('admin_notes')->nullable(); // Admin comments
            $table->string('supporting_document')->nullable(); // File path for supporting docs
            $table->timestamps();

            $table->foreign('user_id')->references('id_users')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id_users')->on('users')->onDelete('set null');
            
            // Index for better performance
            $table->index(['user_id', 'overtime_date']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtimes');
    }
};
