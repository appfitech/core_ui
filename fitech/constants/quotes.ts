const MOTIVATIONAL_QUOTES = [
  'Hoy es un buen día para moverte 💪',
  'Un paso a la vez también es progreso.',
  'Tu cuerpo puede, tu mente es la que decide.',
  'Entrena por la salud, el cuerpo viene por añadidura.',
  'No tienes que ser el mejor, solo ser constante.',
  'Un entrenamiento es mejor que ningún entrenamiento.',
  'Hazlo por ti, por tu versión del futuro.',
  'Pequeños hábitos crean grandes cambios.',
  'Hoy te vas a agradecer no haberte rendido.',
  'Solo te arrepentirás del entrenamiento que no hiciste.',
  'Disciplina es hacer lo que dijiste que harías, incluso sin ganas.',
  'Tu único rival eres tú de ayer.',
  'Muévete por amor propio, no por castigo.',
  'Cinco minutos de movimiento valen más que cero.',
  'Tu cuerpo es tu casa, cuídala todos los días.',
  'Estás a un entrenamiento de mejorar tu ánimo.',
  'No busques perfección, busca consistencia.',
  'Aunque sea poquito, hoy también cuenta.',
  'Respira, mueve el cuerpo y celebra que puedes hacerlo.',
  'Cada día activo es un “sí” a tu bienestar.',
];

export const getRandomMotivationalQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);

  return MOTIVATIONAL_QUOTES[index];
};
