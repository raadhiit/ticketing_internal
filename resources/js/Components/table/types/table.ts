import { ColumnDef } from "@tanstack/react-table";

export type PaginationMeta = {
    current_page: number;
    last_page: number;
}

export type DataTableProps<Tdata, Tvalue> = {
    columns: ColumnDef<Tdata, Tvalue>[];
    data: Tdata[];
    filterKey?: string;
    filterPlaceholder?: string;
    rightToolbarContent?: React.ReactNode;
    emptyMessage?: string;
    statusFilterKey?: string;
    pagination: PaginationMeta
}