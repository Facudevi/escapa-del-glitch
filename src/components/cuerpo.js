// Cuerpo del jugador: torso, cadera, piernas y pies que siguen a la cabeza. Va en el rig.
//
// Sirve para que el jugador vea dónde está su cuerpo: si está parado sobre un estante o un piso, y si la
// niebla del Glitch le está llegando a los pies (el cuerpo se pone rojizo como aviso, antes de que lo alcance).
// No se agarra ni se golpea con él: es solo para mirar.
import { CUERPO, NIEBLA } from '../config.js';

AFRAME.registerComponent('cuerpo', {
  init() {
    this.material = new THREE.MeshStandardMaterial({ color: CUERPO.color, roughness: 0.75, metalness: 0 });
    this.colorNormal = new THREE.Color(CUERPO.color);
    this.colorPeligro = new THREE.Color(CUERPO.colorPeligro);
    this.grupo = new THREE.Group();

    // Torso (con un pequeño escote más claro) y cadera
    this.torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.32, 4, 12), this.material);
    this.torso.scale.set(CUERPO.anchoTorso / 0.3, 1, 0.65);
    this.cadera = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), this.material);
    this.cadera.scale.set(1.1, 0.7, 0.75);
    this.grupo.add(this.torso, this.cadera);

    // Piernas y pies (las piernas se estiran según la altura de la cadera)
    this.piernas = [-1, 1].map((lado) => {
      const pierna = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 1, 4, 10), this.material);
      const pie = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.24), this.material);
      this.grupo.add(pierna, pie);
      return { lado, pierna, pie };
    });

    this.el.setObject3D('cuerpo', this.grupo);
    this.camara = null;
    this.niebla = null;
    this.posMundo = new THREE.Vector3();
  },

  tick() {
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;
    const cabeza = this.camara.object3D.position; // dentro del rig
    const giro = this.camara.object3D.rotation.y; // hacia dónde mira (solo el giro horizontal)
    this.grupo.position.set(cabeza.x, 0, cabeza.z);
    this.grupo.rotation.y = giro;

    // Alturas: hombros un poco debajo de los ojos y cadera a mitad de camino hacia el piso
    const hombros = Math.max(0.6, cabeza.y - CUERPO.alturaHombros);
    const cadera = Math.max(0.35, Math.min(CUERPO.alturaCadera, hombros * 0.62));
    const largoTorso = Math.max(0.2, hombros - cadera - 0.1);
    this.torso.scale.y = largoTorso / 0.62;
    this.torso.position.set(0, cadera + 0.05 + largoTorso / 2, 0.12); // apenas detrás de la cabeza
    this.cadera.position.set(0, cadera, 0.12);
    this.piernas.forEach(({ lado, pierna, pie }) => {
      const largo = Math.max(0.1, cadera - 0.1);
      pierna.scale.y = largo / 1.13;
      pierna.position.set(lado * 0.1, cadera / 2 + 0.04, 0.12);
      pie.position.set(lado * 0.1, 0.035, 0.06);
    });

    // Aviso: la niebla le llega a los pies
    if (!this.niebla) this.niebla = this.el.sceneEl.components.niebla;
    if (this.niebla) {
      this.el.object3D.getWorldPosition(this.posMundo);
      const encima = this.niebla.y - this.posMundo.y; // cuánto le falta a la niebla para llegar a los pies (negativo)
      const peligro = Math.min(Math.max((encima + CUERPO.distanciaPeligro) / (CUERPO.distanciaPeligro + NIEBLA.fraccionCatch), 0), 1);
      this.material.color.copy(this.colorNormal).lerp(this.colorPeligro, peligro);
      this.material.emissive.copy(this.colorPeligro);
      this.material.emissiveIntensity = peligro * 0.4;
    }
  },

  remove() {
    this.el.removeObject3D('cuerpo');
  },
});
