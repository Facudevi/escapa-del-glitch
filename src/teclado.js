// Distribución de las teclas del teclado gigante del primer tramo (teclado completo, con bloque de
// navegación y teclado numérico). La usan el decorado (para dibujar las teclas) y el generador de la pared
// (para apoyar los agarres sobre teclas de verdad). No usa A-Frame.
import { ESCENARIO as E } from './config.js';

const UNIDADES_ANCHO = 22.5; // ancho del teclado completo en unidades de tecla
export const ANCHO_TECLADO = UNIDADES_ANCHO * E.teclado.unidad; // en metros

// Lista de teclas: x = borde izquierdo en unidades, y = centro de la fila en unidades desde arriba,
// w y h = ancho y alto en unidades, esp = tecla especial (más oscura)
export function teclasDelTeclado() {
  const teclas = [];
  const t = (x, y, w = 1, h = 1, esp = false) => teclas.push({ x, y, w, h, esp });

  // Fila de funciones
  t(0, 0.5, 1, 1, true);
  let x = 2;
  for (let grupo = 0; grupo < 3; grupo++) {
    for (let i = 0; i < 4; i++) {
      t(x, 0.5, 1, 1, true);
      x += 1;
    }
    x += grupo < 2 ? 0.5 : 0;
  }
  // Bloque principal
  const fila = (y, anchos, x0 = 0) => {
    let cursor = x0;
    anchos.forEach(([w, esp]) => {
      t(cursor, y, w, 1, !!esp);
      cursor += w;
    });
  };
  const uno = Array.from({ length: 12 }, () => [1]);
  fila(2, [...Array.from({ length: 13 }, () => [1]), [2, true]]);
  fila(3, [[1.5, true], ...uno, [1.5]]);
  fila(4, [[1.75, true], ...Array.from({ length: 11 }, () => [1]), [2.25, true]]);
  fila(5, [[2.25, true], ...Array.from({ length: 10 }, () => [1]), [2.75, true]]);
  fila(6, [[1.25, true], [1.25, true], [1.25, true], [6.25], [1.25, true], [1.25, true], [1.25, true], [1.25, true]]);
  // Bloque de navegación
  fila(0.5, [[1, true], [1, true], [1, true]], 15.25);
  fila(2, [[1, true], [1, true], [1, true]], 15.25);
  fila(3, [[1, true], [1, true], [1, true]], 15.25);
  t(16.25, 5, 1, 1);
  fila(6, [[1], [1], [1]], 15.25);
  // Teclado numérico
  fila(2, [[1, true], [1, true], [1, true], [1, true]], 18.5);
  fila(3, [[1], [1], [1]], 18.5);
  t(21.5, 3.5, 1, 2);
  fila(4, [[1], [1], [1]], 18.5);
  fila(5, [[1], [1], [1]], 18.5);
  t(21.5, 5.5, 1, 2, true);
  t(18.5, 6, 2);
  t(20.5, 6, 1);
  return teclas;
}

// Centros de las teclas en el mundo (x, y), con el teclado apoyado desde y0
export function centrosDeTeclas(y0 = 0) {
  const U = E.teclado.unidad;
  const izquierda = -ANCHO_TECLADO / 2;
  return teclasDelTeclado().map((k) => ({
    x: izquierda + (k.x + k.w / 2) * U,
    y: y0 + E.teclado.arriba - k.y * U,
    w: k.w,
    h: k.h,
    esp: k.esp,
  }));
}
