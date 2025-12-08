// resources/js/Components/tickets/TaskModal.tsx

import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import type {
    SimpleUser,
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

type TaskModalProps = {
    mode: 'create' | 'edit';
    ticket: TicketDto;
    task: TaskDto | null;
    assignees: SimpleUser[]; // 🔹 daftar dev
    canManageTasks: boolean; // admin/pm
    onClose: () => void;
};

export const TaskModal: React.FC<TaskModalProps> = ({
    mode,
    ticket,
    task,
    assignees,
    canManageTasks,
    onClose,
}) => {
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo');

    // 🔹 state assignee_id
    const [assigneeId, setAssigneeId] = useState<number | null>(() => {
        if (task?.assignee) {
            return task.assignee.id;
        }
        // kalau mau default ikut ticket:
        if (ticket.assignedTo) {
            return ticket.assignedTo.id;
        }
        return null;
    });

    const isEdit = mode === 'edit';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const payload = {
            title,
            description: description || null,
            status,
            assignee_id: assigneeId, // 🔹 kirim ke backend
        };

        if (isEdit && task) {
            router.put(
                route('tickets.tasks.update', [ticket.id, task.id]),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => onClose(),
                },
            );
        } else {
            router.post(route('tickets.tasks.store', ticket.id), payload, {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold">
                        {isEdit ? 'Edit Task' : 'Add Task'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="task-title" className="text-[11px]">
                            Title
                        </Label>
                        <Input
                            id="task-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-8 text-xs"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1">
                        <Label
                            htmlFor="task-description"
                            className="text-[11px]"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="task-description"
                            value={description ?? ''}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] text-xs"
                        />
                    </div>

                    {/* 🔹 status */}
                    <div className="space-y-1">
                        <Label className="text-[11px]">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(val) =>
                                setStatus(val as TaskStatus)
                            }
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_META.map((s) => (
                                    <SelectItem
                                        key={s.id}
                                        value={s.id}
                                        className="text-xs"
                                    >
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 🔹 assignee dev */}
                    <div className="space-y-1">
                        <Label className="text-[11px]">Assign To (Dev)</Label>

                        {canManageTasks ? (
                            <Select
                                value={
                                    assigneeId !== null
                                        ? String(assigneeId)
                                        : 'unassigned'
                                }
                                onValueChange={(val) => {
                                    if (val === 'unassigned') {
                                        setAssigneeId(null);
                                    } else {
                                        setAssigneeId(Number(val));
                                    }
                                }}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="unassigned"
                                        className="text-xs"
                                    >
                                        Unassigned
                                    </SelectItem>
                                    {assignees.map((dev) => (
                                        <SelectItem
                                            key={dev.id}
                                            value={String(dev.id)}
                                            className="text-xs"
                                        >
                                            {dev.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            // dev / user biasa: cuma lihat
                            <div className="flex h-8 items-center rounded border px-2 text-xs text-muted-foreground">
                                {assigneeId
                                    ? (assignees.find(
                                          (d) => d.id === assigneeId,
                                      )?.name ?? 'Assigned')
                                    : 'Unassigned'}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-4 flex items-center justify-between gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button type="submit" size="sm">
                                {isEdit ? 'Save' : 'Create'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
