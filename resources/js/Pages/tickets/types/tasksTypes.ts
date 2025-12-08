export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskAssigne = {
    id: number;
    name: string;
};

export type SortableTaskCardProps = {
    task: TaskDto;
    columnId: TaskStatus;
    onEdit: () => void;
    onDelete: () => void;
};

export type KanbanColumnProps = {
    columnId: TaskStatus;
    label: string;
    tasks: TaskDto[];
    onTaskEdit: (task: TaskDto) => void;
    onDeleteTask: (task: TaskDto) => void;
};

export type TaskDto = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    position: number;
    assignee: TaskAssigne | null;
    created_at?: string;
};

export type TicketDto = {
    id: number;
    code: string;
    title: string;
    description: string | null;
    system_id: number | null;
    system_code: string | null;
    category: string;
    priority: string;
    status: string;
    due_date: string | null;
    createdBy: {
        id: number;
        name: string;
    };
    assigned_to: number | null;
    assignedTo: {
        id: number;
        name: string;
    } | null;
    attachments: {
        id: number;
        original_name: string;
        url: string;
    }[];
    created_at: string | null;
    updated_at: string | null;
};

export type KanbanColumns = Record<TaskStatus, TaskDto[]>;

export type SimpleUser = {
    id: number;
    name: string;
};


export type TaskProps = {
    ticket: TicketDto;
    tasks: KanbanColumns;
    canManageTasks: boolean; // admin / pm
    canReorderAllTasks: boolean; // admin / pm
    canChangeStatusOwnTasks: boolean; // dev & admin/pm
    isDev: boolean;
    devOptions: SimpleUser[]; // 🔹 daftar dev
    canCreateTask: boolean;
    canEditTask: boolean;
    canDeleteTask: boolean;
};
