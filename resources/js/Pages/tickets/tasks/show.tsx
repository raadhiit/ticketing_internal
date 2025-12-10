// resources/js/Components/tickets/pages/TicketShowPage.tsx
import PrimaryButton from '@/Components/PrimaryButton';
import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { KanbanBoard } from './KanbanBoard';
import { TaskModal } from './TaskModal';
import { TicketHeader } from './TicketHeader';
import type { KanbanColumns, TaskDto, TaskProps } from '../types/tasksTypes';

export default function TicketShowPage(pageProps: TaskProps) {
    const {
        ticket,
        tasks,
        canReorderAllTasks,
        canChangeStatusOwnTasks,
        isDev,
        devOptions,
        canCreateTask,
        canEditTask,
        canDeleteTask,
    } = pageProps;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingTask, setEditingTask] = useState<TaskDto | null>(null);

    const handleAddTask = () => {
        if (!canCreateTask && !isDev) return;
        setModalMode('create');
        setEditingTask(null);
        setModalOpen(true);
    };

    const handleEditTask = (task: TaskDto) => {
        if (!canEditTask && !isDev) return;
        setModalMode('edit');
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = (task: TaskDto) => {
        if (!canDeleteTask && !isDev) return;

        if (!confirm('Delete this task?')) return;

        router.delete(route('tickets.tasks.destroy', [ticket.id, task.id]), {
            preserveScroll: true,
        });
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingTask(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">Task</h2>
            }
        >
            <Head title={`${ticket.code}`} />

            <div className="space-y-4 p-4">
                {/* BACK BUTTON + INFO TICKET */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="px-2 text-xs"
                        onClick={() => router.get(route('tickets.index'))}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Button>

                    <span className="text-[11px] text-muted-foreground">
                        Ticket #{ticket.code}
                    </span>
                </div>

                <TicketHeader ticket={ticket} />

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Tasks</h2>
                    {canCreateTask && (
                        <PrimaryButton type="button" onClick={handleAddTask}>
                            + Add Task
                        </PrimaryButton>
                    )}
                </div>

                <KanbanBoard
                    ticket={ticket}
                    initialColumns={tasks as KanbanColumns}
                    canReorderAllTasks={canReorderAllTasks}
                    canChangeStatusOwnTasks={canChangeStatusOwnTasks}
                    isDev={isDev}
                    onTaskEdit={handleEditTask}
                    onTaskDelete={handleDeleteTask}
                />

                {modalOpen && (
                    <TaskModal
                        mode={modalMode}
                        ticket={ticket}
                        assignees={devOptions}
                        task={editingTask}
                        canManageTasks={canCreateTask || canEditTask}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
