const MAPBOX_TOKEN_KEY = "mapbox-video-studio-token";
const NASA_CLOUD_SOURCE_ID = "nasa-blue-marble-clouds";
const NASA_CLOUD_LAYER_ID = "nasa-blue-marble-clouds-layer";
const NASA_CLOUD_TEXTURE = "./assets/nasa-blue-marble-clouds.jpg";
const TERRAIN_SOURCE_ID = "mapbox-terrain-dem";
const CLOUD_OPACITY = {
  off: 0,
  subtle: 0.24,
  cinematic: 0.38
};
const TERRAIN_EXAGGERATION = {
  off: 0,
  natural: 1.2,
  dramatic: 1.8
};

const stories = [
  {
    id: "niagara",
    location: "Cataratas del Niagara",
    episode: "Canada y Estados Unidos",
    route: [
      [-79.076, 43.104],
      [-79.069, 43.096],
      [-79.064, 43.091],
      [-79.061, 43.086],
      [-79.066, 43.080]
    ],
    shots: [
      { label: "Zoom desde el globo", center: [-79.0716, 43.0817], zoom: 1.55, pitch: 0, bearing: -38, duration: 9500 },
      { label: "Centro de las cataratas", center: [-79.0716, 43.0817], zoom: 15.0, pitch: 0, bearing: 0, duration: 0 }
    ],
    animation: "flyTo",
    flyTo: {
      curve: 0.9
    },
    globeSpin: {
      startLngOffset: -34,
      stopProgress: 0.34
    }
  },
  {
    id: "patagonia",
    location: "Patagonia",
    episode: "Carretera Austral",
    route: [
      [-72.919, -41.469],
      [-72.706, -42.478],
      [-72.405, -43.119],
      [-72.069, -44.735],
      [-72.686, -45.575],
      [-72.827, -47.254]
    ],
    shots: [
      { label: "Salida desde Puerto Montt", center: [-72.82, -41.54], zoom: 7.2, pitch: 58, bearing: 24, duration: 2600 },
      { label: "Bosques y fiordos hacia el sur", center: [-72.45, -43.2], zoom: 7.8, pitch: 64, bearing: 9, duration: 3200 },
      { label: "Llegada a los glaciares", center: [-72.76, -46.7], zoom: 8.4, pitch: 62, bearing: -18, duration: 3200 }
    ]
  },
  {
    id: "andes",
    location: "Andes",
    episode: "Cruce Chile Argentina",
    route: [
      [-70.669, -33.448],
      [-70.215, -33.119],
      [-69.91, -32.825],
      [-69.27, -32.889],
      [-68.845, -32.889]
    ],
    shots: [
      { label: "Santiago al amanecer", center: [-70.66, -33.45], zoom: 8.5, pitch: 55, bearing: 54, duration: 2400 },
      { label: "Subida por la cordillera", center: [-69.88, -32.96], zoom: 9, pitch: 70, bearing: 68, duration: 3200 },
      { label: "Entrada a Mendoza", center: [-68.89, -32.89], zoom: 8.8, pitch: 56, bearing: 91, duration: 2600 }
    ]
  },
  {
    id: "yucatan",
    location: "Yucatan",
    episode: "Cenotes y costa maya",
    route: [
      [-86.851, 21.161],
      [-87.073, 20.629],
      [-88.568, 20.689],
      [-89.623, 20.967],
      [-90.398, 20.967]
    ],
    shots: [
      { label: "Cancun desde el Caribe", center: [-86.85, 21.1], zoom: 8.7, pitch: 52, bearing: -24, duration: 2400 },
      { label: "Cenotes y ruinas mayas", center: [-88.38, 20.68], zoom: 8.3, pitch: 60, bearing: -72, duration: 3000 },
      { label: "Atardecer en Campeche", center: [-90.37, 20.96], zoom: 8.5, pitch: 54, bearing: -101, duration: 2600 }
    ]
  }
];

