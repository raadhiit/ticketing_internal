import { cn } from "@/lib/utils";

type Priority = "unassigned" | "low" | "medium" | "high" | "urgent";

export function TicketPriorityBadge({ priority }: { priority: Priority}) {
    const labelMap: Record<Priority, string> = {
        unassigned: "Unassigned",
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
    };

    const classMap: Record<Priority, string> = {
        unassigned:
            'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    };

      return (
          <span
              className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] md:text-xs',
                  classMap[priority],
              )}
          >
              {labelMap[priority]}
          </span>
      );

}
