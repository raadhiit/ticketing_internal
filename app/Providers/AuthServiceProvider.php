<?php

namespace App\Providers;

use App\Models\User;
use App\Models\system;
use App\Models\ticket;
use App\Models\departments;
use App\Policies\DeptPolicy;
use App\Policies\UserPolicy;
use App\Policies\TicketPolicy;
use App\Policies\SystemsPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        departments::class => DeptPolicy::class,
        system::class => SystemsPolicy::class,
        ticket::class => TicketPolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
