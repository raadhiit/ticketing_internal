'use client';

import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BaseFormDialog } from '@/Components/dialog/BaseFormDialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Textarea } from '@/Components/ui/textarea';
import type { SystemFormDialogProps } from './types/systemTypes';


type BaseFormSystem = {
    code: string;
    name: string;
    description: string;
    is_active: boolean;
};

export function SystemDialog({ mode, systems, trigger} : SystemFormDialogProps) {
    const isEdit = mode === 'edit';
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, reset, errors } = useForm<BaseFormSystem>({
        code: systems?.code ?? '',
        name: systems?.name ?? '',
        description: systems?.description ?? '',
        is_active: systems?.is_active ?? true,
    });

    const handleClose = () => {
        setOpen(false);
        reset('name', 'code', 'description');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if(isEdit && systems) {
            put(route('systems.update', systems.id), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            })
        } else {
            post(route('systems.store'), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        }
    }

    const title = isEdit ? 'Edit System' : 'Create System';
    const description = isEdit ? 'Ubah Data System' : 'Buat Baru Data System';

    const defaultTrigger = isEdit ? (
        <button
            type="button"
            className="inline-flex items-center gap-1 bg-neutral-300 hover:bg-neutral-200 hover:dark:bg-neutral-500 dark:bg-neutral-600 px-3 py-1.5 border rounded-md font-medium text-xs hover hover:"
        >
            <Pencil className="w-3 h-3" />
            Edit
        </button>
    ) : (
        <button
            type="button"
            className="inline-flex items-center gap-1 bg-primary hover:opacity-90 shadow px-3 py-1.5 rounded-md font-medium text-primary-foreground text-xs"
        >
            <Plus className="w-3 h-3" />
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
            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                    Nama
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder='Masukan Nama Sistem'
                    className='placeholder:text-muted'
                    autoFocus
                />
                {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-1">
                    Code
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="description"
                    className="flex items-center gap-1"
                >
                    Deskripsi
                </Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs">{errors.description}</p>
                )}
            </div>
            
            <div className="flex justify-between items-center px-3 py-2 border border-3 border-neutral-600 rounded-md">
                <div className="space-y-0.5">
                    <Label htmlFor="is_active">Status</Label>
                    <p className="text-muted-foreground text-xs">
                        Aktifkan atau nonaktifkan system.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(value) => setData('is_active', value)}
                    />
                    <span className="text-muted-foreground text-xs">
                        {data.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </BaseFormDialog>
    );
}