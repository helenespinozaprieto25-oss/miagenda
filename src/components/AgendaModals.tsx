import React, { useEffect, useState } from 'react';
import { COURSE_MODULES } from '../data/initialData';
import { CourseClass, NoteItem, TaskItem, TaskStatus } from '../types/agenda';
import { getTodayISO } from '../utils/dateHelpers';
import { BottomSheetModal } from './BottomSheetModal';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass: CourseClass | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseClass, 'id'>, existingId?: string) => void;
}

export function ClassFormModal({
  isOpen,
  onClose,
  initialClass,
  defaultDate,
  onSave,
}: ClassFormModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState(COURSE_MODULES[0]);
  const [date, setDate] = useState(getTodayISO());
  const [time, setTime] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [modality, setModality] = useState<CourseClass['modality']>('En vivo');
  const [instructor, setInstructor] = useState('Prof. Laura Méndez');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (initialClass) {
      setTitle(initialClass.title);
      setModule(initialClass.module);
      setDate(initialClass.date);
      setTime(initialClass.time);
      setDurationMinutes(initialClass.durationMinutes);
      setModality(initialClass.modality);
      setInstructor(initialClass.instructor);
    } else {
      setTitle('');
      setModule(COURSE_MODULES[0]);
      setDate(defaultDate || getTodayISO());
      setTime('18:00');
      setDurationMinutes(60);
      setModality('En vivo');
      setInstructor('Prof. Laura Méndez');
    }
  }, [isOpen, initialClass, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la clase.');
      return;
    }
    if (!date) {
      setError('Selecciona la fecha de la clase.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        module,
        date,
        time: time || '18:00',
        durationMinutes: Number(durationMinutes) || 60,
        modality,
        instructor: instructor.trim() || 'Por confirmar',
      },
      initialClass?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialClass ? 'Editar clase' : 'Nueva clase'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="class-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nombre de la clase
          </label>
          <input
            id="class-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Prompts con archivos PDF en AI Studio"
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
          />
        </div>

        <div>
          <label htmlFor="class-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Módulo del curso
          </label>
          <select
            id="class-module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            {COURSE_MODULES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="class-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Fecha
            </label>
            <input
              id="class-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div>
            <label htmlFor="class-time" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Hora
            </label>
            <input
              id="class-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="class-modality" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Modalidad
            </label>
            <select
              id="class-modality"
              value={modality}
              onChange={(e) => setModality(e.target.value as CourseClass['modality'])}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="En vivo">En vivo</option>
              <option value="Grabada">Grabada</option>
              <option value="Taller práctico">Taller práctico</option>
            </select>
          </div>

          <div>
            <label htmlFor="class-duration" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Duración (minutos)
            </label>
            <input
              id="class-duration"
              type="number"
              min={15}
              max={240}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
        </div>

        <div>
          <label htmlFor="class-instructor" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Docente
          </label>
          <input
            id="class-instructor"
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="Ej. Prof. Laura Méndez"
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors whitespace-nowrap"
          >
            {initialClass ? 'Guardar cambios de la clase' : 'Guardar nueva clase'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors whitespace-nowrap"
          >
            Cancelar
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask: TaskItem | null;
  defaultDate?: string;
  onSave: (data: Omit<TaskItem, 'id'>, existingId?: string) => void;
}

export function TaskFormModal({
  isOpen,
  onClose,
  initialTask,
  defaultDate,
  onSave,
}: TaskFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [module, setModule] = useState(COURSE_MODULES[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setStatus(initialTask.status);
      setModule(initialTask.module);
    } else {
      setName('');
      setDescription('');
      setDueDate(defaultDate || getTodayISO());
      setStatus('pendiente');
      setModule(COURSE_MODULES[0]);
    }
  }, [isOpen, initialTask, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona una fecha de entrega.');
      return;
    }
    onSave(
      {
        name: name.trim(),
        description: description.trim() || 'Sin descripción adicional.',
        dueDate,
        status,
        module,
      },
      initialTask?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Editar tarea' : 'Nueva tarea'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="task-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nombre de la tarea
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Probar Structured Outputs con JSON"
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Descripción
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe qué debes entregar o practicar..."
            className="w-full px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Fecha de entrega
            </label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div>
            <label htmlFor="task-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Tema o módulo
            </label>
            <select
              id="task-module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              {COURSE_MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-800 mb-1.5">Estado</span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setStatus('pendiente')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                status === 'pendiente'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() => setStatus('completada')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                status === 'completada'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completada
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors whitespace-nowrap"
          >
            {initialTask ? 'Guardar cambios' : 'Guardar tarea'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors whitespace-nowrap"
          >
            Cancelar
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote: NoteItem | null;
  onSave: (data: Omit<NoteItem, 'id' | 'updatedAt'>, existingId?: string) => void;
}

export function NoteFormModal({
  isOpen,
  onClose,
  initialNote,
  onSave,
}: NoteFormModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(COURSE_MODULES[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (initialNote) {
      setTitle(initialNote.title);
      setTopic(initialNote.topic);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setTopic(COURSE_MODULES[0]);
      setContent('');
    }
  }, [isOpen, initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu nota.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de tus apuntes.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        topic,
        content: content.trim(),
      },
      initialNote?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Editar nota' : 'Nueva nota'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="note-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Título del apunte
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Parámetros clave en Google AI Studio"
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div>
          <label htmlFor="note-topic" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Tema del curso
          </label>
          <select
            id="note-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            {COURSE_MODULES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Apuntes
          </label>
          <textarea
            id="note-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Anota ideas clave, ejemplos de prompts o recordatorios..."
            className="w-full px-3.5 py-2.5 text-base leading-relaxed text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors whitespace-nowrap"
          >
            {initialNote ? 'Guardar cambios de la nota' : 'Guardar nota'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors whitespace-nowrap"
          >
            Cancelar
          </button>
        </div>
      </form>
    </BottomSheetModal>
  );
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-5">
        <p className="text-base text-slate-700 leading-relaxed">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-base transition-colors whitespace-nowrap"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors whitespace-nowrap"
          >
            Cancelar
          </button>
        </div>
      </div>
    </BottomSheetModal>
  );
}
