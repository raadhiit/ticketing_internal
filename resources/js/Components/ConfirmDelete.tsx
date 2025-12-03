'use client';

import { Button } from '@/Components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';

type ConfirmDeleteDialogProps = {
    /** Nama jenis data, misal: "user", "department", "ticket" */
    resourceName?: string;
    /** Label spesifik yang mau ditampilkan, misal: nama user, nama departemen */
    resourceLabel?: string;

    /** Callback ketika user klik "Ya, hapus" */
    onConfirm: () => void | Promise<void>;

    /** Optional: custom trigger (kalau nggak diisi, pakai tombol Delete default) */
    children?: ReactNode;

    /** Optional: override teks */
    title?: string;
    description?: ReactNode;
    confirmText?: string;
    cancelText?: string;
};

export function ConfirmDeleteDialog({
    resourceName = 'data',
    resourceLabel,
    onConfirm,
    children,
    title,
    description,
    confirmText = 'Ya, hapus',
    cancelText = 'Batal',
}: ConfirmDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    const handleConfirmClick = async () => {
        try {
            setProcessing(true);
            await onConfirm();
        } finally {
            setProcessing(false);
        }
    };

    const defaultTitle = title ?? `Hapus ${resourceName}?`;

    const formattedResourceLabel = resourceLabel ? (
        <span className="font-semibold text-red-600 dark:text-red-400">
            {resourceLabel}
        </span>
    ) : null;

    const defaultDescription = description ?? (
        <>
            {resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}{' '}
            {formattedResourceLabel} akan dihapus dari sistem. Tindakan ini tidak
            dapat dibatalkan.
        </>
    );



    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ?? (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{defaultTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {defaultDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmClick}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
