<?php

namespace App\Http\Controllers;

use Throwable;
use Inertia\Inertia;
use App\Models\departments;
use Illuminate\Http\Request;
use App\Http\Requests\DeptRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\ToggleActive;


class DepartmentsController extends Controller
{
    use ToggleActive;

    public function toggleActive(Request $request, departments $department) {
        return $this->handleToggleActive($request, $department, 'department');
    }

    public function index()
    {
        $departments = departments::orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($department) => [
                'id' => $department->id,
                'name' => $department->name,
                'is_active' => $department->is_active,
                'created_at' => $department->created_at->diffForHumans(),
            ]);

        return Inertia::render('departments/page', [
            'departments' => $departments
        ]);
    }

    public function store(DeptRequest $request) 
    {
        $data = $request->validated();

        try{
            DB::transaction(function () use ($data) {
                departments::create($data);
            });
            return back(303)->with('success', 'Departemen berhasil ditambahkan.');
        }catch(Throwable $th){
            Log::error('Error add Department', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return redirect()->back()->with('error', 'Gagal menambahkan departemen.');
        }
    }

    public function update(DeptRequest $request, departments $department)
    {
        $data = $request->validated();

        try{
            DB::transaction(function () use ($data, $department) {
                $department->update($data);
            });
            return back(303)->with('success', 'Departemen berhasil diperbarui.');
        }catch(Throwable $th){
            Log::error('Error update Department', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal memperbarui departemen.');
        }
    }

    public function destroy(departments $department)
    {
        try{
            DB::transaction(function () use ($department) {
                $department->delete();
            });
            return back(303)->with('success', 'Departemen berhasil dihapus.');
        }catch(Throwable $th){
            Log::error('Error delete Department', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal menghapus departemen.');
        }
    }

    // public function toggleActive(Request $request, departments $department)
    // {
    //     $validated = $request->validate([
    //         'is_active' => 'required|boolean',
    //     ]);

    //     try{
    //         $department->update([
    //             'is_active' => $request->boolean('is_active'),
    //         ]);

    //         // Untuk Inertia + router.patch, redirect 303 enak
    //         return back(303)->with('success', 'Status departemen berhasil diperbarui.');
    //     }catch(Throwable $th){
    //         Log::error('Error update Department Status', [
    //             'message' => $th->getMessage(),
    //             'file' => $th->getFile(),
    //             'line' => $th->getLine(),
    //         ]);
    //         return back(303)->with('error', 'Gagal memperbarui status departemen.');
    //     }
    // }
}
