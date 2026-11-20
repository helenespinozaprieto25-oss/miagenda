import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { TaskItem } from '../types/agenda';
import { formatFullSpanishDate, formatReadableDate, isPastDate } from '../utils/dateHelpers';

interface TasksViewProps {
  tasks: TaskItem[];
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function TasksView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TasksViewProps) {
  const [filter, setFilter] = useState<'todas' | 'pendientes' | 'completadas'>('todas');

  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filter === 'pendientes') return t.status === 'pendiente';
      if (filter === 'completadas') return t.status === 'completada';
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pendiente' ? -1 : 1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-5">
      {/* Encabezado y botón principal */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tareas del curso</h1>
            <p className="text-sm text-slate-600 mt-1 tabular-nums">
              {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'}{' '}
              <span aria-hidden="true">·</span> {completedCount}{' '}
              {completedCount === 1 ? 'completada' : 'completadas'}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Nueva tarea</span>
          </button>
        </div>

        {/* Filtros */}
        <div
          className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl"
          role="tablist"
          aria-label="Filtrar tareas por estado"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'todas'}
            onClick={() => setFilter('todas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'todas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'pendientes'}
            onClick={() => setFilter('pendientes')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'pendientes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'completadas'}
            onClick={() => setFilter('completadas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'completadas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hechas ({completedCount})
          </button>
        </div>
      </section>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            {filter === 'pendientes'
              ? 'No tienes tareas pendientes en este momento.'
              : filter === 'completadas'
              ? 'Todavía no has completado ninguna tarea.'
              : 'Aún no hay tareas registradas.'}
          </p>
          <p className="text-sm text-slate-600">
            Agrega una nueva actividad práctica o entrega del curso de Google AI Studio.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onAddTask}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear primera tarea</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completada';
            const overdue = !isDone && isPastDate(task.dueDate);

            return (
              <article
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                    <span>{task.module}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isDone
                          ? 'text-emerald-700'
                          : overdue
                          ? 'text-red-700'
                          : 'text-amber-800'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {isDone ? 'Completada' : overdue ? 'Pendiente (atrasada)' : 'Pendiente'}
                    </span>
                  </div>

                  <h2
                    className={`text-lg font-bold leading-snug ${
                      isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.name}
                  </h2>

                  <p className="text-base text-slate-600 leading-relaxed">{task.description}</p>

                  <p className="text-sm font-medium text-slate-800 flex items-center gap-2 pt-1 tabular-nums">
                    <CalendarDays className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>
                      Entrega: {formatReadableDate(task.dueDate)} ({formatFullSpanishDate(task.dueDate)})
                    </span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                      isDone
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Marcar como pendiente</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Marcar como completada</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Pencil className="w-4 h-4 shrink-0" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
