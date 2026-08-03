const MAPBOX_TOKEN_KEY = "mapbox-video-studio-token";
const NASA_CLOUD_SOURCE_ID = "nasa-blue-marble-clouds";
const NASA_CLOUD_LAYER_ID = "nasa-blue-marble-clouds-layer";
const NASA_CLOUD_TEXTURE = "./assets/nasa-blue-marble-clouds.jpg";
const ROUTE_SOURCE_ID = "director-route";
const ROUTE_HALO_LAYER_ID = "director-route-halo";
const ROUTE_LINE_LAYER_ID = "director-route-line";
const ROUTE_POINT_LAYER_ID = "director-route-points";
const ROUTE_LABEL_LAYER_ID = "director-route-labels";
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
const DEFAULT_ROUTE_COLOR_KEY = "map-orange";
const ROUTE_COLOR_PRESETS = {
  "map-orange": { line: "#ff3d00", glow: "#fff7e8" },
  "signal-blue": { line: "#4da3ff", glow: "#b9e5ff" },
  "electric-yellow": { line: "#fff200", glow: "#fffde0" },
  "mint-green": { line: "#30c7a3", glow: "#9affdf" },
  "documentary-white": { line: "#f7f1df", glow: "#ffffff" }
};
const DEFAULT_MAP_VIEW = {
  center: [-96, 36],
  zoom: 1.65,
  pitch: 0,
  bearing: 0
};
const LEGACY_ROUTE_COLOR_ALIASES = {
  "#ff6b00": DEFAULT_ROUTE_COLOR_KEY,
  "#ff9500": DEFAULT_ROUTE_COLOR_KEY,
  "#ff8a2a": DEFAULT_ROUTE_COLOR_KEY,
  "#ffe0a3": DEFAULT_ROUTE_COLOR_KEY,
  "#ffd08a": DEFAULT_ROUTE_COLOR_KEY
};
const EXPORT_RESOLUTIONS = {
  "1080p": {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
    square: { width: 1080, height: 1080 },
    bitrate: 12_000_000
  },
  "2k": {
    landscape: { width: 2560, height: 1440 },
    portrait: { width: 1440, height: 2560 },
    square: { width: 1440, height: 1440 },
    bitrate: 24_000_000
  },
  "4k": {
    landscape: { width: 3840, height: 2160 },
    portrait: { width: 2160, height: 3840 },
    square: { width: 2160, height: 2160 },
    bitrate: 45_000_000
  }
};
const DEFAULT_ANIMATION_BRIEF = {
  cameraMove: "follow",
  bearingMode: "north",
  pace: "smooth",
  durationSeconds: 18,
  ending: "hold"
};

const stories = [
  {
    id: "niagara-buffalo",
    location: "Tesla AC: Niagara Falls a Buffalo",
    episode: "1896 · energia desde EE.UU.",
    route: [
      [-79.04287, 43.08186],
      [-79.0025, 43.0632],
      [-78.9412, 43.0188],
      [-78.9048, 42.956],
      [-78.8784, 42.8864]
    ],
    routeLabels: [
      { label: "Tesla/Westinghouse AC · 1896 · 42 km aprox.", coordinate: [-78.955, 42.992] }
    ],
    showRouteInProject: true,
    showRoutePoints: false,
    showCityLabels: true,
    routeColorKey: DEFAULT_ROUTE_COLOR_KEY,
    routeLineColor: ROUTE_COLOR_PRESETS[DEFAULT_ROUTE_COLOR_KEY].line,
    routeGlowColor: ROUTE_COLOR_PRESETS[DEFAULT_ROUTE_COLOR_KEY].glow,
    shots: [
      { label: "Vista inclinada Niagara Falls a Buffalo", center: [-78.9606, 42.9841], zoom: 9.35, pitch: 42, bearing: 0, duration: 9000 },
      { label: "Cierre sin movimiento", center: [-78.9606, 42.9841], zoom: 9.35, pitch: 42, bearing: 0, duration: 0 }
    ]
  },
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
  mapContainer: document.querySelector("#map"),
  tokenInput: document.querySelector("#tokenInput"),
  tokenHelpText: document.querySelector("#tokenHelpText"),
  saveTokenButton: document.querySelector("#saveTokenButton"),
  projectModeButton: document.querySelector("#projectModeButton"),
  traceModeButton: document.querySelector("#traceModeButton"),
  exportModeButton: document.querySelector("#exportModeButton"),
  previewButton: document.querySelector("#previewButton"),
  recordButton: document.querySelector("#recordButton"),
  stillButton: document.querySelector("#stillButton"),
  proExportButton: document.querySelector("#proExportButton"),
  copyFfmpegButton: document.querySelector("#copyFfmpegButton"),
  loadProjectRouteButton: document.querySelector("#loadProjectRouteButton"),
  routeProfileSelect: document.querySelector("#routeProfileSelect"),
  routeColorSelect: document.querySelector("#routeColorSelect"),
  routeColorSwatch: document.querySelector("#routeColorSwatch"),
  calculateRoadRouteButton: document.querySelector("#calculateRoadRouteButton"),
  directRouteButton: document.querySelector("#directRouteButton"),
  routeTraceSummary: document.querySelector("#routeTraceSummary"),
  addPointButton: document.querySelector("#addPointButton"),
  undoPointButton: document.querySelector("#undoPointButton"),
  clearRouteButton: document.querySelector("#clearRouteButton"),
  generateRouteButton: document.querySelector("#generateRouteButton"),
  saveShotButton: document.querySelector("#saveShotButton"),
  storySelect: document.querySelector("#storySelect"),
  routeStorySelect: document.querySelector("#routeStorySelect"),
  routeSourceSummary: document.querySelector("#routeSourceSummary"),
  animationPromptInput: document.querySelector("#animationPromptInput"),
  cameraMoveSelect: document.querySelector("#cameraMoveSelect"),
  routeBearingModeSelect: document.querySelector("#routeBearingModeSelect"),
  paceSelect: document.querySelector("#paceSelect"),
  durationInput: document.querySelector("#durationInput"),
  endingSelect: document.querySelector("#endingSelect"),
  applyBriefButton: document.querySelector("#applyBriefButton"),
  copyBriefButton: document.querySelector("#copyBriefButton"),
  resetMapViewButton: document.querySelector("#resetMapViewButton"),
  formatSelect: document.querySelector("#formatSelect"),
  styleSelect: document.querySelector("#styleSelect"),
  lightSelect: document.querySelector("#lightSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  terrainSelect: document.querySelector("#terrainSelect"),
  objectsSelect: document.querySelector("#objectsSelect"),
  cloudSelect: document.querySelector("#cloudSelect"),
  boundarySelect: document.querySelector("#boundarySelect"),
  resolutionSelect: document.querySelector("#resolutionSelect"),
  fpsInput: document.querySelector("#fpsInput"),
  timelineInput: document.querySelector("#timelineInput"),
  timelineText: document.querySelector("#timelineText"),
  playPauseButton: document.querySelector("#playPauseButton"),
  stopPlaybackButton: document.querySelector("#stopPlaybackButton"),
  jumpStartButton: document.querySelector("#jumpStartButton"),
  jumpEndButton: document.querySelector("#jumpEndButton"),
  exportProgressText: document.querySelector("#exportProgressText"),
  stage: document.querySelector("#stage"),
  statusTitle: document.querySelector("#statusTitle"),
  statusText: document.querySelector("#statusText"),
  shotList: document.querySelector("#shotList"),
  routePointList: document.querySelector("#routePointList")
};

let map;
let mapReady = false;
let currentStory = stories[0];
let routePoints = [];
let routePath = [];
let routeLabels = [];
let routeDistanceMeters = 0;
let routeDurationSeconds = 0;
let routePathProfile = "direct";
let routeRevealProgress = 1;
let activeRouteColorKey = DEFAULT_ROUTE_COLOR_KEY;
let routeDraft = {
  points: [],
  path: [],
  labels: [],
  distanceMeters: 0,
  durationSeconds: 0,
  pathProfile: "direct"
};
let workMode = "trace";
let animationFrame = 0;
let isAnimating = false;
let isAnimationPaused = false;
let playbackMode = null;
let animationRunId = 0;
let currentTimelineElapsed = 0;
let recorder;
let recordedChunks = [];
let timelineFrame = 0;
let nasaCloudTexturePromise;

init();

function init() {
  stories.forEach((story) => {
    const option = document.createElement("option");
    option.value = story.id;
    option.textContent = `${story.location} - ${story.episode}`;
    els.storySelect.append(option);
    els.routeStorySelect.append(option.cloneNode(true));
  });

  const savedToken = localStorage.getItem(MAPBOX_TOKEN_KEY);
  updateTokenHelp(Boolean(savedToken));
  if (savedToken) {
    els.tokenInput.value = savedToken;
    createMap(savedToken);
  }

  renderStory();
  renderRoutePointList();
  updateRouteSourceSummary();
  updateRouteColorSwatch();
  syncRenderControlsFromStory();
  bindEvents();
  setWorkMode("trace");

  if (!savedToken) {
    showMissingTokenStatus();
  } else if (!mapReady) {
    setExportStatus("Cargando mapa", `Usando token guardado para ${getCurrentOriginLabel()}.`);
  }
}

function bindEvents() {
  els.saveTokenButton.addEventListener("click", () => {
    const token = els.tokenInput.value.trim();
    if (!token.startsWith("pk.")) {
      setStatus("Token incompleto", "Mapbox usa tokens publicos que normalmente empiezan con pk.");
      return;
    }

    localStorage.setItem(MAPBOX_TOKEN_KEY, token);
    updateTokenHelp(true);
    createMap(token);
  });

  els.projectModeButton.addEventListener("click", () => setWorkMode("project"));
  els.traceModeButton.addEventListener("click", () => setWorkMode("trace"));
  els.exportModeButton.addEventListener("click", () => setWorkMode("export"));
  els.previewButton.addEventListener("click", togglePreviewPlayback);
  els.recordButton.addEventListener("click", () => playAnimation(true));
  els.stillButton.addEventListener("click", downloadStillFrame);
  els.proExportButton.addEventListener("click", exportProfessionalFrames);
  els.copyFfmpegButton.addEventListener("click", copyFfmpegCommand);
  els.playPauseButton.addEventListener("click", togglePreviewPlayback);
  els.stopPlaybackButton.addEventListener("click", stopPlayback);
  els.jumpStartButton.addEventListener("click", jumpToTimelineStart);
  els.jumpEndButton.addEventListener("click", jumpToTimelineEnd);
  els.loadProjectRouteButton.addEventListener("click", loadRouteFromProject);
  els.routeStorySelect.addEventListener("change", updateRouteSourceSummary);
  els.routeColorSelect.addEventListener("change", applyRouteColorFromControls);
  els.cameraMoveSelect.addEventListener("change", applyRenderSettingsFromControls);
  els.routeBearingModeSelect.addEventListener("change", applyRenderSettingsFromControls);
  els.paceSelect.addEventListener("change", applyRenderSettingsFromControls);
  els.durationInput.addEventListener("change", applyRenderSettingsFromControls);
  els.endingSelect.addEventListener("change", applyRenderSettingsFromControls);
  els.calculateRoadRouteButton.addEventListener("click", calculateRouteWithDirections);
  els.directRouteButton.addEventListener("click", useDirectRoute);
  els.addPointButton.addEventListener("click", addRoutePointFromCenter);
  els.undoPointButton.addEventListener("click", undoRoutePoint);
  els.clearRouteButton.addEventListener("click", clearRoutePoints);
  els.generateRouteButton.addEventListener("click", generateAnimationFromRoute);
  els.saveShotButton.addEventListener("click", saveCurrentShot);
  els.applyBriefButton.addEventListener("click", applyAnimationBrief);
  els.copyBriefButton.addEventListener("click", copyAnimationBrief);
  els.resetMapViewButton.addEventListener("click", resetMapView);
  els.timelineInput.addEventListener("input", scrubTimeline);
  document.addEventListener("keydown", handleShortcut);
  els.lightSelect.addEventListener("change", applyBasemapLook);
  els.themeSelect.addEventListener("change", applyBasemapLook);
  els.terrainSelect.addEventListener("change", setTerrainMode);
  els.objectsSelect.addEventListener("change", applyBasemapLook);
  els.cloudSelect.addEventListener("change", setNasaCloudLayer);
  els.boundarySelect.addEventListener("change", setBoundaryVisibility);

  els.storySelect.addEventListener("change", () => {
    currentStory = getSelectedStory();
    syncRouteStorySelectionFromProject();
    syncRenderControlsFromStory();
    renderStory();
    jumpToFirstShot();
    setTimelineElapsed(0);
    setStatus("Proyecto cargado", "La pestaña Ruta no cambia hasta que uses Cargar ruta.");
  });

  els.styleSelect.addEventListener("change", () => {
    if (!map) return;
    map.setStyle(els.styleSelect.value);
  });

  els.formatSelect.addEventListener("change", () => {
    applyStageFormat();
  });
}

function showMissingTokenStatus() {
  const text = window.location.protocol === "file:"
    ? "Para exportar frames abre la app desde localhost. El selector de carpeta funciona mejor desde un servidor local."
    : `Este origen (${getCurrentOriginLabel()}) no tiene el token guardado. Pegalo aqui y pulsa Guardar token.`;

  setExportStatus("Token requerido", text);
}

function updateTokenHelp(hasToken) {
  if (hasToken) {
    els.tokenHelpText.textContent = `Token guardado para ${getCurrentOriginLabel()}.`;
    return;
  }

  if (window.location.protocol === "file:") {
    els.tokenHelpText.textContent = "Este token queda guardado solo para el archivo local. Para exportar, abre localhost y guardalo ahi tambien.";
    return;
  }

  els.tokenHelpText.textContent = `El token de file://, localhost u otro puerto no se comparte con ${getCurrentOriginLabel()}.`;
}

function getCurrentOriginLabel() {
  if (window.location.protocol === "file:") return "archivo local";
  return window.location.origin;
}

function applyStageFormat() {
  els.stage.className = `stage format-${els.formatSelect.value.replace(":", "-")}`;
  setTimeout(() => map?.resize(), 100);
}

function createMap(token) {
  if (!window.mapboxgl) {
    mapReady = false;
    setControls(true);
    setExportStatus("Mapbox GL no cargo", "Revisa internet o bloqueadores. Sin Mapbox cargado no se puede exportar.");
    return;
  }

  if (map) {
    map.remove();
  }

  const initialCamera = getInitialCamera();

  mapboxgl.accessToken = token;
  mapReady = false;

  try {
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
          showPlaceLabels: Boolean(currentStory.showCityLabels),
          showAdminBoundaries: false,
          show3dObjects: els.objectsSelect.value === "show"
        }
      }
    });
  } catch (error) {
    map = undefined;
    setControls(true);
    setExportStatus("No se pudo crear el mapa", error?.message || "Mapbox no pudo inicializar el visor.");
    return;
  }

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
  setWorkMode(workMode);
  setExportStatus("Cargando mapa", `Esperando Mapbox en ${getCurrentOriginLabel()}.`);
  map.on("click", handleMapClick);

  map.on("style.load", () => {
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
    ensureRouteLayers();
    syncStoryRouteOverlay();
  });

  map.on("load", () => {
    mapReady = true;
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
    ensureRouteLayers();
    syncStoryRouteOverlay();
    setControls(true);
    setStatus("Mapa listo", "Elige una historia, revisa la camara y graba un WebM para llevarlo a tu editor.");
  });

  map.on("error", (event) => {
    const message = event?.error?.message || "Revisa el token, internet o permisos del navegador.";
    mapReady = false;
    setControls(true);
    setExportStatus("Mapbox reporto un error", message);
  });
}