const els = {
  tokenInput: document.querySelector("#tokenInput"),
  saveTokenButton: document.querySelector("#saveTokenButton"),
  previewButton: document.querySelector("#previewButton"),
  recordButton: document.querySelector("#recordButton"),
  stillButton: document.querySelector("#stillButton"),
  storySelect: document.querySelector("#storySelect"),
  formatSelect: document.querySelector("#formatSelect"),
  styleSelect: document.querySelector("#styleSelect"),
  lightSelect: document.querySelector("#lightSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  terrainSelect: document.querySelector("#terrainSelect"),
  objectsSelect: document.querySelector("#objectsSelect"),
  cloudSelect: document.querySelector("#cloudSelect"),
  boundarySelect: document.querySelector("#boundarySelect"),
  fpsInput: document.querySelector("#fpsInput"),
  stage: document.querySelector("#stage"),
  statusTitle: document.querySelector("#statusTitle"),
  statusText: document.querySelector("#statusText"),
  shotList: document.querySelector("#shotList")
};

let map;
let currentStory = stories[0];
let animationFrame = 0;
let isAnimating = false;
let recorder;
let recordedChunks = [];
let recordingDrawFrame = 0;
let nasaCloudTexturePromise;

init();

function init() {
  stories.forEach((story) => {
    const option = document.createElement("option");
    option.value = story.id;
    option.textContent = `${story.location} - ${story.episode}`;
    els.storySelect.append(option);
  });

  const savedToken = localStorage.getItem(MAPBOX_TOKEN_KEY);
  if (savedToken) {
    els.tokenInput.value = savedToken;
    createMap(savedToken);
  }

  renderStory();
  bindEvents();
}

function bindEvents() {
  els.saveTokenButton.addEventListener("click", () => {
    const token = els.tokenInput.value.trim();
    if (!token.startsWith("pk.")) {
      setStatus("Token incompleto", "Mapbox usa tokens publicos que normalmente empiezan con pk.");
      return;
    }

    localStorage.setItem(MAPBOX_TOKEN_KEY, token);
    createMap(token);
  });

  els.previewButton.addEventListener("click", () => playAnimation(false));
  els.recordButton.addEventListener("click", () => playAnimation(true));
  els.stillButton.addEventListener("click", downloadStillFrame);
  els.lightSelect.addEventListener("change", applyBasemapLook);
  els.themeSelect.addEventListener("change", applyBasemapLook);
  els.terrainSelect.addEventListener("change", setTerrainMode);
  els.objectsSelect.addEventListener("change", applyBasemapLook);
  els.cloudSelect.addEventListener("change", setNasaCloudLayer);
  els.boundarySelect.addEventListener("change", setBoundaryVisibility);

  els.storySelect.addEventListener("change", () => {
    currentStory = stories.find((story) => story.id === els.storySelect.value) || stories[0];
    renderStory();
    jumpToFirstShot();
  });

  els.styleSelect.addEventListener("change", () => {
    if (!map) return;
    map.setStyle(els.styleSelect.value);
  });

  els.formatSelect.addEventListener("change", () => {
    els.stage.className = `stage format-${els.formatSelect.value.replace(":", "-")}`;
    setTimeout(() => map?.resize(), 100);
  });
}

function createMap(token) {
  if (map) {
    map.remove();
  }

  const initialCamera = getInitialCamera();

  mapboxgl.accessToken = token;
  map = new mapboxgl.Map({
    container: "map",
    style: els.styleSelect.value,
    center: initialCamera.center,
    zoom: initialCamera.zoom,
    pitch: initialCamera.pitch,
    bearing: initialCamera.bearing,
    projection: "globe",
    preserveDrawingBuffer: true,
    attributionControl: false,
    config: {
      basemap: {
        lightPreset: els.lightSelect.value,
        theme: els.themeSelect.value,
        showPointOfInterestLabels: false,
        showRoadLabels: false,
        showTransitLabels: false,
        showPlaceLabels: false,
        showAdminBoundaries: false,
        show3dObjects: els.objectsSelect.value === "show"
      }
    }
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
  map.scrollZoom.disable();
  map.dragRotate.disable();

  map.on("style.load", () => {
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
  });

  map.on("load", () => {
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
    setStatus("Mapa listo", "Elige una historia, revisa la camara y graba un WebM para llevarlo a tu editor.");
  });

  map.on("error", (event) => {
    const message = event?.error?.message || "Revisa el token, internet o permisos del navegador.";
    setStatus("Mapbox reporto un error", message);
  });
}

function simplifyMapLabels() {
  if (!map || !map.isStyleLoaded()) return;

  setBasemapConfig("showPointOfInterestLabels", false);
  setBasemapConfig("showRoadLabels", false);
  setBasemapConfig("showTransitLabels", false);
  setBasemapConfig("showPlaceLabels", false);

  const layers = map.getStyle().layers || [];
  layers.forEach((layer) => {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  });
}

function setBoundaryVisibility() {
  if (!map || !map.isStyleLoaded()) return;

  const shouldShow = els.boundarySelect.value === "show";
  const visibility = shouldShow ? "visible" : "none";
  setBasemapConfig("showAdminBoundaries", shouldShow);

  const layers = map.getStyle().layers || [];
  layers.forEach((layer) => {
    if (isBoundaryLayer(layer)) {
      map.setLayoutProperty(layer.id, "visibility", visibility);
    }
  });
}

function isBoundaryLayer(layer) {
  if (layer.type !== "line") return false;

  const id = layer.id.toLowerCase();
  const sourceLayer = String(layer["source-layer"] || "").toLowerCase();
  return id.includes("boundary") ||
    id.includes("admin") ||
    id.includes("border") ||
    id.includes("country") ||
    sourceLayer.includes("boundary") ||
    sourceLayer.includes("admin") ||
    sourceLayer.includes("border");
}

function applyBasemapLook() {
  if (!map || !map.isStyleLoaded()) return;

  setBasemapConfig("lightPreset", els.lightSelect.value);
  setBasemapConfig("theme", els.themeSelect.value);
  setBasemapConfig("show3dObjects", els.objectsSelect.value === "show");
}

function setTerrainMode() {
  if (!map || !map.isStyleLoaded()) return;

  const exaggeration = TERRAIN_EXAGGERATION[els.terrainSelect.value] ?? TERRAIN_EXAGGERATION.natural;
  if (exaggeration === 0) {
    map.setTerrain(null);
    return;
  }

  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14
    });
  }

  map.setTerrain({
    source: TERRAIN_SOURCE_ID,
    exaggeration
  });
}

