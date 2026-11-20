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
