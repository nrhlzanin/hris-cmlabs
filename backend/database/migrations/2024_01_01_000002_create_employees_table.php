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
        Schema::create('employees', function (Blueprint $table) {
            $table->string('nik')->primary(); // NIK as primary key
            $table->string('avatar')->nullable(); // file path for avatar
            $table->string('first_name');
            $table->string('last_name');
            $table->string('mobile_phone');
            $table->enum('gender', ['Men', 'Woman']);
            $table->enum('last_education', ['high_school', 'SMA', 'SMK_Sederajat', 'bachelor', 'S1', 'master', 'S2']);
            $table->string('place_of_birth');
            $table->date('date_of_birth');
            $table->string('position');
            $table->string('branch');
            $table->enum('contract_type', ['Permanent', 'Contract']);
            $table->string('grade');
            $table->enum('bank', ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata']);
            $table->string('account_number');
            $table->string('acc_holder_name');
            $table->unsignedBigInteger('letter_id')->nullable();
            $table->timestamps();

            $table->foreign('letter_id')->references('id_letter')->on('letter_formats')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};