// Tecla que se hunde: baja despacio y a velocidad constante mientras está agarrada, como una tecla
// que se presiona, y arrastra al jugador si no sigue subiendo (climb mueve al jugador con el agarre).
// Al soltarla vuelve a su lugar. Va en una entidad con el componente agarre.
// La flecha hacia abajo que la identifica está en su textura (ver forma-agarre).
import { HUNDE } from '../config.js';

AFRAME.registerComponent('tecla-hunde', {
  init() {
    this.yBase = null; // altura original, se toma en el primer cuadro
    this.hundido = 0; // cuánto bajó (m)
  },

  tick(tiempo, dt) {
    const posicion = this.el.object3D.position;
    if (this.yBase === null) this.yBase = posicion.y;

    const segundos = Math.min(dt, 100) / 1000;
    const agarre = this.el.components.agarre;
    if (agarre && agarre.sostenido()) {
      this.hundido = Math.min(HUNDE.hundimientoMaximo, this.hundido + HUNDE.velocidad * segundos);
    } else {
      this.hundido = Math.max(0, this.hundido - HUNDE.retorno * segundos);
    }
    posicion.y = this.yBase - this.hundido;
  },

});
