import type { SummaryCard } from '../types/dashboard';
import SummaryCardItem from './SummaryCard';

interface Props {
  cards: SummaryCard[];
}

export default function SummaryGrid({ cards }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <SummaryCardItem key={card.id} card={card} />
      ))}
    </section>
  );
}
