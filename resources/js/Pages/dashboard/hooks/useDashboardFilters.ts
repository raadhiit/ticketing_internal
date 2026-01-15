import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { Filters } from '../types/dashboard';

export function useDashboardFilters(
    initialQ?: string,
    initialDateFrom?: string | null,
    initialDateTo?: string | null,
) {
    /* =========================
     APPLIED FILTERS (SERVER)
  ========================= */
    const [filters, setFilters] = useState<Filters>({
        q: initialQ ?? '',
        date_from: initialDateFrom ?? '',
        date_to: initialDateTo ?? '',
    });

    /* =========================
     DRAFT STATE (UI)
  ========================= */
    const [draftQ, setDraftQ] = useState(filters.q);
    const [draftDateFrom, setDraftDateFrom] = useState<string>(
        filters.date_from || '',
    );

    const [draftDateTo, setDraftDateTo] = useState<string>(
        filters.date_to || '',
    );

    const isFirstRun = useRef(true);

    /* =========================
     SYNC SERVER → UI (IMPORTANT)
  ========================= */
    useEffect(() => {
        setDraftQ(filters.q);
        setDraftDateFrom(filters.date_from);
        setDraftDateTo(filters.date_to);
    }, [filters]);

    /* =========================
     SEARCH (DEBOUNCED, SAFE)
  ========================= */
    useEffect(() => {
        const t = setTimeout(() => {
            if (filters.q !== draftQ) {
                setFilters((f) => ({ ...f, q: draftQ }));
            }
        }, 500);

        return () => clearTimeout(t);
    }, [draftQ]);

    /* =========================
     APPLY DATE FILTER (MANUAL)
  ========================= */
    function applyDateFilter() {
        setFilters((f) => ({
            ...f,
            date_from: draftDateFrom,
            date_to: draftDateTo,
        }));
    }

    /* =========================
     ROUTER (ONLY WHEN APPLIED)
  ========================= */
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        router.get(
            route('dashboard.index'),
            {
                q: filters.q || undefined,
                date_from: filters.date_from || undefined,
                date_to: filters.date_to || undefined,
            },
            {
                preserveScroll: true,
                replace: true,
            },
        );
    }, [filters]);

    function resetDateFilter() {
        setDraftDateFrom(initialDateFrom ?? '');
        setDraftDateTo(initialDateTo ?? '');

        setFilters((f) => ({
            ...f,
            date_from: initialDateFrom ?? '',
            date_to: initialDateTo ?? '',
        }))
    }

    return {
        /* applied */
        filters,

        /* draft */
        draftQ,
        setDraftQ,
        draftDateFrom,
        setDraftDateFrom,
        draftDateTo,
        setDraftDateTo,

        /* actions */
        applyDateFilter,
        resetDateFilter
    };
}
