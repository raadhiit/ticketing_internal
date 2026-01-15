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
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $model->update($validated);

        return back(303)->with(
            'success',
            "Status {$resourceLabel} berhasil diperbarui."
        );
    }
}