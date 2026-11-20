export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export interface CourseClass {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  modality: 'En vivo' | 'Grabada' | 'Taller práctico';
  instructor: string;
}

export interface TaskItem {
  id: string;
  name: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: string;
}

export interface NoteItem {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}
