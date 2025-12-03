// resources/js/Pages/Tickets/components/TicketStatusBadge.tsx

import { cn } from "@/lib/utils";

type Status = 'open' | 'in_progress' | 'resolved' | 'closed';

const labelMap: Record<Status, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};

const classMap: Record<Status, string> = {
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    in_progress:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    resolved:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    closed: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
};

export function TicketStatusBadge({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] md:text-xs',
                classMap[status],
            )}
        >
            {labelMap[status]}
        </span>
    );
}
