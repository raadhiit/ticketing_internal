import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Columns } from './Column';
import { UsersPageProps, UserRow } from './types/userTypes';
import { UserFormDialog } from './UserDialog';
import { DataTable } from '@/Components/table/DataTable'

export default function UserPage() {
    const { users, departments, roles } = usePage<UsersPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg bg-card shadow-md border-2">
                        <div className="p-4">
                            <DataTable<UserRow, unknown>
                                columns={Columns}
                                data={users.data}
                                filterKey="name" 
                                filterPlaceholder="Filter by Cari User"
                                rightToolbarContent={
                                    <UserFormDialog
                                        mode="create"
                                        departments={departments}
                                        roles={roles}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
