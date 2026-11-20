import React, { useState } from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { COURSE_MODULES } from '../data/initialData';
import { TabId, TaskItem } from '../types/agenda';
import { formatReadableDate } from '../utils/dateHelpers';

interface ProgressViewProps {
  tasks: TaskItem[];
  classesCount: number;
  notesCount: number;
  onToggleTaskStatus: (taskId: string) => void;
  onNavigate: (tab: TabId) => void;
  onResetSampleData: () => void;
}

export function ProgressView({
  tasks,
  classesCount,
  notesCount,
  onToggleTaskStatus,
  onNavigate,
  onResetSampleData,
}: ProgressViewProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');
  const percentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // SVG progress ring geometry
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const moduleBreakdown = COURSE_MODULES.map((mod) => {
    const modTasks = tasks.filter((t) => t.module === mod);
    const modDone = modTasks.filter((t) => t.status === 'completada').length;
    return {
      module: mod,
      total: modTasks.length,
      done: modDone,
      pct: modTasks.length > 0 ? Math.round((modDone / modTasks.length) * 100) : 0,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de avance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900">Tu progreso en el curso</h1>
        <p className="text-sm text-slate-600 mt-1">
          Resumen general de tareas completadas y pendientes en Google AI Studio.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Anillo de progreso */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">{percentage}%</span>
              <span className="text-xs font-medium text-slate-500">completado</span>
            </div>
          </div>

          {/* Métricas numéricas claras */}
          <div className="w-full grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center sm:text-left">
              <p className="text-xs font-semibold text-emerald-800">Completadas</p>
              <p className="text-2xl font-bold text-emerald-900 tabular-nums mt-1">
                {completedTasks.length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center sm:text-left">
              <p className="text-xs font-semibold text-amber-800">Pendientes</p>
              <p className="text-2xl font-bold text-amber-900 tabular-nums mt-1">
                {pendingTasks.length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-700">Total tareas</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{totalTasks}</p>
            </div>
          </div>
        </div>

        <p className="mt-5 pt-4 border-t border-slate-100 text-sm text-slate-600 tabular-nums">
          Además tienes <strong className="text-slate-900">{classesCount}</strong>{' '}
          {classesCount === 1 ? 'clase registrada' : 'clases registradas'} y{' '}
          <strong className="text-slate-900">{notesCount}</strong>{' '}
          {notesCount === 1 ? 'nota de estudio' : 'notas de estudio'}.
        </p>
      </section>

      {/* Avance por módulo */}
      {moduleBreakdown.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Avance por módulo</h2>
          <div className="space-y-4">
            {moduleBreakdown.map((item) => (
              <div key={item.module} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-800 truncate">{item.module}</span>
                  <span className="text-slate-600 font-medium tabular-nums shrink-0">
                    {item.done} de {item.total} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Listado comparativo: Pendientes y Completadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Pendientes ({pendingTasks.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Ir a Tareas
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-600 py-3">
              ¡Excelente! No quedan tareas pendientes.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-900">{task.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      Entrega: {formatReadableDate(task.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shrink-0 whitespace-nowrap"
                  >
                    Completar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Completadas ({completedTasks.length})</span>
          </h2>

          {completedTasks.length === 0 ? (
            <p className="text-sm text-slate-600 py-3">
              Aún no hay tareas marcadas como completadas.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-base font-medium text-slate-600 line-through">
                      {task.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {task.module}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold shrink-0 whitespace-nowrap"
                  >
                    Marcar pendiente
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Opción simple para restaurar los datos de ejemplo */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Datos del curso de ejemplo</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Tus cambios se guardan automáticamente en este dispositivo. Si quieres volver al
              temario inicial de prueba, puedes restaurarlo aquí.
            </p>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar datos de ejemplo</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onResetSampleData();
                  setConfirmReset(false);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold whitespace-nowrap"
              >
                Confirmar restauración
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold whitespace-nowrap"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
