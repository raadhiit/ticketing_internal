import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TicketFilters } from '../types/ticketTypes';

export function useTicketFilters(initialFilters: TicketFilters) {
    const [filters, setFilters] = useState<TicketFilters>(initialFilters);
    const [isFiltering, setIsFiltering] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const prevCodeRef = useRef<string | undefined>(initialFilters.code);

    // debounce khusus search by code
    useEffect(() => {
        if (filters.code === prevCodeRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            prevCodeRef.current = filters.code;

            router.get(
                route('tickets.index'),
                { ...filters, page: 1 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onStart: () => setIsFiltering(true),
                    onFinish: () => setIsFiltering(false),
                },
            );
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [filters.code]);

    const applyFilter = useCallback(
        <K extends keyof TicketFilters>(field: K, value?: TicketFilters[K]) => {
            const next: TicketFilters = {
                ...filters,
                [field]: value || undefined,
            };

            setFilters(next);

            router.get(
                route('tickets.index'),
                { ...next, page: 1 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onStart: () => setIsFiltering(true),
                    onFinish: () => setIsFiltering(false),
                },
            );
        },
        [filters],
    );

    const resetFilters = () => {
        setFilters({});
        router.get(
            route('tickets.index'),
            { page: 1 },
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            },
        );
    };

    return {
        filters,
        setFilters,
        applyFilter,
        resetFilters,
        isFiltering,
    };
}
