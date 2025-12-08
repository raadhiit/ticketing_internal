<?php

namespace App\Http\Controllers;

use Throwable;
use Inertia\Inertia;
use App\Models\departments;
use App\Traits\ToggleActive;
use Illuminate\Http\Request;
use App\Http\Requests\DeptRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DepartmentsController extends Controller
{
    use ToggleActive;

    public function __construct()
    {
        $this->authorizeResource(departments::class, 'department');
    }

    public function toggleActive(Request $request, departments $department)
    {
        $this->authorize('update', $department);
        return $this->handleToggleActive($request, $department, 'department');
    }

    public function index(Request $request)
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
            'departments' => $departments,
            'canManageDepartments' => $request->user()->can('departments.manage'),
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

}
