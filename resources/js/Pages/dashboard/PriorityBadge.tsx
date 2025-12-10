// resources/js/Components/PriorityBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils';


export type Priority = 'unassigned' | 'low' | 'medium' | 'high' | 'urgent';

type Props = {
  priority: Priority;
  className?: string;
  size?: 'sm' | 'md';
  uppercase?: boolean;
};

const variantMap: Record<
  Priority,
  { bg: string; text: string; ring?: string; label: string }
> = {
  unassigned: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-200',
    label: 'UNASSIGNED',
  },
  low: {
    bg: 'bg-emerald-100 dark:bg-emerald-800/30',
    text: 'text-emerald-700 dark:text-emerald-200',
    label: 'LOW',
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-800/30',
    text: 'text-amber-700 dark:text-amber-200',
    label: 'MEDIUM',
  },
  high: {
    bg: 'bg-orange-100 dark:bg-orange-800/30',
    text: 'text-orange-700 dark:text-orange-200',
    label: 'HIGH',
  },
  urgent: {
    bg: 'bg-rose-100 dark:bg-rose-800/30',
    text: 'text-rose-700 dark:text-rose-200',
    label: 'URGENT',
  },
};

export default function PriorityBadge({
  priority,
  className,
  size = 'md',
  uppercase = true,
}: Props) {
  const v = variantMap[priority] ?? variantMap.unassigned;
  const base = 'inline-flex items-center rounded-full font-semibold';
  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-3 py-1 text-sm'; // md

  return (
    <span
      role="status"
      aria-label={`Priority ${v.label}`}
      className={cn(base, sizeClass, v.bg, v.text, className)}
    >
      <span className={cn(uppercase ? 'uppercase tracking-wide' : '')}>
        {uppercase ? v.label : v.label.toLowerCase()}
      </span>
    </span>
  );
}
