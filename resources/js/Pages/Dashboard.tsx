import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    TicketIcon,
    FilterIcon,
    PlusIcon,
    SearchIcon,
} from 'lucide-react';

type SummaryCard = {
    id: string;
    label: string;
    value: number | string;
    description: string;
    accentClass: string;
};

type TicketRow = {
    code: string;
    subject: string;
    status: 'Backlog' | 'In Progress' | 'Resolved' | 'Closed';
    category: string;
    application: string;
    priority: 'Low' | 'Medium' | 'High';
    createdAt: string;
};

const SUMMARY_CARDS: SummaryCard[] = [
    {
        id: 'active',
        label: 'Active Tickets',
        value: 4,
        description: 'Tickets currently open',
        accentClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        id: 'pending',
        label: 'Pending Tickets',
        value: 2,
        description: 'Tickets in progress',
        accentClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
        id: 'completed',
        label: 'Completed Tickets',
        value: 2,
        description: 'Tickets resolved',
        accentClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        id: 'Closed',
        label: 'Closed Tickets',
        value: 0,
        description: 'Tickets Closed',
        accentClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
];

const TICKETS: TicketRow[] = [
    {
        code: 'otMzJWnz',
        subject: 'Laporan Pendapatan RI (Rawat Inap) dan RJ (Rawat Jalan)',
        status: 'Backlog',
        category: 'Report Request',
        application: 'SIMRS',
        priority: 'High',
        createdAt: 'Dec 02, 2025',
    },
    {
        code: '7gmmfdL6',
        subject: 'Surat Kontrol Online',
        status: 'Backlog',
        category: 'Feature Request',
        application: 'SIMRS',
        priority: 'Medium',
        createdAt: 'Aug 25, 2025',
    },
    {
        code: '8Ktt4Ptw',
        subject: 'Laporan Kunjungan Pasien',
        status: 'Resolved',
        category: 'Report Request',
        application: 'SIMRS',
        priority: 'Medium',
        createdAt: 'Aug 22, 2025',
    },
    {
        code: 'gtoH7B3I',
        subject: 'Surat Sakit',
        status: 'Resolved',
        category: 'Feature Request',
        application: 'EMR',
        priority: 'Medium',
        createdAt: 'Jul 18, 2025',
    },
];

function PriorityBadge({ priority }: { priority: TicketRow['priority'] }) {
    const base =
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border';

    if (priority === 'High') {
        return (
            <span className={`${base} border-rose-100 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300`}>
                High
            </span>
        );
    }

    if (priority === 'Medium') {
        return (
            <span className={`${base} border-amber-100 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300`}>
                Medium
            </span>
        );
    }

    return (
        <span className={`${base} border-emerald-100 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300`}>
            Low
        </span>
    );
}

function StatusText({ status }: { status: TicketRow['status'] }) {
    if (status === 'Resolved') {
        return (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Resolved
            </span>
        );
    }

    if (status === 'In Progress') {
        return (
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                In Progress
            </span>
        );
    }

    if (status === 'Closed') {
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

export default function Dashboard() {
    // nanti lu bisa ganti dummy data ini jadi props dari Inertia
    const summaryCards = SUMMARY_CARDS;
    const tickets = TICKETS;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* SUMMARY CARDS */}
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <article
                                key={card.id}
                                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {card.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-foreground">
                                        {card.value} Tickets
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                </div>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accentClass}`}
                                >
                                    <TicketIcon className="h-6 w-6" />
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* TICKET HISTORY */}
                    <section className="rounded-2xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Ticket History
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Latest tickets from your internal system
                                </p>
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Create Ticket
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
                            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-primary">
                                <SearchIcon className="h-4 w-4 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                            >
                                <FilterIcon className="h-4 w-4" />
                                Filters
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-t border-border text-left text-sm">
                                <thead className="bg-accent/60">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        <th className="px-6 py-3">Ticket Code</th>
                                        <th className="px-6 py-3">Subject</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Application</th>
                                        <th className="px-6 py-3">Priority</th>
                                        <th className="px-6 py-3 text-right">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket.code}
                                            className="transition hover:bg-accent/40"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                                                {ticket.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">
                                                {ticket.subject}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusText status={ticket.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {ticket.category}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {ticket.application}
                                            </td>
                                            <td className="px-6 py-4">
                                                <PriorityBadge priority={ticket.priority} />
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                                                {ticket.createdAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer – pagination dummy */}
                        <div className="flex items-center justify-between border-t border-border px-6 py-4 text-xs text-muted-foreground">
                            <div>Rows per page: 10</div>
                            <div className="flex items-center gap-3">
                                <button className="rounded-md px-2 py-1 hover:bg-accent">
                                    Previous
                                </button>
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
                                    1
                                </span>
                                <button className="rounded-md px-2 py-1 hover:bg-accent">
                                    Next
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
