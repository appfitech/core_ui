// app/gymcrush/mockProfiles.ts
import type { CoachProfile } from '@/stores/gymcrushStore';

// Uses Unsplash Featured with coaching/gym queries (people in gyms).
// These URLs are dynamic (may change over time), but consistently return gym/coach imagery.
// Your screen already has a runtime fallback to Picsum if any image fails.
export const MOCK_PROFILES: CoachProfile[] = [
  {
    id: 'c1',
    name: 'Alejandro',
    age: 33,
    distanceKm: 2.3,
    goals: ['Fuerza', 'Hipertrofia'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?personal-trainer,strength,gym,coach&sig=1',
    bio: 'Coach de fuerza y powerlifting. Progresión estructurada y técnica impecable.',
  },
  {
    id: 'c2',
    name: 'Carolina',
    age: 29,
    distanceKm: 4.1,
    goals: ['Pérdida de peso', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?fitness-coach,woman,gym,trainer&sig=2',
    bio: 'Hábitos sostenibles y movilidad para principiantes. Rutinas sencillas y efectivas.',
  },
  {
    id: 'c3',
    name: 'Matías',
    age: 31,
    distanceKm: 3.6,
    goals: ['Resistencia', 'Running'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?running-coach,track,trainer&sig=3',
    bio: 'Planificación de 5K a media maratón. Zonas de ritmo y técnica de carrera.',
  },
  {
    id: 'c4',
    name: 'Valeria',
    age: 27,
    distanceKm: 1.4,
    goals: ['Fuerza', 'Glúteos'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?glute-workout,trainer,gym,woman&sig=4',
    bio: 'Hip thrust, sentadilla y patrones de empuje. Curvas con buena técnica.',
  },
  {
    id: 'c5',
    name: 'Diego',
    age: 35,
    distanceKm: 5.8,
    goals: ['Hipertrofia'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?bodybuilding-coach,gym,hypertrophy,trainer&sig=5',
    bio: 'Volumen inteligente, conexión mente-músculo, periodización avanzada.',
  },
  {
    id: 'c6',
    name: 'Camila',
    age: 28,
    distanceKm: 2.0,
    goals: ['Funcional', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?functional-training,coach,fitness,trainer&sig=6',
    bio: 'Entrenamiento funcional con foco en postura, core y respiración.',
  },
  {
    id: 'c7',
    name: 'Héctor',
    age: 30,
    distanceKm: 7.2,
    goals: ['Fuerza', 'Resistencia'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?strength-and-conditioning,coach,gym&sig=7',
    bio: 'Híbrido fuerza + cardio. Programas 3-4x/semana sostenibles.',
  },
  {
    id: 'c8',
    name: 'Luciana',
    age: 26,
    distanceKm: 6.1,
    goals: ['Pérdida de peso', 'Fuerza'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?weight-loss,personal-trainer,gym,woman&sig=8',
    bio: 'Pérdida de grasa sin dietas locas. Entrenos simples y progresivos.',
  },
  {
    id: 'c9',
    name: 'Bruno',
    age: 34,
    distanceKm: 1.9,
    goals: ['Cross-training', 'Resistencia'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?crossfit-coach,box,trainer&sig=9',
    bio: 'WODs, intervalos y técnica con kettlebells. Ritmo y variedad.',
  },
  {
    id: 'c10',
    name: 'Sofía',
    age: 27,
    distanceKm: 3.2,
    goals: ['Glúteos', 'Fuerza'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?leg-day,personal-trainer,squat,gym&sig=10',
    bio: 'Programas lower-body con enfoque en progresiones de sentadilla.',
  },
  {
    id: 'c11',
    name: 'Pablo',
    age: 32,
    distanceKm: 8.7,
    goals: ['Fuerza'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?powerlifting-coach,barbell,trainer&sig=11',
    bio: 'Powerlifting técnico: squat/bench/deadlift con microciclos claros.',
  },
  {
    id: 'c12',
    name: 'María José',
    age: 29,
    distanceKm: 2.7,
    goals: ['Movilidad', 'Funcional'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?mobility-coach,stretching,trainer&sig=12',
    bio: 'Cadenas musculares, estabilidad y prevención de lesiones.',
  },
  {
    id: 'c13',
    name: 'Álvaro',
    age: 28,
    distanceKm: 9.1,
    goals: ['Running'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?running-coach,tempo,track&sig=13',
    bio: 'Cadencia, técnica y ritmos para bajar tiempos en 5K-10K.',
  },
  {
    id: 'c14',
    name: 'Nati',
    age: 31,
    distanceKm: 5.4,
    goals: ['Hipertrofia', 'Glúteos'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?glute-activation,coach,gym&sig=14',
    bio: 'Hip thrust heavy, isquios y abductores. Forma ante todo.',
  },
  {
    id: 'c15',
    name: 'Gonzalo',
    age: 36,
    distanceKm: 4.8,
    goals: ['Pérdida de peso'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?weight-loss-coach,trainer,gym&sig=15',
    bio: 'Déficit calórico inteligente + NEAT + pesas ligeras.',
  },
  {
    id: 'c16',
    name: 'Patricia',
    age: 30,
    distanceKm: 1.1,
    goals: ['Funcional', 'Resistencia'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?circuit-training,coach,gym&sig=16',
    bio: 'Circuitos y core. Enfoque en sentirse fuerte y móvil.',
  },
  {
    id: 'c17',
    name: 'Ricardo',
    age: 29,
    distanceKm: 6.9,
    goals: ['Fuerza', 'Hipertrofia'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?personal-trainer,bench-press,coach&sig=17',
    bio: 'Bloques de volumen con progresión doble y cluster sets.',
  },
  {
    id: 'c18',
    name: 'Daniela',
    age: 27,
    distanceKm: 2.5,
    goals: ['Pérdida de peso', 'Movilidad'],
    level: 'Beginner',
    photo:
      'https://source.unsplash.com/featured/1200x900?beginner-fitness,coach,trainer,gym&sig=18',
    bio: 'Acompañamiento integral: hábitos, descanso y entrenamiento.',
  },
  {
    id: 'c19',
    name: 'Mauricio',
    age: 34,
    distanceKm: 7.3,
    goals: ['Resistencia'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?endurance-coach,intervals,trainer&sig=19',
    bio: 'Intervalos y series controladas. Subimos VO₂ y umbral.',
  },
  {
    id: 'c20',
    name: 'Elena',
    age: 28,
    distanceKm: 3.9,
    goals: ['Fuerza', 'Funcional'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?personal-trainer,woman,strength,gym&sig=20',
    bio: 'Patrones básicos: bisagras, empujes, tracciones. Técnica ante todo.',
  },
  {
    id: 'c21',
    name: 'Tomás',
    age: 30,
    distanceKm: 8.2,
    goals: ['Cross-training'],
    level: 'Advanced',
    photo:
      'https://source.unsplash.com/featured/1200x900?crossfit-coach,coach,box,athlete&sig=21',
    bio: 'MetCons, EMOM y técnica de gimnásticos con progresión.',
  },
  {
    id: 'c22',
    name: 'Renata',
    age: 25,
    distanceKm: 4.3,
    goals: ['Glúteos', 'Hipertrofia'],
    level: 'Intermediate',
    photo:
      'https://source.unsplash.com/featured/1200x900?personal-trainer,hip-thrust,gym,woman&sig=22',
    bio: 'Prioridad en activaciones y volumen moderado bien distribuido.',
  },
];
