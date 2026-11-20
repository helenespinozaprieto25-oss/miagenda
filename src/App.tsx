import React, { useRef, useState } from 'react';
import { AlertCircle, CalendarDays, Check, Flag, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { BottomSheetModal } from './components/BottomSheetModal';

type PriorityLevel = 'Baja' | 'Media' | 'Alta';
type PriorityFilter = 'Todas' | 'Alta' | 'Media' | 'Baja';

interface ActivityItem {
  id: number;
  text: string;
  date: string; // YYYY-MM-DD
  priority: PriorityLevel;
  completed: boolean;
}

const PRIORITY_OPTIONS: PriorityLevel[] = ['Baja', 'Media', 'Alta'];
const PRIORITY_FILTERS: PriorityFilter[] = ['Todas', 'Alta', 'Media', 'Baja'];

const SHORT_MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatActivityDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const monthName = SHORT_MONTHS_ES[(month || 1) - 1] ?? '';
  const today = getTodayISO();

  if (dateStr === today) {
    return `Hoy · ${day} ${monthName}`;
  }
  return `${day} ${monthName} ${year}`;
}

function getPriorityTextClass(priority: PriorityLevel, completed: boolean): string {
  if (completed) return 'text-slate-500';
  if (priority === 'Alta') return 'text-rose-400 font-semibold';
  if (priority === 'Media') return 'text-amber-300 font-semibold';
  return 'text-teal-300 font-semibold';
}

function createInitialActivities(): ActivityItem[] {
  const today = getTodayISO();
  return [
    {
      id: 1,
      text: 'Leer cómo funciona Column y Row',
      date: today,
      priority: 'Baja',
      completed: true,
    },
    {
      id: 2,
      text: 'Probar el campo para escribir una actividad',
      date: today,
      priority: 'Alta',
      completed: false,
    },
    {
      id: 3,
      text: 'Marcar o eliminar una actividad de la lista',
      date: today,
      priority: 'Media',
      completed: false,
    },
  ];
}

