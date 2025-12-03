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
    roles: Role[];
}>;

export type UserRow = {
    id: number;
    name: string;
    email: string;
    department: string;
    department_id: number;
    is_active: boolean;
    roles: string;
    created_at: string;
};

export type UserForEdit = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    department_id: number | null;
    roles: string;
};

export type UserFormDialogProps = {
    mode: 'create' | 'edit';
    user?: UserForEdit; // wajib kalau mode = "edit"
    departments: Department[];
    roles: Role[];
    trigger?: ReactNode;
};

