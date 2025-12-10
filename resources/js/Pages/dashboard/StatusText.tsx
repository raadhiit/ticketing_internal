import type { TicketRow } from "./types/dashboard";

export function StatusText({ status }: { status: TicketRow['status'] }) {
    if (status === 'open') {
        return (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Resolved
            </span>
        );
    }

    if (status === 'in_progress') {
        return (
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                In Progress
            </span>
        );
    }

    if (status === 'resolved') {
        return (
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                Closed
            </span>
        );
    }

    return (
        <span className="text-sm font-medium text-muted-foreground">
            Backlog
        </span>
    );
}
