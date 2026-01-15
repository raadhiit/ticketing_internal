'use client';

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Funnel, RefreshCcw } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import { cn } from '@/lib/utils';

import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { buildPaginationLinks, normalizeLabel } from '../lib/pagination';
import type { DataTableProps } from '../types/dashboard';

export default function DashboardTable<T>({
    columns,
    data,
    links = [],
    paginator,
    className,
    searchPlaceholder = 'Search by code...',
    initialQ,
    initialDateFrom,
    initialDateTo,
}: DataTableProps<T>) {
    const {
        resetDateFilter,
        draftQ,
        setDraftQ,
        draftDateFrom,
        setDraftDateFrom,
        draftDateTo,
        setDraftDateTo,
        applyDateFilter,
    } = useDashboardFilters(initialQ, initialDateFrom, initialDateTo);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className={cn('w-full overflow-auto', className)}>
            <div className="rounded-2xl border border-border bg-card shadow-sm">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Label className="text-2xl font-semibold">
                            Ticket History
                        </Label>

                        {paginator && (
                            <div className="mt-1 text-xs text-muted-foreground">
                                Showing {paginator.from} — {paginator.to} of{' '}
                                {paginator.total}
                            </div>
                        )}
                    </div>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        {/* SEARCH */}
                        <Input
                            type="search"
                            value={draftQ}
                            onChange={(e) => setDraftQ(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full sm:w-72"
                        />

                        {/* FILTER POPOVER */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Funnel className="mr-1 h-4 w-4" />
                                    Filters
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="end"
                                className="w-72 space-y-3 text-xs"
                            >
                                <div className="border-b pb-2">
                                    <p className="text-[11px] font-semibold text-muted-foreground">
                                        Filter by date
                                    </p>
                                </div>

                                {/* DATE FROM */}
                                <div className="space-y-1">
                                    <Label className="text-[11px]">From</Label>
                                    <Input
                                        type="date"
                                        value={draftDateFrom ?? ''}
                                        onChange={(e) =>
                                            setDraftDateFrom(e.target.value)
                                        }
                                        className="h-8 text-xs"
                                    />
                                </div>

                                {/* DATE TO */}
                                <div className="space-y-1">
                                    <Label className="text-[11px]">To</Label>
                                    <Input
                                        type="date"
                                        value={draftDateTo ?? ''}
                                        onChange={(e) =>
                                            setDraftDateTo(e.target.value)
                                        }
                                        className="h-8 text-xs"
                                    />
                                </div>

                                {/* FOOTER */}
                                <div className="flex items-center justify-between pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[11px]"
                                        onClick={resetDateFilter}
                                    >
                                        <RefreshCcw className="mr-1 h-3 w-3" />
                                        Reset
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="h-7 px-3 text-[11px]"
                                        onClick={applyDateFilter}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* ================= TABLE ================= */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="border-t border-border">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody className="divide-y divide-border bg-background">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition hover:bg-foreground/10"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-sm"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        No data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= PAGINATION ================= */}
                {links.length > 0 && paginator && (
                    <div className="flex items-center justify-between px-6 py-3 text-xs text-muted-foreground">
                        <div>
                            Showing {paginator.from} — {paginator.to} of{' '}
                            {paginator.total}
                        </div>

                        <div className="flex items-center gap-2">
                            {buildPaginationLinks(
                                links,
                                paginator.currentPage,
                                paginator.lastPage,
                            ).map((link, idx) => (
                                <button
                                    key={idx}
                                    className={`min-w-[36px] rounded px-2 py-1 text-[13px] ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent'
                                    }`}
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (!link.url) return;

                                        router.get(
                                            link.url,
                                            {},
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }}
                                >
                                    {normalizeLabel(link.label)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
