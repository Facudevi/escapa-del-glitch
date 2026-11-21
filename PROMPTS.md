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

### Prompt 11 — 2026-11-19

> Anda, seguir Etapa 3

**Respuesta:** se implementó la Etapa 3 (caída y checkpoints): componentes `caida`, `checkpoint` y `fundido`, y dos checkpoints en la pared de prueba. Detalle en la entrada "Etapa 3" más abajo.

### Prompt 12 — 2026-11-20

> Bien, seguir Etapa 4

**Respuesta:** se implementó la Etapa 4 (energía por mano): componentes `energia` y `anillo-energia`. Detalle en la entrada "Etapa 4" más abajo.

### Prompt 13 — 2026-11-20
Se adjuntaron el libro «UX for XR» (Cornel Hillmann) y `BIMESTRE 4 - consigna.pdf`.

> Quiero que realices un analisis completo del siguiente pdf de 200 paginas sobre buenas prácticas de VR, y lo agregues a la documentación del proyecto. Cada vez que debas realizar una etapa del desarrollo de la experiencia, usa el documento para cumplir con las buenas prácticas.
> Al final del desarrollo, debes hacer un chequeo completo de las prácticas aplicadas a la experiencia, para no tener ningún inconveniente ni incongruencias.
> También te adjunto el documento con las consignas del TP4, así las tenés bien claras

**Respuesta:** se extrajo el texto de los dos PDF y se leyeron en detalle los apartados del libro que aplican al proyecto (el libro tiene unas 380 páginas, no 200). Se creó `docs/buenas-practicas-xr.md` con los principios, un checklist por etapa, la revisión de las etapas 1 a 4 y el procedimiento de auditoría final; `docs/consigna-tp4.md` con los requisitos y entregas; y `docs/problemas-resueltos.md`. Se actualizaron `CLAUDE.md` (flujo de trabajo, modo escritorio como entrega) y el README. La etapa 5 quedó pendiente de retomar aplicando el checklist.

### Prompt 14 — 2026-11-20

> Sí, retomá la Etapa 5

**Respuesta:** se implementó la Etapa 5 (agarres especiales) aplicando el checklist de `docs/buenas-practicas-xr.md`. Detalle en la entrada "Etapa 5" más abajo.

### Prompt 15 — 2026-11-20

> Bien, seguir Etapa 6

**Respuesta:** se implementó la Etapa 6 (tramos completos): el setup gamer gigante con teclado, torre de PC y monitor, dificultad creciente, checkpoints entre tramos y el RESET apagado arriba de todo. Detalle en la entrada "Etapa 6" más abajo.

### Prompt 16 — 2026-11-20

> Bien, seguir Etapa 7

**Respuesta:** se implementó la Etapa 7 (fragmentos, pulsera, escaneo y niebla): componentes `fragmentos`, `pulsera`, `escaneo`, `niebla` y `glitch`. Detalle en la entrada "Etapa 7" más abajo.

### Prompt 17 — 2026-11-20

> Bien, seguir Etapa 8

**Respuesta:** se implementó la Etapa 8 (final): botón RESET, rotura de la pantalla, exterior al amanecer, frase, medalla y volver a jugar. Detalle en la entrada "Etapa 8" más abajo.

### Prompt 18 — 2026-11-20

> Bien, seguir Etapa 9

**Respuesta:** se implementó la Etapa 9 (Glitch y extras): frases del Glitch con cola y tiempos de espera, tirolesa de cable USB en la torre, música de fondo y volumen general con silencio. Detalle en la entrada "Etapa 9" más abajo.

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

### 2026-11-19 — Etapa 3: Caída y checkpoints

**Pedido:** "Anda, seguir Etapa 3": fundido a negro y reaparición en el último checkpoint, sin game over.

