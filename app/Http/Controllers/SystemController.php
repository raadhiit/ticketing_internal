<?php

namespace App\Http\Controllers;

use App\Http\Requests\SystemRequest;
use Throwable;
use Inertia\Inertia;
use App\Models\system;
use App\Traits\ToggleActive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SystemController extends Controller
{
    use ToggleActive;

    public function toggleActive(Request $request, system $system) {
        return $this->handleToggleActive($request, $system, 'system');
    }
    
    public function index()
    {
        $system = system::orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($system) => [
                'id' => $system->id,
                'code' => $system->code,
                'name' => $system->name,
                'description' => $system->description,
                'is_active' => $system->is_active,
                'created_at' => $system->created_at->diffForHumans(),
            ]);

        return Inertia::render('system/page', [
            'systems' => $system
        ]);
    }

    public function store(SystemRequest $request)
    {
        $data = $request->validated();
        
        try{
            DB::transaction(function () use ($data) {
                system::create($data);
            });

            return back(303)->with('success', 'Sistem berhasil ditambahkan.');            
        }catch(Throwable $th){
            Log::error('Error add system', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal menambahkan sistem.');
        }
    }

    public function update(System $system, SystemRequest $request)
    {
        $data = $request->validated();

        try{
            DB::transaction(function () use ($data, $system) {
                $system->update($data);
            });
            return back(303)->with('success', 'Sistem berhasil diperbarui.');
        }catch(Throwable $th){
            Log::error('Error update system', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal memperbarui sistem.');
        }
    }

    public function destroy(system $system)
    {
        try{
            DB::transaction(function () use ($system) {
                $system->delete();
            });
            return back(303)->with('success', 'Sistem berhasil dihapus.');
        }catch(Throwable $th){
            Log::error('Error delete system', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal menghapus sistem.');
        }
    }
}
