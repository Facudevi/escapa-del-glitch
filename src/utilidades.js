// Funciones auxiliares compartidas por los componentes.

// Crea una primitiva de A-Frame con sus atributos y la agrega al padre.
export function crear(padre, etiqueta, atributos = {}) {
  const el = document.createElement(etiqueta);
  Object.entries(atributos).forEach(([clave, valor]) => el.setAttribute(clave, valor));
  padre.appendChild(el);
  return el;
}
