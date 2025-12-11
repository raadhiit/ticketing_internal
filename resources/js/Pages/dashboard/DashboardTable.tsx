'use client';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';


type Link = { url: string | null; label: string; active: boolean };

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];                       // ticketHistory.data
  links?: Link[];                  // ticketHistory.links
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
  className?: string;
};

export default function DataTable<T>({ columns, data, links = [], meta, className }: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
      <div className={cn('w-full overflow-auto', className)}>
          <table className="min-w-full table-auto">
              <thead className="bg-accent/60">
                  {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                          {hg.headers.map((header) => {
                              // optional: column size hint (number)
                              const size = (header.column.columnDef as any)
                                  .size as number | undefined;
                              const style = size
                                  ? {
                                        width: `${size}px`,
                                        minWidth: `${size}px`,
                                    }
                                  : undefined;

                              return (
                                  <th
                                      key={header.id}
                                      style={style}
                                      className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                                  >
                                      {header.isPlaceholder
                                          ? null
                                          : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                  </th>
                              );
                          })}
                      </tr>
                  ))}
              </thead>
              <tbody className="divide-y divide-border bg-background">
                  {table.getRowModel().rows.map((row) => (
                      <tr
                          key={row.id}
                          className="transition hover:bg-accent/40"
                      >
                          {row.getVisibleCells().map((cell) => {
                              const size = (cell.column.columnDef as any)
                                  .size as number | undefined;
                              const style = size
                                  ? {
                                        width: `${size}px`,
                                        minWidth: `${size}px`,
                                    }
                                  : undefined;

                              return (
                                  <td
                                      key={cell.id}
                                      style={style}
                                      className="px-6 py-4 align-top text-sm"
                                  >
                                      {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                      )}
                                  </td>
                              );
                          })}
                      </tr>
                  ))}
              </tbody>
          </table>

          {/* pagination (server-side) */}
          {links.length > 0 && meta && (
              <div className="flex items-center justify-between px-6 py-3 text-xs text-muted-foreground">
                  <div>
                      Showing {(meta.current_page - 1) * meta.per_page + 1} —{' '}
                      {Math.min(meta.current_page * meta.per_page, meta.total)}{' '}
                      of {meta.total}
                  </div>

                  <div className="flex items-center gap-2">
                      {links.map((link, idx) => (
                          <button
                              key={idx}
                              className={`min-w-[36px] rounded px-2 py-1 text-[13px] ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                              disabled={!link.url}
                              onClick={() => {
                                  if (!link.url) return;
                                  router.get(
                                      link.url,
                                      {},
                                      {
                                          preserveState: true,
                                          preserveScroll: true,
                                          replace: true,
                                      },
                                  );
                              }}
                          >
                              {link.label}
                          </button>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );
}
