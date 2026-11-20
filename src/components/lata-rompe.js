// Lata que se rompe: al agarrarla por primera vez empieza a crujir y a los 3 segundos cae.
// Quien la sostiene se suelta. Después de un rato vuelve a aparecer en su lugar.
// Va en una entidad con el componente agarre.
//
// El crujido se ve como un temblor de la lata (solo rotación, sin mover el punto donde está
// agarrada: sacudir al jugador marea) y se oye y se siente en el control.
import { LATA, VIBRACION } from '../config.js';
import { crujido, rotura } from '../sonidos.js';

const GRADOS = Math.PI / 180;
const suave = (x) => x * x * (3 - 2 * x);

AFRAME.registerComponent('lata-rompe', {
  init() {
    this.estado = 'entera'; // 'entera' | 'crujiendo' | 'cayendo' | 'ausente' | 'apareciendo'
    this.tiempo = 0;
    this.velocidad = 0; // velocidad de caída (m/s)
    this.proximoPulso = 0;
    this.base = null; // posición original, se toma en el primer cuadro

    this.el.addEventListener('agarrado', () => {
      if (this.estado !== 'entera') return;
      this.estado = 'crujiendo';
      this.tiempo = 0;
      this.proximoPulso = 0;
    });
  },

  tick(tiempo, dt) {
    const objeto = this.el.object3D;
    if (!this.base) this.base = objeto.position.clone();
    const segundos = Math.min(dt, 100) / 1000;
    this.tiempo += segundos;

    if (this.estado === 'crujiendo') {
      // Temblor que crece hasta romperse, con un crujido cada tanto
      const avance = Math.min(this.tiempo / LATA.segundos, 1);
      objeto.rotation.z =
        Math.sin(this.tiempo * LATA.frecuenciaTemblor * Math.PI * 2) * LATA.inclinacionMaxima * GRADOS * avance;
      this.proximoPulso -= segundos;
      if (this.proximoPulso <= 0) {
        this.proximoPulso = LATA.pulsoCada;
        crujido();
        const climb = document.querySelector('#rig').components.climb;
        climb.vibrarAgarre(this.el, VIBRACION.fuerza, VIBRACION.duracion);
      }
      if (this.tiempo >= LATA.segundos) this.romper();
    } else if (this.estado === 'cayendo') {
      this.velocidad += LATA.gravedad * segundos;
      objeto.position.y -= this.velocidad * segundos;
      objeto.rotation.x += 3 * segundos;
      if (this.tiempo >= LATA.duracionCaida) {
        objeto.visible = false;
        this.estado = 'ausente';
        this.tiempo = 0;
      }
    } else if (this.estado === 'ausente') {
      if (this.tiempo >= LATA.reaparece) this.reaparecer();
    } else if (this.estado === 'apareciendo') {
      const avance = Math.min(this.tiempo / LATA.duracionAparicion, 1);
      objeto.scale.setScalar(Math.max(suave(avance), 0.01));
      if (avance >= 1) {
        this.estado = 'entera';
        this.el.components.agarre.ponerDisponible(true);
      }
    }
  },

  // Se rompe: quien la sostiene se suelta y la lata ya no se puede agarrar
  romper() {
    this.estado = 'cayendo';
    this.tiempo = 0;
    this.velocidad = 0;
    this.el.object3D.rotation.set(0, 0, 0);
    rotura();
    this.el.components.agarre.ponerDisponible(false);
  },

  reaparecer() {
    const objeto = this.el.object3D;
    objeto.position.copy(this.base);
    objeto.rotation.set(0, 0, 0);
    objeto.scale.setScalar(0.01);
    objeto.visible = true;
    this.estado = 'apareciendo';
    this.tiempo = 0;
  },
});
