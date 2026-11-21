// Dificultad del juego: normal o fácil. Cambia tres valores de config.js en vivo, porque los componentes
// los leen cada vez que los usan: el alcance para agarrar, lo que dura la energía y la velocidad de la niebla.
// El resto del juego (la pared, los tiempos de los agarres, las medallas) es igual en los dos modos.
import { ENERGIA, FACIL, JUGADOR, NIEBLA } from './config.js';

// Valores normales, guardados al cargar
const NORMAL = {
  radioAgarre: JUGADOR.radioAgarre,
  segundosAgarrando: ENERGIA.segundosAgarrando,
  velocidadNiebla: NIEBLA.velocidad,
};

let actual = 'normal';

// nivel: 'normal' o 'facil'
export function aplicarDificultad(nivel) {
  const facil = nivel === 'facil';
  JUGADOR.radioAgarre = NORMAL.radioAgarre * (facil ? FACIL.factorAlcance : 1);
  ENERGIA.segundosAgarrando = NORMAL.segundosAgarrando * (facil ? FACIL.factorEnergia : 1);
  NIEBLA.velocidad = NORMAL.velocidadNiebla * (facil ? FACIL.factorNiebla : 1);
  actual = facil ? 'facil' : 'normal';
}

export function dificultadActual() {
  return actual;
}
