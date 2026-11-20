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
