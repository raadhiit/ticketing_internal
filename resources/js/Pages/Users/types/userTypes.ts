import type { PageProps } from '@/types';
import { ReactNode } from 'react';

export type Department = {
    id: number;
    name: string;
};

export type Role = {
    id: number;
    name: string;
}

export type UsersPageProps = PageProps<{
    users: {
        data: UserRow[];
        links: any[];
    };
    departments: Department[];
    role: Role[];
    canManageUsers: boolean;
}>;

export type UserRow = {
    id: number;
    name: string;
    email: string;
    department: string;
    department_id: number;
    is_active: boolean;
    role: string;
    created_at: string;
};

export type UserForEdit = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    department_id: number | null;
    role: string;
};

export type UserFormDialogProps = {
    mode: 'create' | 'edit';
    user?: UserForEdit; // wajib kalau mode = "edit"
    departments: Department[];
    role: Role[];
    trigger?: ReactNode;
};

