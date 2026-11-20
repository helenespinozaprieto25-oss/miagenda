import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import { CourseClass, TabId, TaskItem } from '../types/agenda';
import {
  formatFullSpanishDate,
  formatReadableDate,
  getTodayISO,
  isPastDate,
} from '../utils/dateHelpers';

interface HomeViewProps {
  classes: CourseClass[];
  tasks: TaskItem[];
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function HomeView({
  classes,
  tasks,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: HomeViewProps) {
  const today = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  return (
    <div className="space-y-6">
      {/* Saludo y acciones rápidas */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <p className="text-sm text-slate-600 mb-1">
          Curso de Google AI Studio <span aria-hidden="true">·</span> {formatFullSpanishDate(today)}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
          Resumen de hoy
        </h1>
        <p className="text-base text-slate-600 mt-1.5 leading-relaxed">
          Tienes <strong className="text-slate-900 tabular-nums">{upcomingClasses.length}</strong>{' '}
          {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'} y{' '}
          <strong className="text-slate-900 tabular-nums">{pendingTasks.length}</strong>{' '}
          {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'} (
          <span className="tabular-nums">{completedCount}</span> completadas).
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar tarea</span>
          </button>
          <button
            type="button"
            onClick={onAddClass}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-base flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar clase</span>
          </button>
        </div>
      </section>

      {/* Grid principal: 1 columna en móvil, 2 columnas en escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Próximas clases */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <Video className="w-5 h-5 text-blue-700 shrink-0" />
              <h2 className="text-xl font-bold text-slate-900 truncate">Próximas clases</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver calendario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="py-8 text-center space-y-3 border-t border-slate-100">
              <p className="text-base text-slate-600">
                No tienes clases programadas para los próximos días.
              </p>
              <button
                type="button"
                onClick={onAddClass}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Programar una clase</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {upcomingClasses.map((cls) => (
                <article key={cls.id} className="py-4 first:pt-1 last:pb-1 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {cls.module} <span aria-hidden="true">·</span> {cls.modality}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-1 leading-snug">
                      {cls.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 tabular-nums">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                        <CalendarDays className="w-4 h-4 text-blue-700 shrink-0" />
                        {formatReadableDate(cls.date)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        {cls.time} h ({cls.durationMinutes} min)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{cls.instructor}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Tareas pendientes */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="w-5 h-5 text-amber-700 shrink-0" />
              <h2 className="text-xl font-bold text-slate-900 truncate">Tareas pendientes</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="py-8 text-center space-y-3 border-t border-slate-100">
              <p className="text-base text-slate-700 font-medium">
                ¡No tienes tareas pendientes por ahora!
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar nueva tarea</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingTasks.map((task) => {
                const overdue = isPastDate(task.dueDate);
                return (
                  <article key={task.id} className="py-4 first:pt-1 last:pb-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {task.module} <span aria-hidden="true">·</span>{' '}
                        <span className={overdue ? 'text-red-700 font-semibold' : 'text-amber-800 font-semibold'}>
                          {overdue ? 'Entrega atrasada' : 'Pendiente'}
                        </span>
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-1 leading-snug">
                        {task.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-800 tabular-nums">
                        Entrega: {formatReadableDate(task.dueDate)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Marcar como completada</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
