import React, { useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { COURSE_MODULES } from '../data/initialData';
import { NoteItem } from '../types/agenda';
import { formatReadableDate } from '../utils/dateHelpers';

interface NotesViewProps {
  notes: NoteItem[];
  onAddNote: () => void;
  onEditNote: (note: NoteItem) => void;
  onDeleteNote: (note: NoteItem) => void;
}

export function NotesView({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: NotesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');

  const filteredNotes = notes.filter((note) => {
    const matchesTopic = selectedTopic === 'todos' || note.topic === selectedTopic;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.topic.toLowerCase().includes(q);
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Cabecera, búsqueda y filtro por tema */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notas y apuntes</h1>
            <p className="text-sm text-slate-600 mt-1 tabular-nums">
              {notes.length} {notes.length === 1 ? 'apunte guardado' : 'apuntes guardados'} sobre
              Google AI Studio
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNote}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Nueva nota</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar apuntes..."
              aria-label="Buscar en tus apuntes"
              className="w-full min-h-[48px] pl-11 pr-4 py-2.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div>
            <label htmlFor="notes-topic-filter" className="sr-only">
              Filtrar por tema del curso
            </label>
            <select
              id="notes-topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="todos">Todos los temas</option>
              {COURSE_MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Lista de notas */}
      {filteredNotes.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-800">
            {notes.length === 0
              ? 'Todavía no tienes apuntes guardados.'
              : 'No se encontraron notas con ese filtro.'}
          </p>
          <p className="text-sm text-slate-600">
            Guarda ideas clave sobre prompts, parámetros y modelos de Google AI Studio.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onAddNote}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Escribir nueva nota</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-slate-500 tabular-nums">
                  {note.topic} <span aria-hidden="true">·</span> Actualizado:{' '}
                  {formatReadableDate(note.updatedAt)}
                </p>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">{note.title}</h2>

                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-4 h-4 shrink-0" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
