# Problemas documentados y resueltos

La consigna pide que el informe incluya **al menos un problema documentado y resuelto**. Este registro junta los problemas reales que aparecieron durante el desarrollo, con la causa y la solución. Se agrega una entrada cada vez que se resuelve algo que valga contar.

Formato de cada entrada: **qué pasó → por qué pasó → cómo se resolvió → qué se aprendió**.

---

## 1. Los carteles perdían las tildes y la ñ

- **Qué pasó:** el cartel «Agarrá con el botón lateral» se veía como «Agarr con el botn lateral».
- **Por qué:** el texto de A-Frame (`a-text`) usa fuentes de mapas de distancia (MSDF) que no incluyen los caracteres del español. Se probó con la fuente `dejavu` y tampoco las traía.
- **Solución:** el componente `cartel` dibuja el texto en un canvas 2D con la tipografía del sistema y lo usa como textura. Soporta tildes y ñ, ajusta el tamaño de letra al panel y no depende de fuentes externas.
- **Aprendizaje:** en una experiencia en español hay que verificar los caracteres especiales desde el principio. Además, el libro de referencia remarca que el texto legible es un problema histórico de VR (p. 107–108).

## 2. El primer despliegue a GitHub Pages falló

- **Qué pasó:** el link público daba error 404. La parte `build` del workflow andaba y la parte `deploy` fallaba.
- **Por qué:** el workflow corrió antes de cambiar el origen de Pages a «GitHub Actions» en la configuración del repositorio.
- **Solución:** configurar el origen de Pages y volver a correr el workflow.
- **Aprendizaje:** el despliegue tiene una parte que vive fuera del código y hay que configurarla antes del primer push.

## 3. No hay casco para probar la escalada

- **Qué pasó:** ningún integrante tenía un casco VR y la escalada solo se podía probar con el emulador, de forma muy incómoda. El modo escritorio original solo teletransportaba al jugador hasta un agarre.
- **Por qué:** la mecánica depende de los controles de las manos.
- **Solución:** el componente `escalada-mouse` mueve las manos virtuales con el mouse (clic izquierdo y derecho para cada mano) y dispara los mismos eventos que los controles reales. Así se prueba toda la mecánica con el mismo código que usará el casco. La consigna además pide que el docente pueda abrir el link en un navegador de escritorio.
- **Aprendizaje:** conviene diseñar desde el principio un camino de prueba que no dependa del hardware.

## 4. En el modo escritorio, viajar a un agarre alto hacía caer al jugador

- **Qué pasó:** al hacer clic en un agarre lejano, el jugador quedaba flotando en el aire sin agarrarse y la lógica de caída lo mandaba al checkpoint.
- **Por qué:** el viaje coloca al jugador junto al agarre pero no lo agarra.
- **Solución:** después de un viaje hay `CAIDA.graciaViaje` (3 s) sin caída, para que el jugador se agarre con el mouse. Si no lo hace, cae como corresponde.
- **Aprendizaje:** cada mecánica nueva puede cambiar el comportamiento de las anteriores. Conviene probar combinaciones, no solo cada una por separado.

---

## 5. En modo escritorio, la primera tecla estaba siempre resaltada

- **Qué pasó:** al agregar el resaltado de los agarres al alcance, la tecla más baja se veía brillante todo el tiempo.
- **Por qué:** el guante izquierdo en reposo (abajo a la izquierda, en modo escritorio) quedaba a menos de 18 cm de esa tecla, así que el juego creía que la mano estaba por agarrarla.
- **Solución:** en modo escritorio las manos quedan quietas, así que el resaltado lo da solo el cursor del mouse. El resaltado por distancia de la mano queda para VR.
- **Aprendizaje:** una posición de reposo pensada para que se vea el guante puede activar la lógica de interacción. Conviene probar cada función nueva también con las manos en reposo.

## 6. Los agarres que se mueven no arrastraban al jugador

- **Qué pasó:** la tecla que se hundía bajaba, pero el jugador se quedaba en su lugar y su mano se separaba de la tecla.
- **Por qué:** la escalada solo movía al jugador según el movimiento de su mano, no según el del agarre.
- **Solución:** `climb` mide también cuánto se movió el agarre en el mundo y mueve al jugador con él. Con eso funcionan la tecla que se hunde y el panel que gira sin código extra en cada tipo.
- **Aprendizaje:** una mecánica general (agarrarse a algo) tiene que contemplar que ese algo se mueva.

## 7. Dos paneles se superponían y no se podía pasar de uno al otro

- **Qué pasó:** en el tramo del monitor, un jugador automático caía una y otra vez cerca de los paneles que giran.
- **Por qué:** el generador dejó dos paneles a 0,66 m de altura, y cada panel mide 0,8 m: se pisaban, y como giraban con fases distintas era imposible sincronizarse. Además, un panel había quedado pegado a la plataforma final.
- **Solución:** el generador exige 1,7 m de separación entre paneles y 1,8 m respecto de cualquier checkpoint, los limita a su propio tramo y hace que todos giren a la par.
- **Aprendizaje:** una pared generada al azar necesita reglas de separación y una prueba automática que la recorra, no solo mirarla.

