import type { Link } from '../types/dashboard';

export function normalizeLabel(label: string) {
    if (label.includes('previous')) return 'Previous';
    if (label.includes('next')) return 'Next';
    return label.replace(/&laquo;|&raquo;/g, '').trim();
}

export function buildPaginationLinks(
    links: Link[],
    currentPage: number,
    lastPage: number,
    window = 1,
) {
    return links.filter((link) => {
        if (link.label.includes('Previous') || link.label.includes('Next')) {
            return true;
        }

        const page = Number(link.label);
        if (Number.isNaN(page)) return false;

        return (
            page === 1 ||
            page === lastPage ||
            (page >= currentPage - window && page <= currentPage + window)
        )
    });
}