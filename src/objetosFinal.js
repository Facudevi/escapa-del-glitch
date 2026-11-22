// Objetos del exterior del final: el podio con la medalla, el pedestal del botón de volver a jugar y el
// cartel de madera del descanso. Se arman con formas simples (cilindros, cajas, toros y una estrella
// extruida) y con relieve, para que se entienda qué es cada cosa y que ninguna flote en el aire.
// Cada función devuelve un THREE.Group con el origen en el piso, mirando hacia +z (hacia el jugador).
import { COLORES } from './config.js';

const FUENTE = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';

const estandar = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0, ...extra });
const metal = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.6 });

function malla(geometria, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometria, material);
  m.position.set(x, y, z);
  return m;
}

// Textura con líneas de texto centradas sobre un fondo (o transparente, si fondo es null)
function texturaTexto(lineas, ancho, alto, { fondo = null, color = '#f0e9fb', tamano = 0.3 } = {}) {
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const textura = new THREE.CanvasTexture(lienzo);
  textura.colorSpace = THREE.SRGBColorSpace;
  const dibujar = (textos) => {
    const ctx = lienzo.getContext('2d');
    ctx.clearRect(0, 0, ancho, alto);
    if (fondo) {
      ctx.fillStyle = fondo;
      ctx.fillRect(0, 0, ancho, alto);
    }
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const alturaLinea = (alto * 0.8) / Math.max(textos.length, 1);
    let px = Math.min(alto * tamano, alturaLinea * 0.8);
    ctx.font = `bold ${px}px ${FUENTE}`;
    // Se achica la letra hasta que la línea más larga entre en el ancho
    while (px > 8 && Math.max(...textos.map((t) => ctx.measureText(t).width)) > ancho * 0.9) {
      px -= 2;
      ctx.font = `bold ${px}px ${FUENTE}`;
    }
    textos.forEach((t, i) => ctx.fillText(t, ancho / 2, alto / 2 + (i - (textos.length - 1) / 2) * alturaLinea));
    textura.needsUpdate = true;
  };
  dibujar(lineas);
  return { textura, dibujar };
}

// Plano con texto, listo para pegar sobre una superficie
function placaDeTexto(lineas, w, h, opciones) {
  const { textura, dibujar } = texturaTexto(lineas, Math.round(w * 600), Math.round(h * 600), opciones);
  const plano = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: textura, transparent: true }));
  plano.userData.dibujar = dibujar;
  return plano;
}

// ---------- Medalla en un podio ----------

const MEDALLAS = {
  oro: { disco: COLORES.oro, borde: '#f2d27c', estrella: '#b98a24' },
  plata: { disco: COLORES.plata, borde: '#e6e9f0', estrella: '#8e94a6' },
  bronce: { disco: COLORES.bronce, borde: '#d9a678', estrella: '#8f5a33' },
};

function estrella(radioExterior, radioInterior, profundidad) {
  const forma = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? radioExterior : radioInterior;
    const angulo = Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  forma.closePath();
  return new THREE.ExtrudeGeometry(forma, { depth: profundidad, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1 });
}

