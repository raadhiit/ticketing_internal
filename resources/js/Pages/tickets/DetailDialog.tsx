'use client';

import { Badge } from '@/Components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Eye } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { TicketMilestone } from './TicketMilestone';
import type { TicketDetail } from './types/ticketTypes';

type TicketDetailDialogProps = {
    ticket: TicketDetail;
    trigger?: ReactNode;
};

const PRIORITY_CLASS: Record<string, string> = {
    unassigned: 'bg-slate-700/40 text-slate-100',
    low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    high: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    urgent: 'bg-red-500/15 text-red-300 border-red-500/40',
};

const STATUS_CLASS: Record<string, string> = {
    open: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    in_progress: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    closed: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};


export function TicketDetailDialog({
    ticket,
    trigger,
}: TicketDetailDialogProps) {
    const [open, setOpen] = useState(false);

    const defaultTrigger = (
        <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-2.5 border rounded-md text-xs"
        >
            <Eye className="w-3 h-3 text-black dark:text-white" />
        </button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

            <DialogContent className="max-w-2xl border bg-card/95">
                <DialogHeader className="space-y-4">
                    {/* TOP ROW: title + meta penting */}
                    <div className="flex items-start justify-between gap-4">
                        {/* Kiri: title + code + system/category */}
                        <div className="space-y-1">
                            <DialogTitle className="text-lg font-semibold leading-tight">
                                <span className="block truncate">
                                    {ticket.title}
                                </span>
                            </DialogTitle>

                            {ticket.code && (
                                <span className="font-mono text-[11px] text-muted-foreground">
                                    {ticket.code}
                                </span>
                            )}

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                                {ticket.system_code && (
                                    <Badge
                                        variant="outline"
                                        className="border-muted-foreground/20 bg-muted/10 px-2 py-0 font-mono"
                                    >
                                        {ticket.system_code}
                                    </Badge>
                                )}

                                <Badge
                                    variant="secondary"
                                    className="px-2 py-0 text-[11px] uppercase"
                                >
                                    {ticket.category}
                                </Badge>
                            </div>
                        </div>

                        {/* Kanan: Status + Priority */}
                        <div className="flex flex-col items-end gap-2 text-[11px]">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <Badge
                                    variant="outline"
                                    className={`px-2 py-0 text-[11px] uppercase ${STATUS_CLASS[ticket.status] ?? ''} `}
                                >
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Priority
                                </span>
                                <Badge
                                    variant="outline"
                                    className={`px-2 py-0 text-[11px] uppercase ${PRIORITY_CLASS[ticket.priority] ?? ''} `}
                                >
                                    {ticket.priority}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Milestone */}
                    <div className="pt-2">
                        <TicketMilestone status={ticket.status} />
                    </div>
                </DialogHeader>

                {/* BODY */}
                <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                    {/* KIRI: description + attachments */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-medium tracking-wide text-muted-foreground">
                                DESCRIPTION
                            </Label>
                            <div className="whitespace-pre-wrap rounded-md border bg-muted/10 p-3 text-sm">
                                {ticket.description &&
                                ticket.description.trim() !== ''
                                    ? ticket.description
                                    : 'No description.'}
                            </div>
                        </div>

                        {ticket.attachments &&
                            ticket.attachments.length > 0 && (
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                        Attachments
                                    </Label>
                                    <ul className="space-y-1 text-xs">
                                        {ticket.attachments.map((att) => (
                                            <li key={att.id}>
                                                <a
                                                    href={att.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {att.original_name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </div>

                    {/* KANAN: info meta */}
                    <div className="space-y-3 rounded-md border border-dashed border-border/60 bg-muted/5 p-3 text-xs">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="space-y-0.5">
                                <Label className="text-[10px] font-medium tracking-wide text-muted-foreground">
                                    CREATED BY
                                </Label>
                                <p className="truncate text-foreground">
                                    {ticket.created_by_name ?? '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <Label className="text-[10px] font-medium tracking-wide text-muted-foreground">
                                    DEPARTMENT
                                </Label>
                                <p className="truncate text-foreground">
                                    {ticket.department ?? '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <Label className="text-[10px] font-medium tracking-wide text-muted-foreground">
                                    ASSIGNED TO
                                </Label>
                                <p className="truncate text-foreground">
                                    {ticket.assigned_to_name ?? 'Unassigned'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <Label className="text-[10px] font-medium tracking-wide text-muted-foreground">
                                    CREATED AT
                                </Label>
                                <p className="truncate text-foreground whitespace-normal">
                                    {ticket.created_at ?? '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