function setWorkMode(mode) {
  const nextMode = mode === "trace" ? "trace" : mode === "export" ? "export" : "project";
  const previousMode = workMode;
  if (previousMode === "trace" && nextMode !== "trace") {
    saveRouteDraftFromActiveRoute();
  }

  workMode = nextMode;
  document.body.dataset.workMode = nextMode;
  els.projectModeButton.classList.toggle("is-active", nextMode === "project");
  els.traceModeButton.classList.toggle("is-active", nextMode === "trace");
  els.exportModeButton.classList.toggle("is-active", nextMode === "export");
  els.projectModeButton.setAttribute("aria-pressed", String(nextMode === "project"));
  els.traceModeButton.setAttribute("aria-pressed", String(nextMode === "trace"));
  els.exportModeButton.setAttribute("aria-pressed", String(nextMode === "export"));

  if (nextMode === "trace" && previousMode !== "trace") {
    syncRouteStorySelectionFromProject();
    restoreRouteDraftToActiveRoute();
    renderRoutePointList();
    updateRouteTraceSummary();
    updateRouteLayer();
  } else if (nextMode === "project") {
    syncRenderControlsFromStory();
    syncStoryRouteOverlay();
    simplifyMapLabels();
  } else if (nextMode === "export") {
    syncStoryRouteOverlay();
    simplifyMapLabels();
  }

  if (map) {
    setMapInteractivity(nextMode === "trace", nextMode === "trace" ? "crosshair" : "");
  }

  setControls(!isAnimating);

  if (nextMode === "trace") {
    if (map) {
      setStatus("Ruta activada", "Marca puntos en orden, carga una ruta base o calcula vias antes de pasar a Render.");
    } else {
      setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox para empezar a trazar.");
    }
  } else if (nextMode === "export" && map) {
    setStatus("Exportar activado", "Elige resolucion, captura PNG, WebM o exporta frames profesionales.");
  } else if (nextMode === "export") {
    setStatus("Listo para configurar", "Pega tu token publico de Mapbox y guarda. Luego exporta el render activo.");
  } else if (map) {
    setStatus("Render activado", "Ajusta camara, orientacion, color y look antes de reproducir o exportar.");
  } else {
    setStatus("Listo para configurar", "Pega tu token publico de Mapbox y guarda. Luego prueba una ruta y graba el mapa animado.");
  }
}

function setMapInteractivity(enabled, cursor = "") {
  if (!map) return;

  setMapInteraction(map.scrollZoom, enabled);
  setMapInteraction(map.dragPan, enabled);
  setMapInteraction(map.dragRotate, enabled);
  setMapInteraction(map.touchZoomRotate, enabled);
  setMapInteraction(map.keyboard, enabled);
  setMapInteraction(map.doubleClickZoom, enabled);
  setMapInteraction(map.boxZoom, enabled);
  map.getCanvas().style.cursor = cursor;
}

function setMapInteraction(handler, enabled) {
  if (!handler) return;
  if (enabled) {
    handler.enable();
  } else {
    handler.disable();
  }
}

function handleMapClick(event) {
  if (!isTraceMode()) return;
  event.preventDefault();
  addRoutePoint([event.lngLat.lng, event.lngLat.lat]);
}

function loadRouteFromProject() {
  const selectedStory = getRouteSourceStory();
  if (!selectedStory.route?.length) {
    setStatus("Sin ruta base", "Este proyecto no tiene puntos de ruta para cargar.");
    return;
  }

  routePoints = getStoryGuidePoints(selectedStory);
  routePath = selectedStory.routeGuidePoints?.length ? selectedStory.route.map((point) => roundCoordinate(point)) : [];
  routeLabels = getStoryRouteLabels(selectedStory);
  routeDistanceMeters = routePath.length > 1 ? getRouteDistanceKm(routePath) * 1000 : 0;
  routeDurationSeconds = 0;
  routePathProfile = routePath.length > 1 ? selectedStory.routeProfile || "driving" : "direct";
  syncRouteProfileSelect(routePathProfile);
  syncRouteColorSelect(selectedStory.routeLineColor, selectedStory.routeColorKey);
  syncRouteBearingModeSelect(selectedStory.routeBearingMode);
  renderRoutePointList();
  updateRouteTraceSummary();
  rebuildRouteLayers();
  updateRouteLayer();
  setStatus("Ruta cargada", `Se cargaron ${routePoints.length} puntos guia de ${selectedStory.location}.`);
}

function addRoutePointFromCenter() {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  const center = map.getCenter();
  addRoutePoint([center.lng, center.lat]);
  setStatus("Centro agregado", "Se agrego como punto el centro actual de la camara.");
}

function addRoutePoint(coordinate) {
  ensureActiveRouteColorKey();
  routeLabels = [];
  clearCalculatedRoute();
  routePoints.push(roundCoordinate(coordinate));
  renderRoutePointList();
  updateRouteTraceSummary();
  updateRouteLayer();
  setStatus("Punto guia agregado", `${routePoints.length} punto${routePoints.length === 1 ? "" : "s"} en orden. Recalcula la ruta si ya tenias una por vias.`);
}

function undoRoutePoint() {
  if (routePoints.length === 0) {
    setStatus("Ruta vacia", "No hay puntos para deshacer.");
    return;
  }

  routePoints.pop();
  routeLabels = [];
  clearCalculatedRoute();
  renderRoutePointList();
  updateRouteTraceSummary();
  updateRouteLayer();
  setStatus("Punto guia eliminado", `${routePoints.length} punto${routePoints.length === 1 ? "" : "s"} en orden. La ruta calculada se limpio.`);
}

function clearRoutePoints() {
  resetRouteDraft();
  setStatus("Ruta limpia", "Haz click en el mapa para marcar puntos guia en orden.");
}

async function calculateRouteWithDirections() {
  if (!map || !mapReady) {
    setStatus("Mapa no listo", "Guarda el token y espera a que Mapbox cargue antes de calcular una ruta.");
    return;
  }

  if (!isTraceMode()) {
    setStatus("Cambia a Ruta", "La ruta por carretera se calcula desde los puntos guia de la pestaña Ruta.");
    return;
  }

  if (routePoints.length < 2) {
    setStatus("Faltan puntos", "Marca por lo menos origen y destino antes de calcular la ruta.");
    return;
  }

  if (routePoints.length > 25) {
    setStatus("Demasiados puntos", "Mapbox Directions acepta hasta 25 puntos guia por solicitud.");
    return;
  }

  const token = getMapboxToken();
  if (!token) {
    setStatus("Token requerido", "Guarda tu token publico de Mapbox para poder llamar Directions.");
    return;
  }

  const profile = els.routeProfileSelect.value || "driving";
  setControls(false);
  setStatus("Calculando ruta", `${getRouteProfileLabel(profile)} con ${routePoints.length} puntos guia.`);

  try {
    const route = await fetchMapboxDirections(routePoints, profile, token);
    routePath = route.coordinates.map((point) => roundCoordinate(point));
    routeDistanceMeters = route.distance || getRouteDistanceKm(routePath) * 1000;
    routeDurationSeconds = route.duration || 0;
    routePathProfile = profile;
    routeLabels = [];
    updateRouteLayer();
    renderRoutePointList();
    updateRouteTraceSummary();
    setStatus("Ruta calculada", `${getRouteProfileLabel(profile)} · ${formatDistanceKm(routeDistanceMeters / 1000)} · ${routePath.length} vertices.`);
  } catch (error) {
    setStatus("No se pudo calcular", error?.message || "Mapbox Directions no devolvio una ruta valida.");
  } finally {
    setControls(true);
  }
}