**Resumen de lo hecho:**
- `caida` (en el rig): si el jugador está en el aire con las dos manos sueltas más de `CAIDA.graciaSoltar` (250 ms), la vista se funde a negro (500 ms), se queda 150 ms en negro, reaparece en el último checkpoint y la vista vuelve (500 ms). No hay animación de caída, para que no maree. Después de reaparecer hay 600 ms sin poder caer.
- `checkpoint`: plataforma verde cuya cara superior es el piso del jugador. Se alcanzan en orden creciente (el progreso no retrocede). Un checkpoint con `dibujar: false` es una zona sin plataforma (el piso de inicio, orden 0). Si el jugador está parado sobre uno sin agarrarse, queda apoyado a la altura de la plataforma; soltarse a menos de 0,6 m de altura cuenta como aterrizar (`CHECKPOINT.alturaApoyo`).
- `fundido` (en la cámara): esfera negra alrededor de la cabeza con opacidad animada. Funciona en VR, donde no se puede tapar la pantalla con HTML. `ir(opacidad, ms)` devuelve una promesa.
- Eventos de la escena para las etapas siguientes: `checkpoint-alcanzado` (recarga de energía, etapa 4), `caida` (frase del Glitch, etapa 9) y `reaparecer`.
- Pared de prueba: ahora tiene el checkpoint de inicio (piso) y una plataforma verde a 3 m de altura.
- Modo escritorio: después de un viaje con clic hay `CAIDA.graciaViaje` (3 s) para agarrarse con el mouse; si no, se cae como corresponde.
- Todos los tiempos están en `CAIDA` y `CHECKPOINT` de `config.js`.
- Verificado en Chrome: parado en el piso no cae; colgado no cae; al soltarse a 0,8 m cae a los ~340 ms, el fundido llega a opacidad 1 y reaparece en el piso de inicio; con el checkpoint 1 alcanzado, caer desde 0,8 m sobre la plataforma reaparece ahí; soltarse a 0,4 m aterriza sin caer; `npm run build` OK.
- Pendiente de probar por el equipo: cómo se siente el fundido (duraciones) en el casco.

### 2026-11-20 — Etapa 4: Energía por mano

**Pedido:** "Bien, seguir Etapa 4": anillos de energía en los guantes y soltado automático.

**Resumen de lo hecho:**
- `energia` (en el rig): cada mano tiene un valor de 0 a 1. La mano agarrada gasta (`ENERGIA.segundosAgarrando` = 7 s para vaciarse), la mano libre recupera (`segundosRecuperar` = 5 s). Con las dos manos agarradas cada una gasta a `factorDosManos` = 0,6 del ritmo normal. Una mano que llega a cero se suelta sola (`climb.soltar`). Los checkpoints recargan las dos manos, al alcanzarlos y al reaparecer.
- `climb` consulta `energia.puedeAgarrar()`: con menos de `minimoParaAgarrar` (0,15) no se puede agarrar con esa mano, para que no se agarre y se suelte enseguida. Si el rig no tiene `energia`, `climb` funciona igual.
- `anillo-energia` (en cada mano): anillo tenue de fondo y arco que se acorta con la energía, empezando desde arriba. Pasa de verde a ámbar y a rojo con transición suave (umbrales `verdeDesde`, `ambarEn` y `rojoDesde`). Mira siempre hacia la cabeza.
- `escalada-mouse` se entera cuando el juego suelta la mano (sin energía): deja de seguir al mouse y reactiva la cámara aunque el botón siga apretado.
- Eventos de la escena: `energia-agotada` (por si la etapa 9 quiere un sonido o frase) y `energia-recargada`.
- Todos los valores están en `ENERGIA` de `config.js`.
- Verificado en Chrome con el modo mouse: una mano agarrada baja de 1 a 0,71 en 2 s (justo lo esperado); con dos manos cada una baja 0,17 en 2 s (0,6 del ritmo); la mano libre recupera 0,2 por segundo; con 0,1 de energía no deja agarrar; con 0,3 agarra y se suelta sola a los ~2 s aunque el botón siga apretado; llegar a un checkpoint recarga las dos manos; en pantalla los anillos se ven verdes, amarillentos y rojizos según el valor; `npm run build` OK.
- Pendiente de probar por el equipo: el balance (¿7 s alcanza para ir de tecla en tecla?). Es lo primero que conviene ajustar, en `ENERGIA`.

### 2026-11-20 — Etapa 5: Agarres especiales

**Pedido:** "Sí, retomá la Etapa 5": tecla que se hunde, lata que se rompe, bloque intermitente y panel que gira, con carteles de una línea la primera vez que aparece cada tipo.

