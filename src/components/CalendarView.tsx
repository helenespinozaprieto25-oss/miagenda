import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import { CourseClass, TaskItem } from '../types/agenda';
import {
  addDaysISO,
  formatFullSpanishDate,
  formatReadableDate,
  getTodayISO,
  getWeekDatesFrom,
} from '../utils/dateHelpers';

interface CalendarViewProps {
  classes: CourseClass[];
  tasks: TaskItem[];
  onAddClassForDate: (date: string) => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTaskForDate: (date: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function CalendarView({
  classes,
  tasks,
  onAddClassForDate,
  onEditClass,
  onDeleteClass,
  onAddTaskForDate,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarViewProps) {
  const today = getTodayISO();
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const weekDays = getWeekDatesFrom(selectedDate);

  const getActivitiesForDay = (dateISO: string) => {
    const dayClasses = classes
      .filter((c) => c.date === dateISO)
      .sort((a, b) => a.time.localeCompare(b.time));
    const dayTasks = tasks.filter((t) => t.dueDate === dateISO);
    return { dayClasses, dayTasks };
  };

  const selectedDayData = getActivitiesForDay(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate((prev) => addDaysISO(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addDaysISO(prev, 7));
  };

  const handleGoToday = () => {
    setSelectedDate(today);
  };

  return (
    <div className="space-y-5">
      {/* Cabecera de Calendario + Selector Día / Semana */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calendario de actividades</h1>
            <p className="text-sm text-slate-600 mt-1">
              Consulta tus clases y fechas de entrega por día o por semana.
            </p>
          </div>

          <div
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl shrink-0"
            role="tablist"
            aria-label="Tipo de vista del calendario"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'dia'}
              onClick={() => setViewMode('dia')}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'dia'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por día
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'semana'}
              onClick={() => setViewMode('semana')}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'semana'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por semana
            </button>
          </div>
        </div>

        {/* Controles de semana */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Semana ant.</span>
          </button>

          <button
            type="button"
            onClick={handleGoToday}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-900 text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Ir a hoy
          </button>

          <button
            type="button"
            onClick={handleNextWeek}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>Semana sig.</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Tira horizontal de días */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            const { dayClasses, dayTasks } = getActivitiesForDay(day.iso);
            const totalCount = dayClasses.length + dayTasks.length;
            const isSelected = day.iso === selectedDate;
            const isToday = day.iso === today;

            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => {
                  setSelectedDate(day.iso);
                  setViewMode('dia');
                }}
                className={`min-h-[68px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-colors border ${
                  isSelected
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : isToday
                    ? 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {day.shortDay}
                </span>
                <span className="text-lg font-bold tabular-nums leading-tight mt-0.5">
                  {day.dayNumber}
                </span>
                <span
                  className={`text-[10px] font-medium tabular-nums mt-0.5 ${
                    isSelected
                      ? 'text-blue-100'
                      : totalCount > 0
                      ? 'text-blue-700'
                      : 'text-slate-400'
                  }`}
                >
                  {totalCount > 0 ? `${totalCount} act.` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vista por Día */}
      {viewMode === 'dia' ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold text-blue-700">
                {formatReadableDate(selectedDate)}
              </p>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {formatFullSpanishDate(selectedDate)}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2.5">
              <button
                type="button"
                onClick={() => onAddClassForDate(selectedDate)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Nueva clase</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Nueva tarea</span>
              </button>
            </div>
          </div>

          {selectedDayData.dayClasses.length === 0 &&
          selectedDayData.dayTasks.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-base font-medium text-slate-700">
                No hay clases ni entregas programadas para este día.
              </p>
              <p className="text-sm text-slate-500">
                Usa los botones de arriba para agregar una clase o tarea en esta fecha.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedDayData.dayClasses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-600">
                    Clases del día ({selectedDayData.dayClasses.length})
                  </h3>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl px-4">
                    {selectedDayData.dayClasses.map((cls) => (
                      <article key={cls.id} className="py-4 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Clase <span aria-hidden="true">·</span> {cls.module}{' '}
                            <span aria-hidden="true">·</span> {cls.modality}
                          </p>
                          <h4 className="text-base font-semibold text-slate-900 mt-1">
                            {cls.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1 tabular-nums flex items-center gap-2">
                            <Video className="w-4 h-4 text-blue-700 shrink-0" />
                            <span>
                              {cls.time} h ({cls.durationMinutes} min) · {cls.instructor}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Editar clase</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(cls)}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {selectedDayData.dayTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-600">
                    Entregas de tareas ({selectedDayData.dayTasks.length})
                  </h3>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl px-4">
                    {selectedDayData.dayTasks.map((task) => {
                      const isDone = task.status === 'completada';
                      return (
                        <article key={task.id} className="py-4 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-slate-500">
                              Tarea <span aria-hidden="true">·</span> {task.module}{' '}
                              <span aria-hidden="true">·</span>{' '}
                              <span
                                className={
                                  isDone
                                    ? 'text-emerald-700 font-semibold'
                                    : 'text-amber-800 font-semibold'
                                }
                              >
                                {isDone ? 'Completada' : 'Pendiente'}
                              </span>
                            </p>
                            <h4
                              className={`text-base font-semibold mt-1 ${
                                isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {task.name}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                                isDone
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <Clock className="w-4 h-4" />
                                  <span>Marcar pendiente</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Marcar completada</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteTask(task)}
                              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      ) : (
        /* Vista por Semana */
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Resumen de la semana
            </h2>
            <p className="text-sm text-slate-600 tabular-nums">
              {weekDays[0].dayNumber} {weekDays[0].monthShort} – {weekDays[6].dayNumber}{' '}
              {weekDays[6].monthShort}
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {weekDays.map((day) => {
              const { dayClasses, dayTasks } = getActivitiesForDay(day.iso);
              const isToday = day.iso === today;
              const hasAny = dayClasses.length > 0 || dayTasks.length > 0;

              return (
                <div key={day.iso} className="py-4 first:pt-2 last:pb-2 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.iso);
                        setViewMode('dia');
                      }}
                      className="min-h-[44px] text-left flex items-center gap-2 hover:text-blue-700 transition-colors"
                    >
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {day.shortDay} {day.dayNumber} {day.monthShort}
                      </span>
                      {isToday && (
                        <span className="text-xs font-semibold text-blue-700">
                          · Hoy
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddTaskForDate(day.iso)}
                      className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar tarea</span>
                    </button>
                  </div>

                  {!hasAny ? (
                    <p className="text-sm text-slate-400">Sin actividades programadas.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {dayClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-blue-700 tabular-nums">
                              Clase · {cls.time} h · {cls.modality}
                            </p>
                            <p className="text-base font-semibold text-slate-900 mt-0.5">
                              {cls.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => onEditClass(cls)}
                              className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-sm font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteClass(cls)}
                              className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-red-50 text-red-700 text-sm font-semibold"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}

                      {dayTasks.map((task) => {
                        const isDone = task.status === 'completada';
                        return (
                          <div
                            key={task.id}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-semibold ${
                                  isDone ? 'text-emerald-700' : 'text-amber-800'
                                }`}
                              >
                                Tarea · {isDone ? 'Completada' : 'Pendiente'}
                              </p>
                              <p
                                className={`text-base font-semibold mt-0.5 ${
                                  isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                                }`}
                              >
                                {task.name}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => onToggleTaskStatus(task.id)}
                                className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold ${
                                  isDone
                                    ? 'bg-white border border-slate-200 text-slate-800'
                                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                                }`}
                              >
                                {isDone ? 'Reabrir' : 'Completar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditTask(task)}
                                className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-sm font-semibold"
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
