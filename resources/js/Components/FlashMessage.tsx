'use client';

import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/Components/ui/alert';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type FlashProps = {
    type: 'success' | 'error' | 'info';
    message: string;
};

export function FlashMessage({ type, message }: FlashProps) {
    const { props } = usePage(); // 👈 kunci: berubah tiap Inertia visit
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!message) return;

        setOpen(true);

        const timer = setTimeout(() => setOpen(false), 4000);
        return () => clearTimeout(timer);
    }, [props, message]);

    if (!message || !open) return null;

    const variants = {
        success: {
            icon: (
                <CheckCircle2 className="h-4 w-4" />
            ),
            title: 'Berhasil',
            className:
                'border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
        },
        error: {
            icon: <AlertTriangle className="h-4 w-4" />,
            title: 'Terjadi Kesalahan',
            className:
                'border-red-500/40 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-100',
        },
        info: {
            icon: <Info className="h-4 w-4" />,
            title: 'Informasi',
            className:
                'border-sky-500/40 bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
        },
    }[type];

    return (
        <div className="fixed left-1/2 top-4 z-40 flex w-full max-w-md -translate-x-1/2 px-4 sm:top-6">
            <Alert
                className={`flex w-full items-start gap-3 border ${variants.className} shadow-md`}
            >
                <span className="mt-0.5">{variants.icon}</span>
                <div className="flex-1 space-y-1 text-sm">
                    <AlertTitle className="font-semibold">
                        {variants.title}
                    </AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="ml-2 text-xs opacity-70 hover:opacity-100"
                >
                    Tutup
                </button>
            </Alert>
        </div>
    );
}
