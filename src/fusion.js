// Fusiona las mallas de un grupo en muy pocas (una por tipo de material), con el color de cada pieza
// guardado en sus vértices. El decorado del setup tiene cientos de piezas chicas (teclas, aspas, tornillos);
// dibujadas una por una pesarían mucho en el casco, y fusionadas se dibujan en unas pocas llamadas.
//
// No se tocan las mallas con textura, transparentes ni las marcadas con userData.noFusionar = true.
// Las mallas instanciadas se expanden (cada instancia con su color).

const _posicion = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _matrizNormal = new THREE.Matrix3();
const _matriz = new THREE.Matrix4();

// Agrega a un lote la geometría `geometria` transformada por `matriz` y pintada con `color`
function agregar(lote, geometria, matriz, color) {
  const g = geometria.index ? geometria.toNonIndexed() : geometria;
  const posiciones = g.attributes.position;
  const normales = g.attributes.normal;
  _matrizNormal.getNormalMatrix(matriz);
  for (let i = 0; i < posiciones.count; i++) {
    _posicion.fromBufferAttribute(posiciones, i).applyMatrix4(matriz);
    lote.posiciones.push(_posicion.x, _posicion.y, _posicion.z);
    if (normales) {
      _normal.fromBufferAttribute(normales, i).applyMatrix3(_matrizNormal).normalize();
      lote.normales.push(_normal.x, _normal.y, _normal.z);
    } else {
      lote.normales.push(0, 0, 1);
    }
    lote.colores.push(color.r, color.g, color.b);
  }
  if (g !== geometria) g.dispose();
}

// raiz: THREE.Group con las piezas. Devuelve la misma raíz, con las mallas fusionadas.
export function fusionar(raiz) {
  raiz.updateMatrixWorld(true);
  const lotes = {
    estandar: { posiciones: [], normales: [], colores: [] },
    basico: { posiciones: [], normales: [], colores: [] },
  };
  const fusionadas = [];

  raiz.traverse((obj) => {
    if (!obj.isMesh) return;
    const material = obj.material;
    if (!material || Array.isArray(material) || material.map || material.transparent || obj.userData.noFusionar) return;
    const lote = material.isMeshBasicMaterial ? lotes.basico : lotes.estandar;

    if (obj.isInstancedMesh) {
      const color = new THREE.Color();
      for (let i = 0; i < obj.count; i++) {
        obj.getMatrixAt(i, _matriz);
        _matriz.premultiply(obj.matrixWorld);
        if (obj.instanceColor) obj.getColorAt(i, color);
        else color.copy(material.color);
        agregar(lote, obj.geometry, _matriz, color);
      }
    } else {
      agregar(lote, obj.geometry, obj.matrixWorld, material.color);
    }
    fusionadas.push(obj);
  });

  // Se sacan las piezas sueltas
  fusionadas.forEach((obj) => {
    if (obj.parent) obj.parent.remove(obj);
    obj.geometry.dispose();
  });

  // Se agrega una malla por lote, con las posiciones ya en el espacio de la raíz
  const construir = (lote, material) => {
    if (!lote.posiciones.length) return;
    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute('position', new THREE.Float32BufferAttribute(lote.posiciones, 3));
    geometria.setAttribute('normal', new THREE.Float32BufferAttribute(lote.normales, 3));
    geometria.setAttribute('color', new THREE.Float32BufferAttribute(lote.colores, 3));
    geometria.computeBoundingSphere();
    const malla = new THREE.Mesh(geometria, material);
    malla.userData.noFusionar = true;
    // Las posiciones ya incluyen la matriz del mundo de cada pieza: la malla queda sin transformar
    raiz.add(malla);
  };
  construir(lotes.estandar, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 }));
  construir(lotes.basico, new THREE.MeshBasicMaterial({ vertexColors: true }));
  return raiz;
}
