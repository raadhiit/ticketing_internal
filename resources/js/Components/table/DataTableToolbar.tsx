import { Input } from '@/Components/ui/input';
import type { Table } from '@tanstack/react-table';

type Props<Tdata> = {
    table: Table<Tdata>;
    filterKey?: string;
    filterPlaceholder?: string;
    rightToolbarContent?: React.ReactNode;
    statusFilterKey?: string;
};

export function DataTableToolbar<Tdata>({
    table,
    filterKey,
    filterPlaceholder,
    rightToolbarContent,
    statusFilterKey,
}: Props<Tdata>) {
    const filterColumn = filterKey ? table.getColumn(filterKey) : undefined;
    const statusColumn = statusFilterKey
        ? table.getColumn(statusFilterKey)
        : undefined;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
                {filterColumn && (
                    <Input
                        placeholder={
                            filterPlaceholder ?? `Search ${filterKey}...`
                        }
                        value={(filterColumn.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            filterColumn.setFilterValue(e.target.value)
                        }
                        className="max-2-xs border border-neutral-300 dark:border-neutral-700"
                    />
                )}

                {statusColumn && (
                    <label className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded accent-neutral-700 dark:accent-neutral-300"
                            checked={statusColumn.getFilterValue() === false}
                            onChange={(e) =>
                                statusColumn.setFilterValue(
                                    e.target.checked ? false : undefined,
                                )
                            }
                        />
                        <span>Non aktif</span>
                    </label>
                )}
            </div>

            {rightToolbarContent}
        </div>
    );
}
