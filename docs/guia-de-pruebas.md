# Guía de pruebas con personas

Las pruebas automáticas que hicimos durante el desarrollo no reemplazan a jugar con personas. El libro de referencia pide medir con al menos tres (p. 358 y 362). Esta guía sirve para hacerlo sin improvisar y para tener datos para el informe.

## Antes de empezar

- Probar en el **Meta Quest** cuando se pueda (link público abierto desde el navegador del casco) y, si no, en la compu con el **modo escritorio**.
- Conviene que una persona del equipo observe sin ayudar y otra anote.
- Con casco: dejar libres unos 2 m alrededor, y estar cerca por seguridad.
- Si alguien se marea o se cansa, cortar la prueba. Siempre es opcional.
- Elegir, si se puede, **personas distintas entre sí** (altura, experiencia con VR y con juegos). Quien nunca usó VR sirve para ver si se entiende el juego; quien ya usó, para ver el balance.

## Qué decirles (y qué no)

Decirles solo: «Es una experiencia de VR de un festival sobre bienestar gamer. Jugala como quieras». **No explicarles los controles ni el objetivo**: eso lo tiene que enseñar el juego. Anotar cada duda que tengan.

## Preguntas de antes (1 minuto)

1. ¿Usaste antes un casco de VR? ¿Cuántas veces?
2. ¿Jugás videojuegos? ¿Con qué frecuencia?
3. ¿Cuánto medís?

## Qué anotar mientras juegan

| Dato | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Dispositivo (Quest / compu) y modo (normal / fácil) | | | |
| ¿Entendió cómo agarrar sin ayuda? (sí/no, y en cuánto tiempo) | | | |
| Tiempo total hasta romper el RESET | | | |
| Cantidad de caídas | | | |
| Veces que lo alcanzó la niebla | | | |
| Fragmentos que juntó por su cuenta (de 3) | | | |
| ¿Usó el escaneo? ¿Entendió la pulsera? | | | |
| ¿Usó la tirolesa? | | | |
| ¿Abandonó antes de terminar? (abandono) | | | |
| Medalla | | | |
| ¿Se mareó o se cansó? ¿Cuándo? | | | |
| Dudas o frustraciones (anotar frases textuales) | | | |

Para detectar **por qué** falla algo, conviene usar el bucle observar, orientar, decidir y actuar (p. 154): si no usó una ayuda, quizá no la vio; si siempre elige lo mismo, quizá las opciones no se entienden.

## Preguntas de después (3 minutos)

1. En una palabra, ¿cómo te sentiste?
2. ¿Qué fue lo más difícil? ¿Y lo más divertido?
3. ¿Entendiste qué había que hacer y por qué? ¿En qué momento?
4. ¿Qué te pareció la niebla? ¿Y las frases del Glitch?
5. ¿Te resultó cómodo moverte y agarrar? ¿Algo cansó los brazos?
6. Del 1 al 5, ¿qué tan satisfecho quedaste? ¿Se lo recomendarías a alguien?
7. ¿Qué cambiarías?

## Cómo usar lo que encuentren

| Si pasa esto | Se ajusta en `src/config.js` |
|---|---|
| Se cansan o caen mucho | `ENERGIA.segundosAgarrando`, `ENERGIA.segundosRecuperar`, `ESCENARIO.tramos[].distanciaMax` |
| Les cuesta alcanzar los agarres (sobre todo bajos de altura) | `JUGADOR.radioAgarre`, `ESCENARIO.tramos[].distanciaMax`, `FACIL` |
| La niebla los apura demasiado o no los apura | `NIEBLA.velocidad`, `NIEBLA.retardoInicio` |
| Los bloques o paneles se sienten injustos | `INTERMITENTE`, `PANEL`, `LATA` |
| Tardan mucho más o mucho menos de 2 min 30 s | Los tramos (`ESCENARIO.tramos[].alto` y `paso`) y las medallas (`FINAL.medallas`) |
| El golpe al RESET no responde o se activa solo | `FINAL.umbralGolpe`, `FINAL.radioGolpe` |
| El sonido molesta o no se oye | `SONIDO`, `MUSICA`, `FRAGMENTO.sonido` |
| Algo marea | `TIROLESA.velocidad`, `HUNDE.velocidad`, `PANEL.segundosGiro` |

Después de cada ajuste, volver a correr `npm run build` y anotar el cambio en `PROMPTS.md` y, si resolvió un problema real, en `docs/problemas-resueltos.md`: sirve para el informe.

## Métricas para el informe (p. 362)

- **Tasa de abandono:** cuántos no llegaron al final.
- **Éxito de la tarea:** cuántos rompieron el RESET.
- **Tiempo de tarea:** promedio y rango.
- **Problemas y frustraciones:** lista de dudas, con frases textuales.
- **Satisfacción y recomendación:** promedio del 1 al 5.
