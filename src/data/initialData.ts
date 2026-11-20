import { CourseClass, NoteItem, TaskItem } from '../types/agenda';
import { addDaysISO, getTodayISO } from '../utils/dateHelpers';

export const COURSE_MODULES = [
  'Módulo 1 · Primeros pasos',
  'Módulo 2 · Ingeniería de prompts',
  'Módulo 3 · Prompts multimodales',
  'Módulo 4 · Salidas estructuradas',
  'Módulo 5 · Integración con API',
];

export function createInitialClasses(): CourseClass[] {
  const today = getTodayISO();
  return [
    {
      id: 'cls-1',
      title: 'Introducción al entorno de Google AI Studio',
      module: 'Módulo 1 · Primeros pasos',
      date: addDaysISO(today, -2),
      time: '18:00',
      durationMinutes: 60,
      modality: 'Grabada',
      instructor: 'Prof. Laura Méndez',
    },
    {
      id: 'cls-2',
      title: 'Diseño de System Instructions y ejemplos Few-Shot',
      module: 'Módulo 2 · Ingeniería de prompts',
      date: today,
      time: '19:00',
      durationMinutes: 75,
      modality: 'En vivo',
      instructor: 'Prof. Carlos Vega',
    },
    {
      id: 'cls-3',
      title: 'Ajuste de temperatura, Top-P y límites de tokens',
      module: 'Módulo 2 · Ingeniería de prompts',
      date: addDaysISO(today, 1),
      time: '18:30',
      durationMinutes: 60,
      modality: 'Taller práctico',
      instructor: 'Prof. Carlos Vega',
    },
    {
      id: 'cls-4',
      title: 'Análisis de imágenes y PDFs con Gemini multimodal',
      module: 'Módulo 3 · Prompts multimodales',
      date: addDaysISO(today, 3),
      time: '19:00',
      durationMinutes: 90,
      modality: 'En vivo',
      instructor: 'Prof. Laura Méndez',
    },
    {
      id: 'cls-5',
      title: 'Esquemas JSON y Function Calling en la práctica',
      module: 'Módulo 4 · Salidas estructuradas',
      date: addDaysISO(today, 5),
      time: '17:00',
      durationMinutes: 75,
      modality: 'Taller práctico',
      instructor: 'Prof. Diego Navarro',
    },
  ];
}

export function createInitialTasks(): TaskItem[] {
  const today = getTodayISO();
  return [
    {
      id: 'tsk-1',
      name: 'Configurar proyecto y explorar los modelos Gemini',
      description:
        'Abrir Google AI Studio, comparar las respuestas de Gemini Flash y Gemini Pro con un mismo texto y guardar el primer prompt.',
      dueDate: addDaysISO(today, -1),
      status: 'completada',
      module: 'Módulo 1 · Primeros pasos',
    },
    {
      id: 'tsk-2',
      name: 'Redactar System Instructions para un tutor de estudio',
      description:
        'Definir el tono, reglas de respuesta y tres ejemplos de entrada y salida (Few-Shot) para que el modelo responda en español claro.',
      dueDate: today,
      status: 'pendiente',
      module: 'Módulo 2 · Ingeniería de prompts',
    },
    {
      id: 'tsk-3',
      name: 'Comparar temperatura 0.2 vs 1.0 en resúmenes',
      description:
        'Probar el mismo artículo técnico con dos valores de temperatura y anotar cuál mantiene mayor precisión.',
      dueDate: addDaysISO(today, 1),
      status: 'pendiente',
      module: 'Módulo 2 · Ingeniería de prompts',
    },
    {
      id: 'tsk-4',
      name: 'Extraer datos de una factura en imagen',
      description:
        'Subir una imagen de prueba en un prompt multimodal y pedir fecha, comercio y total en formato de lista.',
      dueDate: addDaysISO(today, 3),
      status: 'pendiente',
      module: 'Módulo 3 · Prompts multimodales',
    },
    {
      id: 'tsk-5',
      name: 'Crear esquema JSON para clasificar reseñas',
      description:
        'Configurar Structured Outputs en Google AI Studio para devolver sentimiento, puntuación y resumen breve.',
      dueDate: addDaysISO(today, 6),
      status: 'pendiente',
      module: 'Módulo 4 · Salidas estructuradas',
    },
    {
      id: 'tsk-6',
      name: 'Revisar guía de seguridad y filtros de contenido',
      description:
        'Leer la documentación de Safety Settings y verificar los cuatro niveles de bloqueo disponibles.',
      dueDate: addDaysISO(today, -3),
      status: 'completada',
      module: 'Módulo 1 · Primeros pasos',
    },
  ];
}

export function createInitialNotes(): NoteItem[] {
  const today = getTodayISO();
  return [
    {
      id: 'not-1',
      title: 'Diferencia entre Chat Prompt y Freeform Prompt',
      topic: 'Módulo 1 · Primeros pasos',
      content:
        'En Google AI Studio, Freeform sirve para pruebas rápidas de una sola instrucción o redacción. Chat Prompt permite simular conversaciones de varios turnos y probar cómo el modelo recuerda el contexto previo.',
      updatedAt: addDaysISO(today, -2),
    },
    {
      id: 'not-2',
      title: 'Cuándo usar temperatura baja o alta',
      topic: 'Módulo 2 · Ingeniería de prompts',
      content:
        'Temperatura entre 0.0 y 0.3 funciona mejor para extraer datos, clasificar textos o responder preguntas exactas. Valores entre 0.7 y 1.0 ayudan cuando busco lluvias de ideas o redacción más creativa.',
      updatedAt: today,
    },
    {
      id: 'not-3',
      title: 'Buenas prácticas para System Instructions',
      topic: 'Módulo 2 · Ingeniería de prompts',
      content:
        '1. Indicar el rol específico del asistente.\n2. Definir el formato exacto de salida (listas, tablas o JSON).\n3. Incluir qué debe hacer si no tiene suficiente información para evitar invenciones.',
      updatedAt: addDaysISO(today, -1),
    },
    {
      id: 'not-4',
      title: 'Consejos para subir archivos multimodales',
      topic: 'Módulo 3 · Prompts multimodales',
      content:
        'Se pueden combinar imágenes, audio o PDFs dentro del mismo mensaje junto con instrucciones escritas. Conviene colocar la pregunta específica justo después del archivo para obtener respuestas más precisas.',
      updatedAt: today,
    },
  ];
}
