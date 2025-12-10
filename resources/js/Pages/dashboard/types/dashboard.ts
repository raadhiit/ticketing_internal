import type {
  TicketStatus,
  TicketPriority,
} from '@/Pages/tickets/types/ticketTypes';
import type { PageProps } from '@/types';

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
export type Paginator<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export type DashboardProps = PageProps<{
    summaryCards: any[];
    ticketHistory: Paginator<TicketRow>;
}>;

