import { ColumnDef } from "@tanstack/react-table";
import type { TicketRow } from "./types/dashboard";
import { StatusText } from "./StatusText";
import PriorityBadge from './PriorityBadge';

export const columns: ColumnDef<TicketRow>[] = [
    {
        accessorKey: 'code',
        header: 'Ticket Code',
        cell: (info) => (
            <span className="md:text-md text-xs">
                {info.getValue() as string}
            </span>
        ),
        size: 120,
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => (
            <div className="md:text-md truncate text-xs">
                {info.getValue() as string}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusText status={info.getValue() as any} />,
        size: 110,
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
            <span className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </span>
        ),
        size: 120,
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => <PriorityBadge priority={info.getValue() as any} />,
        size: 140
    },
    {
        accessorKey: 'createdAt',
        header: 'created At',
        cell: (info) => (
            <span className="md:text-md text-xs text-muted-foreground">
                {info.getValue() as string}
            </span>
        ),
    },
];