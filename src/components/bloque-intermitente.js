// Bloque intermitente: está visible unos segundos y después se apaga. Aparece y desaparece con un
// fundido suave (nada de parpadeos). Un anillo a su alrededor muestra cuánto tiempo le queda visible,
// y cuando está apagado se ve apenas su contorno, para saber dónde va a volver.
// Va en una entidad con el componente agarre.
//
// Solo se puede agarrar cuando se ve casi completo; si se apaga con alguien agarrado, lo suelta.
import { COLORES, INTERMITENTE } from '../config.js';

AFRAME.registerComponent('bloque-intermitente', {
  schema: { fase: { type: 'number', default: 0 } }, // s de desfase, para que no estén todos sincronizados

  init() {
    this.tiempo = this.data.fase;
    this.opacidad = -1;
    this.ultimoLargo = -1;
    this.disponible = null;
    const { radioAnilloInterno: ri, radioAnilloExterno: re, ancho, alto, profundidad } = INTERMITENTE;
    this.anillo = { ri, re };

    this.grupo = new THREE.Group();

    // Anillo de fondo (completo) y arco de tiempo restante, delante del bloque
    this.fondoAnillo = new THREE.Mesh(
      new THREE.RingGeometry(ri, re, 48),
      new THREE.MeshBasicMaterial({
        color: COLORES.anilloFondo,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
        fog: false,
      })
    );
    this.arco = new THREE.Mesh(
      new THREE.RingGeometry(ri, re, 3, 1, 0, 0.1),
      new THREE.MeshBasicMaterial({ color: COLORES.celeste, side: THREE.DoubleSide, fog: false })
    );
    this.fondoAnillo.position.z = profundidad / 2 + 0.01;
    this.arco.position.z = profundidad / 2 + 0.012;

    // Contorno que se ve cuando el bloque está apagado
    this.contorno = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(ancho, alto, profundidad)),
      new THREE.LineBasicMaterial({ color: COLORES.celeste, transparent: true, opacity: 0.45, fog: false })
    );

    this.grupo.add(this.fondoAnillo, this.arco, this.contorno);
    this.el.setObject3D('indicador', this.grupo);
  },

  // Rearma el arco para que cubra la fracción `fraccion` del anillo, desde arriba
  actualizarArco(fraccion) {
    this.arco.visible = fraccion > 0.01;
    if (!this.arco.visible) return;
    const largo = Math.PI * 2 * fraccion;
    this.arco.geometry.dispose();
    this.arco.geometry = new THREE.RingGeometry(
      this.anillo.ri,
      this.anillo.re,
      Math.max(3, Math.ceil(48 * fraccion)),
      1,
      Math.PI / 2 - largo,
      largo
    );
  },

  tick(tiempo, dt) {
    this.tiempo += Math.min(dt, 100) / 1000;
    const { visible, oculto, fundido, opacidadMinimaParaAgarrar } = INTERMITENTE;
    const posicionEnCiclo = this.tiempo % (visible + oculto);
    const enFaseVisible = posicionEnCiclo < visible;
    const restante = enFaseVisible ? visible - posicionEnCiclo : 0;

    // Opacidad: sube al empezar la fase visible y baja al terminar
    const opacidad = enFaseVisible ? Math.min(1, posicionEnCiclo / fundido, restante / fundido) : 0;
    const malla = this.el.getObject3D('mesh');
    if (malla && Math.abs(opacidad - this.opacidad) > 0.005) {
      this.opacidad = opacidad;
      malla.material.transparent = true;
      malla.material.opacity = opacidad;
      malla.visible = opacidad > 0.01;
      this.contorno.material.opacity = 0.45 * (1 - opacidad);
      this.fondoAnillo.visible = enFaseVisible;
    }

    // Arco de tiempo visible que queda
    const largo = restante / visible;
    if (Math.abs(largo - this.ultimoLargo) > 0.01) {
      this.ultimoLargo = largo;
      this.actualizarArco(largo);
    }

    const agarre = this.el.components.agarre;
    const disponible = opacidad >= opacidadMinimaParaAgarrar;
    if (agarre && disponible !== this.disponible) {
      this.disponible = disponible;
      agarre.ponerDisponible(disponible);
    }
  },

  remove() {
    this.el.removeObject3D('indicador');
    [this.fondoAnillo, this.arco, this.contorno].forEach((objeto) => {
      objeto.geometry.dispose();
      objeto.material.dispose();
    });
  },
});
