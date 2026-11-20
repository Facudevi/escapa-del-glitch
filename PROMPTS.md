# Registro de prompts

Registro del desarrollo con Claude Code, requerido por la consigna del TP4. Tiene dos partes:

1. **Bitácora de prompts:** cada mensaje que el equipo le escribe a Claude, en orden, con el texto tal cual y un resumen de la respuesta.
2. **Entradas por tarea grande:** al terminar cada etapa se agrega la fecha, el pedido y un resumen de lo hecho.

---

## Bitácora de prompts

### Prompt 1 — 2026-11-19
Se adjuntó `INICIO-PROYECTO.md`.

> podes ayudarme con el desarrollo de mi experiencia VR. Debes leer el md que indican los diferentes puntos a realizar para trabajar. Si necesitas algun archivo, pidemelo y yo te los adjunto para poder comenzar con todo lo necesario

**Respuesta:** se leyó el documento, se verificaron las herramientas (git, Node y npm OK; `gh` y `adb` faltan, ambos opcionales), se buscaron los archivos de `docs/` y se pidió `idea-final.md`. Se explicó cómo crear el repo en GitHub.

### Prompt 2 — 2026-11-19
Se adjuntó `idea-final.md` y dos esquemas (manos/pulsera y paredes de escalada).

> Te adjunto el archivo idea-final, y un esquema de ejemplo del juego con el esquema de las manos/agarres del jugador. Asocie el repo clonado a este chat

**Respuesta:** se copiaron los documentos a `docs/`, se crearon `CLAUDE.md`, `PROMPTS.md`, `README.md` y `.gitignore`, y se armó la Etapa 1 (ver abajo). Se detectó que `consigna.jpeg` era de otra materia y no se incluyó.

### Prompt 3 — 2026-11-19

> podes ir haciendo una bitácora de prompts de los que te voy haciendo a lo largo del chat. Que debería hacer el juego en este momento, solo veo 3 bloques, pero entiendo que es para probar si funcionan las herramientas?

**Respuesta:** se reestructuró este archivo como bitácora y se agregó la regla a `CLAUDE.md`. Se explicó que los 3 bloques son agarres de prueba de la Etapa 1 y qué debe hacer el juego en este punto.

### Prompt 4 — 2026-11-19

> como hago lo del github pages. Ya hice lo del source: github actions, pero no sé donde está el link ni nada por el estilo

**Respuesta:** se revisó el estado público del repo: el commit inicial ya estaba subido, el job `build` del workflow salió bien pero `deploy` falló, y el sitio respondía 404. Se explicó que hay que volver a ejecutar el workflow ahora que el source de Pages es GitHub Actions, y dónde queda el link.

### Prompt 5 — 2026-11-19

> Ya anda

**Respuesta:** se verificó que https://facudevi.github.io/escapa-del-glitch/ responde 200 con la página de la experiencia. Etapa 1 desplegada.

### Prompt 6 — 2026-11-19

> Empezar Etapa 2

**Respuesta:** se implementó la Etapa 2 (escalar): componente `climb`, pared de prueba con 10 teclas firmes y carteles de tutorial. Detalle en la entrada "Etapa 2" más abajo.

### Prompt 7 — 2026-11-19

> donde debo poner el npm run dev para probar con el emulador? Donde está el emulador?

**Respuesta:** se explicó que `npm run dev` se corre en una terminal dentro de la carpeta del proyecto, que se abre `http://localhost:5173` en Chrome, y que el Immersive Web Emulator es una extensión de Chrome (se instala desde la Chrome Web Store y aparece como pestaña en las herramientas de desarrollador).

### Prompt 8 — 2026-11-19

> no tenemos ninguno de los 3 VR. Tenemos que probar con computadora por el momento hasta que alguno pueda probar con cascos. Como pruebo el immersive Web con teclado?

**Respuesta:** se buscó cómo se controla el Immersive Web Emulator: la pestaña de las herramientas de desarrollador se llama "WebXR" (corrección de lo dicho antes) y se manejan casco y controles con el mouse y atajos de teclado, que hay que confirmar en el panel. Se propuso además un modo de escalada de escritorio con mouse para probar `climb` sin casco.

### Prompt 9 — 2026-11-19

> Pruebo con el emulador

**Respuesta:** se dejó la escalada de escritorio con mouse como opción pendiente y se esperó el resultado de la prueba con el Immersive Web Emulator.

### Prompt 10 — 2026-11-19

> Armar modo mouse

**Respuesta:** se creó el componente `escalada-mouse` para escalar en modo escritorio con el mouse (clic izquierdo = mano izquierda, clic derecho = mano derecha, bajar el mouse = subir). Detalle en la entrada "Escalada con mouse" más abajo.

---

## Entradas por tarea grande

### 2026-11-19 — Etapa 1: Base del proyecto

**Pedido:** Leer `INICIO-PROYECTO.md` e `idea-final.md`, verificar herramientas, preparar el repo (`CLAUDE.md`, `PROMPTS.md`, `README.md`) y arrancar con la Etapa 1: proyecto Vite + A-Frame 1.8, escena con piso, luz cálida, rig del jugador, controles de Quest, modo escritorio y deploy a GitHub Pages.

