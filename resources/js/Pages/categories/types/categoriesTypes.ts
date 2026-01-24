import { PageProps } from "@/types";
import { ReactNode } from "react";

export type CategoriesRow = {
    id: number;
    key: string;
    name: string;
    code_prefix: string;
    is_active: boolean;
    created_at: string;
}

export type CategoriesProps = PageProps<{
    categories: {
        data: CategoriesRow[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }
    canManageCategories: boolean;
}>

export type CategoriesEdit = {
    id: number;
    key: string;
    name: string;
    code_prefix: string;
    is_active: boolean;
}

export type CategoriesForm = {
    mode: 'create' | 'edit';
    categories?: CategoriesEdit;
    trigger?: ReactNode;
}