async function fetchMapboxDirections(points, profile, token) {
  const coordinates = points.map((point) => `${point[0]},${point[1]}`).join(";");
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`);
  url.search = new URLSearchParams({
    geometries: "geojson",
    overview: "full",
    steps: "false",
    access_token: token
  }).toString();

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.code !== "Ok") {
    throw new Error(data.message || `Mapbox Directions respondio ${response.status}.`);
  }

  const route = data.routes?.[0];
  const coordinatesResult = route?.geometry?.coordinates;
  if (!Array.isArray(coordinatesResult) || coordinatesResult.length < 2) {
    throw new Error("La respuesta no incluyo una geometria de ruta usable.");
  }

  return {
    coordinates: coordinatesResult,
    distance: route.distance,
    duration: route.duration
  };
}

function useDirectRoute() {
  if (routePoints.length < 2) {
    setStatus("Faltan puntos", "Marca por lo menos dos puntos para ver una linea directa.");
    return;
  }

  clearCalculatedRoute();
  updateRouteLayer();
  updateRouteTraceSummary();
  setStatus("Linea directa", "La ruta vuelve a unir los puntos guia sin seguir calles.");
}

function clearCalculatedRoute() {
  routePath = [];
  routeDistanceMeters = 0;
  routeDurationSeconds = 0;
  routePathProfile = "direct";
}

function saveRouteDraftFromActiveRoute() {
  routeDraft = {
    points: copyRouteCoordinates(routePoints),
    path: copyRouteCoordinates(routePath),
    labels: copyRouteLabels(routeLabels),
    distanceMeters: routeDistanceMeters,
    durationSeconds: routeDurationSeconds,
    pathProfile: routePathProfile
  };
}

function restoreRouteDraftToActiveRoute() {
  routePoints = copyRouteCoordinates(routeDraft.points);
  routePath = copyRouteCoordinates(routeDraft.path);
  routeLabels = copyRouteLabels(routeDraft.labels);
  routeDistanceMeters = routeDraft.distanceMeters;
  routeDurationSeconds = routeDraft.durationSeconds;
  routePathProfile = routeDraft.pathProfile || "direct";
  syncRouteProfileSelect(routePathProfile);
}

function copyRouteCoordinates(points) {
  return (points || []).map((point) => [...point]);
}

function copyRouteLabels(labels) {
  return (labels || []).map((routeLabel) => ({
    ...routeLabel,
    coordinate: [...routeLabel.coordinate],
    offset: routeLabel.offset ? [...routeLabel.offset] : undefined
  }));
}

function getMapboxToken() {
  return els.tokenInput.value.trim() || localStorage.getItem(MAPBOX_TOKEN_KEY) || "";
}

function generateAnimationFromRoute() {
  if (routePoints.length < 2) {
    setStatus("Faltan puntos", "Haz click en el mapa para marcar por lo menos dos puntos.");
    return;
  }

  ensureActiveRouteColorKey();
  const route = getActiveRoutePath().map((point) => [...point]);
  const guidePoints = routePoints.map((point) => [...point]);
  const labels = routeLabels.map((routeLabel) => ({ ...routeLabel, coordinate: [...routeLabel.coordinate] }));
  const selectedRouteColor = getRouteColorPreset(activeRouteColorKey);
  const routeLineColor = selectedRouteColor.line;
  const routeGlowColor = selectedRouteColor.glow;
  const showCityLabels = Boolean(currentStory.showCityLabels);
  const brief = getAnimationBriefSettings();
  syncBriefControls(brief);
  applyBriefLookHints(brief.prompt);
  const shots = createRouteShots(route, brief);
  currentStory = {
    id: "ruta-personalizada",
    location: "Ruta personalizada",
    episode: getGeneratedRouteEpisode(guidePoints, route, brief),
    route,
    routeGuidePoints: guidePoints,
    routeProfile: hasCalculatedRoute() ? routePathProfile : "direct",
    cameraMove: brief.cameraMove,
    routeBearingMode: brief.bearingMode,
    routeColorKey: activeRouteColorKey,
    routeReveal: true,
    routeLabels: labels,
    showRouteInProject: true,
    showRoutePoints: false,
    showCityLabels,
    routeLineColor,
    routeGlowColor,
    shots
  };

  syncProjectSelectWithCurrentStory();
  renderStory();
  updateRouteLayer();
  setWorkMode("project");
  setTimelineElapsed(0, true);
  setStatus("Ruta enviada a Render", `${getBearingModeLabel(brief.bearingMode)} · ruta revelada progresivamente.`);
}

function applyAnimationBrief() {
  if (!isRenderMode()) {
    setStatus("Cambia a Render", "La direccion creativa se aplica sobre el render activo.");
    return;
  }

  if (!currentStory.route?.length || currentStory.route.length < 2) {
    setStatus("Falta una ruta", "Traza por lo menos dos puntos y usa la ruta en Render.");
    return;
  }

  const brief = getAnimationBriefSettings({ includePromptHints: false });
  syncBriefControls(brief);
  applyBriefLookHints(brief.prompt);
  const route = currentStory.route.map((point) => [...point]);

  currentStory = {
    ...currentStory,
    animation: "keyframes",
    flyTo: null,
    globeSpin: null,
    route,
    cameraMove: brief.cameraMove,
    routeBearingMode: brief.bearingMode,
    shots: createRouteShots(route, brief)
  };

  syncProjectSelectWithCurrentStory();
  renderStory();
  updateRouteLayer();
  setTimelineElapsed(0, true);
  setStatus("Direccion aplicada", `${currentStory.shots.length} tomas · ${brief.durationSeconds}s · ${getCameraMoveLabel(brief.cameraMove)}.`);
}

function getAnimationBriefSettings({ includePromptHints = true } = {}) {
  const prompt = els.animationPromptInput.value.trim();
  const hints = includePromptHints ? getPromptBriefHints(prompt) : {};

  return {
    prompt,
    cameraMove: hints.cameraMove || getSelectedCameraMove() || DEFAULT_ANIMATION_BRIEF.cameraMove,
    bearingMode: hints.bearingMode || els.routeBearingModeSelect.value || DEFAULT_ANIMATION_BRIEF.bearingMode,
    pace: hints.pace || els.paceSelect.value || DEFAULT_ANIMATION_BRIEF.pace,
    durationSeconds: hints.durationSeconds || clamp(Number(els.durationInput.value) || DEFAULT_ANIMATION_BRIEF.durationSeconds, 6, 90),
    ending: hints.ending || els.endingSelect.value || DEFAULT_ANIMATION_BRIEF.ending
  };
}

function getSelectedCameraMove() {
  return els.cameraMoveSelect.value;
}

function getPromptBriefHints(prompt) {
  const text = normalizePromptText(prompt);
  const hints = {};
  const durationMatch = text.match(/(\d{1,2})\s*(s|seg|segundos|seconds)/);

  if (durationMatch) {
    hints.durationSeconds = clamp(Number(durationMatch[1]), 6, 90);
  }

  if (text.includes("cenital") || text.includes("top down") || text.includes("2d")) {
    hints.cameraMove = "topdown";
  } else if (text.includes("seguimiento") || text.includes("sobrevuelo") || text.includes("follow")) {
    hints.cameraMove = "follow";
  } else if (text.includes("globo") || text.includes("nasa") || text.includes("documental")) {
    hints.cameraMove = "globe";
  }

  if (text.includes("norte arriba") || text.includes("norte fijo") || text.includes("north up")) {
    hints.bearingMode = "north";
  } else if (text.includes("seguir ruta") || text.includes("orientacion de la ruta") || text.includes("ruta suave")) {
    hints.bearingMode = "route";
  }

  if (text.includes("rapido") || text.includes("dinamico")) {
    hints.pace = "fast";
  } else if (text.includes("lento") || text.includes("pausado") || text.includes("suave")) {
    hints.pace = text.includes("lento") || text.includes("pausado") ? "slow" : "smooth";
  }

  if (text.includes("vista general") || text.includes("overview")) {
    hints.ending = "overview";
  } else if (text.includes("ultimo punto")) {
    hints.ending = "last";
  } else if (text.includes("final fijo") || text.includes("toma fija") || text.includes("pausa")) {
    hints.ending = "hold";
  }

  return hints;
}

function syncBriefControls(brief) {
  setSelectValue(els.cameraMoveSelect, brief.cameraMove);
  setSelectValue(els.routeBearingModeSelect, brief.bearingMode || DEFAULT_ANIMATION_BRIEF.bearingMode);
  setSelectValue(els.paceSelect, brief.pace);
  setSelectValue(els.endingSelect, brief.ending);
  els.durationInput.value = String(brief.durationSeconds);
}

function syncRenderControlsFromStory() {
  const cameraMove = currentStory.route?.length
    ? getCameraMoveFromStory()
    : DEFAULT_ANIMATION_BRIEF.cameraMove;

  setSelectValue(els.cameraMoveSelect, cameraMove);
  setSelectValue(els.routeBearingModeSelect, currentStory.routeBearingMode || DEFAULT_ANIMATION_BRIEF.bearingMode);
  syncRouteColorSelect(currentStory.routeLineColor, currentStory.routeColorKey);
  els.durationInput.value = String(Math.round(getAnimationDuration() / 1000) || DEFAULT_ANIMATION_BRIEF.durationSeconds);
}

function getCameraMoveFromStory() {
  if (currentStory.cameraMove) return currentStory.cameraMove;
  if (currentStory.shots.every((shot) => shot.pitch === 0)) return "topdown";
  if (currentStory.globeSpin || currentStory.animation === "flyTo") return "globe";
  return DEFAULT_ANIMATION_BRIEF.cameraMove;
}

function applyBriefLookHints(prompt) {
  const text = normalizePromptText(prompt);

  if (text.includes("vertical") || text.includes("short") || text.includes("reel") || text.includes("tiktok")) {
    els.formatSelect.value = "9:16";
    applyStageFormat();
  } else if (text.includes("cuadrado") || text.includes("square")) {
    els.formatSelect.value = "1:1";
    applyStageFormat();
  } else if (text.includes("horizontal") || text.includes("youtube")) {
    els.formatSelect.value = "16:9";
    applyStageFormat();
  }

  if (text.includes("4k")) {
    els.resolutionSelect.value = "4k";
  } else if (text.includes("2k")) {
    els.resolutionSelect.value = "2k";
  }

  if (text.includes("oscuro") || text.includes("dark")) {
    setMapStyleValue("mapbox://styles/mapbox/dark-v11");
  } else if (text.includes("satelital") || text.includes("satellite") || text.includes("nasa")) {
    setMapStyleValue("mapbox://styles/mapbox/standard-satellite");
  }

  if (text.includes("sin nubes")) {
    els.cloudSelect.value = "off";
    setNasaCloudLayer();
  } else if (text.includes("nubes") || text.includes("nasa") || text.includes("cinematograf")) {
    els.cloudSelect.value = "cinematic";
    setNasaCloudLayer();
  }

  if (text.includes("sin relieve")) {
    els.terrainSelect.value = "off";
    setTerrainMode();
  } else if (text.includes("dramatic") || text.includes("dramatico") || text.includes("relieve") || text.includes("montana")) {
    els.terrainSelect.value = "dramatic";
    setTerrainMode();
  }
}

function copyAnimationBrief() {
  const briefText = buildAnimationBriefText();
  copyTextToClipboard(briefText)
    .then(() => {
      setStatus("Brief copiado", "Pegamelo en Codex cuando quieras que ajuste la animacion con mas detalle.");
    })
    .catch(() => {
      setStatus("No se pudo copiar", "El navegador bloqueo el portapapeles. Selecciona el texto del brief y copialo manualmente.");
    });
}

function copyFfmpegCommand() {
  copyTextToClipboard(getFfmpegCommand())
    .then(() => {
      setStatus("FFmpeg copiado", "El comando usa la secuencia frame_000001.png desde la carpeta exportada.");
    })
    .catch(() => {
      setStatus("No se pudo copiar", "El navegador bloqueo el portapapeles.");
    });
}

function getFfmpegCommand() {
  const fps = getExportFps();
  const slug = getExportSlug();

  return [
    "# MP4 H.264 de alta calidad",
    `ffmpeg -framerate ${fps} -i frame_%06d.png -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart ${slug}-pro.mp4`,
    "",
    "# Master ProRes 422 HQ",
    `ffmpeg -framerate ${fps} -i frame_%06d.png -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le ${slug}-prores.mov`
  ].join("\n");
}

function getExportMetadata(totalFrames, fps) {
  return JSON.stringify({
    project: currentStory.id,
    title: `${currentStory.location} - ${currentStory.episode}`,
    format: els.formatSelect.value,
    resolution: els.resolutionSelect.value,
    size: getExportSize(),
    fps,
    totalFrames,
    durationMs: getAnimationDuration(),
    ffmpeg: getFfmpegCommand()
  }, null, 2);
}

function buildAnimationBriefText() {
  const brief = getAnimationBriefSettings();
  const route = currentStory.route?.length ? currentStory.route : routePoints;

  return [
    "Mapbox Video Studio - brief de animacion",
    "",
    `Proyecto: ${currentStory.location} - ${currentStory.episode}`,
    `Formato: ${els.formatSelect.value}`,
    `Resolucion: ${els.resolutionSelect.value}`,
    `Duracion objetivo: ${brief.durationSeconds}s`,
    `Camara: ${getCameraMoveLabel(brief.cameraMove)}`,
    `Orientacion: ${getBearingModeLabel(brief.bearingMode)}`,
    `Ritmo: ${getPaceLabel(brief.pace)}`,
    `Final: ${getEndingLabel(brief.ending)}`,
    "",
    "Prompt:",
    brief.prompt || "(sin prompt libre)",
    "",
    "Ruta:",
    JSON.stringify(route, null, 2),
    "",
    "Tomas actuales:",
    JSON.stringify(currentStory.shots, null, 2)
  ].join("\n");
}

function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      textarea.remove();
    }
  });
}

function normalizePromptText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function setSelectValue(select, value) {
  if ([...select.options].some((option) => option.value === value)) {
    select.value = value;
  }
}

function setMapStyleValue(styleUrl) {
  if (els.styleSelect.value === styleUrl) return;
  els.styleSelect.value = styleUrl;
  if (map) map.setStyle(styleUrl);
}

function getCameraMoveLabel(cameraMove) {
  if (cameraMove === "follow") return "Inclinada estable";
  if (cameraMove === "topdown") return "Desde arriba";
  return "Globo a ruta";
}

function getBearingModeLabel(bearingMode) {
  if (bearingMode === "route") return "Seguir ruta suave";
  return "Norte arriba";
}

function getPaceLabel(pace) {
  if (pace === "slow") return "Lento";
  if (pace === "fast") return "Rapido";
  return "Suave";
}

function getEndingLabel(ending) {
  if (ending === "overview") return "Vista general";
  if (ending === "last") return "Ultimo punto";
  return "Toma fija";
}

function saveCurrentShot() {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  if (!isRenderMode()) {
    setStatus("Cambia a Render", "Las tomas se guardan sobre el render activo.");
    return;
  }

  const center = map.getCenter();
  const shots = currentStory.shots.map((shot) => ({ ...shot }));
  if (shots.length > 0 && shots[shots.length - 1].duration === 0) {
    shots[shots.length - 1].duration = 2600;
  }

  shots.push({
    label: `Toma ${shots.length + 1}`,
    center: roundCoordinate([center.lng, center.lat]),
    zoom: Number(map.getZoom().toFixed(2)),
    pitch: Number(map.getPitch().toFixed(0)),
    bearing: Number(map.getBearing().toFixed(0)),
    duration: 0
  });

  currentStory = {
    ...currentStory,
    animation: "keyframes",
    shots
  };

  renderStory();
  setTimelineElapsed(getAnimationDuration());
  setStatus("Toma guardada", "La vista actual se agrego al final de la animacion.");
}

function handleShortcut(event) {
  if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

  const key = event.key.toLowerCase();
  if (key === "r" && isTraceMode()) {
    event.preventDefault();
    loadRouteFromProject();
  } else if (key === "a" && isTraceMode()) {
    event.preventDefault();
    addRoutePointFromCenter();
  } else if (key === "z" && isTraceMode()) {
    event.preventDefault();
    undoRoutePoint();
  } else if (key === "x" && isTraceMode()) {
    event.preventDefault();
    clearRoutePoints();
  } else if (key === "d" && isTraceMode()) {
    event.preventDefault();
    calculateRouteWithDirections();
  } else if (key === "l" && isTraceMode()) {
    event.preventDefault();
    useDirectRoute();
  } else if (key === "g" && isTraceMode()) {
    event.preventDefault();
    generateAnimationFromRoute();
  } else if (key === "k" && isRenderMode()) {
    event.preventDefault();
    saveCurrentShot();
  } else if (key === "c" && isProjectMode()) {
    event.preventDefault();
    downloadStillFrame();
  } else if (event.key === "Enter" && isProjectMode()) {
    event.preventDefault();
    if (playbackMode === "preview" && isAnimating) {
      stopPlayback();
    } else {
      togglePreviewPlayback();
    }
  } else if (event.code === "Space" && isProjectMode()) {
    event.preventDefault();
    togglePreviewPlayback();
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLElement &&
    (target.matches("input, select, textarea") || target.isContentEditable);
}

function getSelectedStory() {
  return getStoryById(els.storySelect.value);
}

function getRouteSourceStory() {
  return getStoryById(els.routeStorySelect.value);
}

function getStoryById(id) {
  if (currentStory.id === id) return currentStory;
  return stories.find((story) => story.id === id) || stories[0];
}

function syncRouteStorySelectionFromProject() {
  if (stories.some((story) => story.id === els.storySelect.value)) {
    els.routeStorySelect.value = els.storySelect.value;
  }
  updateRouteSourceSummary();
}

function updateRouteSourceSummary() {
  const selectedStory = getRouteSourceStory();
  const points = selectedStory.route?.length || 0;
  els.routeSourceSummary.textContent = `Vas a cargar: ${selectedStory.location} - ${selectedStory.episode} · ${points} puntos`;
}

function syncProjectSelectWithCurrentStory() {
  let option = els.storySelect.querySelector(`option[value="${currentStory.id}"]`);
  if (!option) {
    option = document.createElement("option");
    option.value = currentStory.id;
    els.storySelect.append(option);
  }

  option.textContent = `${currentStory.location} - ${currentStory.episode}`;
  els.storySelect.value = currentStory.id;
}

function syncStoryRouteOverlay() {
  if (!isProjectMode()) return;

  if (shouldShowProjectRoute()) {
    routePoints = getStoryGuidePoints(currentStory);
    routePath = currentStory.routeGuidePoints?.length ? currentStory.route.map((point) => roundCoordinate(point)) : [];
    routeLabels = getStoryRouteLabels(currentStory);
  } else {
    routePoints = [];
    routePath = [];
    routeLabels = [];
  }

  routeDistanceMeters = routePath.length > 1 ? getRouteDistanceKm(routePath) * 1000 : 0;
  routeDurationSeconds = 0;
  routePathProfile = routePath.length > 1 ? currentStory.routeProfile || "driving" : "direct";
  syncRouteProfileSelect(routePathProfile);
  syncRouteColorSelect(currentStory.routeLineColor, currentStory.routeColorKey);
  syncRouteBearingModeSelect(currentStory.routeBearingMode);
  updateRouteTraceSummary();
  updateRouteLayer();
}

function shouldShowProjectRoute() {
  return Boolean(currentStory.showRouteInProject && currentStory.route?.length);
}

function shouldShowRoutePoints() {
  return isTraceMode() || currentStory.showRoutePoints !== false;
}

function getStoryRouteLabels(story) {
  return (story.routeLabels || []).map((routeLabel) => ({
    label: routeLabel.label,
    coordinate: roundCoordinate(routeLabel.coordinate),
    offset: routeLabel.offset || [0, -1.2]
  }));
}

function getStoryGuidePoints(story) {
  const points = story.routeGuidePoints?.length ? story.routeGuidePoints : story.route || [];
  return points.map((point) => roundCoordinate(point));
}

function syncRouteProfileSelect(profile) {
  if (profile === "direct") return;
  const option = els.routeProfileSelect.querySelector(`option[value="${profile}"]`);
  if (option) {
    els.routeProfileSelect.value = profile;
  }
}

function applyRenderSettingsFromControls() {
  ensureActiveRouteColorKey();
  updateRouteColorSwatch();

  if (!isProjectMode()) return;

  const brief = getAnimationBriefSettings();
  const selectedRouteColor = getSelectedRouteColorPreset();
  currentStory = {
    ...currentStory,
    routeLineColor: selectedRouteColor.line,
    routeGlowColor: selectedRouteColor.glow,
    routeColorKey: activeRouteColorKey,
    cameraMove: brief.cameraMove,
    routeBearingMode: brief.bearingMode
  };

  if (currentStory.route?.length > 1) {
    currentStory = {
      ...currentStory,
      animation: "keyframes",
      flyTo: null,
      globeSpin: null,
      routeReveal: currentStory.routeReveal ?? true,
      shots: createRouteShots(currentStory.route, brief)
    };
  }

  syncProjectSelectWithCurrentStory();
  renderStory();
  setTimelineElapsed(Math.min(currentTimelineElapsed, getAnimationDuration()), true);
  updateRouteLayer();
  setStatus("Render actualizado", `${getRouteColorLabel(els.routeColorSelect.value)} · ${getCameraMoveLabel(brief.cameraMove)} · ${getBearingModeLabel(brief.bearingMode)}.`);
}

function applyRouteColorFromControls() {
  const selectedRouteColorKey = els.routeColorSelect.value || DEFAULT_ROUTE_COLOR_KEY;
  activeRouteColorKey = ROUTE_COLOR_PRESETS[selectedRouteColorKey] ? selectedRouteColorKey : DEFAULT_ROUTE_COLOR_KEY;
  const selectedRouteColor = getRouteColorPreset(activeRouteColorKey);
  currentStory = {
    ...currentStory,
    routeLineColor: selectedRouteColor.line,
    routeGlowColor: selectedRouteColor.glow,
    routeColorKey: activeRouteColorKey
  };

  updateRouteColorSwatch();
  syncProjectSelectWithCurrentStory();
  rebuildRouteLayers();
  updateRouteLayer();
  setStatus("Color aplicado", `${getRouteColorLabel(activeRouteColorKey)} · ${selectedRouteColor.line}.`);
}

function updateRouteColorSelection() {
  updateRouteColorSwatch();
  updateRouteLayer();
}

function updateRouteColorSwatch() {
  const preset = getSelectedRouteColorPreset();
  els.routeColorSwatch.style.background = preset.line;
  els.routeColorSwatch.style.boxShadow = `0 0 0 2px ${preset.glow}, 0 0 18px ${preset.glow}`;
}

function getSelectedRouteColorPreset() {
  return getRouteColorPreset(els.routeColorSelect.value || activeRouteColorKey);
}

function getRouteColorPreset(colorKey) {
  return ROUTE_COLOR_PRESETS[colorKey] || ROUTE_COLOR_PRESETS[DEFAULT_ROUTE_COLOR_KEY];
}

function syncRouteColorSelect(lineColor, routeColorKey) {
  const colorKey = ROUTE_COLOR_PRESETS[routeColorKey] ? routeColorKey : getRouteColorKey(lineColor);
  activeRouteColorKey = colorKey;
  setSelectValue(els.routeColorSelect, colorKey);
  updateRouteColorSwatch();
}

function ensureActiveRouteColorKey() {
  if (!ROUTE_COLOR_PRESETS[activeRouteColorKey]) {
    activeRouteColorKey = DEFAULT_ROUTE_COLOR_KEY;
  }

  if (!ROUTE_COLOR_PRESETS[els.routeColorSelect.value]) {
    setSelectValue(els.routeColorSelect, activeRouteColorKey);
  }
}

function getRouteColorKey(lineColor) {
  const normalizedLineColor = String(lineColor || "").toLowerCase();
  if (LEGACY_ROUTE_COLOR_ALIASES[normalizedLineColor]) {
    return LEGACY_ROUTE_COLOR_ALIASES[normalizedLineColor];
  }

  const match = Object.entries(ROUTE_COLOR_PRESETS)
    .find(([, preset]) => preset.line.toLowerCase() === normalizedLineColor);
  return match?.[0] || DEFAULT_ROUTE_COLOR_KEY;
}

function getRouteColorLabel(colorKey) {
  const option = els.routeColorSelect.querySelector(`option[value="${colorKey}"]`);
  return option?.textContent || "Naranja mapa";
}

function syncRouteBearingModeSelect(bearingMode) {
  setSelectValue(els.routeBearingModeSelect, bearingMode || DEFAULT_ANIMATION_BRIEF.bearingMode);
}

function getActiveRoutePath() {
  return hasCalculatedRoute() ? routePath : routePoints;
}

function hasCalculatedRoute() {
  return routePath.length > 1;
}

function shouldRevealCurrentRoute() {
  const revealPlayback = playbackMode === "preview" || playbackMode === "record" || playbackMode === "export" || isAnimationPaused;
  return isProjectMode() && revealPlayback && Boolean(currentStory.routeReveal && currentStory.route?.length > 1);
}

function setRouteRevealForElapsed(elapsed, duration) {
  if (!shouldRevealCurrentRoute()) {
    setRouteRevealProgress(1);
    return;
  }

  if (duration <= 0) {
    setRouteRevealProgress(1);
    return;
  }

  setRouteRevealProgress(clamp(elapsed / (duration * 0.86), 0, 1));
}

function setRouteRevealProgress(progress) {
  const nextProgress = clamp(progress, 0, 1);
  if (Math.abs(routeRevealProgress - nextProgress) < 0.001) return;

  routeRevealProgress = nextProgress;
  updateRouteLayer();
}

function getGeneratedRouteEpisode(guidePoints, route, brief) {
  const distance = formatDistanceKm(getRouteDistanceKm(route));
  const mode = hasCalculatedRoute() ? getRouteProfileLabel(routePathProfile).toLowerCase() : "linea directa";
  return `${guidePoints.length} puntos guia · ${mode} · ${distance} · ${brief.durationSeconds}s`;
}

function updateRouteTraceSummary() {
  if (!els.routeTraceSummary) return;

  if (routePoints.length === 0) {
    els.routeTraceSummary.textContent = "Marca puntos guia con click sobre el mapa.";
    return;
  }

  if (routePoints.length === 1) {
    els.routeTraceSummary.textContent = "Marca un segundo punto para crear una ruta.";
    return;
  }

  if (hasCalculatedRoute()) {
    const duration = routeDurationSeconds ? ` · ${formatDurationMinutes(routeDurationSeconds)}` : "";
    els.routeTraceSummary.textContent = `${getRouteProfileLabel(routePathProfile)} · ${routePoints.length} puntos guia · ${formatDistanceKm(routeDistanceMeters / 1000)}${duration} · ${routePath.length} vertices`;
    return;
  }

  els.routeTraceSummary.textContent = `Linea directa · ${routePoints.length} puntos guia · ${formatDistanceKm(getRouteDistanceKm(routePoints))}`;
}

function getRouteProfileLabel(profile) {
  if (profile === "driving-traffic") return "Carretera + trafico";
  if (profile === "walking") return "Caminata";
  if (profile === "cycling") return "Bicicleta";
  return "Ruta por carretera";
}

function resetRouteDraft() {
  routePoints = [];
  clearCalculatedRoute();
  routeLabels = [];
  saveRouteDraftFromActiveRoute();
  renderRoutePointList();
  updateRouteTraceSummary();
  updateRouteLayer();
}

function renderRoutePointList() {
  els.routePointList.innerHTML = "";

  if (routePoints.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Sin puntos guia marcados";
    els.routePointList.append(item);
    return;
  }

  routePoints.forEach((point, index) => {
    const item = document.createElement("li");
    item.textContent = `${getRoutePointRole(index)} · ${point[1].toFixed(4)}, ${point[0].toFixed(4)}`;
    els.routePointList.append(item);
  });
}

function getRoutePointRole(index) {
  if (index === 0) return "Origen";
  if (index === routePoints.length - 1 && routePoints.length > 1) return "Final";
  return `Paso ${index}`;
}

function ensureRouteLayers() {
  if (!map || !map.isStyleLoaded()) return;

  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: getRouteGeoJson()
    });
  }

  if (!map.getLayer(ROUTE_LINE_LAYER_ID)) {
    if (!map.getLayer(ROUTE_HALO_LAYER_ID)) {
      map.addLayer({
        id: ROUTE_HALO_LAYER_ID,
        type: "line",
        slot: "top",
        source: ROUTE_SOURCE_ID,
        filter: ["==", ["geometry-type"], "LineString"],
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": getRouteCasingColor(),
          "line-width": 13,
          "line-opacity": 0.86,
          "line-blur": 0
        }
      });
    }

    map.addLayer({
      id: ROUTE_LINE_LAYER_ID,
      type: "line",
      slot: "top",
      source: ROUTE_SOURCE_ID,
      filter: ["==", ["geometry-type"], "LineString"],
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": getRouteLineColor(),
        "line-width": 8.5,
        "line-opacity": 1
      }
    });
  }

  if (!map.getLayer(ROUTE_POINT_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_POINT_LAYER_ID,
      type: "circle",
      slot: "top",
      source: ROUTE_SOURCE_ID,
      filter: ["all", ["==", ["geometry-type"], "Point"], ["!", ["has", "label"]], ["!=", ["get", "hidePoint"], true]],
      paint: {
        "circle-color": getRouteLineColor(),
        "circle-radius": 7.5,
        "circle-stroke-color": "#fff7d6",
        "circle-stroke-width": 2
      }
    });
  }

  if (!map.getLayer(ROUTE_LABEL_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_LABEL_LAYER_ID,
      type: "symbol",
      slot: "top",
      source: ROUTE_SOURCE_ID,
      filter: ["has", "label"],
      layout: {
        "text-field": ["get", "label"],
        "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        "text-size": 15,
        "text-offset": [0, -1.25],
        "text-allow-overlap": true,
        "text-ignore-placement": true
      },
      paint: {
        "text-color": "#f7f1df",
        "text-halo-color": "#071712",
        "text-halo-width": 1.8
      }
    });
  }

  prioritizeRouteLayers();
  updateRouteLayer();
}

function updateRouteLayer() {
  if (!map || !map.isStyleLoaded()) return;

  const source = map.getSource(ROUTE_SOURCE_ID);
  if (source) {
    source.setData(getRouteGeoJson());
    updateRoutePaint();
  } else {
    ensureRouteLayers();
  }
}

function rebuildRouteLayers() {
  if (!map || !map.isStyleLoaded()) return;

  [
    ROUTE_LABEL_LAYER_ID,
    ROUTE_POINT_LAYER_ID,
    ROUTE_LINE_LAYER_ID,
    ROUTE_HALO_LAYER_ID
  ].forEach((layerId) => {
    if (!map.getLayer(layerId)) return;

    try {
      map.removeLayer(layerId);
    } catch {
      // If a style swap is mid-flight, the next updateRouteLayer call will recreate what is missing.
    }
  });

  if (map.getSource(ROUTE_SOURCE_ID)) {
    try {
      map.removeSource(ROUTE_SOURCE_ID);
    } catch {
      // A retained source is fine; ensureRouteLayers will reuse it.
    }
  }

  ensureRouteLayers();
}

function updateRoutePaint() {
  if (!map || !map.isStyleLoaded()) return;

  const lineColor = getRouteLineColor();

  if (map.getLayer(ROUTE_LINE_LAYER_ID)) {
    map.setPaintProperty(ROUTE_LINE_LAYER_ID, "line-color", lineColor);
    map.setPaintProperty(ROUTE_LINE_LAYER_ID, "line-width", 8.5);
    map.setPaintProperty(ROUTE_LINE_LAYER_ID, "line-opacity", 1);
    map.setLayoutProperty(ROUTE_LINE_LAYER_ID, "line-cap", "round");
    map.setLayoutProperty(ROUTE_LINE_LAYER_ID, "line-join", "round");
    setOptionalPaintProperty(ROUTE_LINE_LAYER_ID, "line-emissive-strength", 2);
  }

  if (map.getLayer(ROUTE_HALO_LAYER_ID)) {
    map.setPaintProperty(ROUTE_HALO_LAYER_ID, "line-color", getRouteCasingColor());
    map.setPaintProperty(ROUTE_HALO_LAYER_ID, "line-width", 13);
    map.setPaintProperty(ROUTE_HALO_LAYER_ID, "line-opacity", 0.86);
    map.setPaintProperty(ROUTE_HALO_LAYER_ID, "line-blur", 0);
    setOptionalPaintProperty(ROUTE_HALO_LAYER_ID, "line-emissive-strength", 1.2);
  }

  if (map.getLayer(ROUTE_POINT_LAYER_ID)) {
    map.setPaintProperty(ROUTE_POINT_LAYER_ID, "circle-color", lineColor);
    map.setPaintProperty(ROUTE_POINT_LAYER_ID, "circle-radius", 7.5);
    map.setPaintProperty(ROUTE_POINT_LAYER_ID, "circle-stroke-color", "#fff7d6");
    map.setPaintProperty(ROUTE_POINT_LAYER_ID, "circle-stroke-width", 2);
  }

  prioritizeRouteLayers();
  map.triggerRepaint();
}

function getRouteCasingColor() {
  const colorKey = isTraceMode() ? activeRouteColorKey : currentStory.routeColorKey;
  if (colorKey === "map-orange" || colorKey === "electric-yellow") return "#fff7e8";
  if (colorKey === "documentary-white") return "#071712";
  return "#071712";
}

function setOptionalPaintProperty(layerId, property, value) {
  try {
    map.setPaintProperty(layerId, property, value);
  } catch {
    // Older/non-Standard styles may not expose every cinematic paint option.
  }
}

function prioritizeRouteLayers() {
  if (!map || !map.isStyleLoaded()) return;

  [
    ROUTE_HALO_LAYER_ID,
    ROUTE_LINE_LAYER_ID,
    ROUTE_POINT_LAYER_ID,
    ROUTE_LABEL_LAYER_ID
  ].forEach((layerId) => {
    if (!map.getLayer(layerId)) return;

    try {
      map.moveLayer(layerId);
    } catch {
      // Some style internals can reject moving between slots; layer slot still keeps it above the basemap.
    }
  });
}

function getRouteLineColor() {
  if (isTraceMode()) return getRouteColorPreset(activeRouteColorKey).line;
  return getNormalizedRouteLineColor(currentStory.routeLineColor, currentStory.routeColorKey);
}

function getRouteGlowColor() {
  if (isTraceMode()) return getRouteColorPreset(activeRouteColorKey).glow;
  return getNormalizedRouteGlowColor(currentStory.routeLineColor, currentStory.routeGlowColor, currentStory.routeColorKey);
}

function getNormalizedRouteLineColor(lineColor, routeColorKey) {
  const colorKey = ROUTE_COLOR_PRESETS[routeColorKey] ? routeColorKey : getRouteColorKey(lineColor);
  return ROUTE_COLOR_PRESETS[colorKey].line;
}

function getNormalizedRouteGlowColor(lineColor, glowColor, routeColorKey) {
  const colorKey = ROUTE_COLOR_PRESETS[routeColorKey] ? routeColorKey : getRouteColorKey(lineColor || glowColor);
  return ROUTE_COLOR_PRESETS[colorKey].glow;
}

function getRouteGeoJson() {
  const features = routePoints.map((point, index) => ({
    type: "Feature",
    properties: {
      index: index + 1,
      hidePoint: !shouldShowRoutePoints()
    },
    geometry: {
      type: "Point",
      coordinates: point
    }
  }));

  routeLabels.forEach((routeLabel) => {
    features.push({
      type: "Feature",
      properties: {
        label: routeLabel.label,
        offset: routeLabel.offset || [0, -1.2]
      },
      geometry: {
        type: "Point",
        coordinates: routeLabel.coordinate
      }
    });
  });

  const linePoints = getVisibleRouteCoordinates(getActiveRoutePath());
  if (linePoints.length > 1) {
    features.unshift({
      type: "Feature",
      properties: {
        lineColor: getRouteLineColor(),
        glowColor: getRouteGlowColor()
      },
      geometry: {
        type: "LineString",
        coordinates: linePoints
      }
    });
  }

  return {
    type: "FeatureCollection",
    features
  };
}

function getVisibleRouteCoordinates(points) {
  if (!shouldRevealCurrentRoute() || routeRevealProgress >= 0.999 || points.length < 2) {
    return points;
  }

  if (routeRevealProgress <= 0) {
    return [];
  }

  const totalDistance = getRouteDistanceKm(points);
  if (totalDistance === 0) {
    return points.slice(0, 2);
  }

  const targetDistance = totalDistance * routeRevealProgress;
  const visible = [points[0]];
  let traveled = 0;

  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const segmentDistance = getDistanceKm(from, to);

    if (traveled + segmentDistance <= targetDistance) {
      visible.push(to);
      traveled += segmentDistance;
      continue;
    }

    const segmentProgress = segmentDistance === 0 ? 0 : (targetDistance - traveled) / segmentDistance;
    visible.push(interpolateCoordinate(from, to, clamp(segmentProgress, 0, 1)));
    break;
  }

  return visible;
}

function createRouteShots(route, brief = DEFAULT_ANIMATION_BRIEF) {
  const bounds = getRouteBounds(route);
  const center = [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2
  ];
  const distance = getRouteDistanceKm(route);
  const cameraMove = brief.cameraMove || DEFAULT_ANIMATION_BRIEF.cameraMove;
  const bearingMode = brief.bearingMode || DEFAULT_ANIMATION_BRIEF.bearingMode;
  const routeZoom = getRouteZoom(distance) + getRouteZoomBoost(cameraMove);
  const rawRouteBearing = getPointBearing(route[0], route[route.length - 1]);
  const stableBearing = getCinematicRouteBearing(rawRouteBearing, bearingMode);
  const cameraRoute = getRouteCameraPoints(route, cameraMove);
  const cameras = [];

  if (cameraMove === "globe") {
    cameras.push({
      label: "Entrada desde el globo",
      center,
      zoom: clamp(routeZoom - 4.8, 1.55, 3.4),
      pitch: 0,
      bearing: stableBearing
    });
  }

  cameras.push({
    label: "Vista general",
    center,
    zoom: clamp(routeZoom - 0.85, 2.2, 10.8),
    pitch: cameraMove === "topdown" ? 0 : 34,
    bearing: cameraMove === "topdown" ? 0 : stableBearing
  });

  cameraRoute.forEach((point, index) => {
    const next = cameraRoute[index + 1] || cameraRoute[index];
    const isLastPoint = index === cameraRoute.length - 1;
    cameras.push({
      label: index === 0 ? "Inicio" : isLastPoint ? "Final" : `Tramo ${index + 1}`,
      center: point,
      zoom: cameraMove === "topdown" ? clamp(routeZoom + 0.2, 2.2, 15.5) : clamp(routeZoom, 2.2, 16),
      pitch: getRoutePitch(cameraMove),
      bearing: cameraMove === "topdown" ? 0 : isLastPoint ? stableBearing : getCinematicSegmentBearing(point, next, rawRouteBearing, stableBearing, bearingMode)
    });
  });

  if (brief.ending === "overview") {
    cameras.push({
      label: "Cierre vista general",
      center,
      zoom: clamp(routeZoom - 0.95, 2.2, 10.6),
      pitch: cameraMove === "topdown" ? 0 : 34,
      bearing: cameraMove === "topdown" ? 0 : stableBearing
    });
  } else if (brief.ending === "hold") {
    const lastCamera = cameras[cameras.length - 1];
    cameras.push({
      ...lastCamera,
      label: "Pausa final"
    });
  }

  const shots = cameras.map((camera) => ({ ...camera, duration: 0 }));
  applyShotDurations(shots, brief);
  return shots;
}

function getRouteCameraPoints(route, cameraMove) {
  const targetCount = cameraMove === "follow" ? 7 : 5;
  if (route.length <= targetCount) {
    return route.map((point) => [...point]);
  }

  return sampleRouteByDistance(route, targetCount);
}

function getRouteZoomBoost(cameraMove) {
  if (cameraMove === "topdown") return 0.45;
  if (cameraMove === "follow") return 0.9;
  return 0.65;
}

function getCinematicRouteBearing(rawBearing, bearingMode) {
  if (bearingMode === "route") {
    return lerpAngle(0, rawBearing, 0.72);
  }

  return 0;
}

function getCinematicSegmentBearing(from, to, routeBearing, stableBearing, bearingMode) {
  if (bearingMode !== "route") return stableBearing;

  const segmentBearing = getPointBearing(from, to);
  const localDelta = getAngleDelta(routeBearing, segmentBearing);
  const localCorrection = clamp(localDelta * 0.16, -14, 14);
  return stableBearing + localCorrection;
}

function getAngleDelta(from, to) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

function sampleRouteByDistance(route, targetCount) {
  const distances = [0];
  let totalDistance = 0;

  for (let index = 1; index < route.length; index += 1) {
    totalDistance += getDistanceKm(route[index - 1], route[index]);
    distances.push(totalDistance);
  }

  if (totalDistance === 0) {
    return [route[0], route[route.length - 1]].map((point) => [...point]);
  }

  const samples = [];
  let segmentIndex = 1;
  for (let sampleIndex = 0; sampleIndex < targetCount; sampleIndex += 1) {
    const targetDistance = totalDistance * (sampleIndex / (targetCount - 1));

    while (segmentIndex < distances.length - 1 && distances[segmentIndex] < targetDistance) {
      segmentIndex += 1;
    }

    const previousDistance = distances[segmentIndex - 1];
    const nextDistance = distances[segmentIndex];
    const segmentProgress = nextDistance === previousDistance ? 0 : (targetDistance - previousDistance) / (nextDistance - previousDistance);
    samples.push(interpolateCoordinate(route[segmentIndex - 1], route[segmentIndex], segmentProgress));
  }

  return samples;
}

function interpolateCoordinate(from, to, t) {
  return [
    lerp(from[0], to[0], t),
    lerp(from[1], to[1], t)
  ];
}

function getRoutePitch(cameraMove) {
  if (cameraMove === "topdown") return 0;
  if (cameraMove === "follow") return 62;
  return 56;
}

function applyShotDurations(shots, brief) {
  if (shots.length < 2) return;

  const totalDuration = clamp(Number(brief.durationSeconds) || DEFAULT_ANIMATION_BRIEF.durationSeconds, 6, 90) * 1000;
  const weights = shots.slice(0, -1).map((shot, index) => {
    if (brief.ending === "hold" && index === shots.length - 2) return 0.7;
    if (index === 0 && shot.label.includes("globo")) return 1.45;
    if (brief.pace === "fast") return index === 0 ? 0.8 : 1;
    if (brief.pace === "slow") return index === 0 ? 1.25 : 1.1;
    return 1;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let assignedDuration = 0;

  shots.forEach((shot, index) => {
    if (index === shots.length - 1) {
      shot.duration = 0;
      return;
    }

    const duration = Math.round(totalDuration * (weights[index] / totalWeight));
    shot.duration = duration;
    assignedDuration += duration;
  });

  shots[shots.length - 2].duration += totalDuration - assignedDuration;
}

function getRouteBounds(route) {
  return route.reduce((bounds, point) => ({
    minLng: Math.min(bounds.minLng, point[0]),
    maxLng: Math.max(bounds.maxLng, point[0]),
    minLat: Math.min(bounds.minLat, point[1]),
    maxLat: Math.max(bounds.maxLat, point[1])
  }), {
    minLng: route[0][0],
    maxLng: route[0][0],
    minLat: route[0][1],
    maxLat: route[0][1]
  });
}

function getRouteDistanceKm(route) {
  let total = 0;
  for (let index = 1; index < route.length; index += 1) {
    total += getDistanceKm(route[index - 1], route[index]);
  }
  return total;
}

function formatDistanceKm(distanceKm) {
  if (distanceKm >= 100) return `${Math.round(distanceKm)} km`;
  if (distanceKm >= 10) return `${distanceKm.toFixed(1)} km`;
  return `${distanceKm.toFixed(2)} km`;
}

function formatDurationMinutes(durationSeconds) {
  const totalMinutes = Math.max(1, Math.round(durationSeconds / 60));
  if (totalMinutes < 90) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}

function getRouteZoom(distance) {
  if (distance > 3000) return 4.2;
  if (distance > 1000) return 5.2;
  if (distance > 300) return 6.4;
  if (distance > 100) return 7.4;
  if (distance > 30) return 9.2;
  return 11.2;
}

function getPointBearing(from, to) {
  const lon1 = toRadians(from[0]);
  const lon2 = toRadians(to[0]);
  const lat1 = toRadians(from[1]);
  const lat2 = toRadians(to[1]);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function getDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(to[1] - from[1]);
  const lonDelta = toRadians(to[0] - from[0]);
  const lat1 = toRadians(from[1]);
  const lat2 = toRadians(to[1]);
  const a = Math.sin(latDelta / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function roundCoordinate(coordinate) {
  return [
    Number(coordinate[0].toFixed(6)),
    Number(coordinate[1].toFixed(6))
  ];
}

function simplifyMapLabels() {
  if (!map || !map.isStyleLoaded()) return;

  const shouldShowCityLabels = Boolean(currentStory.showCityLabels);
  setBasemapConfig("showPointOfInterestLabels", false);
  setBasemapConfig("showRoadLabels", false);
  setBasemapConfig("showTransitLabels", false);
  setBasemapConfig("showPlaceLabels", shouldShowCityLabels);

  const layers = map.getStyle().layers || [];
  layers.forEach((layer) => {
    if (layer.type === "symbol") {
      if (layer.id === ROUTE_LABEL_LAYER_ID) {
        map.setLayoutProperty(layer.id, "visibility", "visible");
        return;
      }

      const visibility = shouldShowCityLabels && isPlaceLabelLayer(layer) ? "visible" : "none";
      map.setLayoutProperty(layer.id, "visibility", visibility);
    }
  });
}

function isPlaceLabelLayer(layer) {
  const id = layer.id.toLowerCase();
  const sourceLayer = String(layer["source-layer"] || "").toLowerCase();
  return id.includes("place") ||
    id.includes("settlement") ||
    id.includes("city") ||
    id.includes("town") ||
    sourceLayer.includes("place") ||
    sourceLayer.includes("settlement");
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

      const cloudLayer = {
        id: NASA_CLOUD_LAYER_ID,
        type: "raster",
        source: NASA_CLOUD_SOURCE_ID,
        paint: {
          "raster-opacity": opacity,
          "raster-fade-duration": 0
        }
      };

      if (map.getLayer(ROUTE_LINE_LAYER_ID)) {
        map.addLayer(cloudLayer, ROUTE_LINE_LAYER_ID);
      } else {
        map.addLayer(cloudLayer);
      }
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
  syncStoryRouteOverlay();
  simplifyMapLabels();
  syncTimelineDuration();

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

function syncTimelineDuration() {
  const duration = getAnimationDuration();
  els.timelineInput.max = String(duration);
  els.timelineInput.value = "0";
  updateTimelineLabel(0, duration);
}

function scrubTimeline() {
  if (!isProjectMode()) {
    return;
  }

  if (playbackMode === "preview") {
    pausePlayback(false);
  }

  const elapsed = Number(els.timelineInput.value) || 0;
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(timelineFrame);
  map?.stop();
  isAnimating = false;
  setControls(true);
  setTimelineElapsed(elapsed, true);
}

function setTimelineElapsed(elapsed, shouldMoveCamera = false) {
  const duration = getAnimationDuration();
  const safeElapsed = clamp(elapsed, 0, duration);
  currentTimelineElapsed = safeElapsed;
  els.timelineInput.value = String(Math.round(safeElapsed));
  updateTimelineLabel(safeElapsed, duration);
  setRouteRevealForElapsed(safeElapsed, duration);

  if (shouldMoveCamera && map) {
    const camera = getCameraAtElapsed(safeElapsed, duration);
    map.jumpTo(camera);
  }
}

function updateTimelineLabel(elapsed, duration) {
  els.timelineText.textContent = `${formatTimelineTime(elapsed)} / ${formatTimelineTime(duration)}`;
}

function formatTimelineTime(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function togglePreviewPlayback() {
  if (playbackMode === "preview" && isAnimating) {
    pausePlayback();
    return;
  }

  const duration = getAnimationDuration();
  const startElapsed = isAnimationPaused
    ? currentTimelineElapsed
    : currentTimelineElapsed >= duration - 16 ? 0 : currentTimelineElapsed;
  playAnimation(false, startElapsed);
}

function pausePlayback(shouldAnnounce = true) {
  if (playbackMode !== "preview") return;

  animationRunId += 1;
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(timelineFrame);
  map?.stop();
  isAnimating = false;
  isAnimationPaused = true;
  playbackMode = null;
  setControls(true);
  updatePlaybackControls();

  if (shouldAnnounce) {
    setStatus("Vista previa en pausa", "Pulsa Reproducir para continuar o Detener para volver al inicio.");
  }
}

function stopPlayback(shouldAnnounce = true) {
  if (playbackMode && playbackMode !== "preview") return;

  animationRunId += 1;
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(timelineFrame);
  map?.stop();
  isAnimating = false;
  isAnimationPaused = false;
  playbackMode = null;
  setTimelineElapsed(0, true);
  setControls(true);
  updatePlaybackControls();

  if (shouldAnnounce) {
    setStatus("Vista previa detenida", "La animacion volvio al inicio.");
  }
}

function jumpToTimelineStart() {
  if (!isProjectMode()) return;
  pausePlayback(false);
  isAnimationPaused = false;
  setTimelineElapsed(0, true);
  updatePlaybackControls();
}

function jumpToTimelineEnd() {
  if (!isProjectMode()) return;
  pausePlayback(false);
  isAnimationPaused = false;
  setTimelineElapsed(getAnimationDuration(), true);
  updatePlaybackControls();
}

function updatePlaybackControls() {
  if (!els.playPauseButton) return;

  const label = playbackMode === "preview" && isAnimating
    ? "Pausar"
    : isAnimationPaused ? "Continuar" : "Reproducir";
  els.playPauseButton.textContent = label;
  els.previewButton.textContent = label === "Pausar" ? "Pausar vista" : label === "Continuar" ? "Continuar vista" : "Vista previa";
}

async function playAnimation(shouldRecord, startElapsed = 0) {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  if (!isProjectMode()) {
    setStatus("Cambia a Render", "El timeline y la vista previa se usan desde Render o Exportar.");
    return;
  }

  cancelAnimationFrame(animationFrame);
  map.stop();
  const runId = animationRunId + 1;
  animationRunId = runId;
  isAnimating = true;
  isAnimationPaused = false;
  playbackMode = shouldRecord ? "record" : "preview";
  setControls(false);
  updatePlaybackControls();
  setMapInteractivity(false);
  syncStoryRouteOverlay();
  ensureRouteLayers();
  updateRouteLayer();
  setTimelineElapsed(shouldRecord ? 0 : startElapsed, true);
  await wait(500);
  if (runId !== animationRunId) return;

  const duration = getAnimationDuration();
  if (shouldRecord) {
    await recordAnimation();
  } else {
    const startedAt = performance.now() - startElapsed;
    startTimelinePlayback(startedAt, duration);
    setStatus("Vista previa", `${Math.round(duration / 1000)} segundos de animacion.`);

    if (currentStory.animation === "flyTo") {
      await playNativeFlyToAnimation(duration);
    } else {
      await playKeyframeAnimation(startedAt, duration);
    }
  }

  if (runId !== animationRunId) return;

  cancelAnimationFrame(timelineFrame);
  setTimelineElapsed(duration);
  isAnimating = false;
  isAnimationPaused = false;
  playbackMode = null;
  setControls(true);
  updatePlaybackControls();
  setWorkMode(workMode);
  setStatus(shouldRecord ? "Grabacion finalizada" : "Vista previa finalizada", "Puedes ajustar la historia, el estilo o el formato y volver a grabar.");
}

async function exportProfessionalFrames() {
  if (!map) {
    setExportStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  if (!isProjectMode()) {
    setExportStatus("Cambia a Exportar", "La exportacion pro usa el render activo.");
    return;
  }

  if (window.location.protocol === "file:") {
    setExportStatus("Abre localhost", "Para exportar frames usa http://localhost con servidor local y guarda el token ahi una vez.");
    return;
  }

  if (typeof window.showDirectoryPicker !== "function") {
    setExportStatus("Exportacion pro no disponible", "Usa Chrome o Edge para guardar una secuencia PNG en una carpeta.");
    return;
  }

  const directory = await window.showDirectoryPicker({ mode: "readwrite" }).catch(() => null);
  if (!directory) {
    setExportStatus("Exportacion cancelada", "No se eligio una carpeta de destino.");
    return;
  }

  const exportSize = getExportSize();
  const fps = getExportFps();
  const duration = getAnimationDuration();
  const totalFrames = getExportFrameCount(duration, fps);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = exportSize.width;
  exportCanvas.height = exportSize.height;
  const context = exportCanvas.getContext("2d");
  const metadata = getExportMetadata(totalFrames, fps);

  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(timelineFrame);
  map.stop();
  isAnimating = true;
  playbackMode = "export";
  setControls(false);
  setMapInteractivity(false);
  let restoreStage = async () => {};
  let completionStatus = null;

  try {
    setExportStatus("Preparando exportacion pro", "Verificando permisos de escritura en la carpeta.");
    await wait(50);

    const hasWritePermission = await verifyDirectoryPermission(directory);
    if (!hasWritePermission) {
      completionStatus = ["Sin permiso de escritura", "Chrome/Edge no dio permiso para guardar PNGs en esa carpeta."];
      return;
    }

    setExportStatus("Carpeta lista", "Creando archivos de referencia para confirmar que el export arranco.");
    await writeTextFile(directory, "export-started.txt", buildExportStartedText(totalFrames, fps, exportSize));
    await writeTextFile(directory, "ffmpeg-command.txt", getFfmpegCommand());
    await writeTextFile(directory, "export-metadata.json", metadata);
    await wait(50);

    setExportStatus("Preparando mapa", `${exportSize.width} x ${exportSize.height}px · ${totalFrames} frames.`);
    restoreStage = await prepareStageForFrameExport(exportSize);
    syncStoryRouteOverlay();
    ensureRouteLayers();
    updateRouteLayer();
    await waitForMapRender();

    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
      const elapsed = getFrameElapsed(frameIndex, totalFrames, duration);
      const fileName = `frame_${String(frameIndex + 1).padStart(6, "0")}.png`;
      setExportStatus("Exportando frames PNG", `${frameIndex + 1} / ${totalFrames} · ${formatTimelineTime(elapsed)}`);
      setTimelineElapsed(elapsed);
      await renderExportFrame(elapsed, duration, context, exportCanvas);
      const blob = await canvasToBlob(exportCanvas, "image/png");
      await writeBlobFile(directory, fileName, blob);
    }

    setTimelineElapsed(duration, true);
    completionStatus = ["Frames exportados", `${totalFrames} PNGs listos. Usa ffmpeg-command.txt para crear el MP4.`];
  } catch (error) {
    console.error("Fallo exportacion pro", error);
    completionStatus = ["Fallo exportacion pro", error?.message || "El navegador no pudo completar la secuencia PNG."];
  } finally {
    isAnimating = false;
    playbackMode = null;
    try {
      await restoreStage();
    } catch (error) {
      console.error("No se pudo restaurar el visor despues del export", error);
      completionStatus = completionStatus || ["Exportacion interrumpida", "El navegador no pudo restaurar el visor despues del intento de export."];
    }

    setControls(true);
    if (map) {
      setMapInteractivity(isTraceMode(), isTraceMode() ? "crosshair" : "");
    }

    if (completionStatus) {
      setExportStatus(completionStatus[0], completionStatus[1]);
    }
  }
}

async function verifyDirectoryPermission(directory) {
  const options = { mode: "readwrite" };

  if (typeof directory.queryPermission === "function") {
    const currentPermission = await directory.queryPermission(options);
    if (currentPermission === "granted") return true;
  }

  if (typeof directory.requestPermission === "function") {
    return (await directory.requestPermission(options)) === "granted";
  }

  return true;
}

function buildExportStartedText(totalFrames, fps, exportSize) {
  return [
    "Exportacion Pro Mapbox",
    `Proyecto: ${currentStory.location}`,
    `Resolucion: ${exportSize.width}x${exportSize.height}`,
    `FPS: ${fps}`,
    `Frames esperados: ${totalFrames}`,
    "",
    "Si ves este archivo, la carpeta fue aceptada y el export empezo."
  ].join("\n");
}

async function prepareStageForFrameExport(exportSize) {
  const stageStyle = {
    width: els.stage.style.width,
    height: els.stage.style.height,
    maxHeight: els.stage.style.maxHeight,
    aspectRatio: els.stage.style.aspectRatio
  };
  const pixelRatio = window.devicePixelRatio || 1;

  els.stage.style.width = `${Math.round(exportSize.width / pixelRatio)}px`;
  els.stage.style.height = `${Math.round(exportSize.height / pixelRatio)}px`;
  els.stage.style.maxHeight = "none";
  els.stage.style.aspectRatio = "auto";
  map.resize();
  await waitForMapIdle(2500);
  await waitForMapRender();

  return async () => {
    els.stage.style.width = stageStyle.width;
    els.stage.style.height = stageStyle.height;
    els.stage.style.maxHeight = stageStyle.maxHeight;
    els.stage.style.aspectRatio = stageStyle.aspectRatio;
    map.resize();
    await waitForMapRender();
  };
}

async function renderExportFrame(elapsed, duration, context, exportCanvas) {
  setRouteRevealForElapsed(elapsed, duration);
  setMapCamera(getCameraAtElapsed(elapsed, duration));
  await waitForMapRender();
  await waitForMapIdle(900);
  await waitForMapRender();
  context.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.drawImage(map.getCanvas(), 0, 0, exportCanvas.width, exportCanvas.height);
}

function getExportFrameCount(duration, fps) {
  return Math.max(1, Math.round((duration / 1000) * fps));
}

function getFrameElapsed(frameIndex, totalFrames, duration) {
  if (totalFrames <= 1) return 0;
  return (frameIndex / (totalFrames - 1)) * duration;
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("No se pudo crear el PNG del frame."));
      }
    }, type);
  });
}

async function writeBlobFile(directory, fileName, blob) {
  const fileHandle = await directory.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function writeTextFile(directory, fileName, text) {
  return writeBlobFile(directory, fileName, new Blob([text], { type: "text/plain" }));
}

async function recordAnimation() {
  const recording = startRecording();
  const duration = getAnimationDuration();
  const startedAt = performance.now();

  startTimelinePlayback(startedAt, duration);
  setStatus("Grabando estable", "Capturando solo frames ya renderizados por Mapbox.");

  await playRecordedKeyframeAnimation(startedAt, duration, recording);
  await wait(300);
  recording.stop();
}

function playRecordedKeyframeAnimation(startedAt, duration, recording) {
  return new Promise((resolve) => {
    let lastCaptureAt = 0;
    const frameInterval = 1000 / recording.fps;

    const tick = async (now) => {
      const elapsed = Math.min(now - startedAt, duration);
      const shouldCapture = elapsed === duration ||
        lastCaptureAt === 0 ||
        now - lastCaptureAt >= frameInterval - 1;

      setMapCamera(getCameraAtElapsed(elapsed, duration));
      setRouteRevealForElapsed(elapsed, duration);

      if (shouldCapture) {
        await waitForMapRender();
        recording.drawFrame();
        lastCaptureAt = now;
      }

      if (elapsed < duration && isAnimating) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    animationFrame = requestAnimationFrame(tick);
  });
}

function getAnimationDuration() {
  return currentStory.shots.reduce((total, shot) => total + shot.duration, 0);
}

function playKeyframeAnimation(startedAt, duration) {
  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = Math.min(now - startedAt, duration);
      const camera = getCameraAtElapsed(elapsed, duration);
      setRouteRevealForElapsed(elapsed, duration);
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

function startTimelinePlayback(startedAt, duration) {
  cancelAnimationFrame(timelineFrame);

  const tick = (now) => {
    const elapsed = Math.min(now - startedAt, duration);
    setTimelineElapsed(elapsed);

    if (elapsed < duration && isAnimating) {
      timelineFrame = requestAnimationFrame(tick);
    }
  };

  timelineFrame = requestAnimationFrame(tick);
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
  const fps = getExportFps();
  const manualStream = exportCanvas.captureStream(0);
  const [manualTrack] = manualStream.getVideoTracks();
  const canRequestFrames = typeof manualTrack?.requestFrame === "function";
  const stream = canRequestFrames ? manualStream : exportCanvas.captureStream(fps);
  const [videoTrack] = stream.getVideoTracks();
  if (!canRequestFrames) manualTrack?.stop();
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  recordedChunks = [];
  recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: getExportBitrate() });
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };
  recorder.onstop = downloadRecording;
  recorder.start();

  return {
    fps,
    drawFrame: () => {
      drawRecordingFrame(context, exportCanvas);
      if (canRequestFrames) videoTrack.requestFrame();
    },
    stop: () => {
      if (recorder?.state === "recording") recorder.stop();
      videoTrack?.stop();
    }
  };
}

function drawRecordingFrame(context, exportCanvas) {
  const sourceCanvas = map.getCanvas();
  context.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.drawImage(sourceCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
}

function waitForMapRender() {
  if (!map) return Promise.resolve();

  return new Promise((resolve) => {
    let hasResolved = false;
    const fallback = setTimeout(finish, 120);

    function finish() {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(fallback);
      map.off("render", finish);
      resolve();
    }

    map.once("render", finish);
    map.triggerRepaint();
  });
}

function waitForMapIdle(timeoutMs = 1000) {
  if (!map) return Promise.resolve();

  return new Promise((resolve) => {
    let hasResolved = false;
    const fallback = setTimeout(finish, timeoutMs);

    function finish() {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(fallback);
      map.off("idle", finish);
      resolve();
    }

    map.once("idle", finish);
    map.triggerRepaint();
  });
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
  const slug = getExportSlug();
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `${slug}-mapbox-still.png`;
  link.click();
  setStatus("PNG capturado", "Se descargo una imagen fija del frame actual.");
}

function getExportSize() {
  const profile = getExportProfile();
  const format = els.formatSelect.value;
  if (format === "9:16") return profile.portrait;
  if (format === "1:1") return profile.square;
  return profile.landscape;
}

function getExportFps() {
  return clamp(Number(els.fpsInput.value) || 24, 24, 60);
}

function getExportBitrate() {
  return getExportProfile().bitrate;
}

function getExportProfile() {
  return EXPORT_RESOLUTIONS[els.resolutionSelect.value] || EXPORT_RESOLUTIONS["1080p"];
}

function getExportSlug() {
  return `${currentStory.id}-${els.formatSelect.value.replace(":", "x")}-${els.resolutionSelect.value}`;
}

function downloadRecording() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = getExportSlug();
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

function getCameraAtElapsed(elapsed, duration = getAnimationDuration()) {
  const timeline = getTimelineState(elapsed);
  return applyGlobeSpin(timeline.camera, duration === 0 ? 1 : elapsed / duration);
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

function resetMapView() {
  if (!map || !mapReady) {
    setStatus("Mapa no listo", "Guarda el token y espera a que Mapbox cargue antes de resetear la vista.");
    return;
  }

  if (playbackMode === "preview") {
    stopPlayback(false);
  }

  setTimelineElapsed(0);
  map.easeTo({
    ...DEFAULT_MAP_VIEW,
    duration: 900,
    essential: true
  });
  setStatus("Vista globo America", "Mapa reseteado con norte arriba, pitch cero y vista general de America.");
}

function setControls(enabled) {
  const renderMode = isRenderMode();
  const exportMode = isExportMode();
  const playbackModeAllowed = renderMode || exportMode;
  const traceMode = isTraceMode();
  const canUseMap = Boolean(map && mapReady);
  const previewActive = playbackMode === "preview";
  const playbackAvailable = playbackModeAllowed && canUseMap && (enabled || previewActive);
  els.previewButton.disabled = !playbackAvailable || !exportMode;
  els.playPauseButton.disabled = !playbackAvailable;
  els.stopPlaybackButton.disabled = !playbackModeAllowed || !canUseMap || playbackMode === "record" || playbackMode === "export";
  els.jumpStartButton.disabled = !playbackModeAllowed || !canUseMap || playbackMode === "record" || playbackMode === "export";
  els.jumpEndButton.disabled = !playbackModeAllowed || !canUseMap || playbackMode === "record" || playbackMode === "export";
  els.recordButton.disabled = !enabled || !exportMode || !canUseMap;
  els.stillButton.disabled = !enabled || !exportMode || !canUseMap;
  els.proExportButton.disabled = !enabled || !exportMode || !canUseMap;
  els.copyFfmpegButton.disabled = !enabled || !exportMode;
  els.animationPromptInput.disabled = !enabled || !renderMode;
  els.cameraMoveSelect.disabled = !enabled || !renderMode;
  els.paceSelect.disabled = !enabled || !renderMode;
  els.durationInput.disabled = !enabled || !renderMode;
  els.endingSelect.disabled = !enabled || !renderMode;
  els.applyBriefButton.disabled = !enabled || !renderMode;
  els.copyBriefButton.disabled = !enabled || !renderMode;
  els.resetMapViewButton.disabled = !enabled || !renderMode || !canUseMap;
  els.routeStorySelect.disabled = !enabled || !traceMode;
  els.loadProjectRouteButton.disabled = !enabled || !traceMode;
  els.routeProfileSelect.disabled = !enabled || !traceMode;
  els.routeColorSelect.disabled = !enabled || !renderMode;
  els.routeBearingModeSelect.disabled = !enabled || !renderMode;
  els.calculateRoadRouteButton.disabled = !enabled || !traceMode || !canUseMap;
  els.directRouteButton.disabled = !enabled || !traceMode;
  els.addPointButton.disabled = !enabled || !traceMode;
  els.undoPointButton.disabled = !enabled || !traceMode;
  els.clearRouteButton.disabled = !enabled || !traceMode;
  els.generateRouteButton.disabled = !enabled || !traceMode;
  els.saveShotButton.disabled = !enabled || !renderMode || !canUseMap;
  els.timelineInput.disabled = !enabled || !playbackModeAllowed || !canUseMap;
  els.projectModeButton.disabled = !enabled;
  els.traceModeButton.disabled = !enabled;
  els.exportModeButton.disabled = !enabled;
  els.saveTokenButton.disabled = !enabled;
}

function isProjectMode() {
  return isRenderMode() || isExportMode();
}

function isRenderMode() {
  return workMode === "project";
}

function isExportMode() {
  return workMode === "export";
}

function isTraceMode() {
  return workMode === "trace";
}

function setStatus(title, text) {
  els.statusTitle.textContent = title;
  els.statusText.textContent = text;
}

function setExportStatus(title, text) {
  setStatus(title, text);
  els.exportProgressText.textContent = `${title}: ${text}`;
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

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
