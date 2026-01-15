import type {
  TicketStatus,
  TicketPriority,
} from '@/Pages/tickets/types/ticketTypes';
import type { PageProps } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

export type SummaryCard = {
    id: 'active' | 'pending' | 'resolved' | 'closed';
    label: string;
    value: number | string;
    description: string;
};

export type TicketRow = {
    code: string;
    title: string;
    status: TicketStatus;
    category: string;
    system: string | null;
    priority: TicketPriority;
    createdAt: string;
};

// ⬇️ INI YANG BENER
export type LaravelPaginator<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type DashboardProps = PageProps<{
    summaryCards: any[];
    ticketHistory: LaravelPaginator<TicketRow>;
    filters: {
        q?: string;
        date_from: string;
        date_to: string;
    };
}>;

export type Link = {
    url: string | null;
    label: string;
    active: boolean;
}

export type Paginator = {
    from: number | null;
    to: number | null;
    total: number;
    currentPage: number;
    lastPage: number;
}

export type Filters = {
    q?: string;
    date_from: string;
    date_to: string;
}

export type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    links?: Link[];
    paginator?: Paginator;
    className?: string;
    searchPlaceholder?: string;
    initialQ?: string;
    initialDateFrom?: string | null;
    initialDateTo?: string | null;
}
