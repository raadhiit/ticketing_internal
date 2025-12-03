<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

trait ToggleActive
{
    /**
     * Toggle kolom is_active untuk model apapun yang punya field itu.
     *
     * @param  Request  $request
     * @param  Model    $model           Model yang mau di-toggle
     * @param  string   $resourceLabel   Label buat pesan flash: "user", "departemen", dll
     */
    protected function handleToggleActive(
        Request $request,
        Model $model,
        string $resourceLabel = 'data'
    ): RedirectResponse {
        $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        try {
            $model->update([
                'is_active' => $request->boolean('is_active'),
            ]);

            return back(303)->with(
                'success',
                "Status {$resourceLabel} berhasil diperbarui."
            );
        } catch (Throwable $th) {
            Log::error("Error update {$resourceLabel} status", [
                'message' => $th->getMessage(),
                'file'    => $th->getFile(),
                'line'    => $th->getLine(),
            ]);

            return back(303)->with(
                'error',
                "Gagal memperbarui status {$resourceLabel}."
            );
        }
    }
}