**Resumen de lo hecho:**
- `agarre` (base de todos los tipos): lleva la clase `agarre`, sabe qué manos lo sostienen, puede dejar de estar disponible (y entonces suelta a quien lo sostiene) y se resalta cuando una mano o el cursor lo tiene al alcance.
- `climb` ahora también mueve al jugador con el agarre cuando este se desplaza (hundirse, girar), mide la cercanía contra la malla del agarre (sin anillos ni adornos), vibra al agarrar y suena un clic.
- `tecla-hunde` (lavanda más profundo, con flecha): baja 0,12 m/s mientras está agarrada, hasta 0,45 m, y vuelve al soltarla.
- `lata-rompe` (ámbar): al agarrarla por primera vez cruje con un temblor de rotación creciente (sin mover el punto de agarre), con sonido y vibración cada 0,5 s. A los 3 s cae, suelta a quien la sostiene y reaparece a los 6 s creciendo.
- `bloque-intermitente` (celeste): visible 3 s y oculto 2 s, con **fundido suave de 0,4 s** y no parpadeo. Un anillo muestra cuánto le queda visible y, apagado, se ve su contorno. Solo se agarra cuando se ve casi completo.
- `panel-gira` (rosa): 3 s de frente, giro lento de 0,8 s, 3 s del lado liso. Sus agarres solo están disponibles mientras miran al jugador (60° de tolerancia).
- `sonidos.js`: clic, crujido y rotura sintetizados con Web Audio (sin archivos de audio).
- Pared de prueba rehecha: un ejemplo de cada tipo, cuatro carteles nuevos, plataforma del checkpoint al costado y agarre lejano hacia ella.
- `escalada-mouse`: el cursor resalta el agarre al alcance. En modo escritorio el resaltado por la mano de VR se desactiva (las manos están en reposo).
- Todo está en `config.js`: `HUNDE`, `LATA`, `INTERMITENTE`, `PANEL`, `RESALTADO`, `SONIDO` y `PARED_PRUEBA`.

**Buenas prácticas aplicadas (checklist de la etapa 5):**
- Color y forma fijos por tipo y cartel de una línea la primera vez (p. 108, 151–153).
- Los movimientos que arrastran al jugador son lentos y a velocidad constante (p. 46, 107).
- Crujido solo visual por rotación; sonido y vibración como refuerzo (p. 152).
- Bloque intermitente con fundido suave y anillo legible; sin parpadeos.
- Panel con giro lento y agarres que se desactivan antes de darle la espalda al jugador.
- Resaltado de agarres al alcance y clic al agarrar (pendientes de la revisión anterior, ahora cumplidos).
- Todo se puede probar con mouse.

**Verificado en Chrome (con el reloj del juego avanzado a mano, porque el panel del navegador renderiza pocos cuadros por segundo):**
- Resaltado: con el cursor sobre una tecla, brillo 0,35; fuera, 0; con la mano de VR simulada, se enciende y se apaga al alejarla.
- Tecla que se hunde: bajó 0,252 m en 2,1 s (esperado 0,252) y el jugador bajó con ella (0,25 m); al soltarla volvió a su lugar.
- Lata: crujió 3 s con temblor creciente (3° a los 1,6 s), a los 3 s cayó, soltó la mano, dejó de ser agarrable, desapareció y volvió a su lugar a los 6 s.
- Bloque intermitente: opacidad 1 con fundido a 0 en ~0,4 s, deja de ser agarrable al bajar de 0,6 y el arco se acorta con el tiempo.
- Panel: 3 s de frente, giro de 0,8 s, 3 s del lado liso, y los agarres se activan y desactivan con el ángulo.
- `npm run build` OK.

**Pendiente:**
- Probar la sensación de los movimientos que arrastran al jugador en un casco (comodidad).
- Los tiempos de cada tipo (`HUNDE`, `LATA`, `INTERMITENTE`, `PANEL`) son una primera estimación para ajustar al jugar.
- Durante el giro, el panel atraviesa visualmente la pared de fondo; en los tramos reales (etapa 6) conviene dejarle un hueco.

### 2026-11-20 — Etapa 6: Tramos completos

**Pedido:** "Bien, seguir Etapa 6": teclado, torre y monitor, con la dificultad creciente y un checkpoint entre cada tramo.