function setNasaCloudLayer() {
  if (!map || !map.isStyleLoaded()) return;

  const opacity = CLOUD_OPACITY[els.cloudSelect.value] ?? CLOUD_OPACITY.subtle;
  if (map.getLayer(NASA_CLOUD_LAYER_ID)) {
    map.setPaintProperty(NASA_CLOUD_LAYER_ID, "raster-opacity", opacity);
    return;
  }

  getNasaCloudTexture()
    .then((url) => {
      if (!map || !map.isStyleLoaded() || map.getSource(NASA_CLOUD_SOURCE_ID)) return;

      map.addSource(NASA_CLOUD_SOURCE_ID, {
        type: "image",
        url,
        coordinates: [
          [-180, 85],
          [180, 85],
          [180, -85],
          [-180, -85]
        ],
        animate: false
      });

      map.addLayer({
        id: NASA_CLOUD_LAYER_ID,
        type: "raster",
        source: NASA_CLOUD_SOURCE_ID,
        paint: {
          "raster-opacity": opacity,
          "raster-fade-duration": 0
        }
      });
    })
    .catch(() => {
      setStatus("No se cargaron las nubes", "Revisa que exista assets/nasa-blue-marble-clouds.jpg.");
    });
}

function getNasaCloudTexture() {
  if (!nasaCloudTexturePromise) {
    nasaCloudTexturePromise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(createTransparentCloudTexture(image));
      image.onerror = reject;
      image.src = NASA_CLOUD_TEXTURE;
    });
  }

  return nasaCloudTexturePromise;
}

