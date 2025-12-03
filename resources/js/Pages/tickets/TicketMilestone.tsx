'use client';

import { cn } from '@/lib/utils';
import type { TicketStatus } from './types/ticketTypes';

const STATUS_ORDER: TicketStatus[] = [
    'open',
    'in_progress',
    'resolved',
    'closed',
];

const STATUS_LABEL: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};

type TicketStatusMilestoneProps = {
    status: TicketStatus;
};

export function TicketMilestone({ status }: TicketStatusMilestoneProps) {
    const currentIndex = STATUS_ORDER.indexOf(status);

    return (
        <div className="flex flex-col gap-2">
            {/* baris atas: stepper */}
            <div className="flex items-center">
                {STATUS_ORDER.map((s, index) => {
                    const isDone = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div
                            key={s}
                            className="flex flex-col flex-1 items-center gap-1"
                        >
                            {/* line kiri + circle + line kanan, SELALU tiga elemen */}
                            <div className="flex items-center w-full">
                                {/* line kiri (transparan di step pertama) */}
                                {/* <div
                                    className={cn(
                                        'flex-1 rounded-full h-[2px]',
                                        index === 0
                                            ? 'bg-transparent'
                                            : index <= currentIndex
                                              ? 'bg-primary'
                                              : 'bg-muted-foreground/30',
                                    )}
                                /> */}
                                <div
                                className={cn(
                                    'flex-1 rounded-full h-[2px]',
                                    index === 0
                                    ? 'bg-transparent'
                                    : index <= currentIndex
                                        ? 'bg-primary/60 dark:bg-primary dark:h-[3px]' // progress: lebih terang & sedikit lebih tebal di dark
                                        : 'bg-muted-foreground/20 dark:bg-muted-foreground/40'
                                )}
                                />

                                {/* circle */}
                                <div
                                    className={cn(
                                        'flex justify-center items-center border rounded-full w-7 h-7 font-medium text-[11px]',
                                        isDone &&
                                            'border-primary bg-primary text-primary-foreground',
                                        isCurrent &&
                                            !isDone &&
                                            'border-primary bg-primary/10 text-primary',
                                        !isDone &&
                                            !isCurrent &&
                                            'border-muted-foreground/30 bg-background text-muted-foreground',
                                    )}
                                >
                                    {index + 1}
                                </div>

                                {/* line kanan (transparan di step terakhir) */}
                                {/* <div
                                    className={cn(
                                        'flex-1 rounded-full h-[2px]',
                                        index === STATUS_ORDER.length - 1
                                            ? 'bg-transparent'
                                            : index < currentIndex
                                              ? 'bg-primary'
                                              : 'bg-muted-foreground/30',
                                    )}
                                /> */}
                                <div
                                className={cn(
                                    'flex-1 rounded-full h-[2px]',
                                    index === STATUS_ORDER.length - 1
                                    ? 'bg-transparent'
                                    : index < currentIndex
                                        ? 'bg-primary/60 dark:bg-primary dark:h-[3px]' // progress
                                        : 'bg-muted-foreground/20 dark:bg-muted-foreground/40'
                                )}
                                />
                            </div>

                            {/* label tepat di bawah circle */}
                            <span className="text-[10px] text-muted-foreground">
                                {STATUS_LABEL[s]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
