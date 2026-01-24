import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { columns } from './column';
import { CategoriesProps } from './types/categoriesTypes';
import { DataTable } from '@/Components/table/DataTable'
import { CatFormDialog } from '../categories/CatDialog';

export default function CategoriesPage() {
    const { categories, canManageCategories } = usePage<CategoriesProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Categories
                </h2>
            }
        >
            <Head title='Categories' />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="overflow-hidden rounded-lg border-2 bg-card shadow-md">
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={categories.data}
                                filterKey="name"
                                filterPlaceholder='Cari Nama Category'
                                pagination={{ 
                                    current_page: categories.current_page,
                                    last_page: categories.last_page
                                 }}
                                 rightToolbarContent={
                                    canManageCategories && (
                                        <CatFormDialog mode="create" />
                                    )
                                 }
                            >

                            </DataTable>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    )
}