function createTransparentCloudTexture(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  for (let index = 0; index < data.length; index += 4) {
    const luminance = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
    const alpha = clamp((luminance - 12) / 180, 0, 1);
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
    data[index + 3] = Math.round(alpha * alpha * 255);
  }

  context.putImageData(pixels, 0, 0);
  return canvas.toDataURL("image/png");
}

function setCleanAtmosphere() {
  if (typeof map?.setFog !== "function") return;

  map.setFog({
    color: "rgb(225, 242, 255)",
    "high-color": "rgb(86, 151, 220)",
    "horizon-blend": 0.04,
    "space-color": "rgb(3, 7, 18)",
    "star-intensity": 0.18
  });
}

function setBasemapConfig(property, value) {
  if (typeof map.setConfigProperty !== "function") return;

  try {
    map.setConfigProperty("basemap", property, value);
  } catch {
    // Some non-Standard styles do not expose basemap config.
  }
}

function renderStory() {
  els.shotList.innerHTML = "";

  currentStory.shots.forEach((shot) => {
    const item = document.createElement("li");
    item.textContent = `${shot.label}: zoom ${shot.zoom}, pitch ${shot.pitch}, bearing ${shot.bearing}`;
    els.shotList.append(item);
  });
}

function jumpToFirstShot() {
  if (!map) return;
  map.jumpTo(getInitialCamera());
}

async function playAnimation(shouldRecord) {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  cancelAnimationFrame(animationFrame);
  map.stop();
  isAnimating = true;
  setControls(false);
  jumpToFirstShot();
  await wait(500);

  let stopRecording = () => {};
  if (shouldRecord) {
    stopRecording = startRecording();
  }

  const duration = getAnimationDuration();
  const startedAt = performance.now();
  setStatus(shouldRecord ? "Grabando" : "Vista previa", `${Math.round(duration / 1000)} segundos de animacion.`);

  if (currentStory.animation === "flyTo") {
    await playNativeFlyToAnimation(duration);
  } else {
    await playKeyframeAnimation(startedAt, duration);
  }

  if (shouldRecord) {
    await wait(400);
    stopRecording();
  }

  isAnimating = false;
  setControls(true);
  setStatus(shouldRecord ? "Grabacion finalizada" : "Vista previa finalizada", "Puedes ajustar la historia, el estilo o el formato y volver a grabar.");
}

function getAnimationDuration() {
  return currentStory.shots.reduce((total, shot) => total + shot.duration, 0);
}

function playKeyframeAnimation(startedAt, duration) {
  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = Math.min(now - startedAt, duration);
      const timeline = getTimelineState(elapsed);
      const camera = applyGlobeSpin(timeline.camera, elapsed / duration);
      map.setFreeCameraOptions ? setMapCamera(camera) : map.jumpTo(camera);

      if (elapsed < duration && isAnimating) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    animationFrame = requestAnimationFrame(tick);
  });
}

function playNativeFlyToAnimation(duration) {
  const target = currentStory.shots[currentStory.shots.length - 1];
  const options = currentStory.flyTo || {};

  return new Promise((resolve) => {
    let hasFinished = false;
    const fallback = setTimeout(finish, duration + 900);

    function finish() {
      if (hasFinished) return;
      hasFinished = true;
      clearTimeout(fallback);
      map.off("moveend", finish);
      resolve();
    }

    map.once("moveend", finish);
    map.flyTo({
      center: target.center,
      zoom: target.zoom,
      pitch: target.pitch,
      bearing: target.bearing,
      duration,
      curve: options.curve ?? 1.42,
      essential: true
    });
  });
}

