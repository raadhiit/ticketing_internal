import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { columns } from './Column';
import { DepartmentsProps } from './types/DeptTypes';
import { DataTable } from '@/Components/table/DataTable'
import { DeptFormDialog } from './DeptDialog';

export default function DeptPage() {
    const { departments, canManageDepartments } = usePage<DepartmentsProps>().props;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Department
                </h2>
            }
        >
            <Head title="Department" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg border-2 bg-card shadow-md">
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={departments.data}
                                filterKey="name"
                                filterPlaceholder="Cari nama department"
                                pagination={{
                                    current_page: departments.current_page,
                                    last_page: departments.last_page,
                                }}
                                rightToolbarContent={
                                    canManageDepartments && (
                                        <DeptFormDialog mode="create" />
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