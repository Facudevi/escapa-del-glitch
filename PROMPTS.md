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

### Prompt 19 — 2026-11-20

> Seguir Etapa 10

**Respuesta:** se implementó la Etapa 10 (pulido): pantalla de inicio con aviso de seguridad, modo fácil, auditoría final contra el libro y la consigna, guías para las pruebas y la intervención manual, y README final. Detalle en la entrada "Etapa 10" más abajo.

### Prompt 20 — 2026-11-21

> Voy a pedirte que el estilo y el diseño de los objetos sean más reales y detallados, que se entienda bien el entorno. Actualmente no parece que estas escalando un teclado, una pc y un monitor. Le falta profundidad a los objetos que componen las paredes de los 3 tramos. El jugador puede salir de el espacio del juego y puede caminar en el "limbo" donde no hay nada. Quiero que pongas limites al jugador para que no pueda avanzar por fuera del juego. Además, la base de los checkpoints no deja visualizar los botones que están por delante. Y quiero que por cada tramo tenga un espacio de profundidad, donde el jugador pueda pararse. en lugar de estar sobre un piso verde que levita. También quiero que la pared (es decir, el teclado, pc y monitor) sean más anchos y hayan más agarres, siempre y cuando se respete el tamaño real de los diferentes componentes que forman la pared. Elimina los comentarios que se encuentran en la pared, ya que no se pueden leer xq están por detrás de los elementos que la diseñan. Agrega un mensaje abajo del todo que diga que a lo largo de la escalada debe juntar los fragmentos para escapar. Cuando el glitch come un fragmento, desaparece en lugar de recolocarse en otro agarre del siguiente tramo. Arregla el problema. Hacé que el glitch vaya un poco más rápido y que el cable usb sea dificil de agarrar. Además, cuando llegues arriba del todo quiero que haya una base de piso donde puedas caminar libremente y esté el boton RESET más grande al fondo. Agregar objetos relacionados a los videojuegos en el piso/base de ahí, donde se puedan esconder aquellos fragmentos que come el glitch y manda para arriba si es que ya completaste el tercer tramo.

**Respuesta:** rediseño visual y de juego en una sola tanda: decorado detallado con profundidad (escritorio, teclado TKL, torre con ventiladores y parlantes, monitor), pared más ancha con más agarres, entrepaños con profundidad para pararse, límites invisibles para el jugador, piso de arriba con RESET grande y objetos de videojuegos, mensaje al pie, fragmentos que se reubican en el tramo siguiente, niebla más rápida y enchufe USB más difícil. Detalle en la entrada "Rediseño visual y de juego" más abajo.

### Prompt 21 — 2026-11-22

> La mayoría de las cosas las cumpliste, pero quiero hacer un par de correcciones:
>
> * Al estar tan bien detallados los tramos, los agarres algunos no se distinguen, mientras que otros parecen que estan flotando en el aire, quiero que el diseño de los tramos esté relacionado al componente, pero que no sea tan detallado, sino no se entiende que es un agarré y que no
> * El tramo 1 debe ser solo un teclado, no hace falta el resto de cosas.
> * Al terminar un tramo, el jugador va a tener una base/piso (no tan largo, que sería el checkpoint). Adelante suyo podra ver el siguiente tramo y así con el último. Basicamente quiero que hagas lo mismo de la base del final, pero con cada checkpoint (obviamente un espacio más corto) en lugar de que sea una base encima de la escalada que interrumpe la vista y no se entiende
> * Quiero que coloques bien los agarres, ya que hay espacios que quedan demasiado libres y quedan agarres que no te llevan a ningún lado
> * Çuando toco el botón RESET y me lleva a la escena final, el personaje aparece en otro lado, lejos del mensaje final y la medalla. Debes acomodarlo para que quede bien. Además, dale un diseño más realista a los objetos del final: la frase debe aparecer en el cielo, frente al personaje sin ese formato de cuadro de texto; la medalla no debe ser solo un circulo de diferente color, debe tener más detalle; y el boton lo mismo que con la medalla, se debe entender y no debe aparecer suelto así como si nada en el aire. Me imaginaba más un boton con una base vertical que lo sostiene
> * Nuevo: Las manos y el reloj deben ser un poco más realistas, pensaba en algo como las manos de los personajes del juego "REC ROOM". Diseñalas para que no sean solo dos circulos y un medio anillo

**Respuesta:** se reestructuró el escenario en tres escalones con piso arriba de cada uno (el siguiente tramo se ve de frente), decorado simple y reconocible, tramo 1 solo teclado, agarres con poste y mejor repartidos, reborde para subir al piso, exterior del final rehecho (frase en el cielo, podio con medalla, pedestal con botón, cartel de madera) y manos y reloj nuevos. Detalle en la entrada "Escalones, agarres y final" más abajo.

### Prompt 22 — 2026-11-22

> hiciste demasiados agarres, está sobreexplotado, deben ser suficientes, pero no demasiados. Sigen habiendo agarres que parecen que estan levitando. Debes distribuir los agarres de manera correcta y de manera distribuida, sin que haya demasiada concentración de un mismo agarre en un espacio

**Respuesta:** se pasó de unos 210 a 133 agarres, repartidos parejo con el método del «mejor candidato» y siempre al alcance de otros; todos los agarres (también latas, bloques y paneles) quedaron apoyados en la pared con una placa y un poste visibles. Detalle en la entrada "Menos agarres, mejor repartidos" más abajo.

### Prompt 23 — 2026-11-22

> No sacaste los agarres que ocupan toda la pared, tienen que haber menos cantidad pero distribuidos en el sentido del tipo de agarre, teniendo en cuenta la dificultad de los tramos. Que hayan menos cantidad de agarres por favor.
> Quiero que el tramo 1 sea un poco más largo verticalmente, así no es tan rápido de superar

**Respuesta:** el reborde que ocupaba todo el ancho pasó a ser dos tramos cortos de barra (uno sobre cada carril de la ruta); la ruta pasó a dos carriles, uno en cada mitad de la pared, con 76 agarres en total; los tipos especiales se reparten según la dificultad del tramo; el tramo del teclado subió de 5,6 a 7,2 m. Detalle en la entrada "Menos agarres por dificultad y teclado más alto" más abajo.

### Prompt 24 — 2026-11-22

> No me parece correcto que tenga rutas marcadas, deben ser agarres distribuidos por el tramo, sin ocupar todos los espacios, pero distribuidos de cierta forma que hayan diferentes caminos posibles que se pueden recorrer sin ser tan marcados

**Respuesta:** se sacaron las rutas (los dos carriles) y el generador reparte los agarres por toda la pared con una trama escalonada con un poco de desorden, sin huecos grandes y con muchos caminos posibles; quedan 83 agarres (más los paneles). Detalle en la entrada "Agarres sin rutas marcadas" más abajo.

### Prompt 25 — 2026-11-22

> Quiero que los fragmentos del tramo 2 y 3 sean díficiles de agarrar o requieran ir por un lugar más dificil, sin cambiar la distribución actual de los agarres, aunque se puede hacer un poco más dificil. Además quiero que el USB sea dificilisimo de agarrar

