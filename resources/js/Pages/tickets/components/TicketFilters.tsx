import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Funnel, Loader2, RefreshCcw } from 'lucide-react';
import type {
    TicketCategory,
    TicketFilters,
    TicketPriority,
    TicketStatus,
} from '../types/ticketTypes';

type Props = {
    filters: TicketFilters;
    onCodeChange: (value: string) => void;
    onFilterChange: <K extends keyof TicketFilters>(
        field: K,
        value: TicketFilters[K],
    ) => void;
    onReset: () => void;
    isFiltering: boolean;

    systems: { id: number; code: string }[];
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
};

export function TicketFilters({
    filters,
    onCodeChange,
    onFilterChange,
    onReset,
    isFiltering,
    systems,
    statuses,
    priorities,
    categories,
}: Props) {
    return (
        <div className="mb-5 rounded-lg border-2 bg-card p-4 shadow-md">
            <Label
                htmlFor="code"
                className="text-base font-medium text-muted-foreground"
            >
                Ticket Code
            </Label>

            <div className="mt-2 flex items-center gap-2">
                <Input
                    id="code"
                    className="h-9 text-sm"
                    placeholder="Search by ticket code..."
                    value={filters.code ?? ''}
                    onChange={(e) => onCodeChange(e.target.value)}
                />

                {isFiltering && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Funnel className="h-4 w-4" />
                            Filters
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="end"
                        className="w-72 space-y-3 text-xs"
                    >
                        {/* Status */}
                        <Select
                            value={filters.status ?? 'all'}
                            onValueChange={(v) =>
                                onFilterChange(
                                    'status',
                                    v === 'all'
                                        ? undefined
                                        : (v as TicketStatus),
                                )
                            }
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All statuses
                                </SelectItem>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Priority */}
                        <Select
                            value={filters.priority ?? 'all'}
                            onValueChange={(v) =>
                                onFilterChange(
                                    'priority',
                                    v === 'all'
                                        ? undefined
                                        : (v as TicketPriority),
                                )
                            }
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All priorities
                                </SelectItem>
                                {priorities.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {p.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Category */}
                        <Select
                            value={filters.category ?? 'all'}
                            onValueChange={(v) =>
                                onFilterChange(
                                    'category',
                                    v === 'all'
                                        ? undefined
                                        : (v as TicketCategory),
                                )
                            }
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All categories
                                </SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* System */}
                        <Select
                            value={
                                filters.system_id !== undefined
                                    ? String(filters.system_id)
                                    : 'all'
                            }
                            onValueChange={(v) =>
                                onFilterChange(
                                    'system_id',
                                    v === 'all' ? undefined : Number(v),
                                )
                            }
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Application" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All applications
                                </SelectItem>
                                {systems.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={onReset}
                            disabled={isFiltering}
                        >
                            <RefreshCcw className="mr-1 h-3 w-3" />
                            Reset
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
