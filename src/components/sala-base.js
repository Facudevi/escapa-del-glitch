// Sala de pruebas de la etapa 1: piso, paredes que marcan los límites y
// unos agarres de prueba para verificar el modo escritorio y las manos.
// Se reemplaza por las paredes de escalada reales a partir de la etapa 2.
import { COLORES, SALA } from '../config.js';

// Crea una primitiva de A-Frame con atributos y la agrega al padre.
function crear(padre, etiqueta, atributos) {
  const el = document.createElement(etiqueta);
  Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
  padre.appendChild(el);
  return el;
}

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

    // Agarres de prueba (teclas firmes provisorias) frente al jugador
    const agarres = [
      { x: -0.6, y: 1.4 },
      { x: 0.5, y: 1.9 },
      { x: -0.2, y: 2.5 },
    ];
    agarres.forEach(({ x, y }) => {
      crear(escena, 'a-box', {
        class: 'agarre',
        position: `${x} ${y} ${-2.5}`,
        width: 0.4,
        height: 0.14,
        depth: 0.3,
        color: COLORES.lavanda,
        material: 'roughness: 0.8; metalness: 0',
      });
    });
  },
});
