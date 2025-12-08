import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from '@/Components/table/DataTable';
import { columns } from './column';
import { TicketsProps, TicketFilters, TicketCategory, TicketPriority, TicketStatus } from './types/ticketTypes';
import { TicketDialog } from './TicketDialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/Components/ui/select';

export default function TicketPage() {
  const { tickets, systems, canManagePriority, canCreate, canAssign, assignees, canManageStatus, filters, categories, priorities, statuses } = usePage<TicketsProps>().props;
  const updateFilters = (Field: keyof TicketFilters, value: string) => {
    router.get(
        route('tickets.index'),
        {
            ...filters,
            [Field]: value || undefined,
            page: 1,
        },
        {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        }
    )
  }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilters('search', e.target.value);
    };


 return (
     <AuthenticatedLayout
         header={
             <h2 className="font-semibold text-xl leading-tight">Tickets</h2>
         }
     >
         <Head title="Tickets" />

         <div className="space-y-4 py-4">
             <div className="mx-auto sm:px-6 lg:px-4 lg:max-w-8xl">
                 <div className="bg-card shadow-md p-4 border-2 rounded-lg overflow-hidden">
                    {/* FILTER BAR */}
                    <div className="items-end gap-3 grid md:grid-cols-3 lg:grid-cols-4 pb-4">
                        {/* System */}
                        <div className="space-y-1">
                            <Label htmlFor="system_id">System</Label>
                            <Select
                                value={
                                    filters.system_id
                                        ? String(filters.system_id)
                                        : 'all'
                                }
                                onValueChange={(val) =>
                                    updateFilters(
                                        'system_id',
                                        val === 'all' ? '' : val,
                                    )
                                }
                            >
                                <SelectTrigger id="system_id" className="h-9">
                                    <SelectValue placeholder="All systems" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All systems</SelectItem>
                                    {systems.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={
                                    filters.category
                                        ? (filters.category as TicketCategory)
                                        : 'all'
                                }
                                onValueChange={(val) =>
                                    updateFilters('category', val === 'all' ? '' : val)
                                }
                            >
                                <SelectTrigger id="category" className="h-9">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={
                                    filters.priority
                                        ? (filters.priority as TicketPriority)
                                        : 'all'
                                }
                                onValueChange={(val) =>
                                    updateFilters('priority', val === 'all' ? '' : val)
                                }
                            >
                                <SelectTrigger id="priority" className="h-9">
                                    <SelectValue placeholder="All priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All priorities</SelectItem>
                                    {priorities.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={
                                    filters.status
                                        ? (filters.status as TicketStatus)
                                        : 'all'
                                }
                                onValueChange={(val) =>
                                    updateFilters('status', val === 'all' ? '' : val)
                                }
                            >
                                <SelectTrigger id="status" className="h-9">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s
                                                .replace('_', ' ')
                                                .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase(),
                                                )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <hr className='space-y-5 mb-5 border border-5' />

                    {/* TABEL */}
                    <DataTable
                        columns={columns}
                        data={tickets.data}
                        // filterKey={undefined} // ⬅️ matikan filter lokal
                        rightToolbarContent={
                            canCreate && (
                                <TicketDialog
                                    mode="create"
                                    systems={systems}
                                    canManagePriority={canManagePriority}
                                    canAssign={canAssign}
                                    canManageStatus={canManageStatus}
                                    assignees={assignees}
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