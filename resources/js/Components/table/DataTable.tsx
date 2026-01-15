'use client';

import {useState} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    type ColumnFiltersState
} from '@tanstack/react-table'
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableTable } from './TableRender';
import { DataTablePagination } from './TablePagination';
import type { DataTableProps } from './types/table';

export function DataTable<Tdata, Tvalue>({
    columns,
    data,
    emptyMessage = 'No Data Found',
    ...rest
}: DataTableProps<Tdata, Tvalue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} {...rest} />
            <DataTableTable
                table={table}
                columns={columns} // ✅ BENAR
                emptyMessage={emptyMessage}
            />

            <DataTablePagination {...rest} />
        </div>
    );
}