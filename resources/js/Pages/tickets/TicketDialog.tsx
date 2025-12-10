'use client';

import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';

import { BaseFormDialog } from '@/Components/dialog/BaseFormDialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketFormDialogProps,
  TicketFormData,

} from './types/ticketTypes';

export function TicketDialog({
  mode,
  systems,
  ticket,
  canManagePriority,
  canManageStatus,
  trigger,
  canAssign,
  assignees,
}: TicketFormDialogProps) {
  const isEdit = mode === 'edit';
   
  const [open, setOpen] = useState(false);

  const { data, setData, post, put, processing, reset, errors } =
      useForm<TicketFormData>({
          system_id: ticket?.system_id ?? '',
          title: ticket?.title ?? '',
          description: ticket?.description ?? '',
          category: ticket?.category ?? 'bug',
          priority: ticket?.priority ?? 'unassigned', // create default: unassigned
          status: ticket?.status ?? 'open',
          due_date: ticket?.due_date ?? '',
          assigned_to: ticket?.assigned_to ?? null, // NEW
          attachment: null,
          ...(isEdit && ticket ? { _method: 'put' } : {}),
      });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                reset(); // optional
            },
            forceFormData: true as const,
        };

        if (isEdit && ticket) {
            post(route('tickets.update', ticket.id), options);
        } else {
            post(route('tickets.store'), options);
        }
    };


  const title = isEdit ? 'Edit Ticket' : 'Create Ticket';
  const descriptionText = isEdit
    ? 'Ubah informasi ticket.'
    : 'Buat ticket baru untuk permintaan atau issue.';

  const defaultTrigger = isEdit ? (
    <button
      type="button"
      className="inline-flex items-center gap-1 hover:dark:bg-neutral-500 dark:bg-neutral-600 px-3 py-2.5 border rounded-md font-medium text-xs"
    >
      <Pencil className="w-3 h-3" />
    </button>
  ) : (
    <button
      type="button"
      className="inline-flex items-center gap-1 bg-primary hover:opacity-90 shadow px-3 py-1.5 rounded-md font-medium text-primary-foreground text-xs"
    >
      <Plus className="w-3 h-3" />
      New Ticket
    </button>
  );

  const categoryOptions: { value: TicketCategory; label: string }[] = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'support', label: 'Support' },
  ];

  const priorityOptions: { value: TicketPriority; label: string }[] = [
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityDisabled = !canManagePriority;
  const statusDisabled = !canManageStatus;

  return (
      <BaseFormDialog
          open={open}
          mode={mode}
          title={title}
          description={descriptionText}
          trigger={trigger ?? defaultTrigger}
          onOpenChange={setOpen}
          onSubmit={handleSubmit}
          isSubmitting={processing}
          submitLabelCreate="Create"
          submitLabelEdit="Save Changes"
      >
          {/* System */}
          <div className="space-y-1">
              <Label htmlFor="system_id" className="flex items-center gap-1">
                  System
                  <span className="text-red-500">*</span>
              </Label>
              <Select
                  value={data.system_id ? String(data.system_id) : ''}
                  onValueChange={(value) =>
                      setData('system_id', value ? Number(value) : '')
                  }
              >
                  <SelectTrigger id="system_id" className="h-9">
                      <SelectValue placeholder="Pilih system" />
                  </SelectTrigger>
                  <SelectContent>
                      {systems.map((system) => (
                          <SelectItem key={system.id} value={String(system.id)}>
                              {system.code}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              {errors.system_id && (
                  <span className="text-xs text-red-500">
                      {errors.system_id}
                  </span>
              )}
          </div>

          {/* Title */}
          <div className="space-y-1">
              <Label htmlFor="title" className="flex items-center gap-1">
                  Title
                  <span className="text-red-500">*</span>
              </Label>
              <Input
                  id="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Masukan Judul Ticket"
                  className="placeholder:dark:text-gray-400"
              />
              {errors.title && (
                  <span className="text-xs text-red-500">{errors.title}</span>
              )}
          </div>

          {/* Description */}
          <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={4}
                  className="placeholder:text-muted-foreground"
              />
              {errors.description && (
                  <span className="text-xs text-red-500">
                      {errors.description}
                  </span>
              )}
          </div>

          {/* Category + Priority */}
          <div className="space-y-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Category */}
                  <div className="space-y-1">
                      <Label
                          htmlFor="category"
                          className="flex items-center gap-1"
                      >
                          Category
                          <span className="text-red-500">*</span>
                      </Label>
                      <Select
                          value={data.category || ''}
                          onValueChange={(value: TicketCategory) =>
                              setData('category', value)
                          }
                      >
                          <SelectTrigger id="category">
                              <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                              {categoryOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      {errors.category && (
                          <span className="text-xs text-red-500">
                              {errors.category}
                          </span>
                      )}
                  </div>

                  {/* Priority */}
                  {canManagePriority && (
                      <div className="space-y-1">
                          <Label
                              htmlFor="priority"
                              className="flex items-center gap-1"
                          >
                              Priority
                          </Label>
                          <Select
                              value={data.priority}
                              onValueChange={(value: TicketPriority) =>
                                  setData('priority', value)
                              }
                              disabled={priorityDisabled}
                          >
                              <SelectTrigger id="priority">
                                  <SelectValue placeholder="Pilih priority" />
                              </SelectTrigger>
                              <SelectContent>
                                  {priorityOptions.map((opt) => (
                                      <SelectItem
                                          key={opt.value}
                                          value={opt.value}
                                      >
                                          {opt.label}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          {errors.priority && (
                              <span className="text-xs text-red-500">
                                  {errors.priority}
                              </span>
                          )}
                      </div>
                  )}
              </div>
          </div>

          {canManageStatus && (
              <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Status */}
                      <div className="space-y-1">
                          <Label
                              htmlFor="status"
                              className="flex items-center gap-1"
                          >
                              Status
                          </Label>
                          <Select
                              value={data.status}
                              onValueChange={(value: TicketStatus) =>
                                  setData('status', value)
                              }
                              disabled={statusDisabled}
                          >
                              <SelectTrigger id="status">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  {statusOptions.map((opt) => (
                                      <SelectItem
                                          key={opt.value}
                                          value={opt.value}
                                      >
                                          {opt.label}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          {errors.status && (
                              <span className="text-xs text-red-500">
                                  {errors.status}
                              </span>
                          )}
                      </div>

                      {/* Due Date */}
                      <div className="space-y-1">
                          <Label
                              htmlFor="due_date"
                              className="flex items-center gap-1"
                          >
                              Due Date
                          </Label>
                          <Input
                              id="due_date"
                              type="date"
                              value={data.due_date ?? ''}
                              onChange={(e) =>
                                  setData('due_date', e.target.value)
                              }
                              className="h-9 placeholder:text-muted-foreground"
                          />
                          {errors.due_date && (
                              <span className="text-xs text-red-500">
                                  {errors.due_date}
                              </span>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* NEW: Assign To – hanya untuk admin/pm */}
          {canAssign && (
              <div className="space-y-1">
                  <div className="flex items-center justify-between">
                      <Label
                          htmlFor="assigned_to"
                          className="flex items-center gap-1"
                      >
                          Assign To
                      </Label>
                      <span className="text-[10px] text-muted-foreground">
                          Hanya admin/PM yang dapat assign.
                      </span>
                  </div>
                  <Select
                      value={
                          data.assigned_to !== null
                              ? String(data.assigned_to)
                              : 'unassigned' // sentinel untuk null
                      }
                      onValueChange={(value) => {
                          if (value === 'unassigned') {
                              setData('assigned_to', null); // clear
                          } else {
                              setData('assigned_to', Number(value));
                          }
                      }}
                  >
                      <SelectTrigger id="assigned_to" className="h-9">
                          <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                          {/* sentinel value, TIDAK kosong */}
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {assignees.map((dev) => (
                              <SelectItem key={dev.id} value={String(dev.id)}>
                                  {dev.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {errors.assigned_to && (
                      <span className="text-xs text-red-500">
                          {errors.assigned_to}
                      </span>
                  )}
              </div>
          )}

          {/* Attachment */}
          <div className="space-y-1">
              <Label htmlFor="attachment" className="flex items-center gap-1">
                  Attachment
                  <span className="text-[10px] font-normal text-muted-foreground">
                      (PDF / JPG / PNG, max 2MB)
                  </span>
              </Label>
              <Input
                  id="attachment"
                  type="file"
                  className="h-9 cursor-pointer"
                  onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setData('attachment', file);
                  }}
              />
              {errors.attachment && (
                  <span className="text-xs text-red-500">
                      {errors.attachment}
                  </span>
              )}
          </div>
      </BaseFormDialog>
  );
}

