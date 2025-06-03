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
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('name_letter_id');
            $table->string('employee_name'); // derived from employee first_name + last_name
            $table->string('name');
            $table->timestamps();

            $table->foreign('name_letter_id')->references('id_letter')->on('letter_formats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};