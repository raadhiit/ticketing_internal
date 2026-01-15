import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { DashboardProps } from '@/Pages/dashboard/types/dashboard';
import { Head, usePage } from '@inertiajs/react';
import { columns } from './components/column';
import DataTable from './components/DashboardTable';
import SummaryGrid from './components/SummaryGrid';

export default function Dashboard() {
    const { summaryCards, ticketHistory, filters } =
        usePage<DashboardProps>().props;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <SummaryGrid cards={summaryCards} />

                    <section className="rounded-2xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={columns}
                                data={ticketHistory.data}
                                links={ticketHistory.links}
                                paginator={{
                                    from: ticketHistory.from,
                                    to: ticketHistory.to,
                                    total: ticketHistory.total,
                                    currentPage: ticketHistory.current_page,
                                    lastPage: ticketHistory.last_page,
                                }}
                                initialQ={filters?.q}
                                initialDateFrom={filters.date_from}
                                initialDateTo={filters.date_to}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
