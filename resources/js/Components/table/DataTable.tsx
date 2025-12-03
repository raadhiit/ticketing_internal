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
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from '@tanstack/react-table';
import * as React from 'react';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey?: string;
    filterPlaceholder?: string;
    rightToolbarContent?: React.ReactNode;
    emptyMessage?: string;
    statusFilterKey?: string; 
};

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    filterPlaceholder,
    rightToolbarContent,
    emptyMessage = 'No data found.',
    statusFilterKey,
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
        getPaginationRowModel: getPaginationRowModel(),
    });

    const filterColumn = filterKey ? table.getColumn(filterKey) : undefined;
    // const statusColumn = table.getColumn('is_active');
      const statusColumn = statusFilterKey
          ? table.getColumn(statusFilterKey)
          : undefined;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-2">
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
                            className="border-2 border-neutral-300 dark:border-neutral-700 max-w-xs placeholder:text-muted-foreground"
                        />
                    )}

                    {statusColumn && (
                        <label className="inline-flex items-center gap-1 text-muted-foreground text-xs whitespace-nowrap shrink-0">
                            <input
                                type="checkbox"
                                className="rounded w-4 h-4 accent-neutral-700 dark:accent-neutral-300"
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
            <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold text-foreground text-xs md:text-sm lg:text-base text-center whitespace-nowrap"
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
                                            className="items-center md:text-md text-base lg:text-base text-center align-middle"
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
                                    className="h-24 text-muted-foreground text-sm text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center gap-2">
                <div className="text-foreground text-xs">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount() || 1}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        First
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </Button>
                </div>
            </div>
        </div>
    );
}
