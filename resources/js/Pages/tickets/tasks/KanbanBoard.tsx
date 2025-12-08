import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useDroppable,
    type DragCancelEvent,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type {
    KanbanColumns,
    SortableTaskCardProps,
    TaskDto,
    TaskStatus,
    TicketDto,
} from '../types/tasksTypes';

const STATUS_META: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'Todo' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' },
];

type KanbanBoardProps = {
    ticket: TicketDto;
    initialColumns: KanbanColumns;
    canReorderAllTasks: boolean;
    canChangeStatusOwnTasks: boolean;
    isDev: boolean;
    onTaskEdit: (task: TaskDto) => void;
    onTaskDelete: (task: TaskDto) => void;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    ticket,
    initialColumns,
    canReorderAllTasks,
    canChangeStatusOwnTasks,
    isDev,
    onTaskEdit,
    onTaskDelete,
}) => {
    const [columns, setColumns] = useState<KanbanColumns>(() => ({
        todo: [...initialColumns.todo],
        in_progress: [...initialColumns.in_progress],
        review: [...initialColumns.review],
        done: [...initialColumns.done],
    }));

    // ghost card yang ngikutin cursor (overlay)
    const [activeTask, setActiveTask] = useState<TaskDto | null>(null);

    // sync dari props (habis create/update/reorder)
    useEffect(() => {
        setColumns({
            todo: [...initialColumns.todo],
            in_progress: [...initialColumns.in_progress],
            review: [...initialColumns.review],
            done: [...initialColumns.done],
        });
    }, [initialColumns]);

    const allTaskIds = useMemo(
        () =>
            [
                ...columns.todo,
                ...columns.in_progress,
                ...columns.review,
                ...columns.done,
            ].map((t) => t.id),
        [columns],
    );

    const findTaskLocation = (taskId: number) => {
        const entries = Object.entries(columns) as [TaskStatus, TaskDto[]][];
        for (const [status, list] of entries) {
            const index = list.findIndex((t) => t.id === taskId);
            if (index !== -1) {
                return { status, index };
            }
        }
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const id = Number(event.active.id);
        const loc = findTaskLocation(id);
        if (!loc) return;

        const task = columns[loc.status].find((t) => t.id === id) || null;
        setActiveTask(task ?? null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = Number(active.id);
        const from = findTaskLocation(activeId);
        if (!from) return;

        let targetStatus: TaskStatus = from.status;
        let targetIndex: number = from.index;

        const overData = over.data?.current as
            | { columnId?: TaskStatus; type?: 'column' | 'task' }
            | undefined;

        // 1) Kalau hover di TASK lain → pakai index task itu
        const overIdNum = Number(over.id);
        const to =
            !Number.isNaN(overIdNum) && overData?.type === 'task'
                ? findTaskLocation(overIdNum)
                : null;

        if (to) {
            targetStatus = to.status;
            targetIndex = to.index;
        }

        // 2) Kalau hover di COLUMN (area kosong) → append di akhir kolom tsb
        if (overData?.type === 'column' && overData.columnId) {
            targetStatus = overData.columnId;
            const list = columns[overData.columnId];
            targetIndex = list.length;
        }

        setColumns((prev) => {
            const next: KanbanColumns = {
                todo: [...prev.todo],
                in_progress: [...prev.in_progress],
                review: [...prev.review],
                done: [...prev.done],
            };

            const fromList = next[from.status];
            const task = fromList.find((t) => t.id === activeId);
            if (!task) return prev;

            // hapus dari posisi awal
            fromList.splice(from.index, 1);

            // insert ke posisi baru
            const targetList = next[targetStatus];
            const clampedIndex = Math.min(targetIndex, targetList.length);
            targetList.splice(clampedIndex, 0, {
                ...task,
                status: targetStatus,
            });

            sendReorderToServer(ticket.id, next);

            return next;
        });
    };

    const handleDragCancel = (event: DragCancelEvent) => {
        setActiveTask(null);
    };

    const sendReorderToServer = (ticketId: number, cols: KanbanColumns) => {
        const payload = {
            columns: {
                todo: cols.todo.map((t) => ({ id: t.id })),
                in_progress: cols.in_progress.map((t) => ({ id: t.id })),
                review: cols.review.map((t) => ({ id: t.id })),
                done: cols.done.map((t) => ({ id: t.id })),
            },
        };

        router.post(route('tickets.tasks.reorder', ticketId), payload, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {STATUS_META.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        columnId={col.id}
                        label={col.label}
                        tasks={columns[col.id]}
                        onTaskEdit={onTaskEdit}
                        onTaskDelete={onTaskDelete}
                    />
                ))}
            </div>

            {/* overlay ghost ala Notion */}
            <DragOverlay>
                {activeTask && <TaskOverlayCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    );
};

/* -------- Column + Card (internal) -------- */

type KanbanColumnProps = {
    columnId: TaskStatus;
    label: string;
    tasks: TaskDto[];
    onTaskEdit: (task: TaskDto) => void;
    onTaskDelete: (task: TaskDto) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    columnId,
    label,
    tasks,
    onTaskEdit,
    onTaskDelete,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${columnId}`,
        data: { columnId, type: 'column' },
    });

    const STATUS_DOT_COLOR: Record<TaskStatus, string> = {
        todo: 'bg-pastel-yellow dark:bg-pastel-yellow/80',
        in_progress: 'bg-pastel-sky dark:bg-pastel-sky/80',
        review: 'bg-pastel-lilac dark:bg-pastel-lilac/80',
        done: 'bg-pastel-mint dark:bg-pastel-mint/80',
    };

    const STATUS_TONE: Record<TaskStatus, { dot: string; border: string }> = {
        todo: {
            dot: 'bg-pastel-yellow dark:bg-pastel-yellow/80',
            border: 'border-pastel-yellow/70 dark:border-pastel-yellow/40',
        },
        in_progress: {
            dot: 'bg-pastel-sky dark:bg-pastel-sky/80',
            border: 'border-pastel-sky/70 dark:border-pastel-sky/40',
        },
        review: {
            dot: 'bg-pastel-lilac dark:bg-pastel-lilac/80',
            border: 'border-pastel-lilac/70 dark:border-pastel-lilac/40',
        },
        done: {
            dot: 'bg-pastel-mint dark:bg-pastel-mint/80',
            border: 'border-pastel-mint/70 dark:border-pastel-mint/40',
        },
    };

    return (
        <Card
            className={cn(
                'flex h-[420px] flex-col rounded-lg',
                // card putih dengan depth halus
                'border border-border bg-card shadow-sm',
                'transition-colors duration-150',
                isOver && 'bg-accent/40 ring-1 ring-primary/60',
            )}
        >
            <CardHeader className="mb-4 border-b border-border/60 px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {/* dot status lu yang sekarang */}
                        <span
                            className={cn(
                                'h-2 w-2 rounded-full',
                                STATUS_DOT_COLOR[columnId], // atau mapping lu
                            )}
                        />
                        <span className="font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                        </span>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-[2px] text-[10px] text-slate-200 dark:text-muted-foreground">
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </CardHeader>

            <CardContent
                ref={setNodeRef}
                className="flex-1 overflow-y-auto pb-3"
            >
                <SortableContext items={tasks.map((t) => t.id)}>
                    <div className="flex flex-col gap-2 pb-2">
                        {tasks.map((task) => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                columnId={columnId}
                                onEdit={() => onTaskEdit(task)}
                                onDelete={() => onTaskDelete(task)}
                            />
                        ))}

                        {tasks.length === 0 && (
                            <div className="rounded border border-dashed border-muted p-2 text-center text-[11px] text-muted-foreground">
                                Drop here
                            </div>
                        )}
                    </div>
                </SortableContext>
            </CardContent>
        </Card>
    );
};

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({
    task,
    columnId,
    onEdit,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { columnId, type: 'task' },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                className={cn(
                    'group border-muted bg-card hover:bg-accent',
                    'cursor-default transition-all duration-150',
                    isDragging &&
                        'scale-[1.02] shadow-lg shadow-black/20 ring-2 ring-primary/60',
                )}
            >
                <CardContent className="space-y-1 p-2">
                    <div className="flex items-start justify-between gap-2">
                        {/* LEFT: Drag handle + main info */}
                        <div className="flex items-start gap-1">
                            {/* DRAG HANDLE */}
                            <button
                                type="button"
                                className="mt-[2px] flex h-5 w-4 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                                {...listeners}
                            >
                                <GripVertical className="h-3 w-3" />
                            </button>

                            {/* TITLE + ASSIGNEE + DESCRIPTION */}
                            <div
                                onClick={onEdit}
                                className="cursor-pointer space-y-0.5"
                            >
                                <div className="text-sm font-semibold leading-snug">
                                    {task.title}
                                    {' - '}
                                    {task.assignee ? (
                                        <span>{task.assignee.name}</span>
                                    ) : (
                                        <span className="text-yellow-600 dark:text-yellow-300">
                                            Unassigned
                                        </span>
                                    )}
                                </div>

                                {task.description && (
                                    <div className="line-clamp-2 text-[10px] text-muted-foreground">
                                        {task.description}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Hover actions */}
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                            >
                                <Pencil className="h-3 w-3" />
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

/* -------- overlay card (ghost) -------- */

type TaskOverlayCardProps = {
    task: TaskDto;
};

const TaskOverlayCard: React.FC<TaskOverlayCardProps> = ({ task }) => {
    return (
        <Card className="border-muted bg-card shadow-xl shadow-black/30 ring-2 ring-primary/70">
            <CardContent className="space-y-1 p-2">
                <div className="text-[11px] font-semibold leading-snug">
                    {task.title}
                </div>
                {task.assignee && (
                    <div className="text-[10px] text-muted-foreground">
                        {task.assignee.name}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