## 8. Un agarre con tiempo podía romperse mientras el jugador esperaba en él

- **Qué pasó:** si la ruta tenía una lata o un bloque intermitente seguido de otro agarre con tiempo (o de un panel), el jugador tenía que esperar colgado de uno que se rompe o se apaga, y caía.
- **Por qué:** el sorteo de tipos no consideraba los vecinos.
- **Solución:** en la ruta garantizada, después de un agarre con tiempo (lata o bloque) siempre viene uno seguro, y los vecinos de un panel también son seguros. Así hay siempre dónde apoyarse y esperar.
- **Aprendizaje:** la dificultad tiene que venir de la habilidad, no de situaciones donde no se puede hacer nada.

## 9. La niebla podía devolver al jugador adentro de la niebla

- **Qué pasó:** al pensar el regreso al checkpoint, si la niebla ya estaba por encima de él, el jugador reaparecía dentro de la niebla y volvía a ser alcanzado en un bucle.
- **Por qué:** la niebla sigue su camino mientras el jugador cae, sin tener en cuenta adónde va a reaparecer.
- **Solución:** cada vez que el jugador reaparece, la niebla baja hasta 3 m por debajo de ese checkpoint (`NIEBLA.retroceso`). Así siempre queda un respiro.
- **Aprendizaje:** una amenaza que persigue al jugador tiene que dejarle una salida después de cada derrota.

## 10. Un fragmento sin juntar podía dejar la partida sin solución

- **Qué pasó:** el diseño dice que el Glitch se come los fragmentos que la niebla alcanza, pero si el jugador llega arriba antes de que la niebla suba tanto, esos fragmentos quedaban en la pared y no se podía juntar los tres.
- **Por qué:** la niebla sube lento a propósito (0,1 m/s), así que un jugador rápido llega arriba antes que ella.
- **Solución:** al llegar a la plataforma de arriba, la niebla sube rápido hasta comerse lo que quedó sin juntar y se detiene debajo de la plataforma, sin alcanzar al jugador. Entonces los fragmentos aparecen escondidos arriba. La partida nunca se traba, y buscarlos lleva más tiempo, que se refleja en la medalla.
- **Aprendizaje:** cada regla del juego necesita una respuesta para el caso en que el jugador la evita.

## 11. El cartel de ayuda tapaba la pulsera

- **Qué pasó:** en modo escritorio, el cuadro de ayuda de abajo a la izquierda cubría la pulsera, que se ve ahí cerca del guante.
- **Por qué:** los dos ocupaban la misma esquina de la pantalla.
- **Solución:** la ayuda pasó a la esquina de arriba a la izquierda.
- **Aprendizaje:** una interfaz dentro del mundo hay que revisarla junto con los textos de pantalla del modo escritorio.

## 12. Al volver a jugar, la sala quedaba con la niebla del exterior

- **Qué pasó:** después de reiniciar, la sala se veía con la bruma suave del exterior en vez de su niebla oscura.
- **Por qué:** para restaurar el ambiente se guardaba el resultado de `getAttribute('fog')`, pero A-Frame devuelve el mismo objeto que después se modifica; al cambiar la niebla, lo «guardado» cambiaba también.
- **Solución:** se guardan copias de los valores antes de entrar al exterior.
- **Aprendizaje:** al guardar un valor para restaurarlo después, hay que copiarlo y no guardar una referencia.

## 13. El golpe con el casco no se detectaba

- **Qué pasó:** con una mano simulada que golpeaba el botón RESET con fuerza, nunca se activaba.
- **Por qué:** había dos errores a la vez. Primero, la dirección «hacia la pared» se calculaba con la orientación del propio botón, que está girado 90° para que su cara mire al jugador, así que apuntaba para arriba. Segundo, la posición anterior de la mano se actualizaba antes de calcular la velocidad, y la velocidad daba siempre cero.
- **Solución:** se usa la orientación del objeto que contiene al botón y se calcula la velocidad antes de guardar la posición nueva. Se probó con golpes rápidos, pasadas lentas, barridos laterales, golpes lejanos y dobles golpes.
- **Aprendizaje:** una detección por movimiento necesita pruebas con casos que deben activarse y casos que no.

## 14. El cartel de la tirolesa quedaba encima del enchufe

- **Qué pasó:** el cartel que explica la tirolesa tapaba el enchufe que explicaba.
- **Por qué:** al buscar un lugar libre para el cartel no se consideraba el enchufe, y además la pared tiene tantos agarres que casi no queda espacio.
- **Solución:** el generador, que ya elige el lugar del enchufe, reserva un hueco para el cartel hacia el centro de la pared y despeja ahí los agarres que sobran (nunca los de la ruta).
- **Aprendizaje:** el espacio para los carteles hay que reservarlo al diseñar la pared, no buscarlo después.
