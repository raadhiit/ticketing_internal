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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')
                ->constrained('tickets')
                ->onDelete('cascade');

            $table->foreignId('assignee_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', ['todo', 'in_progress', 'review', 'done'])
                ->default('todo')
                ->index();

            $table->unsignedInteger('position')->default(0);

            // Index utama untuk kanban
            $table->index('ticket_id');
            $table->index(['ticket_id', 'status', 'position']);

            // Kalau mau mencegah posisi ganda di satu kolom:
            // $table->unique(['ticket_id', 'status', 'position']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
