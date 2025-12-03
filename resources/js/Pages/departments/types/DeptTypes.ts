import type { PageProps } from '@/types';
import { ReactNode } from 'react';

export type DepartmentsRow = {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
};

export type DepartmentsProps = PageProps<{
    departments: {
        data: DepartmentsRow[];
        links: any[];
    };
}>;

export type DeptForEdit = {
    id: number;
    name: string;
    is_active: boolean;
};

export type DeptFormDialogProps = {
    mode: 'create' | 'edit';
    departments?: DeptForEdit;
    trigger?: ReactNode;
};
