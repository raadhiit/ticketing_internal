import { DataTable } from '@/Components/table/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { columns } from '../tickets/components/column';
import { TicketDialog } from '../tickets/components/TicketDialog';
import { TicketFilters } from '../tickets/components/TicketFilters';
import type { TicketsProps } from './types/ticketTypes';
import { useTicketFilters } from '../tickets/hooks/useTicketFilters';

export default function TicketPage() {
    const {
        tickets,
        systems,
        filters: serverFilters,
        statuses,
        priorities,
        categories,
        canCreate,
        ...dialogProps
    } = usePage<TicketsProps>().props;

    const { filters, setFilters, applyFilter, resetFilters, isFiltering } =
        useTicketFilters(serverFilters);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Tickets</h2>}
        >
            <Head title="Tickets" />

            <div className="space-y-4 py-4">
                <div className="lg:max-w-8xl mx-auto sm:px-6 lg:px-4">
                    {/* FILTER CARD */}
                    <div className="overflow-hidden rounded-lg border-2 bg-card p-4 shadow-md">
                        <TicketFilters
                            filters={filters}
                            isFiltering={isFiltering}
                            systems={systems}
                            statuses={statuses}
                            priorities={priorities}
                            categories={categories}
                            onCodeChange={(v) =>
                                setFilters((f) => ({
                                    ...f,
                                    code: v || undefined,
                                }))
                            }
                            onFilterChange={applyFilter}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* TABLE CARD */}
                    <div className="mt-4 overflow-hidden rounded-lg border-2 bg-card p-4 shadow-md">
                        <DataTable
                            columns={columns}
                            data={tickets.data}
                            pagination={{
                                current_page: tickets.current_page,
                                last_page: tickets.last_page,
                            }}
                            rightToolbarContent={
                                canCreate && (
                                    <TicketDialog
                                        mode="create"
                                        systems={systems}
                                        {...dialogProps}
                                    />
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