**Resumen de lo hecho:**
- La pared de prueba se reemplazó por el escenario completo: **22 m de escalada** en tres tramos (teclado 0–6 m, torre de PC 6–13 m, monitor 13–21 m), con un checkpoint verde al final de cada uno y la plataforma violeta de arriba, que también es checkpoint (orden 3).
- `src/tramos.js` genera la distribución de agarres a partir de `ESCENARIO` en `config.js`, con una semilla fija (todos prueban la misma pared):
  - **Ruta garantizada** en zigzag, con agarres a distancias alcanzables (máximo 0,8 m en el teclado, 0,85 en la torre y 1,05 en el monitor, donde hay que estirarse hacia los costados).
  - **Agarres de más** al azar, para que la pared sea amplia y no haya un camino marcado.
  - **Dificultad creciente en cada tramo:** la separación vertical media sube de 0,51 a 0,61 m, y los tipos especiales aparecen más cerca del checkpoint.
  - **Tipos por tramo:** teclado, firmes y las primeras teclas que se hunden cerca del checkpoint; torre, firmes, que se hunden, latas y dos paneles; monitor, bloques intermitentes, lata, panel y agarres lejanos.
  - **Fragmentos** (la etapa 7 los dibuja): el del tramo 1 queda entre dos agarres de la ruta, imposible de pasar de largo; los otros dos quedan al costado, con una cadena de agarres que lleva hasta ellos y una zona endurecida alrededor.
- `src/decorado.js`: teclado con teclas apagadas, torre con rejillas, ventiladores y una tira de luz suave, y monitor con pantalla azul oscura, píxeles apagados y marco ancho. Las teclas y los píxeles son mallas instanciadas (una sola pieza de dibujo), para no pesar en el casco.
- `escenario-glitch` (componente) arma todo: agarres, paneles, checkpoints, el botón RESET apagado con tres huecos vacíos y un cartel grande que se lee desde el piso («Juntá los 3 fragmentos para encender el RESET»), y un cartel de una línea la primera vez que aparece cada tipo. Deja los datos en `escena.escalada` para las etapas siguientes.
- Las paredes de la sala suben a 26 m y las luces cálidas se reparten en altura.

**Buenas prácticas aplicadas (checklist de la etapa 6):**
- Dificultad creciente sin camino marcado, con una referencia para orientarse: el RESET apagado y su cartel, visibles arriba de todo.
- Descanso: un checkpoint cada 6 a 8 m, y la energía obliga a alternar manos.
- Distancias de agarre configurables (`distanciaMax` por tramo) para ajustarlas a distintas alturas de jugador.
- Cada tramo respeta los colores del setup, apagados y calmos, sin destellos.

**Problemas que aparecieron y se resolvieron** (en `docs/problemas-resueltos.md`): dos paneles se superponían y un panel quedaba pegado a una plataforma; una lata o un bloque en la ruta podían romperse o apagarse mientras el jugador esperaba en ellos.

**Verificado en Chrome:**
- Generador: 88 agarres y 4 paneles; la distancia máxima entre agarres de la ruta es 1,05 m; ningún agarre cae dentro de una plataforma.
- Un jugador automático (usa el mismo modo mouse que cualquier persona) subió **toda la pared sin caerse**: teclado en 9 s, torre en 18 s y monitor en 27 s de juego (unos 54 s en total, sin dudar). Una persona va a tardar bastante más, en línea con los 2 min 30 s objetivo. Llegó a la plataforma de arriba y quedó apoyado.
- Visual: se revisaron los tres tramos y la vista desde la plataforma de arriba con el RESET apagado.
- `npm run build` OK.

**Pendiente:**
- Probar la dificultad y las distancias de agarre con personas, idealmente de distintas alturas y en un casco.
- Probar el rendimiento en el Quest (unas 140 entidades más decorado instanciado).
- La tirolesa de la torre es de la etapa 9; hoy el tramo 2 se sube completo.

### 2026-11-20 — Etapa 7: Fragmentos, pulsera, escaneo y niebla

**Pedido:** "Bien, seguir Etapa 7": fragmentos con sonido espacial, pulsera con contador, pulso de escaneo, niebla de píxeles, y que el Glitch se coma los fragmentos y los esconda arriba.

