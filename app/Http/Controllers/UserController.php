<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\User;
use Inertia\Inertia;
use App\Models\departments;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Traits\ToggleActive;

class UserController extends Controller
{
    use ToggleActive;

    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function toggleActive(Request $request, User $user)
    {
        $this->authorize('update', $user);

        return $this->handleToggleActive($request, $user, 'user');
    }

    public function index(Request $request)
    {
        $users = User::with('department')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department->name ?? "-",
                'department_id' => $user->department_id,
                'role' => $user->getRoleNames()->first(), // Collection nama role
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->diffForHumans(),
            ]);

        $departments = departments::orderBy('name')->get(['id', 'name']);
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Users/page', [
            'users' => $users,
            'departments' => $departments,
            'role' => $roles,
            'canManageUsers' => $request->user()->can('users.manage'),
        ]);
    }

    public function store(UserRequest $request) 
    {
        $data = $request->validated();

        try {
            DB::transaction(function () use ($data) {
                $roleName = $data['role'];
                $userData = Arr::except($data, ['role']);

                $userData['password'] = Hash::make($userData['password']);

                $user = User::create($userData);

                $user->assignRole($roleName);
            });
            return back(303)->with('success', 'User berhasil ditambahkan.');
        } catch (Throwable $th) {
            Log::error('Error add user', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal menambahkan user.');
        }
    }

    public function update(UserRequest $request, User $user)
    {

        $data = $request->validated();
        $roleName = $data['role'] ?? null;
        unset($data['role']);

        if (!array_key_exists('password', $data) || $data['password'] === null || $data['password'] === '') {
            unset($data['password']);
        } else {
            // Kalau password diisi → hash dulu
            $data['password'] = Hash::make($data['password']);
        }

        try {
            DB::transaction(function () use ($data, $user, $roleName) {
                $user->update($data);
                if ($roleName) {
                    $user->syncRoles($roleName);
                }
            });

            return back(303)->with('success', 'User berhasil diperbarui.');
        }catch (Throwable $th) {
            Log::error('Error update user', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', $th->getMessage());
        }
    }

    public function destroy(User $user)
    {
        try{
            DB::transaction(function () use ($user) {
                $user->delete();
            });
            return back(303)->with('success', 'User berhasil dihapus.');
        }catch(Throwable $th){
            Log::error('Error delete user', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back(303)->with('error', 'Gagal menghapus user.');
        }
    }

}
