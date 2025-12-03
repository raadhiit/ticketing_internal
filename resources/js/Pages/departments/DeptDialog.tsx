'use client';

import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { BaseFormDialog } from '@/Components/dialog/BaseFormDialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import type { DeptFormDialogProps } from './types/DeptTypes';

type BaseForm = {
    name: string;
    is_active: boolean;
};

export function DeptFormDialog({
    mode,
    departments,
    trigger
}: DeptFormDialogProps) {
    const isEdit = mode === 'edit';
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, reset, errors } = useForm<BaseForm>({
        name: departments?.name ?? '',
        is_active: departments?.is_active ?? true,
    });

    const handleClose = () => {
        setOpen(false);
        reset('name');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit && departments) {
            put(route('departments.update', departments.id), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            })
        } else {
            post(route('departments.store'), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        }
    } 

    const title = isEdit ? 'Edit Department' : 'Create Department';
    const description = isEdit ? 'Ubah Data Department' : 'Buat Baru Data Department';

    const defaultTrigger = isEdit ? (
        <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium dark:bg-neutral-600 hover:dark:bg-neutral-500"
        >
            <Pencil className="h-3 w-3" />
            Edit
        </button>
    ) : (
        <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:opacity-90"
        >
            <Plus className="h-3 w-3" />
            Tambah
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
                <Label htmlFor="name" className="flex items-center gap-1">
                    Nama
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
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="space-y-0.5">
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
                        {data.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </BaseFormDialog>
    );


}