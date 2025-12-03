import { PageProps } from "@/types";
import { ReactNode } from "react";

export type TicketRow = {
    id: number;
    code: string;
    title: string;
    description: string;
    system_code: string;
    system_id: number;
    category: 'bug' | 'feature' | 'improvement' | 'support';
    priority: 'unassigned' | 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    due_date: string;
    created_by: number;
    createdBy: { id: number; name: string };
    assigned_to: number | null;
    assignedTo?: { id: number; name: string } | null;
    attachments: TicketAttachmentRow[];
    created_at: string;
    updated_at: string;
};

export type TicketFilters = {
    system_id?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    search?: string;
    due_from?: string | null;
    due_to?: string | null;
};

export type TicketsProps = PageProps<{
    tickets: {
        data: TicketRow[];
        links: any[];
    };
    systems: SystemOption[];
    categories: TicketCategory[];
    priorities: TicketPriority[];
    statuses: TicketStatus[];
    canManagePriority: boolean;
    canManageStatus: boolean;
    canAssign: boolean;
    canCreate: boolean;
    assignees: AssginedOption[];
    filters: TicketFilters;
}>;

export type TicketAttachmentRow = {
    id: number;
    original_name: string;
    url: string;
};

export type TicketCategory = 'bug' | 'feature' | 'improvement' | 'support';
export type TicketPriority = 'unassigned' | 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type SystemOption = {
  id: number;
  code: string;
};

export type TicketDetail = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string | null;
  system_code?: string;
  created_by_name?: string;
  assigned_to_name?: string | null;
  created_at?: string;
  attachments?: TicketAttachmentRow[];
};

export type TicketForEdit = {
  id: number;
  system_id: number;
  title: string;
  description: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string | null; // format "YYYY-MM-DD" kalau mau pakai <input type="date" />
  assigned_to: number | null;
  attachments: TicketAttachmentRow[];
};

export type TicketFormDialogProps = {
  mode: 'create' | 'edit';
  systems: SystemOption[];
  ticket?: TicketForEdit; // wajib kalau mode = "edit"
  canManagePriority: boolean;
  canManageStatus: boolean;
  canAssign: boolean;
  assignees: AssginedOption[];
  trigger?: ReactNode;
};

export type TicketFormData = {
    system_id: number | '' | null;
    title: string;
    description: string;
    category: TicketCategory | '';
    priority: TicketPriority;
    status: TicketStatus;
    due_date: string | ''; // input date
    assigned_to: number | null;
    attachment: File | null;
    _method?: 'put' | 'patch';
};

export type AssginedOption = {
  id: number;
  name: string;
}