// app/gymbro/mockProfiles.ts
import { Profile } from '@/stores/gymBroStore';

// People training in the gym — static Unsplash photo IDs (stable, gym-only).
export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Camila',
    age: 27,
    distanceKm: 2.1,
    goals: ['Fuerza', 'Resistencia'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1594385208976-6a0b1b1f4b93?q=80&w=1200&auto=format&fit=crop',
    bio: 'Amo el gym y el running. Busco partner para HIIT los jueves.',
  },
  {
    id: '2',
    name: 'Valentina',
    age: 30,
    distanceKm: 6.4,
    goals: ['Pérdida de peso', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Recién volviendo a entrenar. Yoga + pesas ligeras.',
  },
  {
    id: '3',
    name: 'Lucía',
    age: 24,
    distanceKm: 1.2,
    goals: ['Fuerza', 'Hipertrofia'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1605296867724-dbc9b1f1a8d1?q=80&w=1200&auto=format&fit=crop',
    bio: 'Push-pull-legs y cross. 🍑 day lover.',
  },
  {
    id: '4',
    name: 'Diana',
    age: 34,
    distanceKm: 3.7,
    goals: ['Resistencia', 'Running'],
    level: 'Advanced',
    photo:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    bio: '10K los domingos en el malecón. ¿Te apuntas?',
  },
  {
    id: '5',
    name: 'María',
    age: 28,
    distanceKm: 8.9,
    goals: ['Pérdida de peso', 'Fuerza'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1546484959-f9a53db89ee0?q=80&w=1200&auto=format&fit=crop',
    bio: 'Pesas 4x/semana + caminatas. Objetivo: -4kg antes del verano.',
  },
  {
    id: '6',
    name: 'Sofía',
    age: 26,
    distanceKm: 4.5,
    goals: ['Resistencia', 'Running'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1554310603-d39d43033729?q=80&w=1200&auto=format&fit=crop',
    bio: 'Amante del cardio y los 5K. Busco alguien para intervalos.',
  },
  {
    id: '7',
    name: 'Andrea',
    age: 32,
    distanceKm: 1.8,
    goals: ['Fuerza', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop',
    bio: 'Volviendo del descanso. Full técnica y estiramientos.',
  },
  {
    id: '8',
    name: 'Nathaly',
    age: 29,
    distanceKm: 9.2,
    goals: ['Hipertrofia', 'Fuerza'],
    level: 'Advanced',
    photo:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
    bio: 'Powerbuilding vibes. ¿Leg day juntos?',
  },
  {
    id: '9',
    name: 'Fernanda',
    age: 25,
    distanceKm: 3.1,
    goals: ['Pérdida de peso', 'Resistencia'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Cinta + circuitos. Objetivo: aguante y constancia.',
  },
  {
    id: '10',
    name: 'Carla',
    age: 31,
    distanceKm: 5.6,
    goals: ['Movilidad', 'Fuerza'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1599050751794-23a0f050d1d3?q=80&w=1200&auto=format&fit=crop',
    bio: 'Mobility first, luego pesas. Me encanta aprender nuevas técnicas.',
  },
  {
    id: '11',
    name: 'Micaela',
    age: 23,
    distanceKm: 2.9,
    goals: ['Running', 'Resistencia'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop',
    bio: 'Recién empezando con 3K. Motivación es clave.',
  },
  {
    id: '12',
    name: 'Brenda',
    age: 33,
    distanceKm: 7.7,
    goals: ['Fuerza'],
    level: 'Advanced',
    photo:
      'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?q=80&w=1200&auto=format&fit=crop',
    bio: 'Levantamientos compuestos. Bench + deadlift + squat.',
  },
  {
    id: '13',
    name: 'Fiorella',
    age: 28,
    distanceKm: 4.0,
    goals: ['Hipertrofia'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200&auto=format&fit=crop',
    bio: 'Split push/pull/legs. Busco partner para superseries.',
  },
  {
    id: '14',
    name: 'Gabriela',
    age: 27,
    distanceKm: 1.6,
    goals: ['Resistencia', 'Fuerza'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    bio: 'Full-body 3x/sem. Me gusta registrar progresos.',
  },
  {
    id: '15',
    name: 'Paula',
    age: 29,
    distanceKm: 10.3,
    goals: ['Pérdida de peso', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1576673789673-8e3f0957cd2c?q=80&w=1200&auto=format&fit=crop',
    bio: 'Lento pero seguro. Alimentación + gym con paciencia.',
  },
  {
    id: '16',
    name: 'Julia',
    age: 26,
    distanceKm: 2.4,
    goals: ['Fuerza', 'Glúteos'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    bio: 'Glute focus. Me encantan las progresiones con hip thrust y sentadilla.',
  },
  {
    id: '17',
    name: 'Isabella',
    age: 27,
    distanceKm: 6.0,
    goals: ['Resistencia', 'Pérdida de peso'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Spinning + pesas. Objetivo: mejorar el VO₂ y definición.',
  },
  {
    id: '18',
    name: 'Rocío',
    age: 24,
    distanceKm: 3.3,
    goals: ['Hipertrofia', 'Fuerza'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1605296867724-dbc9b1f1a8d1?q=80&w=1200&auto=format&fit=crop',
    bio: 'PPL con énfasis en delts. Vamos por un press más sólido.',
  },
  {
    id: '19',
    name: 'Daniela',
    age: 33,
    distanceKm: 7.1,
    goals: ['Movilidad', 'Resistencia'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1605296867304-02806c8f1c07?q=80&w=1200&auto=format&fit=crop',
    bio: 'Recuperando ritmo con movilidad y circuitos ligeros.',
  },
  {
    id: '20',
    name: 'Carolina',
    age: 28,
    distanceKm: 5.9,
    goals: ['Fuerza'],
    level: 'Advanced',
    photo:
      'https://images.unsplash.com/photo-1526401485004-2fda9f4e54ce?q=80&w=1200&auto=format&fit=crop',
    bio: 'Foco en sentadilla y técnica. ¿Hacemos PR day?',
  },
  {
    id: '21',
    name: 'Ale',
    age: 27,
    distanceKm: 1.5,
    goals: ['Resistencia', 'Running'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1520975935093-5ce093f1df90?q=80&w=1200&auto=format&fit=crop',
    bio: 'Series y cuestas. Me gusta combinar pista con fuerza.',
  },
  {
    id: '22',
    name: 'Majo',
    age: 29,
    distanceKm: 2.7,
    goals: ['Pérdida de peso', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    bio: 'Busco constancia. Caminatas + máquinas guiadas.',
  },
  {
    id: '23',
    name: 'Flor',
    age: 25,
    distanceKm: 4.4,
    goals: ['Hipertrofia'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1571019614221-3f9c3ee4f3f3?q=80&w=1200&auto=format&fit=crop',
    bio: 'Back day favorito: dominadas asistidas y jalones.',
  },
  {
    id: '24',
    name: 'Vero',
    age: 32,
    distanceKm: 9.8,
    goals: ['Fuerza', 'Resistencia'],
    level: 'Advanced',
    photo:
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop',
    bio: 'KB swings + fuerza básica. Entrenos cortos e intensos.',
  },
  {
    id: '25',
    name: 'Belén',
    age: 30,
    distanceKm: 3.0,
    goals: ['Resistencia', 'Pérdida de peso'],
    level: 'Intermediate',
    photo:
      'https://images.unsplash.com/photo-1546484959-f9a53db89ee0?q=80&w=1200&auto=format&fit=crop',
    bio: 'Cardio divertido + fuerza para recomposición.',
  },
];
