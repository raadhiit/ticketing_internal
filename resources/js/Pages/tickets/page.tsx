import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from '@/Components/table/DataTable';
import { columns } from './column';
import { TicketsProps, TicketFilters, TicketCategory, TicketPriority, TicketStatus } from './types/ticketTypes';
import { TicketDialog } from './TicketDialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/Components/ui/select';
import { Loader2, RefreshCcw, Funnel } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/Components/ui/popover';

export default function TicketPage() {
    const {
        tickets,
        systems,
        canManagePriority,
        canCreate,
        canAssign,
        assignees,
        canManageStatus,
        filters,
        categories,
        priorities,
        statuses,
    } = usePage<TicketsProps>().props;

    const [localCode, setLocalCode] = useState(filters.code ?? '');
    const [isFiltering, setIsFiltering] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localCode === (filters.code ?? '')) return;

            setIsFiltering(true);

            router.get(
                route('tickets.index'),
                {
                    ...filters,
                    code: localCode || undefined,
                    page: 1,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onFinish: () => setIsFiltering(false),
                },
            );
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [localCode]); // ⬅️ CUMA tergantung input user

    const updateFilters = useCallback(
        (field: keyof TicketFilters, value: string) => {
            router.get(
                route('tickets.index'),
                {
                    ...filters,
                    [field]: value || undefined,
                    page: 1,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onStart: () => setIsFiltering(true),
                    onFinish: () => setIsFiltering(false),
                },
            );
        },
        [filters],
    );

    const handleResetFilters = () => {
        // reset state lokal
        setLocalCode('');
        setIsFiltering(false);

        router.get(
            route('tickets.index'),
            {
                page: 1, // balik ke page 1
            },
            {
                preserveScroll: true,
                preserveState: false, // ⬅️ biar props (filters) direset dari backend
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">Tickets</h2>
            }
        >
            <Head title="Tickets" />

            <div className="space-y-4 py-4">
                <div className="lg:max-w-8xl mx-auto sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg border-2 bg-card p-4 mb-5 shadow-md">
                        {/* FILTER BAR */}
                        <div className="mb-5 space-y-3">
                            {/* Row 0: Search + Filters button */}
                            <Label
                                htmlFor="code"
                                className="text-base font-medium text-muted-foreground"
                            >
                                Ticket Code
                            </Label>
                            <div className="flex items-center gap-2">
                                {/* Search / Ticket Code */}
                                <div className="flex-1">
                                    <Input
                                        id="code"
                                        className="h-9 text-sm"
                                        placeholder="Search by ticket code..."
                                        value={localCode}
                                        onChange={(e) =>
                                            setLocalCode(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Loading kecil di samping */}
                                {isFiltering && (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}

                                {/* Tombol Filters */}
                                <Popover
                                    open={filterOpen}
                                    onOpenChange={setFilterOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Funnel className="h-4 w-4" />
                                            <span className="hidden text-sm sm:inline">
                                                Filters
                                            </span>
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align="end"
                                        className="w-72 space-y-3 text-xs"
                                    >
                                        <div className="border-b pb-2">
                                            <p className="text-[11px] font-semibold text-muted-foreground">
                                                Filter by
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="status"
                                                className="text-[11px]"
                                            >
                                                Status
                                            </Label>
                                            <Select
                                                value={
                                                    filters.status
                                                        ? (filters.status as TicketStatus)
                                                        : 'all'
                                                }
                                                onValueChange={(val) =>
                                                    updateFilters(
                                                        'status',
                                                        val === 'all'
                                                            ? ''
                                                            : val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="status"
                                                    className="h-8 text-xs"
                                                >
                                                    <SelectValue placeholder="All statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All statuses
                                                    </SelectItem>
                                                    {statuses.map((s) => (
                                                        <SelectItem
                                                            key={s}
                                                            value={s}
                                                        >
                                                            {s
                                                                .replace(
                                                                    '_',
                                                                    ' ',
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                        l.toUpperCase(),
                                                                )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Priority */}
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="priority"
                                                className="text-[11px]"
                                            >
                                                Priority
                                            </Label>
                                            <Select
                                                value={
                                                    filters.priority
                                                        ? (filters.priority as TicketPriority)
                                                        : 'all'
                                                }
                                                onValueChange={(val) =>
                                                    updateFilters(
                                                        'priority',
                                                        val === 'all'
                                                            ? ''
                                                            : val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="priority"
                                                    className="h-8 text-xs"
                                                >
                                                    <SelectValue placeholder="All priorities" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All priorities
                                                    </SelectItem>
                                                    {priorities.map((p) => (
                                                        <SelectItem
                                                            key={p}
                                                            value={p}
                                                        >
                                                            {p.toUpperCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="category"
                                                className="text-[11px]"
                                            >
                                                Category
                                            </Label>
                                            <Select
                                                value={
                                                    filters.category
                                                        ? (filters.category as TicketCategory)
                                                        : 'all'
                                                }
                                                onValueChange={(val) =>
                                                    updateFilters(
                                                        'category',
                                                        val === 'all'
                                                            ? ''
                                                            : val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="category"
                                                    className="h-8 text-xs"
                                                >
                                                    <SelectValue placeholder="All categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All categories
                                                    </SelectItem>
                                                    {categories.map((c) => (
                                                        <SelectItem
                                                            key={c}
                                                            value={c}
                                                        >
                                                            {c
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                c.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* System / Application */}
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="system_id"
                                                className="text-[11px]"
                                            >
                                                Application
                                            </Label>
                                            <Select
                                                value={
                                                    filters.system_id
                                                        ? String(
                                                              filters.system_id,
                                                          )
                                                        : 'all'
                                                }
                                                onValueChange={(val) =>
                                                    updateFilters(
                                                        'system_id',
                                                        val === 'all'
                                                            ? ''
                                                            : val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="system_id"
                                                    className="h-8 text-xs"
                                                >
                                                    <SelectValue placeholder="All applications" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All applications
                                                    </SelectItem>
                                                    {systems.map((s) => (
                                                        <SelectItem
                                                            key={s.id}
                                                            value={String(s.id)}
                                                        >
                                                            {s.code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Footer: Reset */}
                                        <div className="flex items-center justify-between pt-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[11px]"
                                                onClick={() => {
                                                    handleResetFilters();
                                                    setFilterOpen(false);
                                                }}
                                                disabled={isFiltering}
                                            >
                                                <RefreshCcw className="mr-1 h-3 w-3" />
                                                Reset
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                    </div>

                    <div className="overflow-hidden rounded-lg border-2 bg-card p-4 shadow-md">
                        {/* TABEL */}
                        <DataTable
                            columns={columns}
                            data={tickets.data}
                            rightToolbarContent={
                                canCreate && (
                                    <TicketDialog
                                        mode="create"
                                        systems={systems}
                                        canManagePriority={canManagePriority}
                                        canAssign={canAssign}
                                        canManageStatus={canManageStatus}
                                        assignees={assignees}
                                    />
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}