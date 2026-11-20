// Sala base: piso y cuatro paredes que marcan los límites del espacio de juego.
import { COLORES, SALA } from '../config.js';
import { crear } from '../utilidades.js';

AFRAME.registerComponent('sala-base', {
  init() {
    const escena = this.el;
    const { lado, altoParedes } = SALA;
    const mitad = lado / 2;

    // Piso
    crear(escena, 'a-plane', {
      rotation: '-90 0 0',
      width: lado,
      height: lado,
      color: COLORES.piso,
      material: 'roughness: 1; metalness: 0',
    });

    // Cuatro paredes = límites de la sala
    const paredes = [
      { pos: `0 ${altoParedes / 2} ${-mitad}`, rot: '0 0 0' },
      { pos: `0 ${altoParedes / 2} ${mitad}`, rot: '0 180 0' },
      { pos: `${-mitad} ${altoParedes / 2} 0`, rot: '0 90 0' },
      { pos: `${mitad} ${altoParedes / 2} 0`, rot: '0 -90 0' },
    ];
    paredes.forEach(({ pos, rot }) => {
      crear(escena, 'a-plane', {
        position: pos,
        rotation: rot,
        width: lado,
        height: altoParedes,
        color: COLORES.pared,
        material: 'roughness: 1; metalness: 0',
      });
    });
  },
});
