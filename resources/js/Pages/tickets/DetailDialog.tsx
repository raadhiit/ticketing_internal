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

            <DialogContent className="max-w-base lg:max-w-xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex flex-col items-start">
                        <span className="font-bold text-xl truncate">
                            {ticket.title}
                        </span>
                        {ticket.code && (
                            <span className="font-mono text-[12px] text-muted-foreground">
                                {ticket.code}
                            </span>
                        )}
                    </DialogTitle>

                    <DialogDescription asChild>
                        <div className="flex flex-wrap items-center gap-2">
                            {ticket.system_code && (
                                <Badge
                                    variant="secondary"
                                    className="text-[10px]"
                                >
                                    {ticket.system_code}
                                </Badge>
                            )}
                            <Badge variant="secondary" className="text-[10px]">
                                {ticket.category.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                                Priority: {ticket.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                                Status: {ticket.status.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogDescription>

                    <div className="items-center mt-3">
                        <TicketMilestone status={ticket.status} />
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* <div className="gap-4 grid md:grid-cols-2 text-muted-background text-xs">
                        <div className="space-y-1">
                            <Label className="text-md uppercase tracking-wide">
                                Created By
                            </Label>
                            <p>{ticket.created_by_name ?? '-'}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-md uppercase tracking-wide">
                                Assigned To
                            </Label>
                            <p>{ticket.assigned_to_name ?? 'Unassigned'}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-md uppercase tracking-wide">
                                Created At
                            </Label>
                            <p>{ticket.created_at ?? '-'}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-md uppercase tracking-wide">
                                Due Date
                            </Label>
                            <p>{ticket.due_date ?? '-'}</p>
                        </div>
                    </div> */}

                    <div className="gap-x-8 gap-y-4 grid md:grid-cols-2 text-xs text-center">
                        {/* Created By */}
                        <div className="space-y-0.5">
                            <Label className="font-medium text-[10px] text-muted-foreground tracking-wide">
                                CREATED BY
                            </Label>
                            <p className="text-foreground">
                                {ticket.created_by_name ?? '-'}
                            </p>
                        </div>

                        {/* Assigned To */}
                        <div className="space-y-0.5">
                            <Label className="font-medium text-[10px] text-muted-foreground tracking-wide">
                                ASSIGNED TO
                            </Label>
                            <p className="text-foreground">
                                {ticket.assigned_to_name ?? 'Unassigned'}
                            </p>
                        </div>

                        {/* Created At */}
                        <div className="space-y-0.5">
                            <Label className="font-medium text-[10px] text-muted-foreground tracking-wide">
                                CREATED AT
                            </Label>
                            <p className="text-foreground">
                                {ticket.created_at ?? '-'}
                            </p>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-0.5">
                            <Label className="font-medium text-[10px] text-muted-foreground tracking-wide">
                                DUE DATE
                            </Label>
                            <p className="text-foreground">
                                {ticket.due_date ?? '-'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="bg-muted/20 p-3 border rounded-md text-sm whitespace-pre-wrap">
                            {ticket.description &&
                            ticket.description.trim() !== ''
                                ? ticket.description
                                : 'No description.'}
                        </div>
                    </div>
                    
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wide">
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
            </DialogContent>
        </Dialog>
    );
}
