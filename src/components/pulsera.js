// Reloj de pulsera en la muñeca izquierda: una correa, una caja redonda con la esfera (el contador y un arco
// de espera del escaneo) y, flotando sobre la mano, un panel grande con lo mismo para leerlo bien: cuántos
// fragmentos lleva el jugador (0/3) durante toda la partida y, con una barra, cuánto falta para poder volver
// a usar el escaneo. Va en la entidad de la mano izquierda (junto a mano-guante).
//
// Tocar la pulsera con la otra mano pide un escaneo (evento 'escaneo-pedido'). Es interfaz dentro del
// mundo: no hay HUD pegado a la pantalla.
import { COLORES, FRAGMENTO, JUGADOR, PULSERA } from '../config.js';

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

    // Reloj en la muñeca: correa alrededor de la manga, caja redonda en el dorso de la mano y una esfera
    // con el contador. En la mano izquierda, el dorso mira hacia -x y la muñeca queda hacia +z.
    const z = 0.0545;
    const correa = new THREE.MeshStandardMaterial({ color: COLORES.lavanda, roughness: 0.7 });
    const carcasa = new THREE.MeshStandardMaterial({ color: '#4a4666', roughness: 0.4, metalness: 0.5 });
    this.canvasReloj = document.createElement('canvas');
    this.canvasReloj.width = this.canvasReloj.height = 128;
    this.texturaReloj = new THREE.CanvasTexture(this.canvasReloj);
    this.texturaReloj.colorSpace = THREE.SRGBColorSpace;

    this.reloj = new THREE.Group();
    this.reloj.scale.setScalar(JUGADOR.mano.escala); // acompaña el tamaño de la mano
    this.reloj.add(new THREE.Mesh(new THREE.TorusGeometry(0.043, 0.008, 8, 28), correa).translateZ(z));
    const caja = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.029, 0.014, 24), carcasa);
    caja.rotation.z = Math.PI / 2;
    caja.position.set(-0.053, 0, z);
    this.reloj.add(caja);
    const bisel = new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.004, 8, 24), new THREE.MeshStandardMaterial({ color: COLORES.violeta, roughness: 0.5 }));
    bisel.rotation.y = Math.PI / 2;
    bisel.position.set(-0.0605, 0, z);
    this.reloj.add(bisel);
    this.esfera = new THREE.Mesh(new THREE.CircleGeometry(0.0235, 28), new THREE.MeshBasicMaterial({ map: this.texturaReloj }));
    this.esfera.rotation.y = -Math.PI / 2;
    this.esfera.position.set(-0.0612, 0, z);
    this.reloj.add(this.esfera);
    const corona = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.012), carcasa);
    corona.position.set(-0.05, 0, z - 0.03);
    this.reloj.add(corona);

    this.grupo = new THREE.Group();
    this.grupo.add(this.panel, this.reloj);
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

  // Esfera del reloj: arco con la espera del escaneo y el contador de fragmentos
  dibujarReloj(recogidos, barra) {
    const ctx = this.canvasReloj.getContext('2d');
    const w = 128;
    ctx.fillStyle = COLORES.cartelFondo;
    ctx.fillRect(0, 0, w, w);
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(211, 201, 234, 0.25)';
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.stroke();
    if (barra > 0.01) {
      ctx.strokeStyle = COLORES.celeste;
      ctx.beginPath();
      ctx.arc(64, 64, 52, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(barra, 1));
      ctx.stroke();
    }
    ctx.fillStyle = recogidos >= FRAGMENTO.total ? COLORES.fragmentoBrillo : COLORES.cartelTexto;
    ctx.font = `bold 46px ${FUENTE}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${recogidos}/${FRAGMENTO.total}`, 64, 66);
    this.texturaReloj.needsUpdate = true;
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
      this.dibujarReloj(recogidos, barra);
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
    this.reloj.traverse((m) => {
      if (m.isMesh) {
        m.geometry.dispose();
        m.material.dispose();
      }
    });
    this.textura.dispose();
    this.texturaReloj.dispose();
  },
});
