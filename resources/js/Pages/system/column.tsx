'use client';

import { ConfirmDeleteDialog } from "@/Components/ConfirmDelete";
import { Switch } from "@/Components/ui/switch";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import type { SystemRow } from './types/systemTypes';
import { SystemDialog } from './SystemDialog';
import { cn } from "@/lib/utils";

export const columns: ColumnDef<SystemRow>[] = [
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
        accessorKey: 'code',
        header: 'Kode',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.code}</span>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Deskripsi',
        cell: ({ row }) => {
            const desc = row.original.description ?? '-';

            return (
                <span
                    title={desc} // hover lihat full deskripsi
                    className="max-w-xs text-muted-foreground text-xs md:text-sm truncate"
                >
                    {desc}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const systems = row.original;
            const handleToggle = (value: boolean) => {
                router.patch(
                    route('systems.toggle-active', systems.id),
                    { is_active: value },
                    { preserveScroll: true },
                );
            };

            return (
                <div className="flex justify-center items-center gap-1 md:gap-2 w-full text-[11px] md:text-xs">
                    <Switch
                        variant="status"
                        checked={systems.is_active}
                        onCheckedChange={handleToggle}
                        className="scale-90 md:scale-100" // kecil di mobile
                    />
                    <span
                        className={cn(
                            'text-[11px] text-muted-foreground md:text-xs',
                            systems.is_active ? 'text-green-500' : 'text-red-500'
                        )}
                    >
                        {systems.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Dibuat',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">
                {row.original.created_at}
            </span>
        ),
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const systems = row.original;
            const handleDelete = () => {
                router.delete(route('systems.destroy', systems.id), {
                    preserveScroll: true,
                });
            };

            return (
                <div className="flex justify-center items-center gap-2">
                    <SystemDialog mode="edit" systems={systems} />
                    <ConfirmDeleteDialog
                        resourceName="systems"
                        resourceLabel={systems.name}
                        onConfirm={handleDelete}
                    />
                </div>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
    }
];