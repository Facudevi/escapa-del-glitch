// Funciones auxiliares compartidas por los componentes.
import { ESCENARIO } from './config.js';

// Crea una primitiva de A-Frame con sus atributos y la agrega al padre.
export function crear(padre, etiqueta, atributos = {}) {
  const el = document.createElement(etiqueta);
  Object.entries(atributos).forEach(([clave, valor]) => el.setAttribute(clave, valor));
  padre.appendChild(el);
  return el;
}

// ---------- Posiciones de los escalones ----------
// Cada tramo es una pared (un escalón) que queda `profundidadPiso` metros más atrás que el anterior.
// z del frente de la pared del tramo `i` (0 = teclado, 1 = torre, 2 = monitor)
export const frenteTramo = (i) => ESCENARIO.zFrente - i * ESCENARIO.profundidadPiso;

// z donde queda el jugador al escalar la pared del tramo `i` (y al llegar a su piso, de frente al tramo siguiente)
export const lugarFrenteAlTramo = (i) => frenteTramo(i) + ESCENARIO.distanciaAlJugador;
