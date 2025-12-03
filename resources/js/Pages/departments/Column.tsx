'use client';

import { ConfirmDeleteDialog } from "@/Components/ConfirmDelete";
import { Switch } from "@/Components/ui/switch";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import type { DepartmentsRow } from "./types/DeptTypes";
import { DeptFormDialog } from './DeptDialog';
import { cn } from "@/lib/utils";

export const columns: ColumnDef<DepartmentsRow>[] = [
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
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const departments = row.original;
            const handleToggle = (value: boolean) => {
                router.patch(
                    route('departments.toggle-active', departments.id),
                    { is_active: value },
                    { preserveScroll: true },
                );
            };

            return (
                <div className="flex justify-center items-center gap-1 md:gap-2 w-full text-[11px] md:text-xs">
                    <Switch
                        variant="status"
                        checked={departments.is_active}
                        onCheckedChange={handleToggle}
                        className="scale-90 md:scale-100" // kecil di mobile
                    />
                    <span
                        className={cn(
                            'text-[11px] text-muted-foreground md:text-xs',
                            departments.is_active ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {departments.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Dibuat',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.created_at}</span>
        )
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const departments = row.original;
            const handleDelete = () => {
                router.delete(route('departments.destroy', departments.id), {
                    preserveScroll: true,
                });
            };

            return (
                <div className="flex justify-center items-center gap-2">
                    <DeptFormDialog mode="edit" departments={departments} />
                    <ConfirmDeleteDialog 
                        resourceName="Departments"
                        resourceLabel={departments.name}
                        onConfirm={handleDelete} 
                    />
                </div>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
    }
]; 
