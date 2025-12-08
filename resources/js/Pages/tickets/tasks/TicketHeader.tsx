import React from 'react';
import type { TicketDto } from '@/Pages/tickets/types/tasksTypes';

type Props = {
    ticket: TicketDto;
};

export const TicketHeader: React.FC<Props> = ({ ticket }) => {
    return (
        <div className="rounded-lg border bg-card/80 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                {/* Kiri: kode, title, deskripsi */}
                <div className="space-y-1">
                    <div className="text-[11px] text-muted-foreground">
                        Ticket #{ticket.code}
                    </div>
                    <h1 className="text-lg font-semibold leading-tight text-foreground">
                        {ticket.title}
                    </h1>

                    {ticket.description && (
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                            {ticket.description}
                        </p>
                    )}
                </div>

                {/* Kanan: meta info */}
                <div className="mt-2 flex flex-col items-start gap-1 text-[11px] md:mt-0 md:items-end">
                    <div className="flex flex-wrap gap-1">
                        {/* Status chip */}
                        <span className="inline-flex items-center rounded-full bg-muted dark:bg-muted/80 px-2 py-[2px] text-[10px] font-medium text-slate-200 dark:text-slate-100">
                            <span className="bg-pastel-sky dark:bg-pastel-sky/80 mr-1 h-1.5 w-1.5 rounded-full" />
                            {ticket.status}
                        </span>

                        {/* Priority chip */}
                        <span className="inline-flex items-center rounded-full bg-destructive/10 dark:bg-destructive/50 px-2 py-[2px] text-[10px] font-medium text-destructive dark:text-rose-500">
                            Priority: {ticket.priority}
                        </span>
                    </div>

                    {ticket.assignedTo && (
                        <div className="text-[11px] text-muted-foreground">
                            Assigned to{' '}
                            <span className="font-semibold text-foreground">
                                {ticket.assignedTo.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
