'use client';

import { ConfirmDeleteDialog } from "@/Components/ConfirmDelete";
import { Switch } from "@/Components/ui/switch";
import { router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import type { CategoriesProps, CategoriesRow } from "./types/categoriesTypes";
import { CatFormDialog } from './CatDialog';
import { cn } from "@/lib/utils";

export const columns: ColumnDef<CategoriesRow>[] = [
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
        accessorKey: 'key',
        header: 'Key',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.key}</span>
        )
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.name}</span>
        )
    },
    {
        accessorKey: 'code_prefix',
        header: 'Code Prefix',
        cell: ({ row }) => (
            <span className="md:text-md text-xs">{row.original.code_prefix}</span>
        )
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const  categories = row.original;
            const { canManageCategories } = usePage<CategoriesProps>().props;
            const handleToggle = (value: boolean) => {
                if (!canManageCategories) return;
                router.patch(
                    route('categories.toggle-active', categories.id),
                    { is_active: value },
                    { preserveScroll: true },
                );
            };

            return (
                <div className="flex w-full items-center justify-center gap-1 text-[11px] md:gap-2 md:text-xs">
                    <Switch
                        variant="status"
                        checked={categories.is_active}
                        disabled={!canManageCategories}
                        onCheckedChange={handleToggle}
                        className="scale-90 md:scale-100"
                    />
                    <span
                        className={cn(
                            'text-[11px] text-muted-foreground md:text-xs',
                            categories.is_active
                                ? 'text-green-600'
                                : 'text-red-600',
                        )}
                    >
                        {categories.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            );
        }
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
            const categories = row.original;
            const { canManageCategories } = usePage<CategoriesProps>().props;
            const handleDelete = () => {
                if (!canManageCategories) return;
                router.delete(route('categories.destroy', categories.id), {
                    preserveScroll: true,
                });
            }
            return (
                <div className="flex justify-center items-center gap-2">
                    <CatFormDialog mode="edit" categories={categories} />
                    <ConfirmDeleteDialog 
                        resourceName="Categories"
                        resourceLabel={categories.name}
                        onConfirm={() => router.delete(route('categories.destroy', categories.id))} 
                    />
                </div>
            );
        }
    }

]
