<?php

namespace App\Policies;

use App\Models\User;
use App\Models\system;

class SystemsPolicy
{
    /**
     * Create a new policy instance.
     */

    public function viewAny (User $user)
    {
        return $user->can('systems.manage');
    }

    public function view(User $user, system $target)
    {
        return $user->can('systems.manage');
    }

    public function create(User $user)
    {
        return $user->can('systems.manage');
    }

    public function update(User $user, system $target)
    {
        return $user->can('systems.manage');
    }

    public function delete(User $user, system $target)
    {
        return $user->can('systems.manage');
    }
}
