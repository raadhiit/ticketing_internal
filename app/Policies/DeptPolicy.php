<?php

namespace App\Policies;

use App\Models\departments;
use App\Models\User;

class DeptPolicy
{
    /**
     * Create a new policy instance.
     */
    public function viewAny (User $user)
    {
        return $user->can('departments.manage');
    }

    public function view(User $user, departments $target)
    {
        return $user->can('departments.manage');
    }

    public function create(User $user)
    {
        return $user->can('departments.manage');
    }

    public function update(User $user, departments $target)
    {
        return $user->can('departments.manage');
    }

    public function delete(User $user, departments $target)
    {
        return $user->can('departments.manage');
    }


}
