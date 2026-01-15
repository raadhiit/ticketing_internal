import type { TicketRow } from "../types/dashboard";

export function StatusText({ status }: { status: TicketRow['status'] }) {
    if (status === 'open') {
        return (
            <span className="text-xs font-medium text-sky-800 dark:text-sky-400">
                Open
            </span>
        );
    }

    if (status === 'in_progress') {
        return (
            <span className="text-xs font-medium text-amber-800 dark:text-amber-400">
                In Progress
            </span>
        );
    }

    if (status === 'resolved') {
        return (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Resolved
            </span>
        );
    }

    return (
        <span className="text-xs font-medium text-muted-foreground">
            Backlog
        </span>
    );
}
