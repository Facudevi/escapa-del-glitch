// Anillo de energía alrededor del guante. Va en la entidad de la mano (junto a mano-guante).
// Un anillo tenue de fondo y un arco que se acorta con la energía, de verde a ámbar y a rojo.
// El anillo mira siempre hacia la cabeza del jugador, para que se lea de frente.
import { COLORES, ENERGIA } from '../config.js';

AFRAME.registerComponent('anillo-energia', {
  schema: { mano: { type: 'string', default: 'izquierda' } },

  init() {
    this.rig = null;
    this.camara = null;
    this.posCamara = new THREE.Vector3();
    this.ultimoValor = -1;

    this.verde = new THREE.Color(COLORES.verde);
    this.ambar = new THREE.Color(COLORES.ambar);
    this.rojo = new THREE.Color(COLORES.rojo);

    const { radioInterno, radioExterno, segmentos } = ENERGIA;
    this.grupo = new THREE.Group();

    this.fondo = new THREE.Mesh(
      new THREE.RingGeometry(radioInterno, radioExterno, segmentos),
      new THREE.MeshBasicMaterial({
        color: COLORES.anilloFondo,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
        fog: false,
      })
    );
    this.arco = new THREE.Mesh(
      new THREE.RingGeometry(radioInterno, radioExterno, 3, 1, 0, 0.1),
      new THREE.MeshBasicMaterial({ color: this.verde, side: THREE.DoubleSide, fog: false })
    );
    this.arco.position.z = 0.001; // apenas delante del fondo

    this.grupo.add(this.fondo, this.arco);
    this.el.setObject3D('anillo', this.grupo);
  },

  // Color según la energía: verde → ámbar → rojo, con transición suave
  colorPara(valor, destino) {
    const { verdeDesde, ambarEn, rojoDesde } = ENERGIA;
    if (valor >= verdeDesde) return destino.copy(this.verde);
    if (valor >= ambarEn) {
      return destino.lerpColors(this.ambar, this.verde, (valor - ambarEn) / (verdeDesde - ambarEn));
    }
    if (valor >= rojoDesde) {
      return destino.lerpColors(this.rojo, this.ambar, (valor - rojoDesde) / (ambarEn - rojoDesde));
    }
    return destino.copy(this.rojo);
  },

  // Rearma el arco para que cubra la fracción `valor` del anillo, empezando desde arriba
  actualizarArco(valor) {
    this.arco.visible = valor > 0.01;
    if (!this.arco.visible) return;

    const { radioInterno, radioExterno, segmentos } = ENERGIA;
    const largo = Math.PI * 2 * Math.min(valor, 1);
    this.arco.geometry.dispose();
    this.arco.geometry = new THREE.RingGeometry(
      radioInterno,
      radioExterno,
      Math.max(3, Math.ceil(segmentos * valor)),
      1,
      Math.PI / 2 - largo,
      largo
    );
    this.colorPara(valor, this.arco.material.color);
  },

  tick() {
    if (!this.rig) this.rig = document.querySelector('#rig');
    if (!this.camara) this.camara = document.querySelector('#camara');
    const energia = this.rig && this.rig.components.energia;
    if (!energia || !this.camara) return;

    const valor = energia.valores[this.data.mano];
    if (Math.abs(valor - this.ultimoValor) > 0.004) {
      this.ultimoValor = valor;
      this.actualizarArco(valor);
    }

    // El anillo mira a la cabeza
    this.camara.object3D.getWorldPosition(this.posCamara);
    this.grupo.lookAt(this.posCamara);
  },

  remove() {
    this.el.removeObject3D('anillo');
    this.fondo.geometry.dispose();
    this.fondo.material.dispose();
    this.arco.geometry.dispose();
    this.arco.material.dispose();
  },
});
