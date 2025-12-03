'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TicketRow, TicketsProps, TicketForEdit, TicketDetail } from './types/ticketTypes';
import { TicketPriorityBadge } from '@/Components/badge/PriorityBadge';
import { TicketStatusBadge } from '@/Components/badge/StatusBadge';
import { TicketCategoryBadge } from '@/Components/badge/CategoryBadge';
import { ConfirmDeleteDialog } from '@/Components/ConfirmDelete';
import { router, Link, usePage } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { TicketDialog } from './TicketDialog';
import { TicketMilestone } from './TicketMilestone';
import { TicketDetailDialog } from './DetailDialog';
import { Value } from '@radix-ui/react-select';

const formatData = (value?: string | null) => {
    if(!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

}

export const columns: ColumnDef<TicketRow>[] = [
    
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
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => {
            const ticket = row.original;

            return (
                <span
                    className="font-semibold text-blue-600 dark:text-blue-400 text-xs md:text-sm"
                >
                    {ticket.code}
                </span>
            );
        },
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const ticket = row.original;

            return (
                <div className="flex flex-col text-left">
                    <span className="font-medium text-xs md:text-sm line-clamp-1">
                        {ticket.title}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'system_code',
        header: 'System',
        cell: ({ row }) => (
            <span className="text-[11px] text-muted-foreground md:text-xs">
                {row.original.system_code}
            </span>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
            <div className="flex justify-center">
                <TicketCategoryBadge category={row.original.category} />
            </div>
        ),
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => {
            const ticket = row.original;
            const { canManagePriority } = usePage<any>().props; // sesuaikan tipe

            // Hanya admin/PM yang boleh ubah priority
            if (!canManagePriority) {
                return (
                    <div className="flex justify-center">
                        <TicketPriorityBadge priority={ticket.priority} />
                    </div>
                );
            }

            // versi interaktif: dropdown ganti priority (nanti tinggal wiring ke route)
            return (
                <div className="flex justify-center">
                    <TicketPriorityBadge priority={ticket.priority} />
                    {/* nanti bisa tambahin dropdown/context menu buat ubah */}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <div className="flex justify-center">
                <TicketStatusBadge status={row.original.status} />
            </div>
        ),
    },
    {
        id: 'assigned_to', // id column bebas, nggak harus sama dengan field
        header: 'Assigned To',
        cell: ({ row }) => {
            const ticket = row.original as TicketRow;
            return (
            <span className="text-[11px] text-muted-foreground md:text-xs">
                {ticket.assignedTo?.name ?? 'Unassigned'}
            </span>
            );
        },
    },
    {
        accessorKey: 'due_date',
        header: 'Due Date',
        cell: ({ row }) => {
            const value = row.original.due_date;
            return (
                <span className="text-[11px] text-muted-foreground md:text-xs">
                    {formatData(value)}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const ticket = row.original;
            const {
                systems,
                canManagePriority,
                canManageStatus,
                canAssign,
                assignees,
            } = usePage<TicketsProps>().props;

            const ticketForEdit: TicketForEdit = {
                id: ticket.id,
                system_id: ticket.system_id,
                title: ticket.title,
                description: ticket.description,
                category: ticket.category,
                priority: ticket.priority,
                status: ticket.status,
                due_date: ticket.due_date,
                assigned_to: ticket.assigned_to,
                attachments: ticket.attachments,
            };

            const detailTicket: TicketDetail = {
                id: ticket.id,
                code: ticket.code,
                title: ticket.title,
                description: ticket.description,
                category: ticket.category,
                priority: ticket.priority,
                status: ticket.status,
                due_date: ticket.due_date ?? null,
                system_code: ticket.system_code,
                created_by_name: ticket.createdBy?.name,
                assigned_to_name: ticket.assignedTo?.name ?? null,
                created_at: ticket.created_at,
                attachments: ticket.attachments,
            };

            const handleDelete = () => {
                router.delete(route('tickets.destroy', ticket.id), {
                    preserveScroll: true,
                });
            };

            return (
                <div className="flex justify-center items-center gap-2">
                    <TicketDetailDialog ticket={detailTicket} />
                    <TicketDialog
                        mode="edit"
                        systems={systems}
                        ticket={ticketForEdit}
                        canManagePriority={canManagePriority}
                        canManageStatus={canManageStatus}
                        canAssign={canAssign}
                        assignees={assignees}
                    />
                    <ConfirmDeleteDialog
                        resourceName="ticket"
                        resourceLabel={`${ticket.code} - ${ticket.title}`}
                        onConfirm={handleDelete}
                    />
                </div>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
    },
];