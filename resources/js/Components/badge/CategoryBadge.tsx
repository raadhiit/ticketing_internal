import { cn } from "@/lib/utils";

type Category = 'bug' | 'feature' | 'improvement' | 'support';

const labelMap: Record<Category, string> = {
    bug: 'Bug',
    feature: 'Feature',
    improvement: 'Improvement',
    support: 'Support',
};

const classMap: Record<Category, string> = {
    bug: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    feature: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    improvement:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    support: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export function TicketCategoryBadge({ category }: { category: Category }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[10px] md:text-xs',
                classMap[category],
            )}
        >
            {labelMap[category]}
        </span>
    );
}
