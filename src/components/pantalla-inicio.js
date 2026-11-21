// Pantalla de inicio: lo primero que ve el jugador en el navegador, antes de entrar a VR. Va en la <a-scene>.
//
// Explica de qué se trata, los controles con casco y en la compu, y da un aviso de seguridad (espacio libre
// y descansos). Es salteable: se cierra con el botón, con Enter, al entrar en VR o al agarrarse por primera
// vez. Deja elegir el modo fácil (también se activa con ?facil=1 en el link).
//
// El HTML de la pantalla está en index.html (elemento #inicio). Para quien juega con casco, el aviso de
// seguridad también está escrito dentro del mundo, al pie de la pared.
import { aplicarDificultad } from '../dificultad.js';

AFRAME.registerComponent('pantalla-inicio', {
  init() {
    this.panel = document.querySelector('#inicio');
    if (!this.panel) return;

    // ?facil=1 en el link activa el modo fácil desde el principio
    let facilPorLink = false;
    try {
      facilPorLink = new URLSearchParams(window.location.search).get('facil') === '1';
    } catch (error) {
      facilPorLink = false;
    }
    aplicarDificultad(facilPorLink ? 'facil' : 'normal');
    this.facil = facilPorLink;
    const aviso = this.panel.querySelector('[data-modo]');
    if (aviso) aviso.textContent = facilPorLink ? 'Modo fácil activado.' : '';

    this.panel.querySelector('[data-empezar]').addEventListener('click', () => this.cerrar(this.facil));
    this.panel.querySelector('[data-facil]').addEventListener('click', () => this.cerrar(true));

    this.alTeclear = (e) => {
      if (e.code === 'Enter' && this.abierta()) this.cerrar(this.facil);
    };
    window.addEventListener('keydown', this.alTeclear);
    // En VR el panel de la página no se ve: al entrar o al agarrarse se cierra solo
    this.el.addEventListener('enter-vr', () => this.cerrar(this.facil));
    this.el.addEventListener('mano-agarra', () => this.cerrar(this.facil));

    this.panel.querySelector('[data-empezar]').focus();
  },

  abierta() {
    return !!this.panel && !this.panel.hidden;
  },

  // facil: si se juega en modo fácil
  cerrar(facil) {
    if (!this.abierta()) return;
    this.facil = !!facil;
    aplicarDificultad(this.facil ? 'facil' : 'normal');
    this.panel.hidden = true;
    this.el.emit('inicio-cerrado', { facil: this.facil }, false);
  },

  remove() {
    window.removeEventListener('keydown', this.alTeclear);
  },
});
