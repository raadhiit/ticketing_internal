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
            <div className='py-6'>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg bg-card shadow-md border-2">
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={departments.data}
                                filterKey='name'
                                filterPlaceholder='Cari nama department'
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
    )
}