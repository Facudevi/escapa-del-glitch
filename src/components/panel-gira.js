// Panel que gira: muestra agarres de un lado unos segundos y después gira lento hacia el lado liso.
// Hay que pasar mientras está de frente. Va en la entidad del panel; los agarres son hijos suyos
// (entidades con el componente agarre).
//
// Si el jugador está agarrado cuando empieza a girar, lo lleva un poco (climb mueve al jugador
// con el agarre) hasta que los agarres dejan de mirarlo y los suelta.
import { PANEL } from '../config.js';

const GRADOS = Math.PI / 180;
const suave = (x) => x * x * (3 - 2 * x);

AFRAME.registerComponent('panel-gira', {
  schema: { fase: { type: 'number', default: 0 } }, // s de desfase dentro del ciclo

  init() {
    this.tiempo = this.data.fase;
    this.deFrente = null;
  },

  tick(tiempo, dt) {
    this.tiempo += Math.min(dt, 100) / 1000;
    const { segundosDeFrente: frente, segundosDeEspaldas: espaldas, segundosGiro: giro } = PANEL;
    const p = this.tiempo % (frente + giro + espaldas + giro);

    let angulo;
    if (p < frente) angulo = 0;
    else if (p < frente + giro) angulo = Math.PI * suave((p - frente) / giro);
    else if (p < frente + giro + espaldas) angulo = Math.PI;
    else angulo = Math.PI + Math.PI * suave((p - frente - giro - espaldas) / giro);
    this.el.object3D.rotation.y = angulo;

    // Los agarres solo están disponibles mientras miran hacia el jugador
    const deFrente = Math.cos(angulo) >= Math.cos(PANEL.anguloMaximoDeAgarre * GRADOS);
    if (deFrente !== this.deFrente) {
      this.deFrente = deFrente;
      this.el.querySelectorAll('[agarre]').forEach((el) => {
        if (el.components.agarre) el.components.agarre.ponerDisponible(deFrente);
      });
    }
  },
});
