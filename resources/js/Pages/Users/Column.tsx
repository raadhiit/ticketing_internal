'use client';

import { ConfirmDeleteDialog } from '@/Components/ConfirmDelete';
import { Switch } from '@/Components/ui/switch';
import { router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { UserFormDialog } from './UserDialog';
import { UserRow, UsersPageProps } from './types/userTypes';
import { cn } from '@/lib/utils';

export const Columns: ColumnDef<UserRow>[] = [
    {
        id: 'no',
        header: '#',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.index + 1}</span>
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.email}</span>
        ),
    },
    {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">
                {row.original.department ?? '-'}
            </span>
        ),
    },
    {
        accessorKey: 'role',
        header: 'role',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">
                {row.original.role ?? '-'}
            </span>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const user = row.original;
            const { canManageUsers } = usePage<UsersPageProps>().props;

            const handleToggle = (value: boolean) => {
                if (!canManageUsers) return; // jaga-jaga
                router.patch(
                    route('users.toggle-active', user.id),
                    { is_active: value },
                    { preserveScroll: true },
                );
            };

            return (
                <div className="flex w-full items-center justify-center gap-1 text-[11px] md:gap-2 md:text-xs">
                    <Switch
                        variant="status"
                        checked={user.is_active}
                        onCheckedChange={handleToggle}
                        disabled={!canManageUsers} // ⬅️ BACA AJA KALO GA BOLEH
                        className="scale-90 md:scale-100"
                    />
                    <span
                        className={cn(
                            'text-[11px] font-medium md:text-xs',
                            user.is_active
                                ? 'text-emerald-600'
                                : 'text-red-500',
                        )}
                    >
                        {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const user = row.original;
            const { departments, role, canManageUsers } =
                usePage<UsersPageProps>().props;

            const handleDelete = () => {
                if (!canManageUsers) return;
                router.delete(route('users.destroy', user.id), {
                    preserveScroll: true,
                });
            };

            if (!canManageUsers) {
                // Kalau cuma boleh lihat, gak usah render tombol apa pun
                return (
                    <div className="flex items-center justify-center text-[11px] text-muted-foreground md:text-xs">
                        -
                    </div>
                );
            }

            return (
                <div className="flex items-center justify-center gap-1 text-[11px] md:gap-2 md:text-xs">
                    {/* Edit */}
                    <UserFormDialog
                        mode="edit"
                        user={{
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            is_active: user.is_active,
                            department_id: user.department_id,
                            role: user.role,
                        }}
                        departments={departments}
                        role={role}
                    />

                    {/* Delete */}
                    <ConfirmDeleteDialog
                        resourceName="user"
                        resourceLabel={user.name}
                        onConfirm={handleDelete}
                    />
                </div>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: 'created_at',
        header: 'Dibuat',
        cell: ({ row }) => (
            <span className="text-sm sm:text-xs">
                {row.original.created_at}
            </span>
        ),
    },
];
