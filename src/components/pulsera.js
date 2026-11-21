// Pulsera en la muñeca izquierda: muestra cuántos fragmentos lleva el jugador (0/3) durante toda la
// partida y, con una barra, cuánto falta para poder volver a usar el escaneo. Va en la entidad de la
// mano izquierda (junto a mano-guante).
//
// Tocar la pulsera con la otra mano pide un escaneo (evento 'escaneo-pedido'). Es interfaz dentro del
// mundo: no hay HUD pegado a la pantalla.
import { COLORES, FRAGMENTO, PULSERA } from '../config.js';

const FUENTE = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';

// Dibuja un hexágono centrado en (x, y)
function hexagono(ctx, x, y, radio) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angulo = (Math.PI / 3) * i + Math.PI / 6;
    const px = x + radio * Math.cos(angulo);
    const py = y + radio * Math.sin(angulo);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

AFRAME.registerComponent('pulsera', {
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;

    this.panel = new THREE.Mesh(
      new THREE.PlaneGeometry(PULSERA.ancho, PULSERA.alto),
      new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, side: THREE.DoubleSide })
    );
    this.panel.position.set(...PULSERA.desplazamiento);

    // La banda alrededor de la muñeca
    this.banda = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.012, 8, 24),
      new THREE.MeshBasicMaterial({ color: COLORES.lavanda })
    );
    this.banda.rotation.x = Math.PI / 2;
    this.banda.position.set(0, 0, 0.07);

    this.grupo = new THREE.Group();
    this.grupo.add(this.panel, this.banda);
    this.el.setObject3D('pulsera', this.grupo);

    this.escena = this.el.sceneEl;
    this.otraMano = null;
    this.camara = null;
    this.ultimo = { recogidos: -1, barra: -1 };
    this.tocando = false;
    this.posPanel = new THREE.Vector3();
    this.posMano = new THREE.Vector3();
    this.posCamara = new THREE.Vector3();
  },

  dibujar(recogidos, barra) {
    const ctx = this.canvas.getContext('2d');
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Fondo
    ctx.fillStyle = COLORES.cartelFondo;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 36);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tres fragmentos: llenos los que se juntaron, con borde punteado los que faltan
    for (let i = 0; i < FRAGMENTO.total; i++) {
      const x = 70 + i * 82;
      hexagono(ctx, x, 92, 34);
      if (i < recogidos) {
        ctx.fillStyle = COLORES.fragmento;
        ctx.fill();
      } else {
        ctx.setLineDash([7, 7]);
        ctx.lineWidth = 4;
        ctx.strokeStyle = COLORES.fragmentoBrillo;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Contador
    ctx.fillStyle = COLORES.cartelTexto;
    ctx.font = `bold 78px ${FUENTE}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${recogidos}/${FRAGMENTO.total}`, 330, 96);

    // Barra del escaneo: se llena durante la espera y queda completa cuando está listo
    ctx.fillStyle = COLORES.anilloFondo;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.roundRect(36, 178, w - 72, 36, 18);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (barra > 0.01) {
      ctx.fillStyle = COLORES.celeste;
      ctx.beginPath();
      ctx.roundRect(36, 178, (w - 72) * barra, 36, 18);
      ctx.fill();
    }
    this.textura.needsUpdate = true;
  },

  tick() {
    const fragmentos = this.escena.components.fragmentos;
    const escaneo = this.escena.components.escaneo;
    const recogidos = fragmentos ? fragmentos.recogidos : 0;
    const barra = escaneo ? Math.round(escaneo.fraccionEspera() * 50) / 50 : 1;
    if (recogidos !== this.ultimo.recogidos || barra !== this.ultimo.barra) {
      this.ultimo = { recogidos, barra };
      this.dibujar(recogidos, barra);
    }

    // El panel mira a la cabeza para que se lea de frente
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;
    this.camara.object3D.getWorldPosition(this.posCamara);
    this.panel.lookAt(this.posCamara);

    // ¿La otra mano toca la pulsera?
    if (!this.otraMano) this.otraMano = document.querySelector('#mano-der');
    if (!this.otraMano || !escaneo) return;
    this.panel.getWorldPosition(this.posPanel);
    this.otraMano.object3D.getWorldPosition(this.posMano);
    const distancia = this.posMano.distanceTo(this.posPanel);
    if (distancia <= PULSERA.radioToque && !this.tocando) {
      this.tocando = true;
      this.escena.emit('escaneo-pedido', { origen: 'pulsera' }, false);
    } else if (distancia > PULSERA.radioToque * 1.6) {
      this.tocando = false;
    }
  },

  remove() {
    this.el.removeObject3D('pulsera');
    this.panel.geometry.dispose();
    this.panel.material.dispose();
    this.banda.geometry.dispose();
    this.banda.material.dispose();
    this.textura.dispose();
  },
});
