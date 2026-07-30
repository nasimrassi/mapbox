const MAPBOX_TOKEN_KEY = "mapbox-video-studio-token";

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
  storySelect: document.querySelector("#storySelect"),
  formatSelect: document.querySelector("#formatSelect"),
  styleSelect: document.querySelector("#styleSelect"),
  cloudSelect: document.querySelector("#cloudSelect"),
  fpsInput: document.querySelector("#fpsInput"),
  stage: document.querySelector("#stage"),
  cloudLayer: document.querySelector("#cloudLayer"),
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
let cloudDrawFrame = 0;
let cloudStartedAt = performance.now();

const clouds = [
  { x: 0.04, y: 0.12, size: 0.22, speed: 0.008, opacity: 0.28 },
  { x: 0.34, y: 0.2, size: 0.18, speed: 0.011, opacity: 0.2 },
  { x: 0.66, y: 0.1, size: 0.28, speed: 0.006, opacity: 0.24 },
  { x: 0.82, y: 0.34, size: 0.2, speed: 0.009, opacity: 0.18 },
  { x: 0.18, y: 0.48, size: 0.24, speed: 0.007, opacity: 0.16 }
];

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
  startCloudLoop();
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
  els.cloudSelect.addEventListener("change", () => drawCloudLayer());

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
        showPointOfInterestLabels: false,
        showRoadLabels: false,
        showTransitLabels: false,
        showPlaceLabels: false
      }
    }
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
  map.scrollZoom.disable();
  map.dragRotate.disable();

  map.on("style.load", () => {
    setGlobeAtmosphere();
    simplifyMapLabels();
  });

  map.on("load", () => {
    setGlobeAtmosphere();
    simplifyMapLabels();
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

function setGlobeAtmosphere() {
  if (typeof map?.setFog === "function") {
    map.setFog({});
  }
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

  if (els.cloudSelect.value !== "off") {
    drawCloudLayer(els.cloudLayer);
    context.drawImage(els.cloudLayer, 0, 0, exportCanvas.width, exportCanvas.height);
  }

  recordingDrawFrame = requestAnimationFrame(() => drawRecordingFrame(context, exportCanvas));
}

function startCloudLoop() {
  cancelAnimationFrame(cloudDrawFrame);
  const tick = () => {
    drawCloudLayer();
    cloudDrawFrame = requestAnimationFrame(tick);
  };
  tick();
}

function drawCloudLayer(targetCanvas = els.cloudLayer) {
  if (!targetCanvas) return;

  const cloudMode = els.cloudSelect.value;
  const rect = els.stage.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * pixelRatio));
  const height = Math.max(1, Math.round(rect.height * pixelRatio));

  if (targetCanvas.width !== width) targetCanvas.width = width;
  if (targetCanvas.height !== height) targetCanvas.height = height;

  const context = targetCanvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  if (cloudMode === "off") return;

  context.save();
  context.scale(pixelRatio, pixelRatio);
  context.filter = cloudMode === "cinematic" ? "blur(7px)" : "blur(4px)";

  const elapsed = (performance.now() - cloudStartedAt) / 1000;
  const intensity = cloudMode === "cinematic" ? 1.35 : 0.82;

  clouds.forEach((cloud, index) => {
    const drift = (cloud.x + elapsed * cloud.speed) % 1.2;
    const x = (drift - 0.1) * rect.width;
    const y = cloud.y * rect.height;
    const size = cloud.size * Math.min(rect.width, rect.height);
    drawCloud(context, x, y, size, cloud.opacity * intensity, index);
  });

  context.restore();
}

function drawCloud(context, x, y, size, opacity, seed) {
  const pieces = [
    [-0.45, 0.1, 0.56],
    [-0.16, -0.08, 0.72],
    [0.18, -0.02, 0.64],
    [0.48, 0.12, 0.48],
    [0.02, 0.2, 0.82]
  ];

  const gradient = context.createRadialGradient(x, y, size * 0.12, x, y, size * 0.88);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
  gradient.addColorStop(0.62, `rgba(255, 255, 255, ${opacity * 0.56})`);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  pieces.forEach(([offsetX, offsetY, radius], index) => {
    const wobble = Math.sin(seed * 9 + index * 1.7) * 0.03;
    context.beginPath();
    context.ellipse(
      x + offsetX * size,
      y + offsetY * size,
      size * (radius + wobble),
      size * radius * 0.38,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
  });
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
