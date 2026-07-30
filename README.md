# Mapbox Video Studio

Herramienta local para crear clips de mapas animados para YouTube usando Mapbox GL JS.

## Primer uso

1. Abre `index.html` en el navegador.
2. Pega tu token publico de Mapbox, que empieza con `pk.`.
3. Elige una historia, formato y estilo.
4. Usa `Vista previa` para revisar la camara.
5. Usa `Grabar WebM` para descargar el clip.

## Token

Mapbox requiere un token publico para cargar mapas. Puedes conseguirlo en:

https://account.mapbox.com

El token se guarda solo en `localStorage` del navegador. No se escribe en ningun archivo del proyecto.

## Formatos iniciales

- YouTube horizontal: `16:9`
- YouTube Shorts: `9:16`
- Cuadrado: `1:1`

## Siguiente paso recomendado

Cuando tengas una ruta real para un video, reemplaza o agrega una historia en `app.js` dentro del arreglo `stories`. Cada historia tiene:

- `route`: coordenadas `[longitud, latitud]` para dibujar la linea.
- `shots`: puntos de camara con `center`, `zoom`, `pitch`, `bearing` y `duration`.

El archivo exportado es `.webm`. Para editar en Premiere, DaVinci o Final Cut suele funcionar directo; si necesitas `.mp4`, puedes convertirlo luego con ffmpeg o HandBrake.
