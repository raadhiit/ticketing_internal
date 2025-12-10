import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    TicketIcon,
} from 'lucide-react';
import { columns } from './column';
import type { DashboardProps, SummaryCard } from '@/Pages/dashboard/types/dashboard'; 
import  DataTable  from './DashboardTable';


const accentById: Record<SummaryCard['id'], string> = {
  active:   'bg-sky-100 dark:bg-sky-500/20',
  pending:  'bg-amber-100 dark:bg-amber-500/20',
  resolved: 'bg-emerald-100 dark:bg-emerald-500/20',
  closed:   'bg-rose-100 dark:bg-rose-500/20',  // ⬅️ closed: bg khusus
};

const iconById: Record<SummaryCard['id'], string> = {
  active:   'text-sky-600 dark:text-sky-300',
  pending:  'text-amber-600 dark:text-amber-300',
  resolved: 'text-emerald-600 dark:text-emerald-300',
  closed:   'text-rose-600 dark:text-rose-300',
};


export default function Dashboard() {
    const { summaryCards, ticketHistory } = usePage<DashboardProps>().props;
    
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
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* SUMMARY CARDS */}
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card: SummaryCard) => (
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
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentById[card.id]}`}
                                >
                                    <TicketIcon
                                        className={`h-6 w-6 ${iconById[card.id]}`}
                                    />
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* TICKET HISTORY */}
                    <section className="rounded-2xl border border-border bg-card shadow-sm">
                        {/* header omitted for brevity */}
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={columns}
                                data={ticketHistory.data}
                                links={ticketHistory.links}
                                meta={ticketHistory.meta}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
