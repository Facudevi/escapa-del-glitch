// Tecla que se hunde: baja despacio y a velocidad constante mientras está agarrada, como una tecla
// que se presiona, y arrastra al jugador si no sigue subiendo (climb mueve al jugador con el agarre).
// Al soltarla vuelve a su lugar. Va en una entidad con el componente agarre.
// Lleva una flecha hacia abajo en la cara frontal para que se reconozca de lejos.
import { COLORES, HUNDE, PARED_PRUEBA } from '../config.js';

AFRAME.registerComponent('tecla-hunde', {
  init() {
    this.yBase = null; // altura original, se toma en el primer cuadro
    this.hundido = 0; // cuánto bajó (m)

    // Flecha hacia abajo en la cara frontal de la tecla
    const forma = new THREE.Shape();
    forma.moveTo(-0.06, 0.035);
    forma.lineTo(0.06, 0.035);
    forma.lineTo(0, -0.04);
    forma.closePath();
    this.flecha = new THREE.Mesh(
      new THREE.ShapeGeometry(forma),
      new THREE.MeshBasicMaterial({ color: COLORES.flecha, side: THREE.DoubleSide })
    );
    this.flecha.position.z = PARED_PRUEBA.tecla.profundidad / 2 + 0.002;
    this.el.setObject3D('flecha', this.flecha);
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

  remove() {
    this.el.removeObject3D('flecha');
    this.flecha.geometry.dispose();
    this.flecha.material.dispose();
  },
});
