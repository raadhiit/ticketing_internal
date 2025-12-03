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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // MASTER RELATIONS
            $table->foreignId('system_id')
                ->constrained('systems');

            $table->foreignId('created_by')
                ->constrained('users');

            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users');

            // BUSINESS FIELDS
            $table->string('code')->unique();

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('category', ['bug', 'feature', 'improvement', 'support'])
                ->default('bug');

            $table->enum('priority', ['unassigned', 'low', 'medium', 'high', 'urgent'])
                ->default('unassigned')
                ->index();

            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])
                ->default('open')
                ->index();

            $table->date('due_date')
                ->nullable()
                ->index();

            $table->softDeletes();

            // COMPOSITE INDEXES
            $table->index(['assigned_to', 'status']); // view dev
            $table->index(['system_id', 'status']);   // view PM/admin per system
            $table->index(['created_by', 'status']);  // "ticket yang saya buat"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
