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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->enum('type', ['package', 'seat']);
            $table->decimal('monthly_price', 10, 2)->nullable();
            $table->decimal('yearly_price', 10, 2)->nullable();
            $table->decimal('seat_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('IDR');
            $table->json('features');
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->string('button_text')->default('Select Plan');
            $table->string('button_variant')->default('primary');
            $table->integer('min_seats')->nullable();
            $table->integer('max_seats')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
