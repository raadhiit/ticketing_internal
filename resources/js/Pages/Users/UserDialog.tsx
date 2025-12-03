'use client';

import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { BaseFormDialog } from '@/Components/dialog/BaseFormDialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import type { UserFormDialogProps } from './types/userTypes';

type BaseUserForm = {
    name: string;
    email: string;
    password: string;
    is_active: boolean;
    department_id: number | '' | null;
    roles: string;
};

export function UserFormDialog({
    mode,
    user,
    departments,
    trigger,
    roles
}: UserFormDialogProps) {
    const isEdit = mode === 'edit';
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, reset, errors } =
        useForm<BaseUserForm>({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            is_active: user?.is_active ?? true,
            department_id: user?.department_id ?? '',
            roles: user?.roles ?? 'user'
        });

    const handleClose = () => {
        setOpen(false);
        reset('password'); // biasanya cukup reset password saja, kalau mau full: reset()
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit && user) {
            // UPDATE
            put(route('users.update', user.id), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        } else {
            // CREATE
            post(route('users.store'), {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        }
    };

    const title = isEdit ? 'Edit User' : 'Tambah User';
    const description = isEdit
        ? 'Ubah data user, lalu klik simpan.'
        : 'Isi data user baru, lalu klik simpan.';

    // Trigger default (kalau prop trigger tidak dikirim)
    const defaultTrigger = isEdit ? (
        <button
            type="button"
            className="inline-flex items-center gap-1 hover:dark:bg-neutral-500 dark:bg-neutral-600 px-3 py-2 border rounded-md font-medium text-xs"
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
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    reset('password');
                }
            }}
            mode={mode}
            title={title}
            description={description}
            trigger={trigger ?? defaultTrigger}
            onSubmit={handleSubmit}
            isSubmitting={processing}
        >
            {/* === Isi form khusus USER === */}

            {/* Department */}
            <div className="space-y-1">
                <Label htmlFor="department_id">Department</Label>
                <select
                    id="department_id"
                    className="bg-card px-3 py-2 border rounded-md w-full text-muted dark:text-muted text-sm"
                    value={data.department_id ?? ''}
                    onChange={(e) =>
                        setData(
                            'department_id',
                            e.target.value ? Number(e.target.value) : '',
                        )
                    }
                >
                    <option value="">Pilih department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
                {errors.department_id && (
                    <p className="text-red-500 text-xs">
                        {errors.department_id}
                    </p>
                )}
            </div>

            {/* Name */}
            <div className="space-y-1">
                <Label htmlFor="name" className="flex items-center gap-1">
                    Nama
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    placeholder="Masukan nama"
                    onChange={(e) => setData('name', e.target.value)}
                    className="placeholder:text-muted"
                    autoFocus
                />
                {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Label htmlFor="email" className="flex items-center gap-1">
                    Email
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Masukan email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="placeholder:dark:text-muted placeholder:text-muted"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1">
                <Label htmlFor="password" className="flex items-center gap-1">
                    {isEdit ? 'Password (opsional)' : 'Password'}
                    <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={
                        isEdit
                            ? 'Biarkan kosong jika tidak diganti'
                            : 'Minimal 8 karakter'
                    }
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="placeholder:dark:text-muted placeholder:text-muted"
                />
                {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="role" className="flex items-center gap-1">
                    Role
                    <span className="text-red-500">*</span>
                </Label>
                <select
                    id="role"
                    className="bg-card px-3 py-2 border rounded-md w-full text-muted-foreground dark:text-muted-foreground text-sm"
                    value={data.roles}
                    onChange={(e) => setData('roles', e.target.value)}
                >
                    <option value="">Pilih role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
                {errors.roles && (
                    <p className="text-red-500 text-xs">{errors.roles}</p>
                )}
            </div>

            {/* Status aktif */}
            <div className="flex justify-between items-center px-3 py-2 border rounded-md">
                <div className="space-y-0.5">
                    <Label htmlFor="is_active">Status</Label>
                    <p className="text-muted-foreground text-xs">
                        Aktifkan atau nonaktifkan user.
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
