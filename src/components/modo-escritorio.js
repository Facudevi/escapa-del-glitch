// Modo escritorio (solo para probar sin casco): WASD para caminar y clic en un agarre
// para llevar al jugador hasta él. Se desactiva solo al entrar en VR. Va en la <a-scene>.
import { ESCRITORIO } from '../config.js';

AFRAME.registerComponent('modo-escritorio', {
  init() {
    this.teclas = {};
    this.rig = null;
    this.direccion = new THREE.Vector3();

    window.addEventListener('keydown', (e) => (this.teclas[e.code] = true));
    window.addEventListener('keyup', (e) => (this.teclas[e.code] = false));

    // Los clics del cursor burbujean hasta la escena
    this.el.addEventListener('click', (e) => this.alClickear(e));
  },

  enVR() {
    return this.el.is('vr-mode');
  },

  alClickear(e) {
    if (this.enVR()) return;
    const objetivo = e.target;
    if (!objetivo || !objetivo.classList.contains('agarre')) return;

    const rig = document.querySelector('#rig');
    const destino = new THREE.Vector3();
    objetivo.object3D.getWorldPosition(destino);

    // El jugador queda frente al agarre, con la mano a la altura del agarre
    destino.y = Math.max(0, destino.y - ESCRITORIO.alturaAgarre);
    destino.z += ESCRITORIO.distanciaAlAgarre;

    rig.setAttribute('animation__viaje', {
      property: 'position',
      to: `${destino.x} ${destino.y} ${destino.z}`,
      dur: ESCRITORIO.duracionViaje,
      easing: 'easeInOutQuad',
    });
  },

  tick(tiempo, dt) {
    if (this.enVR()) return;
    if (!this.rig) this.rig = document.querySelector('#rig');
    const camara = document.querySelector('#camara');
    if (!this.rig || !camara) return;

    const adelante = (this.teclas.KeyW ? 1 : 0) - (this.teclas.KeyS ? 1 : 0);
    const lateral = (this.teclas.KeyD ? 1 : 0) - (this.teclas.KeyA ? 1 : 0);
    if (!adelante && !lateral) return;

    // Moverse según hacia dónde mira la cámara, solo en el plano horizontal
    const yaw = camara.object3D.rotation.y;
    this.direccion.set(lateral, 0, -adelante).normalize();
    this.direccion.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    const paso = (ESCRITORIO.velocidadCaminar * dt) / 1000;
    const pos = this.rig.object3D.position;
    pos.x += this.direccion.x * paso;
    pos.z += this.direccion.z * paso;
  },
});
