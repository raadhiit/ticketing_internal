'use client';

import { FormEvent, ReactNode } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

type BaseFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    mode: 'create' | 'edit';

    title: string;
    description?: string;

    /** optional custom trigger */
    trigger?: ReactNode;

    /** isi form (fields) */
    children: ReactNode;

    /** submit handler dari parent (UserFormDialog, dst.) */
    onSubmit: (e: FormEvent) => void;

    /** state loading dari form (processing) */
    isSubmitting?: boolean;

    /** label tombol submit (kalau mau override) */
    submitLabelCreate?: string;
    submitLabelEdit?: string;
};

export function BaseFormDialog({
    open,
    onOpenChange,
    mode,
    title,
    description,
    trigger,
    children,
    onSubmit,
    isSubmitting = false,
    submitLabelCreate = 'Simpan',
    submitLabelEdit = 'Simpan Perubahan',
}: BaseFormDialogProps) {
    const submitLabel =
        mode === 'edit' ? submitLabelEdit : submitLabelCreate;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    {/* Form fields */}
                    <div className="space-y-3">{children}</div>

                    <DialogFooter className="mt-2">
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Menyimpan...'
                                : submitLabel}
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
