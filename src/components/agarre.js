// Base de todos los agarres. Va en cada tecla, lata, bloque o agarre de panel.
//
// - Lleva la clase "agarre", que usan climb y el modo escritorio para encontrarlos.
// - Sabe qué manos lo sostienen (climb le avisa con 'agarrado' y 'soltado').
// - Puede dejar de estar disponible (por ejemplo, un bloque apagado): pierde la clase y suelta a quien lo sostiene.
// - Se resalta cuando una mano o el mouse lo tiene al alcance ('resaltar' y 'apagar').
//
// Los comportamientos propios de cada tipo (se hunde, se rompe, intermitente, gira) están en
// sus componentes: tecla-hunde, lata-rompe, bloque-intermitente y panel-gira.
import { RESALTADO } from '../config.js';

AFRAME.registerComponent('agarre', {
  schema: {
    tipo: { type: 'string', default: 'firme' },
    tolerancia: { type: 'number', default: 1 },
    brillo: { type: 'color', default: '' }, // color del brillo propio (si el agarre tiene textura, la malla es blanca) // multiplica el radio de agarre: menos de 1 = hay que tocarlo más justo
  },

  init() {
    this.manos = {}; // manos que lo sostienen ahora
    this.alAlcance = {}; // manos (o el mouse) que lo tienen al alcance
    this.disponible = true;
    this.el.classList.add('agarre');
    this.el.addEventListener('object3dset', () => this.actualizarBrillo()); // brillo base apenas se dibuja

    this.el.addEventListener('agarrado', (e) => (this.manos[e.detail.mano] = true));
    this.el.addEventListener('soltado', (e) => delete this.manos[e.detail.mano]);
    this.el.addEventListener('resaltar', (e) => {
      this.alAlcance[e.detail.mano] = true;
      this.actualizarBrillo();
    });
    this.el.addEventListener('apagar', (e) => {
      delete this.alAlcance[e.detail.mano];
      this.actualizarBrillo();
    });
  },

  sostenido() {
    return Object.keys(this.manos).length > 0;
  },

  // Activa o desactiva el agarre. Al desactivarlo, quien lo sostiene se suelta.
  ponerDisponible(disponible) {
    if (disponible === this.disponible) return;
    this.disponible = disponible;
    this.el.classList.toggle('agarre', disponible);
    if (!disponible) {
      this.alAlcance = {};
      this.actualizarBrillo();
      this.soltarTodas();
    }
  },

  soltarTodas() {
    const climb = document.querySelector('#rig').components.climb;
    Object.keys(this.manos).forEach((mano) => climb.soltar(mano));
  },

  // Brillo propio cuando está al alcance de una mano: el mismo color, algo más luminoso
  actualizarBrillo() {
    const malla = this.el.getObject3D('mesh');
    const material = malla && malla.material;
    if (!material || !material.emissive) return;
    const resaltado = this.disponible && Object.keys(this.alAlcance).length > 0;
    if (this.data.brillo) material.emissive.set(this.data.brillo);
    else material.emissive.copy(material.color);
    material.emissiveIntensity = resaltado ? RESALTADO.intensidad : RESALTADO.base;
  },
});
