# Escapá del Glitch

Experiencia de realidad virtual, touchpoint complementario de **RESET** (festival sobre bienestar gamer). El jugador queda atrapado dentro de un setup gamer gigante y lo escala con los brazos, de pie, para salir. Para encender el botón RESET que rompe la pantalla tiene que juntar tres fragmentos.

TP4 — Santino Mosca, Rodrigo Masek y Facundo de Vichenzo.

🔗 **Link público:** https://facudevi.github.io/escapa-del-glitch/ _(se activa al configurar GitHub Pages)_

Documentación del diseño: [`docs/idea-final.md`](docs/idea-final.md). Registro de prompts del desarrollo: [`PROMPTS.md`](PROMPTS.md).

## Documentación

- [`docs/idea-final.md`](docs/idea-final.md): diseño completo de la experiencia.
- [`docs/consigna-tp4.md`](docs/consigna-tp4.md): requisitos y entregas del TP4.
- [`docs/buenas-practicas-xr.md`](docs/buenas-practicas-xr.md): buenas prácticas de UX para XR y checklist por etapa.
- [`docs/problemas-resueltos.md`](docs/problemas-resueltos.md): problemas encontrados y cómo se resolvieron.
- [`PROMPTS.md`](PROMPTS.md): bitácora de prompts.

## El escenario

El jugador escala un setup gamer gigante de unos 22 m, en tres tramos con un checkpoint entre cada uno:

1. **Teclado:** teclas firmes para aprender; cerca del checkpoint aparecen las primeras teclas que se hunden.
2. **Torre de PC:** teclas que se hunden, latas que se rompen y los primeros paneles que giran.
3. **Monitor:** bloques intermitentes, paneles y agarres lejanos hacia los costados. Es el más exigente.

Arriba de todo está el botón RESET apagado. La distribución de agarres la genera `src/tramos.js` con una semilla fija (`ESCENARIO.semilla` en `src/config.js`); cambiarla da otra pared. Con `distanciaMax` de cada tramo se ajusta qué tan lejos están los agarres.

## Privacidad

La experiencia no recoge ni envía datos personales ni de uso.

## Stack

A-Frame 1.8 + Vite. Solo primitivas de A-Frame, sin modelos 3D ni librerías externas.

## Cómo correrlo

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Otros comandos: `npm run build` (genera `dist/`) y `npm run preview` (sirve el build).

## Cómo probarlo

- **En la compu (sin casco):** abrir en Chrome.
  - Arrastrar para mirar y **WASD** para caminar.
  - **Clic en un agarre lejano:** lleva al jugador hasta él.
  - **Escalar con mouse:** mantener el **clic izquierdo** (mano izquierda) o el **clic derecho** (mano derecha) sobre un agarre al alcance y **bajar el mouse** para subir. Con las dos manos agarradas se usan los dos botones.
  - **Caída:** si soltás las dos manos en el aire, la vista se funde a negro y reaparecés en el último checkpoint (plataforma verde, o el piso de inicio). Tras un clic de viaje tenés 3 segundos para agarrarte.
  - **Energía:** cada guante tiene un anillo (verde → ámbar → rojo). La mano agarrada gasta energía y la libre la recupera; sin energía la mano se suelta sola. Alternar las manos y llegar a un checkpoint recarga todo.
  - **Fragmentos:** hay uno por tramo, brillan y suenan más fuerte al acercarte. Se juntan tocándolos con la mano y el contador está en la pulsera de la mano izquierda. **Escanear:** tecla **E** (con casco, tocá la pulsera con la otra mano o apretá A/X); marca el fragmento del tramo y tiene 10 s de espera.
  - **Niebla de píxeles:** sube despacio desde abajo desde que te agarrás por primera vez. Si te alcanza, volvés al último checkpoint; si alcanza un fragmento sin juntar, el Glitch se lo come y aparece escondido en la plataforma de arriba.
  - **Final:** con los tres fragmentos, el botón RESET (arriba de todo) se enciende. En la compu, hacé **clic** en el botón; con casco, **golpealo con la mano**. La pantalla se rompe y salís a un paisaje al amanecer, con una medalla según el tiempo (oro menos de 2 min, plata menos de 3, bronce el resto). Para **volver a jugar**: golpeá el botón violeta, o tecla **R** en la compu.
  - **Tirolesa:** en lo alto de la torre hay un enchufe USB. Agarrate de él y te lleva solo, a velocidad constante, hasta el segundo checkpoint.
  - **El Glitch:** comenta con frases cortas cuando te caés, te quedás quieto, te alcanza la niebla, se come un fragmento o llegás arriba sin los tres.
  - **Sonido:** música tranquila de fondo y efectos. **Silenciar o reactivar: tecla M** (con casco, botón B o Y).
  - **Agarres:** tecla firme (lavanda, sin límite), tecla que se hunde (lavanda profundo con flecha, baja despacio mientras la sostenés), lata que se rompe (ámbar, cruje y cae a los 3 s), bloque intermitente (celeste, mirá el anillo) y panel que gira (rosa, agarrate cuando está de frente). Los agarres al alcance se resaltan.
  - Para simular casco y controles, también sirve la extensión **Immersive Web Emulator** de Meta (pestaña WebXR de las herramientas de desarrollador).
- **En el Quest por USB:** con el modo desarrollador activado, correr `adb reverse tcp:5173 tcp:5173` y abrir `http://localhost:5173` en el navegador del casco.
- **En el Quest sin cable:** abrir el link público (HTTPS) en el navegador del casco y tocar el botón de gafas VR.

## Estructura

```
├── CLAUDE.md          reglas del proyecto
├── PROMPTS.md         registro de prompts
├── docs/              idea final y esquemas
├── index.html
├── src/
│   ├── main.js
│   ├── config.js      tiempos, velocidades y colores
│   └── components/    un componente de A-Frame por archivo
└── .github/workflows/deploy.yml
```

## Despliegue

Cada push a `main` publica en GitHub Pages mediante GitHub Actions.
