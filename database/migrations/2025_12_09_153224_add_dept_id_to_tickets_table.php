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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('dept_id')
                ->nullable()
                ->constrained('departments')
                ->after('created_by');
            $table->index(['dept_id', 'status']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['dept_id', 'status']);
            $table->dropConstrainedForeignId('dept_id');
        });
    }
};
