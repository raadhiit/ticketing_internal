<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    
    public function viewAny (User $user)
    {
        return $user->can('users.manage');
    }

    public function view(User $user, User $target)
    {
        return $user->can('users.manage');
    }

    public function create(User $user)
    {
        return $user->can('users.manage');
    }

    public function update(User $user, User $target)
    {
        return $user->can('users.manage');
    }

    public function delete(User $user, User $target)
    {
        return $user->can('users.manage');
    }
}
