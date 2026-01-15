import type { SummaryCard } from '../types/dashboard';

export const summaryCardUI: Record<
  SummaryCard['id'],
  { accent: string; icon: string }
> = {
  active: {
    accent: 'bg-sky-100 dark:bg-sky-500/20',
    icon: 'text-sky-600 dark:text-sky-800',
  },
  pending: {
    accent: 'bg-amber-100 dark:bg-amber-500/20',
    icon: 'text-amber-600 dark:text-amber-300',
  },
  resolved: {
    accent: 'bg-emerald-100 dark:bg-emerald-500/20',
    icon: 'text-emerald-600 dark:text-emerald-300',
  },
  closed: {
    accent: 'bg-rose-100 dark:bg-rose-500/20',
    icon: 'text-rose-600 dark:text-rose-300',
  },
};
