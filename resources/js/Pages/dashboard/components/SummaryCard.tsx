import { TicketIcon } from 'lucide-react';
import type { SummaryCard as SummaryCardType } from '../types/dashboard';
import { summaryCardUI } from '../config/summaryCard.config';

interface Props {
  card: SummaryCardType;
}

export default function SummaryCard({ card }: Props) {
  const ui = summaryCardUI[card.id];

  return (
    <article className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition hover:scale-105 hover:shadow-md">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {card.label}
        </p>
        <p className="text-2xl font-semibold text-foreground">
          {card.value} Tickets
        </p>
        <p className="text-xs text-muted-foreground">
          {card.description}
        </p>
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${ui.accent}`}>
        <TicketIcon className={`h-6 w-6 ${ui.icon}`} />
      </div>
    </article>
  );
}
