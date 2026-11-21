// Botón RESET. Va en la entidad del botón (que también lleva el componente golpeable).
//
// Está apagado hasta que el jugador junta los tres fragmentos; ahí se enciende. Con el botón encendido,
// un golpe lo activa y empieza el final. Si se lo golpea apagado, suena un toque sordo y el Glitch avisa
// que faltan fragmentos (sin consecuencias).
//
// Eventos sobre la escena: 'reset-listo' y 'reset-activado'.
import { COLORES } from '../config.js';
import { golpeSordo, resetListo } from '../sonidos.js';

AFRAME.registerComponent('reset-boton', {
  init() {
    this.estado = 'apagado'; // 'apagado' | 'listo' | 'activado'
    this.el.addEventListener('golpeado', () => this.alGolpear());
    this.el.sceneEl.addEventListener('fragmento-recogido', (e) => {
      if (e.detail.total >= 3) this.encender();
    });
  },

  encender() {
    if (this.estado !== 'apagado') return;
    this.estado = 'listo';
    this.pintar(COLORES.resetListo, 0.8);
    resetListo();
    this.el.sceneEl.emit('reset-listo', {}, false);
  },

  alGolpear() {
    if (this.estado === 'listo') {
      this.estado = 'activado';
      this.el.sceneEl.emit('reset-activado', {}, false);
    } else if (this.estado === 'apagado') {
      golpeSordo();
      const glitch = this.el.sceneEl.components.glitch;
      if (glitch) glitch.decir('faltan');
    }
  },

  // Vuelve a estar apagado (al volver a jugar)
  reiniciar() {
    this.estado = 'apagado';
    this.pintar(COLORES.resetApagado, 0);
  },

  pintar(color, brillo) {
    this.el.setAttribute(
      'material',
      `color: ${color}; emissive: ${color}; emissiveIntensity: ${brillo}; roughness: 0.9; metalness: 0`
    );
  },
});