export default function App() {
  // Estado en memoria: se conserva únicamente mientras la aplicación está abierta
  const [activityText, setActivityText] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityPriority, setActivityPriority] = useState<PriorityLevel>('Media');
  const [showError, setShowError] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [activities, setActivities] = useState<ActivityItem[]>(createInitialActivities);
  const inputRef = useRef<HTMLInputElement>(null);

  // Estado para búsqueda en tiempo real y filtro por prioridad
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('Todas');

  // Estado para edición de una actividad existente
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const [showEditError, setShowEditError] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setActivityText(value);
    if (showError && value.trim().length > 0) {
      setShowError(false);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = activityText.trim();

    if (!cleanText) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }

    const finalDate = activityDate || getTodayISO();

    setActivities((prev) => [
      ...prev,
      {
        id: nextId,
        text: cleanText,
        date: finalDate,
        priority: activityPriority,
        completed: false,
      },
    ]);
    setNextId((prev) => prev + 1);
    setActivityText('');
    setActivityDate('');
    setActivityPriority('Media');
    setShowError(false);
  };

  const handleToggleCompleted = (id: number) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteActivity = (id: number) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenEdit = (activity: ActivityItem) => {
    setEditingActivity(activity);
    setEditText(activity.text);
    setEditDate(activity.date);
    setShowEditError(false);
  };

  const handleCloseEdit = () => {
    setEditingActivity(null);
    setShowEditError(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    const cleanText = editText.trim();
    if (!cleanText) {
      setShowEditError(true);
      editInputRef.current?.focus();
      return;
    }

    const finalDate = editDate || getTodayISO();

    setActivities((prev) =>
      prev.map((item) =>
        item.id === editingActivity.id
          ? { ...item, text: cleanText, date: finalDate }
          : item
      )
    );
    handleCloseEdit();
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const completionPercentage =
    activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const isFiltered = Boolean(normalizedSearch) || priorityFilter !== 'Todas';
  const filteredActivities = activities.filter((a) => {
    const matchesSearch = !normalizedSearch || a.text.toLowerCase().includes(normalizedSearch);
    const matchesPriority = priorityFilter === 'Todas' || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-[#0D1E26] sm:bg-gradient-to-br sm:from-[#07111A] sm:via-[#0B1E24] sm:to-[#071B19] text-slate-100 flex flex-col sm:items-center sm:justify-center sm:p-2">
      {/* Marco modelo celular alargado visible en pantallas medianas y grandes */}
      <div className="w-full flex-1 sm:flex-none sm:w-[356px] sm:h-[860px] sm:max-h-[96vh] bg-gradient-to-b from-[#0D1E26] via-[#0F1824] to-[#0B121C] sm:rounded-[48px] sm:border-[10px] sm:border-zinc-900 sm:ring-1 sm:ring-white/10 sm:shadow-2xl flex flex-col sm:overflow-hidden">
        {/* Altavoz y cámara frontal del teléfono (solo en vista de escritorio/tablet) */}
        <div
          aria-hidden="true"
          className="hidden sm:flex items-center justify-center h-7 bg-zinc-900 shrink-0"
        >
          <span className="w-14 h-1.5 bg-zinc-700 rounded-full" />
          <span className="w-2.5 h-2.5 bg-zinc-700 rounded-full ml-2" />
        </div>

        {/* Barra superior fija de la aplicación móvil */}
        <header className="sticky top-0 sm:static z-30 bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-sm shrink-0">
          <div className="w-full px-4 h-14 flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold tracking-tight truncate">Mi Agenda</h1>
            <span className="text-sm font-semibold text-teal-50 tabular-nums whitespace-nowrap shrink-0">
              {completedCount}/{activities.length} hechas
            </span>
          </div>
        </header>

        {/* Área desplazable de la pantalla del celular */}
        <main className="flex-1 w-full px-4 py-5 flex flex-col sm:overflow-y-auto pb-safe">
          {/* Formulario para agregar actividad */}
          <form onSubmit={handleAddActivity} noValidate className="space-y-3.5">
            <div>
              <label
                htmlFor="activity-input"
                className="block text-sm font-semibold text-slate-200 mb-1.5"
              >
                Nueva actividad
              </label>
              <input
                ref={inputRef}
                id="activity-input"
                type="text"
                value={activityText}
                onChange={handleInputChange}
                placeholder="Escribe una actividad..."
                aria-invalid={showError}
                aria-describedby={showError ? 'activity-error' : undefined}
                className={`w-full min-h-[48px] px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 bg-slate-900/90 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  showError
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-700 focus:ring-teal-400 focus:border-teal-400'
                }`}
              />

              {showError && (
                <p
                  id="activity-error"
                  role="alert"
                  className="mt-2 text-sm font-medium text-rose-400 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Debes escribir una actividad para poder agregarla.</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="activity-date"
                className="block text-sm font-semibold text-slate-200 mb-1.5"
              >
                Fecha <span className="font-normal text-slate-400">(opcional, hoy por defecto)</span>
              </label>
              <input
                id="activity-date"
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 text-base text-slate-100 bg-slate-900/90 border border-slate-700 rounded-xl tabular-nums [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-200 mb-1.5">
                Prioridad
              </span>
              <div
                className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl"
                role="radiogroup"
                aria-label="Nivel de prioridad"
              >
                {PRIORITY_OPTIONS.map((level) => {
                  const isSelected = activityPriority === level;
                  const activeColor =
                    level === 'Alta'
                      ? 'bg-slate-800 text-rose-400 shadow-sm'
                      : level === 'Media'
                      ? 'bg-slate-800 text-amber-300 shadow-sm'
                      : 'bg-slate-800 text-teal-300 shadow-sm';

                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setActivityPriority(level)}
                      className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                        isSelected
                          ? activeColor
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 active:scale-[0.99] text-slate-950 font-bold text-base inline-flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5 shrink-0" />
              <span>Agregar actividad</span>
            </button>
          </form>

          {/* Lista de actividades agregadas */}
          <section
            aria-label="Lista de actividades"
            className="mt-6 pt-5 border-t border-slate-800 flex-1 flex flex-col"
          >
            {/* Pequeña tarjeta de resumen con barra de progreso */}
            <div className="mb-4 bg-slate-900/85 rounded-2xl border border-teal-500/25 p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Progreso de tareas</p>
                  <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                    {completedCount} de {activities.length}{' '}
                    {activities.length === 1 ? 'completada' : 'completadas'}
                  </p>
                </div>
                <span className="text-xl font-bold text-teal-300 tabular-nums shrink-0">
                  {completionPercentage}%
                </span>
              </div>
              <div
                className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="Porcentaje de tareas completadas"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200">
                Lista de actividades
              </h2>
              <span className="text-xs font-medium text-slate-400 tabular-nums">
                {isFiltered
                  ? `${filteredActivities.length} de ${activities.length}`
                  : `${activities.length} ${activities.length === 1 ? 'actividad' : 'actividades'}`}
              </span>
            </div>

            {/* Barra de búsqueda en tiempo real */}
            <div className="relative mb-3">
              <Search
                aria-hidden="true"
                className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar actividad por nombre..."
                aria-label="Buscar actividad por nombre"
                className={`w-full min-h-[48px] pl-11 py-2.5 text-base text-slate-100 placeholder:text-slate-400 bg-slate-900/90 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 ${
                  searchQuery ? 'pr-12' : 'pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white absolute right-1 top-1/2 -translate-y-1/2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selector de filtro por prioridad */}
            <div
              className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-3.5"
              role="tablist"
              aria-label="Filtrar actividades por prioridad"
            >
              {PRIORITY_FILTERS.map((filterOption) => {
                const isSelected = priorityFilter === filterOption;
                const activeColor =
                  filterOption === 'Alta'
                    ? 'bg-slate-800 text-rose-400 shadow-sm'
                    : filterOption === 'Media'
                    ? 'bg-slate-800 text-amber-300 shadow-sm'
                    : filterOption === 'Baja'
                    ? 'bg-slate-800 text-teal-300 shadow-sm'
                    : 'bg-slate-800 text-teal-300 shadow-sm';

                return (
                  <button
                    key={filterOption}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setPriorityFilter(filterOption)}
                    className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isSelected
                        ? activeColor
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {filterOption}
                  </button>
                );
              })}
            </div>

            {activities.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-12 px-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                <p className="text-base text-slate-300 leading-relaxed">
                  Todavía no hay actividades. Escribe una arriba para comenzar.
                </p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-base text-slate-300 leading-relaxed">
                  No hay actividades que coincidan con el filtro aplicado.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPriorityFilter('Todas');
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold transition-colors"
                >
                  Mostrar todas
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {filteredActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="bg-slate-900/85 border border-slate-800 rounded-2xl px-2 py-2 flex items-center gap-1"
                  >
                    {/* Control para marcar como completada */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={activity.completed}
                      aria-label={
                        activity.completed
                          ? `Desmarcar "${activity.text}"`
                          : `Marcar "${activity.text}" como completada`
                      }
                      onClick={() => handleToggleCompleted(activity.id)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl active:bg-slate-800 transition-colors shrink-0"
                    >
                      <span
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          activity.completed
                            ? 'bg-teal-400 border-teal-400 text-slate-950'
                            : 'bg-slate-950 border-slate-600'
                        }`}
                      >
                        {activity.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </span>
                    </button>

                    {/* Nombre, fecha y prioridad de la actividad */}
                    <div
                      onClick={() => handleToggleCompleted(activity.id)}
                      className="flex-1 min-w-0 py-1 cursor-pointer select-none"
                    >
                      <p
                        className={`text-base leading-snug ${
                          activity.completed
                            ? 'line-through text-slate-500'
                            : 'text-slate-100'
                        }`}
                      >
                        {activity.text}
                      </p>
                      <div className="mt-1 text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
                        <span className="font-medium text-slate-400 inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formatActivityDate(activity.date)}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${getPriorityTextClass(
                            activity.priority,
                            activity.completed
                          )}`}
                        >
                          <Flag className="w-3 h-3 shrink-0" />
                          Prioridad {activity.priority}
                        </span>
                      </div>
                    </div>

                    {/* Botón para editar nombre y fecha */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(activity)}
                      aria-label={`Editar "${activity.text}"`}
                      title="Editar actividad"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 active:bg-teal-500/20 transition-colors shrink-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Botón para eliminar actividad */}
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(activity.id)}
                      aria-label={`Eliminar "${activity.text}"`}
                      title="Eliminar actividad"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        {/* Barra inferior de gesto del modelo celular */}
        <div
          aria-hidden="true"
          className="hidden sm:flex items-center justify-center h-5 bg-[#0B121C] shrink-0"
        >
          <span className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Formulario sencillo en hoja inferior para editar nombre y fecha */}
      <BottomSheetModal
        isOpen={editingActivity !== null}
        onClose={handleCloseEdit}
        title="Editar actividad"
      >
        <form onSubmit={handleSaveEdit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="edit-activity-input"
              className="block text-sm font-semibold text-slate-200 mb-1.5"
            >
              Nombre de la actividad
            </label>
            <input
              ref={editInputRef}
              id="edit-activity-input"
              type="text"
              value={editText}
              onChange={(e) => {
                const value = e.target.value;
                setEditText(value);
                if (showEditError && value.trim().length > 0) {
                  setShowEditError(false);
                }
              }}
              placeholder="Escribe el nombre de la actividad..."
              aria-invalid={showEditError}
              aria-describedby={showEditError ? 'edit-activity-error' : undefined}
              className={`w-full min-h-[48px] px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                showEditError
                  ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                  : 'border-slate-700 focus:ring-teal-400 focus:border-teal-400'
              }`}
            />

            {showEditError && (
              <p
                id="edit-activity-error"
                role="alert"
                className="mt-2 text-sm font-medium text-rose-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Debes escribir una actividad para guardar los cambios.</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-activity-date"
              className="block text-sm font-semibold text-slate-200 mb-1.5"
            >
              Fecha
            </label>
            <input
              id="edit-activity-date"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 text-base text-slate-100 bg-slate-900 border border-slate-700 rounded-xl tabular-nums [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-base transition-colors whitespace-nowrap"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={handleCloseEdit}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-base transition-colors whitespace-nowrap"
            >
              Cancelar
            </button>
          </div>
        </form>
      </BottomSheetModal>
    </div>
  );
}
