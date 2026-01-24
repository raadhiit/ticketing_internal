'use client';

import { useForm } from "@inertiajs/react";
import { Pencil, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { BaseFormDialog } from "@/Components/dialog/BaseFormDialog";
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import type { CategoriesForm } from './types/categoriesTypes';


type BaseForm = {
    key: string;
    name: string;
    code_prefix: string;
    is_active: boolean;
};

export function CatFormDialog({
    mode, 
    categories,
    trigger
}: CategoriesForm) {
    const isEdit = mode === 'edit';
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, put, reset, errors } = useForm<BaseForm>({
        key: categories?.key ?? '',
        name: categories?.name ?? '',
        code_prefix: categories?.code_prefix ?? '',
        is_active: categories?.is_active ?? true,
    });

    const handleClose = () => {
        setOpen(false);
        reset( 'key','name', 'code_prefix');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // if (isEdit && categories) {
        //     put(route('categories.update', categories.id), {
        //         preserveScroll: true,
        //         onSuccess: () => handleClose(),
        //     })
        // } else {
        //     post(route('categories.store'), {
        //         preserveScroll: true,
        //         onSuccess: () => handleClose(),
        //     });
        // }
    }

    const title = isEdit ? 'Edit Category' : 'Create Category';
    const description = isEdit ? 'Edit Category' : 'Create Category';

    const defaultTrigger = isEdit ? (
        <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-2.5 border rounded-md text-xs"
        >
            <Pencil className="mr-2 h-4 w-4" /> Edit
        </button>
    ) : (
        <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-2.5 border rounded-md text-xs"
        >
            <Plus className="mr-2 h-4 w-4" /> Create
        </button>
    );

    return (
        <BaseFormDialog
            open={open}
            mode={mode}
            title={title}
            description={description}
            trigger={trigger ?? defaultTrigger}
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
            isSubmitting={false}
            submitLabelCreate="Simpan"
            submitLabelEdit="Simpan Perubahan"
        >
            <div className="space-y-1">
                <Label htmlFor="key" className="flex items-center gap-1">
                    Key
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="key"
                    type="text"
                    value={data.key}
                    onChange={(e) => setData('key', e.target.value)}
                    autoFocus
                    className="placeholder:text-muted placeholder:dark:text-muted"
                />
                {errors.key && (
                    <span className="text-xs text-red-500">{errors.key}</span>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="name" className="flex items-center gap-1">
                    Name
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    autoFocus
                    className="placeholder:text-muted placeholder:dark:text-muted"
                />
                {errors.name && (
                    <span className="text-xs text-red-500">{errors.name}</span>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="code_prefix" className="flex items-center gap-1">
                    Code Prefix
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="code_prefix"
                    type="text"
                    value={data.code_prefix}
                    onChange={(e) => setData('code_prefix', e.target.value)}
                    autoFocus
                    className="placeholder:text-muted placeholder:dark:text-muted"
                />
                {errors.code_prefix && (
                    <span className="text-xs text-red-500">{errors.code_prefix}</span>
                )}
            </div>

            <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="space-y-0 5">
                    <Label htmlFor="is_active">Status</Label>
                    <p className="text-xs text-muted-foreground">
                        Aktifkan atau nonaktifkan user.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(value) => setData('is_active', value)}
                    />
                    <span className="text-xs text-muted-foreground">
                        {data.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>
            </div>
        </BaseFormDialog>
    );
}