**Resumen de lo hecho:**
- `fragmentos`: un hexágono violeta suave por tramo, con un brillo que respira muy despacio (0,5 Hz, sin parpadeo). Se juntan tocándolos con la mano (0,45 m). Cada uno que se junta enciende un hueco del RESET, en orden, y suena una campanita. Estados: pared → recogido, o pared → comido → escondido → recogido. El del tramo 1 está entre dos agarres de la ruta (en el camino).
- **Sonido espacial** (`sonidos.js`): cada fragmento suena en el espacio con dos notas tranquilas (do y sol) y un volumen que baja en línea recta hasta ser 0 a 8 m, así que se oye más fuerte al acercarse. El oyente sigue a la cabeza. Se sintetiza con Web Audio, sin archivos.
- `pulsera` (en la mano izquierda): panel dentro del mundo que mira a la cabeza, con los tres hexágonos (llenos los juntados), el contador `n/3` y una barra del escaneo que se llena durante la espera. Tocarla con la otra mano pide un escaneo.
- `escaneo`: se pide con la pulsera, con A/X o con la **tecla E** en modo escritorio. Una onda celeste recorre la pared durante 1,2 s y marca por 1 s el fragmento del tramo en el que está el jugador (halo grande). Después hay 10 s de espera.
- `niebla`: lila suave, con píxeles flotando en el borde. Empieza a subir 5 s después del primer agarre, a 0,1 m/s constante. Si alcanza al jugador, lo devuelve al último checkpoint (como una caída) y queda 3 m por debajo de ese checkpoint, para no devolverlo adentro de la niebla. Si alcanza un fragmento sin juntar, el Glitch se lo come.
- **La partida nunca se traba:** al llegar a la plataforma de arriba, la niebla sube rápido hasta comerse lo que quedó sin juntar y se detiene debajo de la plataforma, sin alcanzar al jugador. Entonces los fragmentos comidos reaparecen medio escondidos (hundidos en el piso) en distintos puntos de la plataforma, y se juntan al pasar cerca.
- `glitch`: cartel con frases del Glitch, por ahora «Ñam, este te lo escondo arriba» al comerse un fragmento. Flota delante de la cabeza, un poco más arriba de la mirada, con un leve retraso al seguirla y siempre por encima de todo. Cada frase tiene un tiempo de espera. Las demás frases son de la etapa 9.
- Carteles nuevos cerca del inicio: cómo juntar y escanear (con A/X y con la tecla E) y que la niebla sube.
- El cartel de ayuda del modo escritorio pasó a la esquina de arriba, porque tapaba la pulsera.
- Todo en `config.js`: `FRAGMENTO`, `PULSERA`, `ESCANEO`, `NIEBLA` y `GLITCH`.

**Buenas prácticas aplicadas (checklist de la etapa 7):**
- Sonido espacial de los fragmentos como guía (p. 151–152).
- Pulsera diegética con contador y barra de espera, sin HUD pegado a la pantalla (p. 102).
- El escaneo tiene alternativa para escritorio: una tecla (p. 287).
- Niebla de velocidad lenta y constante, color suave y sin parpadeos (p. 107).
- Lo que pasó con un fragmento comido se explica con el cartel del Glitch, que se mueve con retraso (p. 109).
- Tiempo de espera del escaneo visible en la propia pulsera (estado del sistema, p. 53).

**Verificado en Chrome (reloj del juego avanzado a mano):**
- Escaneo con la tecla E: marca el fragmento del tramo correcto, la barra pasa de 0 a 0,65 a los 6 s y a 1 a los 10 s; un segundo pedido durante la espera se ignora; la onda se ve y termina.
- Recoger: con la mano cerca del fragmento del tramo 1, contador 1/3 y primer hueco encendido.
- Niebla: no sube antes de agarrarse; mide 0,1 m/s; al alcanzar al jugador lo devuelve al checkpoint y queda por debajo de él; al alcanzar un fragmento se lo come y aparece la frase, que se desvanece a los 3,5 s y no se repite durante la espera.
- Llegada arriba: la niebla acelera, se come el fragmento restante, los dos comidos aparecen en la plataforma y al pasar cerca el contador llega a 3/3 con los tres huecos encendidos.
- Visual: se revisó el fragmento con su brillo, la pulsera con el contador y la barra, y la niebla vista desde arriba. `npm run build` OK.

