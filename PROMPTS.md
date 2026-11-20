# Registro de prompts

Registro del desarrollo con Claude Code, requerido por la consigna del TP4. Al final de cada tarea grande se agrega una entrada con la fecha, el pedido del equipo y un resumen de lo hecho.

---

## 2026-11-19 — Etapa 1: Base del proyecto

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