**Resumen de lo hecho:**
- Se verificaron git, Node y npm (faltan `gh` y `adb`, ambos opcionales).
- Se copiaron a `docs/` la idea final y los esquemas.
- Se crearon `CLAUDE.md`, `PROMPTS.md`, `README.md` y `.gitignore`.
- Proyecto con Vite y A-Frame 1.8.0 (`package.json`, `vite.config.js` con `base: './'` para GitHub Pages).
- `src/config.js` con colores, ambiente, medidas de la sala, jugador y modo escritorio.
- Componentes (uno por archivo en `src/components/`):
  - `ambiente-calido`: fondo, niebla suave y luces cálidas.
  - `sala-base`: piso, cuatro paredes como límites y tres agarres de prueba.
  - `mano-guante`: guante esférico que cambia de color con `gripdown`/`gripup` y emite `mano-agarra`/`mano-suelta`.
  - `modo-escritorio`: WASD y clic en un agarre para ir hasta él; se desactiva en VR.
- Rig del jugador con cámara y dos manos con `meta-touch-controls`.
- Workflow `.github/workflows/deploy.yml` para publicar en GitHub Pages en cada push a `main`.
- Verificado: `npm run build` OK; en Chrome la escena carga sin errores y el clic en un agarre mueve al jugador hasta él.
- Pendiente de probar por el equipo: manos reales en el Quest o en el Immersive Web Emulator.

### 2026-11-19 — Etapa 2: Escalar

**Pedido:** "Empezar Etapa 2": componente `climb` con teclas firmes en una pared de prueba.

**Resumen de lo hecho:**
- `climb` (en el rig): al apretar el grip a menos de `JUGADOR.radioAgarre` de un agarre (`.agarre`), la mano queda pegada; el movimiento de esa mano respecto del rig se aplica al rig en sentido contrario (bajar el brazo = subir). Con dos manos agarradas se promedia el movimiento. Vibra el control al agarrar (si el casco lo permite). El rig no baja de `y = 0`.
- Eventos: `mano-guante` emite `mano-agarra`/`mano-suelta` (intención del jugador); `climb` responde con `agarre-tomado`/`agarre-soltado` sobre la mano. El guante se pone ámbar solo si de verdad tiene un agarre.
- `pared-prueba`: pared con 10 teclas firmes alternadas izquierda/derecha cada 0,5 m (parámetros en `PARED_PRUEBA` de `config.js`) y los dos carteles de inicio.
- `cartel`: panel con texto dibujado en un canvas. Se descartó `a-text` porque ninguna de sus fuentes trae tildes ni ñ.
- `sala-base` ahora solo tiene piso y paredes; `crear()` pasó a `src/utilidades.js`.
- Verificado en Chrome con manos simuladas por script: un grip lejos de todo no agarra; con grip cerca, bajar 0,3 m la mano sube el rig 0,3 m; con dos manos, 0,4 m; al soltar, el guante vuelve a lila. `npm run build` OK.
- Todavía no hay caída: al soltar, el jugador queda en el aire. Es la Etapa 3.
- Pendiente de probar por el equipo: escalar con controles reales (Quest o Immersive Web Emulator).

### 2026-11-19 — Escalada con mouse (modo escritorio)

**Pedido:** "Armar modo mouse": poder probar la escalada en la compu, porque el equipo todavía no tiene casco.

**Resumen de lo hecho:**
- `escalada-mouse` (en la `<a-scene>`): con el clic izquierdo o derecho sostenido sobre un agarre al alcance (`ESCRITORIO.alcance`, 1 m desde la cámara) la mano izquierda o derecha queda agarrada; bajar el mouse baja la mano y el jugador sube; moverlo a un costado desplaza al jugador al lado contrario.
- No duplica la lógica de escalada: mueve las entidades de las manos y emite los mismos eventos que el control real (`mano-agarra` / `mano-suelta`), así que usa `climb`. Todo lo que se construya sobre `climb` (caída, energía, agarres especiales) se puede probar así.
- Mientras se escala se pausa la rotación de cámara con el mouse y se bloquea caminar con WASD. Los guantes se ven en reposo abajo a los costados.
- `modo-escritorio`: el clic en un agarre solo viaja si el agarre está lejos; los clics que terminan un agarre se ignoran.
- Ajustes en `ESCRITORIO` de `config.js`: `alcance`, `metrosPorPixel` (sensibilidad) y `reposoMano`.
- Verificado en Chrome: arrastre real con la herramienta del navegador (80 px = 0,41 m de subida); botón derecho, dos manos (promedia, 0,4 m) y alcance (no agarra desde lejos) con eventos de mouse simulados; WASD bloqueado colgado; la cámara no queda pegada al soltar; el clic a un agarre lejano sigue viajando.
- Pendiente de probar por el equipo: la sensibilidad del mouse con un mouse real.