**Pendiente:**
- Escuchar el sonido espacial (no se puede comprobar desde las pruebas automáticas) y ajustar volúmenes.
- Probar con controles reales: tocar la pulsera con la otra mano y los botones A y X.
- Ajustar el balance de la niebla (`NIEBLA.velocidad` y `retardoInicio`) jugando.
- El botón RESET todavía no se activa: es la etapa 8.

### 2026-11-20 — Etapa 8: Final

**Pedido:** "Bien, seguir Etapa 8": botón RESET, escena exterior, frase y medalla.

**Resumen de lo hecho:**
- `golpeable`: un objeto que se activa con un golpe. **Con casco**, cuenta una mano que llega a menos de 0,4 m del botón con más de 1 m/s hacia la pared y moviéndose sobre todo hacia él: rozarlo, pasar la mano despacio o de costado no lo activa. Hay 1,2 s de espera entre golpes. **En modo escritorio** es un clic del mouse a menos de 2 m.
- `reset-boton`: el botón RESET está apagado hasta juntar los tres fragmentos; ahí se enciende en lila claro con una nota. Golpeado apagado hace un toque sordo y el Glitch avisa «El RESET todavía no enciende: faltan fragmentos», sin consecuencias.
- `cronometro` (invisible): empieza al primer agarre y se detiene al activar el RESET.
- `final`: al golpear el RESET suena la rotura y el Glitch dice «Bueno, ganaste. Nos vemos afuera»; se abren 9 grietas finas desde el botón sobre la pantalla y una luz cálida se abre desde ellas. Después de 1,2 s (para leer la frase) la vista se funde despacio hacia esa luz (1,5 s, sin destellos). El jugador aparece al aire libre al amanecer (pasto, montañas, cielo en degradé celeste a durazno y sol bajo), con el paisaje acomodado justo delante de adonde mira, y la vista vuelve (1,5 s) con un acorde que sube.
- Delante del jugador: la frase «Subiste de nivel, adentro y afuera de la pantalla», la medalla con el tiempo (oro menos de 2 min, plata menos de 3, bronce el resto) y un botón para volver a jugar. En el exterior no se puede caminar más allá de 9 m.
- **Volver a jugar** (golpear el botón, clic en escritorio o tecla R): reinicia fragmentos, huecos del RESET, niebla, cronómetro, energía, checkpoints, el botón y el ambiente de la sala, **sin recargar la página**, para no cortar la sesión de VR.
- Después del final la niebla y las caídas se detienen.
- Todo en `config.js`: `FINAL` (umbral del golpe, tiempos de la transición, medallas, exterior) y colores del exterior.

**Buenas prácticas aplicadas (checklist de la etapa 8):**
- Golpe deliberado, no accidental: velocidad y dirección mínimas, espera entre golpes, y solo con los tres fragmentos (p. 53–54, 102–103).
- Transición con fundido lento hacia una luz cálida, sin cortes ni destellos (p. 46, 107).
- El paisaje exterior es estático y calmo; la frase y la medalla se quedan hasta que el jugador decide volver a jugar.
- Se puede volver a jugar fácilmente, sin salir de la sesión (heurística de control y libertad, p. 53).
- Retroalimentación cuando falta algo: toque sordo y aviso del Glitch en vez de no hacer nada (visibilidad del estado, p. 53).

**Problemas que aparecieron y se resolvieron** (en `docs/problemas-resueltos.md`): la niebla de la sala no se restauraba al volver a jugar, y el golpe con el casco no se detectaba por dos errores (la dirección "hacia la pared" y el orden del cálculo de velocidad).

**Verificado en Chrome:**
- Botón apagado: el golpe no lo activa y aparece el aviso; con los 3 fragmentos se enciende.
- Golpe con el mouse: grietas 0 → 81 de 81, luz cálida creciendo, fundido, aparición en el exterior; la medalla sale oro con 1:35, plata con 2:30 y bronce con 3:20.
- Golpe con la mano en un casco simulado: un golpe rápido hacia la pared activa; una pasada lenta, un barrido de costado, un golpe lejos y alejarse rápido no; dos golpes seguidos cuentan uno.
- Volver a jugar: fragmentos otra vez en la pared, huecos apagados, niebla abajo y quieta, cronómetro en cero, botón apagado y ambiente de la sala restaurado.
- Visual: se revisaron las grietas, el exterior y la pantalla de resultado. `npm run build` OK.

