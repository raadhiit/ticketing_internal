import { PageProps } from "@/types";
import { ReactNode } from "react";

export type SystemRow = {
    id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
};

export type SystemForEdit = {
    id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
};

export type SystemProps = PageProps & {
    systems: {
        data: SystemRow[];
        links: any[];
    };
    canManageSystems: boolean;
};

export type SystemFormDialogProps = {
    mode: 'create' | 'edit';
    systems?: SystemRow;
    trigger?: ReactNode;
};