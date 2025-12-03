<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // admin
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@example.com',
            ],
            [
                'name'     => 'Admin',
                'password' => bcrypt('password'), // ganti kalau mau
            ]
        );

        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // dev
        $dev = User::updateOrCreate(
            ['email' => 'dev@example.com'],
            [
                'name' => 'Dev',
                'password' => bcrypt('password'),
            ]
        );
        $dev->assignRole('dev');

        // pm
        $pm = User::updateOrCreate(
            ['email' => 'pm@example.com'],
            [
                'name' => 'PM',
                'password' => bcrypt('password'),
            ]
        );
        $pm->assignRole('pm');

        // user
        $user = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole('user');
    }
}
