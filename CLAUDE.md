# Escapá del Glitch — reglas del proyecto

Experiencia de realidad virtual (touchpoint del festival RESET) hecha con A-Frame. El jugador escala un setup gamer gigante, de pie y con los brazos, para salir. Equipo: Santino Mosca, Rodrigo Masek y Facundo de Vichenzo.

**Fuente de verdad:** `docs/idea-final.md`. Si algo contradice a ese documento, manda la idea final. Referencias visuales: `docs/esquema-paredes.webp` (disposición de tramos, anterior a la versión final) y `docs/esquema-manos-pulsera.webp` (anillos de energía y pulsera).

**Otros documentos que hay que respetar:**
- `docs/consigna-tp4.md`: requisitos y entregas del TP4 (resumen del PDF oficial).
- `docs/buenas-practicas-xr.md`: buenas prácticas de UX para XR del libro *UX for XR* (Hillmann, 2025), con un checklist por etapa.
- `docs/problemas-resueltos.md`: registro de problemas resueltos, que pide la consigna para el informe.

## Repositorio: reglas estrictas

- **Nunca ejecutes `git commit`, `git push`, ni nada que modifique el historial o el remoto** (branches remotas, merges, tags, PRs). Solo podés leer (`git status`, `git diff`, `git log`).
- Al terminar cada cambio que valga la pena guardar, avisá que es un buen momento para commitear y sugerí un mensaje claro en español, por ejemplo `feat: componente climb con teclas firmes`. Si hay que subir cambios, indicá el comando; lo corre el equipo.
- `gh` solo para consultar, nunca para modificar el repo.
- Se trabaja sobre `main`; cada push a `main` despliega a GitHub Pages.

## Intervención manual

- Los bloques marcados con `// INTERVENCIÓN MANUAL` los escribe el equipo y **no se modifican sin pedir permiso**.
- Antes de cada intervención, recordale al equipo hacer un commit (queda el "antes"), y otro después (el "después").

## Stack

- **A-Frame 1.8** por npm, con **Vite** (servidor de desarrollo y build).
- **Solo A-Frame y sus componentes.** Nada de motores de física ni librerías 3D externas. Trayectorias, caídas y movimientos se calculan a mano o con el componente `animation`.
- **Todo con primitivas** (`a-box`, `a-cylinder`, `a-plane`, `a-sphere`, etc.). Sin modelos 3D externos.
- **Controles:** `meta-touch-controls` con eventos `gripdown` y `gripup`, más un **modo escritorio** para probar sin casco: clic en un agarre lejano lleva al jugador hasta él, y con el mouse se escala (clic izquierdo/derecho = mano izquierda/derecha). El modo escritorio es **una entrega, no solo una ayuda**: la consigna dice que el docente abre el link en el navegador de escritorio, así que tiene que estar pulido y explicado en pantalla. Además, el equipo no tiene casco por ahora, así que **toda mecánica nueva tiene que poder probarse en modo escritorio**: el modo mouse no tiene lógica propia, mueve las manos y dispara los mismos eventos que los controles (`mano-agarra`/`mano-suelta`).
- **Duración objetivo:** ~2 min 30 s de partida.
- **Ambiente calmo:** penumbra cálida; colores de RESET suavizados (violeta, lavanda, celeste, ámbar suave, verde suave). Sin neón, destellos ni parpadeos fuertes.

## Código

- Código y comentarios **en español**.
- **Un componente propio por archivo**, en `src/components/`.
- **Todos los tiempos, velocidades y colores viven en `src/config.js`**, para ajustarlos al probar. No hardcodear números de juego en los componentes.
- Estructura: `index.html`, `src/main.js`, `src/config.js`, `src/components/`, `.github/workflows/deploy.yml`.

## Flujo de trabajo

Una etapa por vez (ver sección 7 de `INICIO-PROYECTO.md`): 1 Base, 2 Escalar, 3 Caída y checkpoints, 4 Energía por mano, 5 Agarres especiales, 6 Tramos completos, 7 Fragmentos/pulsera/escaneo/niebla, 8 Final, 9 Glitch y extras, 10 Pulido. Las etapas 1 a 8 son las prioritarias.

**Bitácora de prompts:** en cada mensaje del equipo, agregar a la sección "Bitácora de prompts" de `PROMPTS.md` una entrada numerada con la fecha, el texto del prompt tal cual y un resumen de la respuesta. Se hace en el mismo turno, no al final de la etapa.

**Antes de empezar cada etapa:** leer `docs/buenas-practicas-xr.md`, aplicar el checklist de esa etapa (sección 4) y revisar que no contradiga `docs/idea-final.md` ni `docs/consigna-tp4.md`.

Al terminar cada etapa:
1. Mostrar cómo probarla.
2. Agregar una entrada a "Entradas por tarea grande" de `PROMPTS.md` (fecha, pedido, resumen de lo hecho), con las **buenas prácticas aplicadas** y las que quedaron pendientes.
3. Si apareció y se resolvió un problema relevante, sumarlo a `docs/problemas-resueltos.md`.
4. Sugerir el mensaje de commit.
5. Esperar la confirmación del equipo antes de seguir.

**Al terminar el desarrollo (etapa 10):** hacer la auditoría final descrita en la sección 6 de `docs/buenas-practicas-xr.md` y guardarla en `docs/auditoria-final.md`. Corregir las incongruencias que aparezcan antes de dar el proyecto por cerrado.

**Intervención manual obligatoria (consigna):** el equipo tiene que modificar a mano al menos una parte del código generado y documentarla con antes y después. Recordárselo antes de la etapa 10 si todavía no la hizo.

## Cómo probar

- Compu: `npm run dev` y abrir en Chrome con Immersive Web Emulator.
- Quest por USB: `adb reverse tcp:5173 tcp:5173` y abrir `http://localhost:5173` en el navegador del casco.
- Quest sin cable: el link de GitHub Pages (HTTPS).