**Pendiente:**
- Probar el golpe con controles reales (el umbral de 1 m/s es una estimación, `FINAL.umbralGolpe`).
- Escuchar los sonidos del final.
- Ver cuánto tardan personas reales: los tiempos de la medalla (2 y 3 min) se ajustan en `FINAL.medallas`.

### 2026-11-20 — Etapa 9: Glitch y extras

**Pedido:** "Bien, seguir Etapa 9": frases del Glitch, tirolesa y sonidos.

**Resumen de lo hecho:**
- **Frases del Glitch** (`glitch`): ya dice una en cada momento puntual del diseño.
  - Caída: «Ese agarre no te quería».
  - Quedarse quieto: «¿Te tomaste un cooldown?» (a los 25 s sin moverse, solo después del primer agarre).
  - Llegar arriba sin los tres fragmentos: «¿No te olvidaste de algo?».
  - Comerse un fragmento: «Ñam, este te lo escondo arriba».
  - Romper el RESET: «Bueno, ganaste. Nos vemos afuera».
  - Extras: cuando la niebla lo alcanza («La niebla te alcanzó: volvé a subir») y al golpear el RESET apagado.
  - Cada frase tiene su tiempo de espera para no repetirse (8 s en general; 45 s la de quedarse quieto). Si llegan dos juntas, la segunda espera su turno (hasta 2 en cola). Cada una suena con un pitido corto y suave.
- **Tirolesa** (`tirolesa`): un enchufe USB gris en lo alto de la torre, a un costado, con un cable en curva que llega hasta el segundo checkpoint. Quien se agarra del enchufe se desliza solo hasta ahí, a **1,5 m/s constante** (por longitud de arco), sin aceleraciones, en unos 2,8 s. No se puede caer durante el recorrido. Es una alternativa a subir el tramo completo. El generador busca un lugar libre y reserva uno para su cartel.
- **Sonidos y audio general** (`sonidos.js`, `audio-juego`):
  - Todo pasa por un volumen general: se puede **silenciar con la tecla M** (o el botón B o Y del control) y aparece un aviso. La elección se recuerda en el navegador.
  - **Música tranquila de fondo**: cuatro acordes suaves que cambian cada 8 s, sintetizados; arranca con el primer gesto del jugador.
  - Más sonidos: pitido del Glitch y soplido de la tirolesa. Ya estaban el clic al agarrar, el crujido y la rotura de la lata, el brillo espacial de los fragmentos, la campanita al juntar, el golpe y rotura del RESET y el acorde del amanecer.
- Todo en `config.js`: `GLITCH` (frases y tiempos), `MUSICA` y `TIROLESA`.

**Buenas prácticas aplicadas (checklist de la etapa 9):**
- Frases cortas, legibles (cartel por encima de todo, con retraso al seguir la cabeza) y con tiempo de espera (p. 109, 53).
- Tirolesa a velocidad constante, sin aceleraciones (p. 107).
- Sonidos suaves y de volumen parejo, con posibilidad de silenciar (p. 152) y aviso del estado (p. 53).
- Una alternativa en la torre para quien no quiere o no puede subir todo el tramo (inclusión, p. 47–49).

**Verificado en Chrome (reloj del juego avanzado a mano):**
- Tirolesa: el paso por cuadro es idéntico en todo el recorrido (0,024 m, mínimo igual a máximo); llega al checkpoint 2 sin caerse y se puede repetir.
- Frases: cada momento dispara la suya; la niebla habla por ella y no se suma la de caída; las que llegan juntas se encolan y salen una detrás de otra; no se repiten dentro de su tiempo de espera; la de quedarse quieto no sale antes del primer agarre, sale a los 26 s y no se repite antes de 45 s.
- Audio: la música arranca con el primer gesto; M, B e Y silencian y reactivan, muestran el aviso y se guardan; el contexto de audio queda en marcha.
- `npm run build` OK.

**Pendiente:**
- **Escuchar todo**: la música, el balance entre efectos y los volúmenes (`SONIDO`, `MUSICA`).
- Probar B e Y con controles reales.
- Ver si la tirolesa se siente cómoda en un casco (`TIROLESA.velocidad`).
