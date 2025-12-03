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
            <span className="text-xs md:text-md">{row.index + 1}</span>
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => (
            <span className="text-xs md:text-md">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <span className="text-xs md:text-md">{row.original.email}</span>
        ),
    },
    {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => (
            <span className="text-xs md:text-md">
                {row.original.department ?? '-'}
            </span>
        ),
    },
    {
        accessorKey: 'roles',
        header: 'role',
        cell: ({ row }) => (
            <span className="text-xs md:text-md">
                {row.original.roles ?? '-'}
            </span>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const user = row.original;
            const handleToggle = (value: boolean) => {
                router.patch(
                    route('users.toggle-active', user.id),
                    { is_active: value },
                    { preserveScroll: true },
                );
            };

            return (
                <div className="flex w-full items-center justify-center gap-1 text-[11px] md:gap-2 md:text-xs">
                    <Switch
                        variant="status" // ⬅️ penting: cuma di sini jadi hijau/merah
                        checked={user.is_active}
                        onCheckedChange={handleToggle}
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
            const { departments, roles } = usePage<UsersPageProps>().props;

            const handleDelete = () => {
                router.delete(route('users.destroy', user.id), {
                    preserveScroll: true,
                });
            };

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
                            roles: user.roles,
                        }}
                        departments={departments}
                        roles={roles}
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