**Respuesta:** los fragmentos de la torre y el monitor quedaron sobre un agarre especial y rodeados de agarres especiales, y el enchufe USB es mucho más chico, del color de la torre y más lejos de los agarres. Detalle en la entrada "Fragmentos difíciles y USB dificilísimo" más abajo.

### Prompt 26 — 2026-11-22

> Quiero que el jugador en caso de saltearse una medalla, disminuya a plata su medalla,y en caso de que se saltee dos  que sea de bronce, sin importar el tiempo. Ahora, la variable de tiempo sigue siendo igual para determinar la medalla, pero primero se prioriza la perdida de los fragmentos.
> Además, para obtener el fragmento del tramo 2, debe haber en esa ruta si o si un agarre de un panel que gira y una lata al menos. El fragmento debe estar por la zona izquierda del tramo.
> Hacer la lata un poco más grande en tamaño, que no sea tan pequeña.
> La música de fondo resulta muy irritante ya que se escucha una especie de ruido blanco que molesta a los jugadores. Modificarla para que no sea fastidiable

**Respuesta:** la medalla ahora depende primero de los fragmentos perdidos (uno = plata como máximo, dos o más = bronce) y después del tiempo; el fragmento de la torre quedó a la izquierda, sobre una lata a la que solo se llega desde un panel que gira; la lata es un 50 % más grande; y la música pasó a ser un colchón de acordes bajito con campanitas sueltas, sin desafinaciones. Detalle en la entrada "Medallas por fragmentos, fragmento de la torre, lata y música" más abajo.

### Prompt 27 — 2026-11-22

> Sigue habiendo una especie de ruido blanco en la musica. Es una nota continua que no para en ningun momento, quiero que la elimines de la musica del fondo

**Respuesta:** se eliminó el colchón de acordes sostenidos (la nota continua) y la música quedó solo con campanitas sueltas separadas por silencios; además el sonido de los fragmentos, que también era un tono continuo mientras estaba cerca, pasó a ser un aviso suave que se repite cada 2,6 s. Detalle en la entrada "Música sin nota continua" más abajo.

### Prompt 28 — 2026-11-22

> pero no quiero que sean notas que suenan y se apaguen, busco que sea una melodía tranquila sin un sonido que suene tan fuerte y continuo como el anterior que hacía que exploten los tímpanos

**Respuesta:** la música pasó a ser una melodía lenta y fluida, a volumen bajo, tocada con un sonido redondo y notas que se enlazan, con silencios entre repeticiones; no hay ningún sonido sostenido. Detalle en la entrada "Melodía tranquila" más abajo.

### Prompt 29 — 2026-11-25

> Quiero que dejes un poco más de espacio para moverse entre el piso/base y la pared para escalar. Cambiar de posición aquel fragmento que se pierde y aparece arriba debajo de un control, ya que es imposible de ver y no se sabe donde está si es que no pasaste por encima suyo o haciendo escaner. No modificar los tramos en sí

**Respuesta:** los pisos de los escalones pasaron de 2,7 a 3,4 m de profundidad (de 1,55 a 2,25 m libres entre el borde y los agarres), con la sala un poco más grande para que entre todo; y los fragmentos que aparecen arriba quedaron a la vista, delante o al costado de los objetos, un poco más altos. Los agarres de los tramos no cambiaron. Detalle en la entrada "Más espacio en los pisos y fragmentos a la vista" más abajo.

### Prompt 30 — 2026-11-25

> No sube el glitch. Además, cuando paso un tramo sin agarrar el fragmento, el fragmento no reaparece en la parte de arriba (no hace falta que el glitch lo coma para que llegue arriba).
> Quiero que hagas los tramos más largos y en cada tramo, agregues "estantes" o pequeñas bases donde el jugador pueda pararse. De esta forma, el jugador no debe estar agarrado todo el tiempo a los agarres. Por eso también debes agregarle un cuerpo al personaje, para que el jugador entienda si su cuerpo es tocado por el glitch o puede pararse en estas pequeñas bases.
> Mejorar el diseño de los agarres, darles forma y una identidad visual más gráfica que no las haga parecer como formas geométricas con colores. Agregar más detalle a la pantalla de juego final (Más paisaje, flores, arboles, pajaritos que se muevan, animación en general para que no se sienta tan estático)

**Respuesta:** se arregló la niebla, los fragmentos salteados ahora suben solos, los tramos son más altos y tienen estantes, el jugador tiene cuerpo, los agarres tienen dibujo propio y el final tiene un paisaje vivo. Detalle en la entrada "Niebla, estantes, cuerpo, agarres gráficos y paisaje vivo" más abajo.

### Prompt 31 — 2026-11-25

> el glitch todavía no sube. Hacé que lo haga. Por cada tramo que se completa, que el glitch automaticamente suba 3/4 de ese tramo, para no quedarse tan atrás respecto al jugador.
> Hacer coincidir la manos con el movimiento del jugador, es decir, que si yo muevo mi cabeza hacia la izquierda (donde apunto), tanto el cuerpo como las manos deben apuntar a la izquierda (siempre mirando de frente respecto al eje del jugador). Distribuir mejor los agarres del tramo 2 (en la zona izquierda faltan algunos)

**Respuesta:** la niebla ahora arranca también si el jugador se despega del piso, y al completar un tramo sube enseguida hasta 3/4 de ese tramo; las manos en reposo giran con la mirada; y el generador rellena los huecos de la pared con agarres conectados (la torre pasó de 35 a 46 agarres). Detalle en la entrada "Niebla que alcanza, manos con la mirada y huecos rellenos" más abajo.

### Prompt 32 — 2026-11-25

> Que la frase final tenga una tipografía y diseño más impactante o que coincida con el paisaje siendo más llamativa sin hacer cualquier cosa. Primero muestrame las opciones y elijo

**Respuesta:** se mostraron cuatro opciones de diseño para la frase del cielo (letras redondeadas con degradé de amanecer, letras con volumen estilo título de videojuego, letra manuscrita que se escribe sola y frase en arco como un arcoíris), con una maqueta sobre el cielo del final, para que el equipo elija antes de programar.

### Prompt 33 — 2026-11-25

> Elijo la opción B: título de videojuego

**Respuesta:** la frase del final pasó a ser un título de videojuego: «SUBISTE DE NIVEL» en letras de bloque crema con volumen lavanda y violeta, y la bajada en una cinta clara; entra con un rebote chico y después flota despacio. Detalle en la entrada "Título del final estilo videojuego" más abajo.

### Prompt 34 — 2026-11-26

> como conecto los cascos VR y controles para probar la experiencia

**Respuesta:** se explicaron las tres formas de probar en un Meta Quest: el link de GitHub Pages sin cable (lo más simple), el servidor local por USB con `adb reverse` (modo desarrollador, depuración USB y aceptar la huella en el casco) y el servidor local por Wi-Fi con HTTPS; más cómo emparejar y despertar los controles y qué botones usa el juego (grip para agarrar, A/X para escanear). No se tocó código.

### Prompt 35 — 2026-11-26

> necesito información sobre el proyecto para agregarlo a mi informe. Se va a encontrar en la parte de definición del proyecto, debo tener imagenes intercaladas con texto. Esto se encuentra en la consigna mejor explicado. Busca esa parte y haz el trabajo