function startRecording() {
  const exportCanvas = document.createElement("canvas");
  const exportSize = getExportSize();
  exportCanvas.width = exportSize.width;
  exportCanvas.height = exportSize.height;

  const context = exportCanvas.getContext("2d");
  const fps = clamp(Number(els.fpsInput.value) || 30, 24, 60);
  const stream = exportCanvas.captureStream(fps);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  recordedChunks = [];
  recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12_000_000 });
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };
  recorder.onstop = downloadRecording;
  recorder.start();
  drawRecordingFrame(context, exportCanvas);

  return () => {
    cancelAnimationFrame(recordingDrawFrame);
    if (recorder?.state === "recording") recorder.stop();
  };
}

function drawRecordingFrame(context, exportCanvas) {
  const sourceCanvas = map.getCanvas();
  context.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.drawImage(sourceCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
  recordingDrawFrame = requestAnimationFrame(() => drawRecordingFrame(context, exportCanvas));
}

function downloadStillFrame() {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  const exportCanvas = document.createElement("canvas");
  const exportSize = getExportSize();
  exportCanvas.width = exportSize.width;
  exportCanvas.height = exportSize.height;

  const context = exportCanvas.getContext("2d");
  context.drawImage(map.getCanvas(), 0, 0, exportCanvas.width, exportCanvas.height);

  const link = document.createElement("a");
  const slug = `${currentStory.id}-${els.formatSelect.value.replace(":", "x")}`;
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `${slug}-mapbox-still.png`;
  link.click();
  setStatus("PNG capturado", "Se descargo una imagen fija del frame actual.");
}

function getExportSize() {
  const format = els.formatSelect.value;
  if (format === "9:16") return { width: 1080, height: 1920 };
  if (format === "1:1") return { width: 1080, height: 1080 };
  return { width: 1920, height: 1080 };
}

function downloadRecording() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = `${currentStory.id}-${els.formatSelect.value.replace(":", "x")}`;
  link.href = url;
  link.download = `${slug}-mapbox-animation.webm`;
  link.click();
  URL.revokeObjectURL(url);
}

function getTimelineState(elapsed) {
  let cursor = 0;
  const shots = currentStory.shots;

  for (let index = 0; index < shots.length; index += 1) {
    const current = shots[index];
    const next = shots[index + 1] || current;
    const end = cursor + current.duration;

    if (elapsed <= end || index === shots.length - 1) {
      const localT = current.duration === 0 ? 1 : (elapsed - cursor) / current.duration;
      return { camera: interpolateShot(current, next, easeInOutCubic(clamp(localT, 0, 1))) };
    }

    cursor = end;
  }

  return { camera: shots[shots.length - 1] };
}

function getInitialCamera() {
  return applyGlobeSpin(currentStory.shots[0], 0);
}

function applyGlobeSpin(camera, progress) {
  if (!currentStory.globeSpin) return camera;

  const spin = currentStory.globeSpin;
  const targetCenter = currentStory.shots[currentStory.shots.length - 1].center;
  const spinProgress = easeOutQuad(clamp(progress / spin.stopProgress, 0, 1));
  const spinOffset = spin.startLngOffset * (1 - spinProgress);

  return {
    ...camera,
    center: [targetCenter[0] + spinOffset, targetCenter[1]]
  };
}

function interpolateShot(a, b, t) {
  return {
    center: [
      lerp(a.center[0], b.center[0], t),
      lerp(a.center[1], b.center[1], t)
    ],
    zoom: lerp(a.zoom, b.zoom, t),
    pitch: lerp(a.pitch, b.pitch, t),
    bearing: lerpAngle(a.bearing, b.bearing, t)
  };
}

function setMapCamera(camera) {
  map.jumpTo(camera);
}

function setControls(enabled) {
  els.previewButton.disabled = !enabled;
  els.recordButton.disabled = !enabled;
  els.stillButton.disabled = !enabled;
  els.saveTokenButton.disabled = !enabled;
}

function setStatus(title, text) {
  els.statusTitle.textContent = title;
  els.statusText.textContent = text;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;
}

function easeOutQuad(t) {
  return 1 - (1 - t) ** 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpAngle(a, b, t) {
  const delta = ((((b - a) % 360) + 540) % 360) - 180;
  return a + delta * t;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