// Podio de dos escalones con una columna y, arriba, una medalla con cinta colgando de un soporte.
// Devuelve { grupo, pintar(tipo, textoTiempo), mecer(tiempo) }.
export function crearPodioConMedalla() {
  const grupo = new THREE.Group();
  const piedra = estandar('#d8cfe6');
  const piedraOscura = estandar('#a99cc4');
  grupo.add(malla(new THREE.BoxGeometry(1.5, 0.14, 1.1), piedraOscura, 0, 0.07, 0));
  grupo.add(malla(new THREE.BoxGeometry(1.1, 0.14, 0.8), piedra, 0, 0.21, 0));
  grupo.add(malla(new THREE.CylinderGeometry(0.3, 0.34, 0.78, 20), piedra, 0, 0.67, 0));
  grupo.add(malla(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 24), piedraOscura, 0, 1.1, 0));

  // Placa con el nombre de la medalla y el tiempo, en el frente de la columna
  const placa = placaDeTexto(['Medalla', 'Tiempo'], 0.56, 0.34, { fondo: '#3a3050', color: '#f0e9fb', tamano: 0.36 });
  placa.position.set(0, 0.6, 0.345);
  grupo.add(placa);

  // Soporte y medalla (el grupo `medalla` se mece apenas)
  grupo.add(malla(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), metal('#8f8aa8'), 0, 1.35, -0.1));
  const medalla = new THREE.Group();
  medalla.position.set(0, 1.6, 0);
  grupo.add(medalla);

  const materialDisco = estandar(MEDALLAS.oro.disco, { roughness: 0.35, metalness: 0.55 });
  const materialBorde = estandar(MEDALLAS.oro.borde, { roughness: 0.3, metalness: 0.6 });
  const materialEstrella = estandar(MEDALLAS.oro.estrella, { roughness: 0.4, metalness: 0.5 });
  const disco = malla(new THREE.CylinderGeometry(0.36, 0.36, 0.07, 40), materialDisco);
  disco.rotation.x = Math.PI / 2;
  medalla.add(disco);
  const borde = malla(new THREE.TorusGeometry(0.36, 0.035, 10, 40), materialBorde, 0, 0, 0.035);
  medalla.add(borde);
  const anilloInterior = malla(new THREE.TorusGeometry(0.27, 0.014, 8, 36), materialBorde, 0, 0, 0.04);
  medalla.add(anilloInterior);
  const estrellaMalla = malla(estrella(0.19, 0.085, 0.025), materialEstrella, 0, 0.005, 0.04);
  medalla.add(estrellaMalla);

  // Argolla y cinta en V con una franja al medio, que sube hasta el soporte
  medalla.add(malla(new THREE.TorusGeometry(0.05, 0.014, 8, 16), metal('#c9cdd8'), 0, 0.4, 0));
  const cintaColor = estandar(COLORES.violeta);
  const cintaFranja = estandar('#f0e9fb');
  [-1, 1].forEach((lado) => {
    const tira = new THREE.Group();
    tira.position.set(lado * 0.1, 0.62, -0.005);
    tira.rotation.z = -lado * 0.32;
    tira.add(malla(new THREE.BoxGeometry(0.13, 0.5, 0.012), cintaColor));
    tira.add(malla(new THREE.BoxGeometry(0.03, 0.5, 0.014), cintaFranja));
    medalla.add(tira);
  });

  return {
    grupo,
    pintar(tipo, textoTiempo) {
      const m = MEDALLAS[tipo] || MEDALLAS.bronce;
      materialDisco.color.set(m.disco);
      materialBorde.color.set(m.borde);
      materialEstrella.color.set(m.estrella);
      placa.userData.dibujar([`Medalla de ${tipo}`, textoTiempo]);
    },
    mecer(tiempo) {
      medalla.rotation.y = Math.sin(tiempo * 0.9) * 0.4;
      medalla.rotation.z = Math.sin(tiempo * 0.6) * 0.04;
    },
  };
}

// ---------- Pedestal del botón de volver a jugar ----------

// Base, poste vertical y un cabezal con un cartel y el botón. Devuelve { grupo, posicionBoton } (la posición
// del botón en coordenadas del grupo, para ponerle encima la entidad golpeable).
export function crearPedestalDelBoton() {
  const grupo = new THREE.Group();
  const oscuro = estandar('#3a3050');
  const claro = estandar('#7b6aa8');
  grupo.add(malla(new THREE.CylinderGeometry(0.42, 0.46, 0.1, 24), oscuro, 0, 0.05, 0));
  grupo.add(malla(new THREE.CylinderGeometry(0.1, 0.12, 0.9, 16), claro, 0, 0.55, 0));
  grupo.add(malla(new THREE.CylinderGeometry(0.16, 0.2, 0.12, 16), oscuro, 0, 0.12, 0));

  // Cabezal: una caja con un borde más claro, el cartel arriba y el botón abajo
  const cabezal = new THREE.Group();
  cabezal.position.set(0, 1.28, 0);
  cabezal.add(malla(new THREE.BoxGeometry(0.68, 0.86, 0.14), oscuro));
  cabezal.add(malla(new THREE.BoxGeometry(0.72, 0.9, 0.08), claro, 0, 0, -0.03));
  const cartel = placaDeTexto(['Volver', 'a jugar'], 0.54, 0.34, { fondo: '#d8cfe6', color: '#3a3050', tamano: 0.38 });
  cartel.position.set(0, 0.22, 0.075);
  cabezal.add(cartel);
  const ayuda = placaDeTexto(['o tecla R'], 0.54, 0.1, { color: '#d8cfe6', tamano: 0.6 });
  ayuda.position.set(0, -0.04, 0.075);
  cabezal.add(ayuda);
  // Aro alrededor del botón
  cabezal.add(malla(new THREE.TorusGeometry(0.2, 0.03, 10, 28), estandar('#d8cfe6'), 0, -0.24, 0.08));
  grupo.add(cabezal);

  return { grupo, posicionBoton: new THREE.Vector3(0, 1.28 - 0.24, 0.1) };
}

// ---------- Cartel de madera ----------

// Poste con una tabla de madera y un texto pintado encima
export function crearCartelDeMadera(lineas) {
  const grupo = new THREE.Group();
  const madera = estandar('#8a6a4a');
  const tabla = estandar('#dcc08e');
  grupo.add(malla(new THREE.CylinderGeometry(0.06, 0.07, 1.3, 10), madera, 0, 0.65, 0));
  grupo.add(malla(new THREE.BoxGeometry(1.5, 0.74, 0.07), madera, 0, 1.25, 0));
  grupo.add(malla(new THREE.BoxGeometry(1.4, 0.64, 0.08), tabla, 0, 1.25, 0.005));
  const texto = placaDeTexto(lineas, 1.28, 0.52, { color: '#4a3a28', tamano: 0.24 });
  texto.position.set(0, 1.25, 0.05);
  grupo.add(texto);
  return grupo;
}
