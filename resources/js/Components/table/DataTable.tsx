'use client';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from '@tanstack/react-table';
import * as React from 'react';
import { router } from '@inertiajs/react';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey?: string;
    filterPlaceholder?: string;
    rightToolbarContent?: React.ReactNode;
    emptyMessage?: string;
    statusFilterKey?: string;
    pagination: PaginationMeta;
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
};


export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    filterPlaceholder,
    rightToolbarContent,
    emptyMessage = 'No data found.',
    statusFilterKey,
    pagination
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    // console.log(table.getCanNextPage());

    const filterColumn = filterKey ? table.getColumn(filterKey) : undefined;
    // const statusColumn = table.getColumn('is_active');
      const statusColumn = statusFilterKey
          ? table.getColumn(statusFilterKey)
          : undefined;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                {/* KIRI: search + checkbox */}
                <div className="flex items-center gap-3">
                    {filterColumn && (
                        <Input
                            placeholder={
                                filterPlaceholder ?? `Search ${filterKey}...`
                            }
                            value={
                                (filterColumn.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                filterColumn.setFilterValue(event.target.value)
                            }
                            className="max-w-xs border border-neutral-300 placeholder:text-muted-foreground dark:border-neutral-700"
                        />
                    )}

                    {statusColumn && (
                        <label className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded accent-neutral-700 dark:accent-neutral-300"
                                checked={
                                    statusColumn.getFilterValue() === false
                                }
                                onChange={(e) =>
                                    statusColumn.setFilterValue(
                                        e.target.checked ? false : undefined,
                                    )
                                }
                            />
                            <span>Non aktif</span>
                        </label>
                    )}
                </div>

                {/* KANAN: tombol Tambah / toolbar lain */}
                {rightToolbarContent}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-neutral-300 dark:border-neutral-700">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap text-center text-xs font-semibold text-foreground md:text-sm lg:text-base"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="md:text-md items-center text-center align-middle text-base lg:text-base"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                route('tickets.index'),
                                { page: 1 },
                                { preserveState: true, preserveScroll: true },
                            )
                        }
                        disabled={pagination.current_page === 1}
                    >
                        First
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                route('tickets.index'),
                                { page: pagination.current_page - 1 },
                                { preserveState: true, preserveScroll: true },
                            )
                        }
                        disabled={pagination.current_page === 1}
                    >
                        Prev
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                route('tickets.index'),
                                { page: pagination.current_page + 1 },
                                { preserveState: true, preserveScroll: true },
                            )
                        }
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                    >
                        Next
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                route('tickets.index'),
                                { page: pagination.last_page },
                                { preserveState: true, preserveScroll: true },
                            )
                        }
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                    >
                        Last
                    </Button>
                </div>
            </div>
        </div>
    );
}
