import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { columns } from './column';
import { DataTable } from '@/Components/table/DataTable'
import { SystemDialog } from './SystemDialog';
import { SystemProps } from './types/systemTypes';

export default function SysPage() {
    const { systems, canManageSystems } = usePage<SystemProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">System</h2>
            }
        >
            <Head title="System" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg border-2 bg-card shadow-md">
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={systems.data}
                                filterKey="name"
                                filterPlaceholder="Cari nama system"
                                rightToolbarContent={
                                    canManageSystems && (
                                        <SystemDialog mode="create" />
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}