**Respuesta:** el PDF de la consigna no está en el repositorio, así que se tomó el resumen de `docs/consigna-tp4.md`, que pide en el informe la «definición y justificación de la idea». Se armó un documento con ocho bloques de texto (qué es, la historia, la mecánica, los tres tramos, la niebla y los fragmentos, el final, la justificación de la idea y de la VR, y la accesibilidad) intercalados con nueve capturas del juego real. Ocho están en 1920×1080, sacadas del render 3D con una cámara de fotos temporal desde la consola del navegador; la de la pantalla de inicio está en 800×450. No se tocó código del juego.

### Prompt 36 — 2026-11-26

> nono, no quiero que sea un un documento dentro del proyecto este, sino uno nuevo que sea externo al repo

**Respuesta:** el documento de la definición del proyecto pasó a ser un documento externo en Claude Docs (https://claude.ai/artifact/9FjZHGLVXQmSD3tm7hy3F8), con el mismo texto y las nueve capturas intercaladas. Se puede editar, comentar y exportar a Word, PDF o Google Docs. Se borraron del repositorio la carpeta `docs/informe/` y la línea que se había agregado al `README.md`.

### Prompt 37 — 2026-11-26

> como se hace para probar en Linux

**Respuesta:** se explicó cómo probar en Linux (Ubuntu 24.04 de la escuela, sin permisos de administrador): servidor local con `npm run dev` y Chromium con la extensión Immersive Web Emulator para simular casco y controles (Firefox no sirve porque no tiene WebXR); en el Quest, el link de GitHub Pages; y el camino por USB con `adb`, que en Linux necesita instalar `adb` y una regla de udev, para lo que hace falta `sudo`. No se tocó código.

### Prompt 38 — 2026-11-26

> Quiero que en VR, para moverse lo haga con el stick de los controles, no que hagas el movimiento "espacial", varios lo jugaron y se quejaron de eso

**Respuesta:** se agregó el componente `movimiento-stick`: en VR el jugador camina por los pisos con el stick de cualquiera de los dos controles, hacia donde mira y a velocidad constante (1,8 m/s, en `STICK` de `src/config.js`). No camina mientras está agarrado o cayendo, y respeta los límites. La escalada sigue siendo con los brazos. Detalle en la entrada "Caminar con el stick en VR" más abajo.

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

### 2026-11-20 — Etapa 10: Pulido y auditoría final

**Pedido:** "Seguir Etapa 10": pulido, ajuste de tiempos, README final y el chequeo completo de las prácticas aplicadas, sin incongruencias.

**Resumen de lo hecho:**
- **Pantalla de inicio** (`pantalla-inicio` + `index.html`): al abrir el link explica de qué se trata, los controles con casco y en la compu, y da un **aviso de seguridad** (2 m libres, movimientos con cuidado, pausas, descansar en una plataforma verde, sin datos personales). Es salteable (botón, Enter, entrar en VR o el primer agarre). Para quien juega con casco, el aviso también está escrito dentro del mundo.
- **Modo fácil** (`dificultad.js`): más alcance para agarrar (×1,4), la energía dura más (×1,6) y la niebla sube más lenta (×0,6). Se elige en la pantalla de inicio o con `?facil=1` en el link. Cambia valores de `config.js` en vivo, sin tocar el resto del juego.
- Cartel de descanso en el exterior («tomá agua y descansá la vista un rato»), por el diseño consciente del libro y el espíritu de RESET.
- Valores que estaban sueltos en los componentes pasaron a `config.js` (el total de fragmentos, tiempos de protección tras reiniciar y tras la tirolesa).
- **Auditoría final** (`docs/auditoria-final.md`): 56 puntos revisados (checklists por etapa y las diez heurísticas de Nielsen): 40 cumplen y están verificados, 7 cumplen pero falta confirmarlos con casco o personas, 3 están pendientes de prueba real, 4 son parciales y 2 no aplican (con la razón). Incluye los requisitos de la consigna, las incongruencias encontradas con `idea-final.md` y lo que no se pudo verificar.
- `docs/guia-de-pruebas.md`: protocolo para probar con tres personas (qué decirles, qué medir, preguntas y cómo ajustar `config.js` con lo que se encuentre).
- `docs/intervencion-manual.md`: cómo hacer y documentar la intervención manual obligatoria, con ideas de bloques y una tabla para completar.
- **README final** reescrito: cómo se juega, cómo correrlo y probarlo, estructura, configuración, documentación y límites conocidos. `CLAUDE.md` actualizado.

**Buenas prácticas aplicadas (checklist de la etapa 10):**
- Pantalla de inicio con instrucciones por dispositivo y aviso de seguridad (p. 26–27, 107).
- Tutorial salteable y modo fácil, para distintos tipos de jugador (p. 47–49, 107).
- Diseño consciente: sin datos personales, invitación a descansar, sesión corta (p. 158–161).
- Auditoría con las heurísticas de Nielsen y métricas para medir con personas (p. 53–54, 362).

**Verificado en Chrome:**
- Pantalla de inicio: se muestra al abrir, el botón de modo fácil cambia alcance, energía y niebla (0,252 m, 11,2 s y 0,06 m/s), Enter la cierra y `?facil=1` activa el modo fácil.
- Recorrido completo del jugador automático con el juego normal: teclado 9 s, torre 19 s y monitor 28 s, 0 caídas; los fragmentos comidos aparecen arriba, se juntan, el RESET se enciende y se activa; medalla de oro con 1:28; y volver a jugar deja todo como al principio.
- Rendimiento: 31 llamadas de dibujo, 8.820 triángulos y 156 entidades por cuadro; 0 errores en la consola.
- Último deploy público exitoso (corresponde al commit de la etapa 9).
- `npm run build` OK.

**Pendiente (depende del equipo):**
- Intervención manual del código, con commit antes y después (`docs/intervencion-manual.md`).
- Probar en un casco y con al menos tres personas, y ajustar `config.js` con lo que encuentren.
- Escuchar el sonido y ajustar volúmenes.
- Informe visual 16:9 (Figma y PDF) y exposición de 5 minutos.

### 2026-11-21 — Rediseño visual y de juego (profundidad, límites, piso final)

**Pedido:** objetos más reales y con profundidad; límites del jugador; entrepaños donde pararse en vez de un piso que levita; pared más ancha con más agarres (respetando tamaños reales); sin carteles en la pared; mensaje al pie; el fragmento comido se reubica en el tramo siguiente; Glitch más rápido; cable USB difícil de agarrar; piso final caminable con RESET grande y objetos de videojuegos donde se esconden los fragmentos.

**Resumen de lo hecho:**
- **Decorado nuevo** (`src/decorado.js`, `src/fusion.js`): escritorio con veta, alfombrilla, mouse con cable, taza, cuaderno y lápiz; teclado TKL con teclas en dos niveles y leyendas; torre de PC con rejilla perforada, tres ventiladores con aro de color, entradas y tornillos; dos parlantes; monitor con marco, mentón, pantalla hundida con un escritorio dibujado, logo y LEDs. Todo con primitivas y sobresale del plano de la pared hasta 0,7 m. `fusion.js` junta las mallas para no subir las llamadas de dibujo (32 en total).
- **Proporciones reales** (escala 1 cm = 18 cm): pared de 12,5 m de ancho y 125 agarres (antes ~80); el teclado pasó a TKL para que entre con el mouse y la alfombrilla sin pisarse.
- **Generador** (`src/tramos.js`) reescrito: ruta en zigzag con centro que deriva, agarres de más, desvíos con cadena de agarres firmes para llegar a los fragmentos y «refugios» (lugares donde puede reaparecer un fragmento).
- **Entrepaños** (`src/plataformas.js`): cada checkpoint es una plataforma de rejilla de 2,4 m de profundidad con vigas, riel de luz y cinco diagonales que la sostienen. Los agarres salen por delante del decorado y de los entrepaños, así que nada tapa a los botones.
- **Límites** (`src/components/limites.js`): el cuerpo del jugador no sale de la sala, de la pared ni de los bordes de cada plataforma. Se prueba con teleports a 30–40 m: siempre vuelve a la zona.
- **Piso de arriba**: piso con baldosas y barandas, panel de fondo, consola con el botón RESET grande (1 m de radio, golpeable desde 1,3 m) y tres huecos de fragmentos, joystick, control, cartuchos, auriculares, lata, dado de 20, monedas, hongo y corazón de píxeles.
- **Sin carteles en la pared.** Solo queda el mensaje del pie: «A lo largo de la escalada tenés que juntar los fragmentos para escapar».
- **Fragmentos comidos** (`fragmentos.js`): el Glitch lo manda a un agarre libre del tramo siguiente, siempre por encima del jugador y sin pisar a otro fragmento. Si ya no hay tramo siguiente o el jugador completó el tercero, se esconde entre los objetos del piso de arriba.
- **Niebla** 0,15 m/s (antes 0,1). **Enchufe USB**: más chico, hundido respecto de los agarres y con tolerancia ×0,3 (hay que tocar casi justo).
- Todo lo nuevo salió a `config.js` (`ESCENARIO`, `LIMITES`, `DECORADO`, `FRAGMENTO`, `TIROLESA`, `FINAL`). Se subió un poco la luz ambiente para que el entorno se lea mejor.

**Buenas prácticas aplicadas:**
- Límites físicos con corrección suave del rig, sin cortes bruscos.
- Profundidad y pistas visuales en el entorno (volumen, tamaños reales) para orientarse.
- Interfaz dentro del mundo sin tapar elementos interactivos (se sacaron los carteles de la pared).
- Rendimiento: mallas fusionadas, 32 llamadas de dibujo, ~35.000 triángulos.
- Modo escritorio: todo se puede probar con el mouse (el enchufe se agarra desde 0,6 m).

**Verificado en Chrome (modo escritorio):**
- Vistas del teclado, la torre, el monitor, los entrepaños y el piso final; 0 errores en la consola.
- Límites en el piso, en el aire, en los entrepaños y en el piso de arriba.
- Reubicación: el fragmento del tramo 1 pasó al tramo 2 y luego al 3; el del tramo 3 se esconde arriba.
- Tirolesa: 4,3 s hasta el segundo entrepaño, sin caídas y con checkpoint alcanzado.
- Final: los tres fragmentos escondidos se juntan, el RESET se enciende, la rotura y la luz salen del panel del fondo y volver a jugar deja todo como al principio.
- No se repitió el recorrido completo con el jugador automático: el generador garantiza una ruta con agarres a menos de 1,05 m.

**Pendiente (depende del equipo):**
- Probar con casco: alcance real a los agarres, comodidad del enchufe USB y rendimiento en Quest.
- Medir la duración de la partida con personas; si se alargó por los desvíos, ajustar `config.js`.
- Intervención manual con commit antes y después.

### 2026-11-22 — Escalones, agarres y final (correcciones del rediseño)

**Pedido:** agarres que se distingan y no floten; tramo 1 solo teclado; un piso corto arriba de cada tramo desde el que se ve el siguiente (como el piso final); agarres bien repartidos y sin callejones; el final con el jugador bien ubicado y objetos más reales (frase en el cielo, medalla con detalle, botón con base vertical); manos y reloj estilo Rec Room.

**Resumen de lo hecho:**
- **Tres escalones** (`decorado.js`, `plataformas.js`, `utilidades.js`): cada tramo es una pared sólida (teclado, torre, monitor) que queda 2,7 m más atrás que la anterior, con un piso de baldosas arriba. Desde ese piso se ve de frente la pared siguiente, y arriba del último está el piso final. Ya no hay entrepaños tapando la vista de la escalada.
- **Decorado simple:** se sacaron los detalles chicos (leyendas, tornillos, perforaciones, escritorio, mouse, taza, cuaderno). El tramo 1 es solo un teclado completo (teclas de 50 cm, carcasa y apoyamuñecas); la torre tiene tres ventiladores y dos parlantes; el monitor, marco y pantalla.
- **Agarres que no flotan:** cada agarre firme lleva un poste que lo une con la pared, tienen más brillo propio y los colores del decorado quedaron más apagados que los suyos.
- **Subir al piso** (`ascenso.js`, reemplaza a `tirolesa.js`): arriba de cada pared hay un **reborde verde**; al agarrarse, el jugador sube solo, a velocidad constante, y queda parado en el piso mirando la pared siguiente. El enchufe USB usa el mismo componente.
- **Agarres bien ubicados** (`tramos.js`): filas de salida sobre el piso, relleno parejo de la pared y **poda** de los agarres que no llevan a ningún lado (sin camino desde abajo, sin camino hacia el reborde o con un solo vecino). Quedan unos 210 agarres y ningún hueco de más de 1,2 m.
- **Límites** adaptados a cada escalón (`limites.js`). La causa de que el jugador apareciera lejos en el final era que los límites lo devolvían a la sala: ahora no actúan en el exterior.
- **Final** (`objetosFinal.js`, `final.js`): el exterior se acomoda delante de la cabeza del jugador y de adonde mira; la frase flota en el cielo sin cuadro (`cartel` con `sinFondo`); podio con medalla (disco, borde, anillo, estrella extruida y cinta en V) que cambia de color según oro, plata o bronce y se mece; pedestal con poste y cabezal donde está el botón; cartel de madera del descanso. Luz propia de amanecer.
- **Manos y reloj** (`mano-guante.js`, `pulsera.js`): manos de dibujos animados con palma, cuatro dedos de tres falanges, pulgar y manga, que se cierran en puño al agarrar; el control no se dibuja (`model: false`). El reloj tiene correa, caja, bisel y una esfera con el contador y el arco del escaneo.
- Todo lo nuevo salió a `config.js` (`ESCENARIO`, `LIMITES`, `ASCENSO`, `FINAL`, `JUGADOR.mano`, `DECORADO`).

**Buenas prácticas aplicadas:**
- Affordance: lo que se agarra tiene forma, color y brillo propios y está unido a la pared; el decorado queda en segundo plano.
- Referencias espaciales: desde cada piso se ve el próximo tramo, que sirve de meta visible.
- Movimiento automático lento y constante, con aviso visual (reborde verde) y sin posibilidad de caer mientras dura.
- Presencia corporal: manos con dedos que reflejan el estado (abierta, apretando, agarrando).
- Interfaz dentro del mundo sin cuadros sobrepuestos en el cielo (frase) y con el reloj como indicador físico.
- Modo escritorio completo: se probó una escalada con clics reales del mouse por los tres tramos.

**Verificado en Chrome (modo escritorio):**
- Jugador automático con eventos de mouse: escaló los tres tramos de punta a punta con 0 caídas, subió al piso de cada escalón por el reborde y llegó al piso final.
- Límites en el piso de la sala; el ascenso lleva a los tres pisos con su checkpoint.
- Final completo: el jugador aparece delante del podio, la frase se ve en el cielo, la medalla y el botón de volver a jugar están a su alcance.
- 0 errores en la consola; entre 60 y 70 llamadas de dibujo vistas de lejos.

**Pendiente (depende del equipo):**
- Probar con casco: alcance a los agarres y al reborde (a 0,75 m del jugador), tamaño de las manos y comodidad del ascenso.
- Con unos 210 agarres, vigilar el rendimiento en Quest; si hace falta, subir `separacion` en `ESCENARIO.tramos`.
- Intervención manual con commit antes y después.

### 2026-11-22 — Menos agarres, mejor repartidos

**Pedido:** demasiados agarres, algunos todavía parecen flotar y se amontonan en algunos lugares.

**Resumen de lo hecho:**
- **Cantidad:** 133 agarres (41 en el teclado, 59 en la torre y 33 en el monitor) más los 4 paneles, contra unos 210 antes.
- **Reparto** (`tramos.js`): se sacó el relleno al azar y las dos filas de salida. Ahora cada agarre de relleno se coloca en el lugar más alejado de los demás entre 150 puntos al azar, siempre al alcance de al menos dos agarres que ya existen (nunca queda uno aislado), y se frena cuando no queda lugar con la separación del tramo (`ESCENARIO.tramos[i].separacion`: 0,85, 0,9 y 1,0 m). Abajo de cada tramo quedan solo cinco agarres de salida bien separados.
- **Sin levitar** (`decorado.js`): todos los agarres, incluidos las latas, los bloques intermitentes y los paneles que giran, tienen una placa contra la pared y un poste más claro que el decorado; los paneles tienen un eje en el medio.
- Se ajustó la distancia a la que empieza el jugador frente a cada pared (1,65 m) para que el alcance del mouse en modo escritorio siga alcanzando.

**Buenas prácticas aplicadas:**
- Densidad justa: opciones suficientes para elegir camino, sin saturar la vista (carga visual) ni el casco.
- Affordance: cada agarre se ve unido a la pared.

**Verificado en Chrome:** jugador automático con mouse escaló los tres tramos hasta el piso final, 0 caídas (la niebla se pausó en la prueba para que el robot lento no fuera alcanzado) y 0 errores en la consola.

**Pendiente (depende del equipo):**
- Probar con casco que 133 agarres sean suficientes y que los saltos entre ellos se sientan cómodos; si hace falta más o menos, tocar `separacion` en `config.js`.
- Intervención manual con commit antes y después.

### 2026-11-22 — Menos agarres por dificultad y teclado más alto

**Pedido:** menos agarres; los que ocupaban toda la pared (el reborde) fuera; tipos repartidos según la dificultad de cada tramo; tramo 1 más largo en vertical.

**Resumen de lo hecho:**
- **Reborde en tramos cortos:** antes era una barra de 12 m. Ahora son dos barras de 1,8 m, una sobre el último agarre de cada carril (`ESCENARIO.borde`: `ancho` y `separacion`), con sus soportes.
- **Dos carriles** (`tramos.js`): la ruta garantizada sube por dos caminos serpenteantes, uno en cada mitad de la pared, así los agarres se reparten por todo el ancho y no se amontonan en el centro. Cada carril tiene sus pasos más separados (`paso` subió en los tres tramos).
- **Cantidad:** 76 agarres (20 en el teclado, 27 en la torre y 29 en el monitor) más los 4 paneles, contra 133 antes. El relleno quedó apenas como complemento (`separacion` 1,2 / 1,3 / 1,4 m) y la semilla se eligió buscando un reparto parejo.
- **Tipos según la dificultad** (`ESCENARIO.tramos[i].mezcla` y `reglas`): teclado casi todo firme con apenas teclas que se hunden arriba; torre con latas que se rompen y teclas que se hunden; monitor con bloques intermitentes y algunas latas. Los tipos especiales se colocan cada uno en el agarre más lejano de los otros especiales, para que se repartan.
- **Tramo 1 más largo:** pasó de 5,6 a 7,2 m. El teclado se ajusta solo (apoyamuñecas más alto), la altura total es 22,2 m y se subieron las paredes de la sala y las luces.
- Los refugios de los fragmentos ahora también salen de los agarres de la ruta.

**Buenas prácticas aplicadas:**
- Curva de dificultad: cada tramo introduce un tipo de agarre más exigente que el anterior.
- Densidad justa, sin saturar la vista ni el casco.

**Verificado en Chrome:** jugador automático con mouse escaló los tres tramos por los dos carriles, subiendo por los rebordes cortos, con 0 caídas y 0 errores en la consola (la niebla se pausó en la prueba). El jugador automático no pudo agarrar algunas latas por ir demasiado rápido, igual que antes.

**Pendiente (depende del equipo):**
- Probar con casco que los carriles se sientan cómodos y medir cuánto dura el tramo del teclado ahora que es más alto.
- Intervención manual con commit antes y después.

### 2026-11-22 — Agarres sin rutas marcadas

**Pedido:** que no haya rutas marcadas: agarres distribuidos por todo el tramo, sin ocupar todos los espacios, con distintos caminos posibles que no se noten tanto.

**Resumen de lo hecho:**
- **Se eliminó el concepto de ruta** (`tramos.js` reescrito): ya no hay carriles ni caminos garantizados que se vean como una fila de agarres.
- **Trama con desorden:** cada fila de agarres está corrida media columna de la anterior y cada agarre se corre un poco al azar, así que se reparten parejo por todo el ancho, sin un orden que se note.
- **Huecos y caminos:** se sacan agarres al azar (10 % en el teclado, 15 % en la torre y 20 % en el monitor), pero solo los que se pueden sacar sin dejar a otros sin salida: cada agarre que queda tiene un vecino más abajo (o el piso) y uno más arriba (o el reborde) al alcance. Quedan muchos caminos distintos para subir.
- **Dificultad por tramo** (`ESCENARIO.tramos[i]`): `rejilla` (más separación, saltos más largos y menos agarres en los tramos de arriba), `alcance`, `quitar` y `mezcla` de tipos (teclado casi todo firme; torre con latas y teclas que se hunden; monitor con bloques intermitentes y latas). Los tipos especiales se reparten lo más lejos posible entre sí y siempre queda un camino de agarres firmes hasta arriba.
- **Cantidad:** 83 agarres (30 en el teclado, 31 en la torre y 22 en el monitor) más los 4 paneles. No se puede bajar mucho más sin dejar saltos imposibles: la pared mide unos 160 m² utilizables y los agarres tienen que estar a un alcance de brazo.
- Los fragmentos van apenas arriba de un agarre firme (ya no hacen falta desvíos) y el enchufe USB queda hacia un costado, a una mano de un agarre. El reborde de arriba son tres barras cortas por pared.

**Buenas prácticas aplicadas:**
- Libertad de elección: muchos caminos posibles, sin una única ruta evidente.
- Curva de dificultad por tramo, y siempre una salida (sin callejones).

**Verificado en Chrome:** el jugador automático eligió caminos al azar por la pared (con latas, bloques intermitentes y paneles incluidos) y completó los tres tramos con 0 caídas y 0 errores (la niebla se pausó en la prueba).

**Pendiente (depende del equipo):**
- Probar con casco que los saltos (hasta 1,35 a 1,55 m entre vecinos) se sientan cómodos; si no, bajar `alcance` y `columnas` o sumar agarres en `config.js`.
- Intervención manual con commit antes y después.

### 2026-11-22 — Fragmentos difíciles y USB dificilísimo

**Pedido:** fragmentos de los tramos 2 y 3 difíciles de agarrar (o que obliguen a ir por un lugar más difícil), sin cambiar la distribución de agarres (solo un poco más difícil), y el USB dificilísimo de agarrar.

**Resumen de lo hecho:**
- **Fragmentos de la torre y el monitor** (`tramos.js`, `ESCENARIO.tramos[i].fragmento`): el agarre sobre el que flota el fragmento deja de ser firme y pasa a ser una lata o una tecla que se hunde (torre) o un bloque intermitente (monitor). Los agarres de alrededor (1,2 m en la torre y 1,3 m en el monitor) también se endurecen, siempre que quede un camino de agarres firmes hasta arriba. La posición de los demás agarres no cambió; solo cambiaron algunos tipos (en la torre hay 6 latas en vez de 5 y en el monitor 7 bloques en vez de 6).
- **Hay que acercar más la mano:** en esos tramos el fragmento se recoge a 0,36 m de la mano (antes 0,45), `FRAGMENTO.radioRecogerDificil`.
- **USB** (`TIROLESA`): el enchufe mide 8 × 5 cm (antes 16 × 9), es del color de la torre, está a entre 1,0 y 1,3 m del agarre más cercano (hay que estirarse) y la tolerancia al agarrarlo bajó de 0,3 a 0,1: con casco hay que tocarlo a unos 2 cm.

**Buenas prácticas aplicadas:**
- Riesgo y recompensa: lo más escondido o difícil es un atajo opcional o un objetivo extra, no una barrera para avanzar.
- La dificultad crece por tramo.

**Verificado en Chrome:** con la mano en el agarre anfitrión (lata en la torre, bloque intermitente en el monitor) se recogen los fragmentos de los tramos 2 y 3. El USB sigue pudiéndose agarrar apuntando al centro del enchufe con el mouse.

**Pendiente (depende del equipo):**
- Probar con casco si el USB es demasiado difícil (`TIROLESA.tolerancia`) y si los fragmentos se sienten bien (`FRAGMENTO.radioRecogerDificil`).
- Intervención manual con commit antes y después.

### 2026-11-22 — Medallas por fragmentos, fragmento de la torre, lata y música

**Pedido:** que perder fragmentos baje la medalla sin importar el tiempo; fragmento de la torre a la izquierda con un panel y una lata sí o sí en el camino; lata más grande; música menos irritante.

**Resumen de lo hecho:**
- **Medalla** (`final.js`, `fragmentos.js`): se cuentan los fragmentos que el Glitch se comió (`fragmentos.perdidos`, aunque después se junten). Con uno perdido el tope es plata; con dos o más, bronce. El tiempo se aplica igual que antes y gana la peor de las dos. La placa del podio muestra «Fragmentos perdidos: n» y la pantalla de inicio avisa la regla.
- **Fragmento de la torre** (`tramos.js`, `ESCENARIO.tramos[1].fragmento`): queda en la zona izquierda (x entre −4 y −2), sobre una lata. Los agarres que llegan a esa lata desde abajo se sacan, salvo un panel que gira que se coloca justo debajo; hasta ese panel se llega por agarres firmes. Comprobado en un grafo: sin el panel no se puede llegar al fragmento, y el agarre del fragmento es una lata. Se mantiene el resto de la distribución (se sacaron unos pocos agarres cerca de la lata).
- **Lata** (`LATA`): de 26 × 13 cm a 40 × 20 cm de radio y alto, un 50 % más grande.
- **Música** (`sonidos.js`, `MUSICA`): se sacó el colchón de seis notas desafinadas que sonaba como un zumbido parejo. Ahora son acordes de tres notas sin desafinar, más bajos y con un filtro más cerrado, y sobre ellos campanitas sueltas de una escala pentatónica, con un poco de eco y a intervalos al azar. Se puede silenciar con M o con B/Y como antes.

**Buenas prácticas aplicadas:**
- Consecuencias claras y avisadas: la regla de las medallas se explica en la pantalla de inicio y en la placa final.
- Audio de fondo agradable y bajo, sin ruido constante (fatiga auditiva).

**Verificado en Chrome:** tabla de medallas por tiempo y fragmentos perdidos; lata con radio 0,2 y alto 0,4; sin errores en la consola. El jugador automático no pudo repetir el camino exacto por el panel porque espera con una sola mano, igual que una persona que no descansa; el camino se comprobó con el grafo.

**Pendiente (depende del equipo):**
- Escuchar la música nueva en el casco y ajustar `MUSICA.volumen`, `volumenAcordes` y `volumenNotas`.
- Probar con personas el fragmento de la torre y la dificultad del panel más la lata.
- Intervención manual con commit antes y después.

### 2026-11-22 — Música sin nota continua

**Pedido:** eliminar la nota continua de la música de fondo.

**Resumen de lo hecho:**
- **Música** (`sonidos.js`, `MUSICA`): se sacó el colchón de acordes. Los acordes duraban más que el intervalo entre uno y otro y se superponían, así que siempre había una nota sonando. Ahora solo hay campanitas sueltas de una escala pentatónica con un poco de eco, cada 3 a 7 s al azar, y entre una y otra no suena nada.
- **Fragmentos** (`crearZumbido`, `FRAGMENTO.sonido`): también tenían un tono continuo que se oía desde menos de 8 m (desde el principio del juego). Ahora es un aviso corto (do y sol, 1,2 s) cada 2,6 s, con el mismo volumen según la distancia, así sigue sirviendo para encontrarlos sin ser un sonido constante.

**Buenas prácticas aplicadas:**
- Sin sonidos sostenidos en el fondo (fatiga auditiva); la información espacial del audio se mantiene, pero en pulsos.

**Verificado en Chrome:** en 16 s se crearon 30 osciladores y todos tenían hora de fin (de 1,3 s); ninguno quedó sonando sin parar. 0 errores en la consola.

**Pendiente (depende del equipo):**
- Escuchar en el casco y ajustar `MUSICA.notasCada`, `MUSICA.volumenNotas` y `FRAGMENTO.sonido.cada`.
- Intervención manual con commit antes y después.

### 2026-11-22 — Melodía tranquila

**Pedido:** que la música sea una melodía tranquila (no notas sueltas que suenan y se apagan), sin un sonido fuerte ni continuo.

**Resumen de lo hecho:**
- **Melodía** (`sonidos.js`, `MUSICA.frases`): dos frases de 8 pulsos en do mayor pentatónica (mi–sol–la–sol–mi–re–do y re–mi–sol–mi–re–do–la) y 4 pulsos de silencio, que se repiten. A 66 pulsos por minuto, una vuelta dura unos 18 s.
- **Sonido:** cada nota es un seno con un poco de triángulo, sube en 0,12 s y se apaga en 0,7 s, así se pisa un poquito con la siguiente y la melodía fluye sin cortes. Pasa por un filtro que recorta los agudos (1800 Hz) y un eco leve.
- **Volumen:** 0,35 del volumen general (antes 1,0 y con un colchón de varias notas a la vez). Nunca suena más de una nota principal (a veces dos por el solapamiento).
- La música se programa por adelantado con el reloj del audio, así no se corta ni se atrasa si el juego se pone lento.
- Todo se ajusta en `MUSICA` (`config.js`): ritmo, volumen, filtro, eco y las propias notas.

**Buenas prácticas aplicadas:**
- Audio de fondo suave y bajo, sin sonidos sostenidos (fatiga auditiva), y se puede silenciar con M o con B/Y.

**Verificado en Chrome:** la secuencia sale como está escrita (mi, sol, la, sol, mi, re, do, silencio, y repite) y ningún oscilador queda sin parar; 0 errores en la consola. No se pudo escuchar.

**Pendiente (depende del equipo):**
- Escuchar con casco y ajustar `MUSICA.volumen`, `pulsosPorMinuto` y la melodía a gusto.
- Intervención manual con commit antes y después.

### 2026-11-25 — Más espacio en los pisos y fragmentos a la vista

**Pedido:** más espacio para moverse entre el piso y la pared que se escala; que el fragmento que aparece arriba debajo del control se pueda ver; sin tocar los tramos.

**Resumen de lo hecho:**
- **Pisos más profundos** (`ESCENARIO.profundidadPiso` de 2,7 a 3,4 m): entre el borde del piso y la cara de los agarres de la pared siguiente quedan 2,25 m libres (antes 1,55). Para que entre todo, el primer escalón se adelantó (`zFrente` 4,0), el fondo del piso de arriba se corrió (`final.fondoZ` −8,4) y la sala pasó de 16 a 18 m de lado (`SALA.lado`, `LIMITES.sala`).
- El piso de arriba conserva su tamaño: los objetos de videojuegos se mueven junto con su borde (`plataformas.js`), y el lugar donde aparece el jugador se mide desde ese borde (`final.spawnDesdeElBorde`).
- **Escondites a la vista** (`FRAGMENTO.escondites`, ahora medidos desde el borde del piso de arriba): delante del control (antes quedaba adentro del control), al lado del joystick, junto a los cartuchos y junto a los auriculares, flotando a 0,5 m del piso (`alturaEscondite`, antes 0,02).
- Los agarres, sus tipos y su distribución no cambiaron (misma semilla y mismas cantidades: 30, 34 y 23).

**Buenas prácticas aplicadas:**
- Espacio cómodo para moverse en los descansos.
- Lo que hay que encontrar se ve: el escaneo ayuda, pero no es obligatorio.

**Verificado en Chrome:** los tres ascensos llegan a su piso con el checkpoint; desde cinco lugares del piso de arriba, un rayo de la cámara a cada fragmento escondido no choca con ningún objeto (todos visibles); al caminar hasta ellos se juntan los tres. 0 errores en la consola.

**Pendiente (depende del equipo):**
- Probar con casco que el espacio del piso se sienta cómodo.
- Intervención manual con commit antes y después.

### 2026-11-25 — Niebla, estantes, cuerpo, agarres gráficos y paisaje vivo

**Pedido:** que suba el Glitch; que el fragmento salteado aparezca más arriba sin que lo coma la niebla; tramos más largos con estantes para pararse; cuerpo visible; agarres con identidad gráfica; final con más paisaje y animación.

**Resumen de lo hecho:**
- **Niebla** (`niebla.js`): el problema era que alcanzaba al jugador mientras seguía en el piso de la sala, lo «devolvía» al mismo lugar y volvía a bajar 3 m: parecía que nunca subía. Ahora en el piso de la sala no lo alcanza. Además empieza apenas debajo del piso (−0,6 m), sube a 0,2 m/s y arranca 4 s después del primer agarre.
- **Fragmentos salteados** (`fragmentos.js`): al llegar a un piso, cada fragmento de un tramo ya pasado que no se juntó sube solo a un agarre de un tramo más alto o, si ya no hay, aparece en el piso de arriba. Cuenta como perdido para la medalla y el Glitch lo avisa («Te olvidaste un fragmento: lo mando más arriba»).
- **Tramos más largos:** 9, 10 y 9 m (antes 7,2, 8 y 7); la altura total es 28 m. La sala, las luces y el decorado (teclado con franjas de luz y logo, ventiladores repartidos) se ajustaron a la nueva altura.
- **Estantes** (`estante.js`, `tramos.js`, `decorado.js`): cinco bases de madera con borde ámbar (una en el teclado y dos en cada uno de los otros tramos). El jugador puede pararse encima sin agarrarse; si se suelta hasta 0,8 m por encima, cae parado. No son checkpoints. El generador despeja los agarres donde va el estante y agrega agarres de acceso a los costados y arriba, y comprueba que se llegue a cada estante y se siga subiendo.
- **Cuerpo** (`cuerpo.js`): torso, cadera, piernas y pies que siguen a la cabeza. Se pone rojizo cuando la niebla le llega a los pies, antes de alcanzarlo.
- **Agarres con identidad gráfica** (`forma-agarre.js`): cada tipo tiene su dibujo. La tecla firme tiene flecha hacia arriba y un tornillo; la que se hunde, una flecha grande hacia abajo; la lata, etiqueta «COLA», grieta, tapa y anillo; el bloque intermitente es un mosaico de píxeles; el reborde, verde con flechas; el USB, el símbolo grabado. El brillo al tener un agarre al alcance respeta el color de cada tipo.
- **Paisaje vivo** (`paisajeFinal.js`, `PAISAJE`): 34 árboles (redondos y pinos) que se mecen, 260 matas de pasto, 170 flores que se mueven con el viento, 7 pajaritos que vuelan en círculos aleteando, 5 mariposas que revolotean cerca y 7 nubes que pasan.

**Buenas prácticas aplicadas:**
- Descanso dentro del tramo (estantes) para bajar la fatiga de brazos.
- Cuerpo visible: conciencia del propio cuerpo y aviso claro del peligro.
- Affordance: cada agarre muestra con un dibujo qué hace.
- Final con movimiento suave y continuo, sin destellos.

**Verificado en Chrome:** la niebla sube de forma continua (de −0,6 a 1,6 m en 12 s); el jugador queda parado sobre un estante sin caer; los fragmentos salteados pasan de tramo en tramo y aparecen arriba; el cuerpo cambia de color cerca de la niebla; cada tramo se puede subir hasta el reborde (comprobado en el grafo, también usando solo agarres firmes y estantes); el paisaje final se anima (pajaritos, mariposas y nubes en movimiento). 0 errores en la consola.

**Pendiente (depende del equipo):**
- Probar con casco el alto del cuerpo, los estantes y la duración de la partida (los tramos son más largos; se puede ajustar `NIEBLA.velocidad` y `FINAL.medallas`).
- Intervención manual con commit antes y después.

### 2026-11-25 — Niebla que alcanza, manos con la mirada y huecos rellenos

**Pedido:** que el Glitch suba de verdad y que, al completar cada tramo, suba automáticamente 3/4 de ese tramo; manos (y cuerpo) que giren con la mirada; mejor distribución de agarres en la torre (faltaban a la izquierda).

**Resumen de lo hecho:**
- **Niebla** (`niebla.js`, `NIEBLA.alcanceTramo` y `velocidadAlcance`): al llegar al piso de un tramo, la niebla sube a 1,5 m/s hasta 3/4 de ese tramo (por ejemplo, 6,75 m al terminar el teclado) y después sigue a su velocidad normal. Además arranca si el jugador se despega del piso aunque no se haya registrado un agarre, y la altura mínima baja junto con ella cuando el jugador cae.
- **Manos con la mirada** (`escalada-mouse.js`): en modo escritorio, las manos en reposo giran alrededor de la cabeza según hacia dónde mira el jugador y apuntan hacia ese lado; el cuerpo ya lo hacía. Con casco, las manos las siguen moviendo los controles.
- **Huecos rellenos** (`tramos.js`, paso 5a-bis): donde quedó un hueco más grande que el alcance (por estantes, paneles o agarres que se sacaron), el generador agrega agarres firmes que crecen desde los que ya hay y saca al final los que no quedaron con camino. No rellena alrededor de los fragmentos difíciles ni debajo del fragmento de la torre. La torre pasó de 35 a 46 agarres (17 a la izquierda y 10 a la derecha, antes 2), y el hueco más grande bajó de 4,2 a 2,2 m.

**Buenas prácticas aplicadas:**
- Presión constante y visible (la niebla acompaña al jugador).
- Las manos y el cuerpo responden a la orientación de la cabeza (propiocepción).

**Verificado en Chrome:** con un clic real del mouse sobre un agarre, la niebla arranca y sube; al completar el teclado subió de 2 a 6,75 m y siguió subiendo; las manos giran con la mirada; los tres tramos se pueden subir (también solo con agarres firmes) y el fragmento de la torre sigue exigiendo el panel y la lata. 0 errores en la consola.

**Pendiente (depende del equipo):**
- Probar con personas si la niebla resulta muy exigente al quedarse descansando en un piso (`NIEBLA.velocidad`, `alcanceTramo`).
- Intervención manual con commit antes y después.

### 2026-11-25 — Título del final estilo videojuego

**Pedido:** que la frase final del cielo tenga una tipografía y un diseño más impactantes, que combinen con el paisaje sin exagerar. Se mostraron cuatro maquetas y el equipo eligió la opción B, «título de videojuego».

**Resumen de lo hecho:**
- **Componente nuevo `titulo-nivel`** (`src/components/titulo-nivel.js`): dibuja en un canvas el título «SUBISTE DE NIVEL» en letras de bloque (tipografía Lilita One), color crema y con volumen (tres capas apiladas de lavanda a violeta) más una sombra suave. Debajo va la bajada «adentro y afuera de la pantalla» en letra redondeada (Fredoka) sobre una cinta clara.
- **Animación:** cuando aparece el exterior, el título entra creciendo con un rebote chico (0,9 s) y después flota despacio (0,3 m cada 5 s). Sin parpadeos ni destellos.
- **Tipografías:** instaladas con npm (`@fontsource/lilita-one` y `@fontsource/fredoka`, solo el subconjunto latino, que incluye tildes y ñ). Van dentro del build, así que no hace falta internet. Mientras cargan se dibuja con la letra del sistema y se redibuja al terminar.
- **Config:** `FINAL.frase` pasó a ser `{ titulo, bajada }`. `FINAL.cielo` suma `pixelesPorMetro`, `entrada` y `flotar`, y `COLORES.tituloNivel` tiene los colores de la cara, el volumen, la sombra y la cinta.
- `final.js` usa `titulo-nivel` en lugar del `cartel` sin fondo.

**Buenas prácticas aplicadas:**
- Texto grande, con alto contraste y separado del fondo por el volumen y la sombra, legible a 30 m.
- Jerarquía clara: el título arriba y la bajada más chica abajo.
- Movimiento suave y continuo, sin parpadeos (ambiente calmo).

**Verificado en Chrome:** el título aparece en el cielo sobre el podio con las dos tipografías cargadas; el build incluye los archivos de las fuentes. 0 errores en la consola.

**Pendiente (depende del equipo):**
- Ver con casco si el tamaño y la altura del título se leen cómodos (`FINAL.cielo`).
- Intervención manual con commit antes y después.

### 2026-11-26 — Caminar con el stick en VR

**Pedido:** que en VR el jugador se mueva con el stick de los controles y no teniendo que desplazarse físicamente por la habitación, porque varias personas que lo probaron se quejaron de eso.

**Resumen de lo hecho:**
- **Componente nuevo `movimiento-stick`** (`src/components/movimiento-stick.js`), en el rig del jugador: lee el evento `thumbstickmoved` de los dos controles y mueve el rig hacia donde mira la cabeza, solo en el plano horizontal.
- Sirve **cualquiera de los dos sticks** (si se mueven los dos, manda el más inclinado). No camina si hay una mano agarrada, mientras cae o mientras un ascenso automático lleva al jugador. Al reaparecer o volver a jugar se olvida el último valor del stick.
- Va antes de `limites` en el rig, así que los límites de siempre (paredes, borde de los pisos, estantes) lo corrigen en el mismo cuadro.
- **Config:** `STICK.velocidad` (1,8 m/s) y `STICK.zonaMuerta` (0,3) en `src/config.js`.
- La pantalla de inicio y el README suman «Mové el stick de cualquier control para caminar».
- La escalada sigue siendo con los brazos, como dice `docs/idea-final.md`; el stick solo reemplaza caminar por los pisos.

**Buenas prácticas aplicadas:**
- Velocidad **constante**, sin aceleraciones ni frenadas, para reducir el mareo (p. 107).
- Zona muerta para que un stick apenas corrido no deslice al jugador.
- Los dos sticks hacen lo mismo: sirve igual para zurdos y diestros (p. 29–30).
- Sigue disponible moverse con el cuerpo: el stick se suma, no lo reemplaza.

**Verificado en Chrome** (simulando el stick desde la consola, cuadro por cuadro): 1 s de stick = 1,8 m; con 0,2 de inclinación no se mueve; con una mano agarrada no se mueve; contra la pared y en el borde del piso del tramo 1 los límites lo frenan sin hacerlo caer. `npm run build` sin errores y 0 errores en la consola.

**Pendiente (depende del equipo):**
- Probarlo con casco y con las personas que se quejaron, y ajustar `STICK.velocidad` si marea o resulta lento.
- Evaluar giro por pasos con el stick derecho y una viñeta de comodidad. El giro por pasos hoy no se puede agregar sin cambiar `climb`, que asume que el rig no está rotado.
