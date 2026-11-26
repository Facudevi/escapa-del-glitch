// Paisaje vivo del exterior del final: árboles que se mecen, pasto, flores que se mueven con el viento,
// pajaritos que vuelan en círculos aleteando, mariposas que revolotean cerca y nubes que pasan despacio.
// Todo con formas simples. Devuelve { grupo, animar(segundos) }; el grupo tiene el origen donde aparece el
// jugador, que mira hacia -z (ahí están el podio y el pedestal, y se deja ese lugar libre).
import { PAISAJE } from './config.js';

// Números al azar con semilla, para que el paisaje sea siempre igual
function crearAzar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const estandar = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0 });
// ¿Este punto cae donde están el podio, el pedestal y el cartel (delante del jugador)?
const ocupado = (x, z) => Math.abs(x) < 3.2 && z < -1.2 && z > -5;

export function crearPaisaje() {
  const azar = crearAzar(20261125);
  const grupo = new THREE.Group();
  const P = PAISAJE;

  // ---------- Árboles (redondos y pinos) ----------
  const tronco = estandar('#8a6a4a');
  const hojas = P.colorHojas.map(estandar);
  const arboles = [];
  for (let i = 0; i < P.arboles; i++) {
    const angulo = azar() * Math.PI * 2;
    const distancia = entre(P.radioArboles[0], P.radioArboles[1], azar());
    const x = Math.sin(angulo) * distancia;
    const z = -Math.cos(angulo) * distancia;
    if (distancia < 18 && Math.abs(x) < 6 && z < 0) continue; // no tapar la vista de adelante
    const arbol = new THREE.Group();
    arbol.position.set(x, 0, z);
    const escala = entre(0.8, 1.5, azar());
    arbol.scale.setScalar(escala);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 2.2, 8), tronco);
    t.position.y = 1.1;
    arbol.add(t);
    const copa = new THREE.Group();
    copa.position.y = 2.2;
    const material = hojas[i % hojas.length];
    if (azar() < 0.5) {
      // Árbol redondo: tres esferas
      [[0, 0.9, 0, 1.2], [0.6, 0.5, 0.2, 0.8], [-0.5, 0.6, -0.2, 0.85]].forEach(([dx, dy, dz, r]) => {
        const bola = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 9), material);
        bola.position.set(dx, dy, dz);
        copa.add(bola);
      });
    } else {
      // Pino: tres conos
      [[0, 1.0, 1.3], [0, 1.9, 1.0], [0, 2.7, 0.7]].forEach(([dx, dy, r]) => {
        const cono = new THREE.Mesh(new THREE.ConeGeometry(r, 1.6, 10), material);
        cono.position.set(dx, dy, 0);
        copa.add(cono);
      });
    }
    arbol.add(copa);
    grupo.add(arbol);
    arboles.push({ copa, fase: azar() * 6 });
  }

  // ---------- Pasto (matas) ----------
  const matas = new THREE.InstancedMesh(new THREE.ConeGeometry(0.08, 0.35, 5), estandar('#5f9a6c'), P.matas);
  const aux = new THREE.Object3D();
  for (let i = 0, n = 0; n < P.matas && i < P.matas * 4; i++) {
    const r = entre(1.5, P.radioFlores, Math.sqrt(azar()));
    const a = azar() * Math.PI * 2;
    const x = Math.sin(a) * r;
    const z = -Math.cos(a) * r;
    if (ocupado(x, z)) continue;
    aux.position.set(x, 0.17, z);
    aux.rotation.set(entre(-0.2, 0.2, azar()), azar() * 6, entre(-0.2, 0.2, azar()));
    aux.scale.setScalar(entre(0.7, 1.4, azar()));
    aux.updateMatrix();
    matas.setMatrixAt(n++, aux.matrix);
  }
  matas.instanceMatrix.needsUpdate = true;
  grupo.add(matas);

  // ---------- Flores (tallo y corola), que se mecen ----------
  const tallos = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 5), estandar('#4f8a5c'), P.flores);
  const corolas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.8 }), P.flores);
  const flores = [];
  const color = new THREE.Color();
  for (let i = 0; flores.length < P.flores && i < P.flores * 4; i++) {
    const r = entre(1.8, P.radioFlores, Math.sqrt(azar()));
    const a = azar() * Math.PI * 2;
    const x = Math.sin(a) * r;
    const z = -Math.cos(a) * r;
    if (ocupado(x, z)) continue;
    const flor = { x, z, alto: entre(0.25, 0.55, azar()), fase: azar() * 6.3, velocidad: entre(1.2, 2.0, azar()) };
    corolas.setColorAt(flores.length, color.set(P.colorFlores[flores.length % P.colorFlores.length]));
    flores.push(flor);
  }
  corolas.instanceColor.needsUpdate = true;
  grupo.add(tallos, corolas);

  const moverFlores = (s) => {
    flores.forEach((f, i) => {
      const inclinacion = Math.sin(s * f.velocidad + f.fase) * 0.12;
      aux.position.set(f.x + Math.sin(inclinacion) * f.alto * 0.5, f.alto / 2, f.z);
      aux.rotation.set(0, 0, -inclinacion);
      aux.scale.set(1, f.alto, 1);
      aux.updateMatrix();
      tallos.setMatrixAt(i, aux.matrix);
      aux.position.set(f.x + Math.sin(inclinacion) * f.alto, f.alto, f.z);
      aux.rotation.set(0, 0, 0);
      aux.scale.set(1, 0.75, 1);
      aux.updateMatrix();
      corolas.setMatrixAt(i, aux.matrix);
    });
    tallos.instanceMatrix.needsUpdate = true;
    corolas.instanceMatrix.needsUpdate = true;
  };
  moverFlores(0);

  // ---------- Pajaritos que vuelan en círculos ----------
  const plumas = estandar('#4a4666');
  const pajaros = [];
  for (let i = 0; i < P.pajaros; i++) {
    const pajaro = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), plumas);
    cuerpo.scale.set(0.8, 0.7, 1.6);
    pajaro.add(cuerpo);
    const alas = [-1, 1].map((lado) => {
      const pivote = new THREE.Group();
      pivote.position.set(lado * 0.1, 0.03, 0);
      const ala = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.22), plumas);
      ala.position.x = lado * 0.28;
      pivote.add(ala);
      pajaro.add(pivote);
      return { pivote, lado };
    });
    grupo.add(pajaro);
    pajaros.push({
      pajaro,
      alas,
      radio: entre(10, 26, azar()),
      altura: entre(8, 16, azar()),
      velocidad: entre(0.15, 0.3, azar()) * (azar() < 0.5 ? 1 : -1),
      fase: azar() * 6.3,
      aleteo: entre(7, 10, azar()),
      centro: { x: entre(-8, 8, azar()), z: entre(-30, -10, azar()) },
    });
  }

  // ---------- Mariposas cerca del jugador ----------
  const mariposas = [];
  for (let i = 0; i < P.mariposas; i++) {
    const mariposa = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: P.colorFlores[(i + 2) % P.colorFlores.length], side: THREE.DoubleSide, roughness: 0.7 });
    const alas = [-1, 1].map((lado) => {
      const pivote = new THREE.Group();
      const ala = new THREE.Mesh(new THREE.CircleGeometry(0.09, 10), material);
      ala.position.x = lado * 0.08;
      ala.rotation.x = -Math.PI / 2;
      pivote.add(ala);
      mariposa.add(pivote);
      return { pivote, lado };
    });
    grupo.add(mariposa);
    mariposas.push({ mariposa, alas, fase: azar() * 6.3, radio: entre(2.5, 6, azar()), altura: entre(0.6, 1.6, azar()), velocidad: entre(0.25, 0.45, azar()) });
  }

  // ---------- Nubes que pasan ----------
  const blanco = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.92, fog: false });
  const nubes = [];
  for (let i = 0; i < P.nubes; i++) {
    const nube = new THREE.Group();
    for (let k = 0; k < 5; k++) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(entre(2.5, 4.5, azar()), 12, 9), blanco);
      bola.position.set(k * 3 - 6, entre(-0.8, 0.8, azar()), entre(-1.5, 1.5, azar()));
      bola.scale.y = 0.6;
      nube.add(bola);
    }
    nube.position.set(entre(-90, 90, azar()), entre(38, 55, azar()), entre(-120, -40, azar()));
    grupo.add(nube);
    nubes.push({ nube, velocidad: entre(0.6, 1.4, azar()) });
  }

  return {
    grupo,
    animar(s, dt) {
      arboles.forEach(({ copa, fase }) => {
        copa.rotation.z = Math.sin(s * 0.7 + fase) * 0.035;
        copa.rotation.x = Math.cos(s * 0.5 + fase) * 0.025;
      });
      moverFlores(s);
      pajaros.forEach((p) => {
        const a = s * p.velocidad + p.fase;
        const x = p.centro.x + Math.cos(a) * p.radio;
        const z = p.centro.z + Math.sin(a) * p.radio;
        const y = p.altura + Math.sin(s * 0.8 + p.fase) * 0.8;
        p.pajaro.position.set(x, y, z);
        // Mira hacia donde vuela
        p.pajaro.rotation.y = -a - (p.velocidad > 0 ? 0 : Math.PI);
        const aleteo = Math.sin(s * p.aleteo + p.fase) * 0.6;
        p.alas.forEach(({ pivote, lado }) => (pivote.rotation.z = lado * aleteo));
      });
      mariposas.forEach((m) => {
        const a = s * m.velocidad + m.fase;
        m.mariposa.position.set(Math.cos(a) * m.radio, m.altura + Math.sin(s * 1.7 + m.fase) * 0.25, -3 + Math.sin(a * 1.3) * m.radio * 0.6);
        m.mariposa.rotation.y = -a;
        const aleteo = Math.sin(s * 14 + m.fase) * 0.9;
        m.alas.forEach(({ pivote, lado }) => (pivote.rotation.z = lado * aleteo));
      });
      nubes.forEach((n) => {
        n.nube.position.x += n.velocidad * Math.min(dt, 0.1);
        if (n.nube.position.x > 110) n.nube.position.x = -110;
      });
    },
  };
}

function entre(a, b, t) {
  return a + (b - a) * t;
}
