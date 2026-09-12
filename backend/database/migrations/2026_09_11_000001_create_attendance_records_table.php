<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('student_id');
            $table->string('student_name');
            $table->string('class_code')->nullable();
            $table->string('class_name');
            $table->string('subject');
            $table->date('date');
            $table->string('time', 5);
            $table->string('status', 20);
            $table->string('method', 20);
            $table->timestamps();

            $table->unique(['user_id', 'student_id', 'class_name', 'subject', 'date'], 'attendance_unique_scan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};