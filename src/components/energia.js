// Energía de cada mano. Va en el rig del jugador, junto a climb.
//
// - La mano agarrada pierde energía y la mano libre la recupera.
// - Con las dos manos agarradas, cada una pierde más despacio (ENERGIA.factorDosManos).
// - Una mano que llega a cero se suelta sola.
// - Los checkpoints recargan las dos manos (al alcanzarlos y al reaparecer en ellos).
//
// Los valores van de 0 a 1 en this.valores.izquierda / this.valores.derecha; el anillo de cada
// guante (anillo-energia) los lee. climb consulta puedeAgarrar() antes de agarrar.
//
// Eventos sobre la escena: 'energia-agotada' { mano } y 'energia-recargada'.
import { ENERGIA } from '../config.js';

const MANOS = ['izquierda', 'derecha'];

AFRAME.registerComponent('energia', {
  init() {
    this.valores = { izquierda: 1, derecha: 1 };

    const escena = this.el.sceneEl;
    escena.addEventListener('checkpoint-alcanzado', () => this.recargar());
    escena.addEventListener('reaparecer', () => this.recargar());
  },

  recargar() {
    MANOS.forEach((mano) => (this.valores[mano] = 1));
    this.el.sceneEl.emit('energia-recargada', {}, false);
  },

  // Sin un mínimo de energía no se puede agarrar
  puedeAgarrar(mano) {
    return this.valores[mano] >= ENERGIA.minimoParaAgarrar;
  },

  tick(tiempo, dt) {
    const climb = this.el.components.climb;
    if (!climb) return;
    const segundos = dt / 1000;

    const agarradas = MANOS.filter((mano) => climb.sujetas[mano]);
    const factor = agarradas.length === 2 ? ENERGIA.factorDosManos : 1;
    const perdida = (factor / ENERGIA.segundosAgarrando) * segundos;
    const ganancia = (1 / ENERGIA.segundosRecuperar) * segundos;

    MANOS.forEach((mano) => {
      if (climb.sujetas[mano]) {
        this.valores[mano] = Math.max(0, this.valores[mano] - perdida);
        if (this.valores[mano] <= 0) {
          climb.soltar(mano); // sin energía, la mano se suelta sola
          this.el.sceneEl.emit('energia-agotada', { mano }, false);
        }
      } else {
        this.valores[mano] = Math.min(1, this.valores[mano] + ganancia);
      }
    });
  },
});
