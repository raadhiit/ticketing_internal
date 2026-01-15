import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import type { PaginationMeta } from './types/table';

type Props = {
    pagination: PaginationMeta;
    paginationRoute?: string;
};

export function DataTablePagination({
    pagination,
    paginationRoute = 'tickets.index',
}: Props) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="text-xs">
                Page {pagination.current_page} of {pagination.last_page}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === 1}
                    onClick={() =>
                        router.get(
                            route(paginationRoute),
                            { page: 1 },
                            { preserveState: true, preserveScroll: true },
                        )
                    }
                >
                    First
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === 1}
                    onClick={() =>
                        router.get(
                            route(paginationRoute),
                            { page: pagination.current_page - 1 },
                            { preserveState: true, preserveScroll: true },
                        )
                    }
                >
                    Prev
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() =>
                        router.get(
                            route(paginationRoute),
                            { page: pagination.current_page + 1 },
                            { preserveState: true, preserveScroll: true },
                        )
                    }
                >
                    Next
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() =>
                        router.get(
                            route(paginationRoute),
                            { page: pagination.last_page },
                            { preserveState: true, preserveScroll: true },
                        )
                    }
                >
                    Last
                </Button>
            </div>
        </div>
    );
}
