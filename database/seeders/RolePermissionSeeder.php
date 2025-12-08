<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = 'web';

        // 1. Buat semua permission
        $permissions = [
            // MASTER DATA
            'departments.manage',
            'systems.manage',
            'users.manage',

            // TICKETS
            'tickets.view.all',
            'tickets.view.own',
            'tickets.view.assigned',
            'tickets.create',
            'tickets.assign',
            'tickets.set-priority',
            'tickets.update-status',
            'tickets.delete',

            // TASKS (KANBAN)
            'tasks.create',
            'tasks.update',
            'tasks.delete',
            'tasks.manage-all',
            'tasks.manage-assigned',
            'tasks.view-all',
            'tasks.view-assigned',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate([
                'name'       => $name,
                'guard_name' => $guard,
            ]);
        }

        // 2. Buat roles
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $guard]);
        $pm    = Role::firstOrCreate(['name' => 'pm',    'guard_name' => $guard]);
        $dev   = Role::firstOrCreate(['name' => 'dev',   'guard_name' => $guard]);
        $user  = Role::firstOrCreate(['name' => 'user',  'guard_name' => $guard]);

        // 3. Assign permissions ke setiap role

        // ADMIN → full akses
        $admin->syncPermissions(Permission::all());

        // PM → manage systems + full ticket/task (tanpa users.manage kalau mau dibatasi)
        $pm->syncPermissions([
            'departments.manage',      // opsional, kalau PM boleh manage departemen
            'systems.manage',

            'tickets.view.all',
            'tickets.view.own',
            'tickets.view.assigned',
            'tickets.create',
            'tickets.assign',
            'tickets.set-priority',
            'tickets.update-status',
            'tickets.delete',      // bisa di-on kan kalau mau PM boleh delete

            'tasks.manage-all',
            'tasks.manage-assigned',
            'tasks.view-all',
            'tasks.view-assigned',
        ]);

        // DEV → fokus ke ticket yang dia buat & yang assigned ke dia
        $dev->syncPermissions([
            'tickets.view.own',
            'tickets.view.assigned',
            'tickets.create',
            'tickets.update-status',

            'tasks.create',
            'tasks.update',
            'tasks.delete',
            'tasks.manage-assigned',
            'tasks.view-assigned',
        ]);

        // USER → cuma bisa buat & lihat ticket sendiri
        $user->syncPermissions([
            'tickets.view.own',
            'tickets.create',
            'tickets.update-status',
            // kalau mau user bisa cancel ticket sendiri, nanti bisa tambah permission lain
        ]);
    }
}
