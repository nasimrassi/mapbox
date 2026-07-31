const MAPBOX_TOKEN_KEY = "mapbox-video-studio-token";
const NASA_CLOUD_SOURCE_ID = "nasa-blue-marble-clouds";
const NASA_CLOUD_LAYER_ID = "nasa-blue-marble-clouds-layer";
const NASA_CLOUD_TEXTURE = "./assets/nasa-blue-marble-clouds.jpg";
const ROUTE_SOURCE_ID = "director-route";
const ROUTE_LINE_LAYER_ID = "director-route-line";
const ROUTE_POINT_LAYER_ID = "director-route-points";
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
  loadProjectRouteButton: document.querySelector("#loadProjectRouteButton"),
  addPointButton: document.querySelector("#addPointButton"),
  undoPointButton: document.querySelector("#undoPointButton"),
  clearRouteButton: document.querySelector("#clearRouteButton"),
  generateRouteButton: document.querySelector("#generateRouteButton"),
  saveShotButton: document.querySelector("#saveShotButton"),
  storySelect: document.querySelector("#storySelect"),
  formatSelect: document.querySelector("#formatSelect"),
  styleSelect: document.querySelector("#styleSelect"),
  lightSelect: document.querySelector("#lightSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  terrainSelect: document.querySelector("#terrainSelect"),
  objectsSelect: document.querySelector("#objectsSelect"),
  cloudSelect: document.querySelector("#cloudSelect"),
  boundarySelect: document.querySelector("#boundarySelect"),
  viewerModeSelect: document.querySelector("#viewerModeSelect"),
  resolutionSelect: document.querySelector("#resolutionSelect"),
  fpsInput: document.querySelector("#fpsInput"),
  timelineInput: document.querySelector("#timelineInput"),
  timelineText: document.querySelector("#timelineText"),
  stage: document.querySelector("#stage"),
  statusTitle: document.querySelector("#statusTitle"),
  statusText: document.querySelector("#statusText"),
  shotList: document.querySelector("#shotList"),
  routePointList: document.querySelector("#routePointList")
};

let map;
let currentStory = stories[0];
let routePoints = [];
let animationFrame = 0;
let isAnimating = false;
let recorder;
let recordedChunks = [];
let recordingDrawFrame = 0;
let timelineFrame = 0;
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
  renderRoutePointList();
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
  els.loadProjectRouteButton.addEventListener("click", loadRouteFromProject);
  els.addPointButton.addEventListener("click", addRoutePointFromCenter);
  els.undoPointButton.addEventListener("click", undoRoutePoint);
  els.clearRouteButton.addEventListener("click", clearRoutePoints);
  els.generateRouteButton.addEventListener("click", generateAnimationFromRoute);
  els.saveShotButton.addEventListener("click", saveCurrentShot);
  els.timelineInput.addEventListener("input", scrubTimeline);
  els.viewerModeSelect.addEventListener("change", setViewerMode);
  document.addEventListener("keydown", handleShortcut);
  els.lightSelect.addEventListener("change", applyBasemapLook);
  els.themeSelect.addEventListener("change", applyBasemapLook);
  els.terrainSelect.addEventListener("change", setTerrainMode);
  els.objectsSelect.addEventListener("change", applyBasemapLook);
  els.cloudSelect.addEventListener("change", setNasaCloudLayer);
  els.boundarySelect.addEventListener("change", setBoundaryVisibility);

  els.storySelect.addEventListener("change", () => {
    currentStory = getSelectedStory();
    renderStory();
    jumpToFirstShot();
    setTimelineElapsed(0);
    setStatus("Proyecto cargado", "La ruta de Trazo no cambia hasta que uses Cargar ruta del proyecto.");
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
  setViewerMode();
  map.on("click", handleMapClick);

  map.on("style.load", () => {
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
    ensureRouteLayers();
  });

  map.on("load", () => {
    setCleanAtmosphere();
    applyBasemapLook();
    setTerrainMode();
    simplifyMapLabels();
    setBoundaryVisibility();
    setNasaCloudLayer();
    ensureRouteLayers();
    setStatus("Mapa listo", "Elige una historia, revisa la camara y graba un WebM para llevarlo a tu editor.");
  });

  map.on("error", (event) => {
    const message = event?.error?.message || "Revisa el token, internet o permisos del navegador.";
    setStatus("Mapbox reporto un error", message);
  });
}

function setViewerMode() {
  if (!map) return;

  const mode = els.viewerModeSelect.value;
  const isDirector = mode === "director";
  setMapInteractivity(isDirector, isDirector ? "crosshair" : "");

  if (isDirector) {
    setStatus("Modo Trazo activado", "Haz click directo sobre el mapa para colocar puntos; usa Agregar centro solo si quieres marcar la camara.");
  } else {
    setStatus("Modo animacion activado", "El visor queda listo para timeline, vista previa y exportacion.");
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
  if (els.viewerModeSelect.value !== "director") return;
  event.preventDefault();
  addRoutePoint([event.lngLat.lng, event.lngLat.lat]);
}

function loadRouteFromProject() {
  const selectedStory = getSelectedStory();
  if (!selectedStory.route?.length) {
    setStatus("Sin ruta en proyecto", "Este proyecto no tiene puntos de ruta para cargar.");
    return;
  }

  routePoints = selectedStory.route.map((point) => roundCoordinate(point));
  renderRoutePointList();
  updateRouteLayer();
  setStatus("Ruta cargada", `Se cargaron ${routePoints.length} puntos de ${selectedStory.location}.`);
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
  routePoints.push(roundCoordinate(coordinate));
  renderRoutePointList();
  updateRouteLayer();
  setStatus("Punto agregado", `${routePoints.length} punto${routePoints.length === 1 ? "" : "s"} en la ruta.`);
}

function undoRoutePoint() {
  if (routePoints.length === 0) {
    setStatus("Ruta vacia", "No hay puntos para deshacer.");
    return;
  }

  routePoints.pop();
  renderRoutePointList();
  updateRouteLayer();
  setStatus("Punto eliminado", `${routePoints.length} punto${routePoints.length === 1 ? "" : "s"} en la ruta.`);
}

function clearRoutePoints() {
  resetRouteDraft();
  setStatus("Ruta limpia", "Haz click en el mapa para marcar nuevos puntos.");
}

function generateAnimationFromRoute() {
  if (routePoints.length < 2) {
    setStatus("Faltan puntos", "Haz click en el mapa para marcar por lo menos dos puntos.");
    return;
  }

  const route = routePoints.map((point) => [...point]);
  const shots = createRouteShots(route);
  currentStory = {
    id: "ruta-personalizada",
    location: "Ruta personalizada",
    episode: `${route.length} puntos`,
    route,
    shots
  };

  renderStory();
  updateRouteLayer();
  setTimelineElapsed(0, true);
  setStatus("Animacion generada", "Revisa el timeline, guarda tomas extra o exporta el video.");
}

function saveCurrentShot() {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
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
  if (key === "r") {
    event.preventDefault();
    loadRouteFromProject();
  } else if (key === "a") {
    event.preventDefault();
    addRoutePointFromCenter();
  } else if (key === "z") {
    event.preventDefault();
    undoRoutePoint();
  } else if (key === "x") {
    event.preventDefault();
    clearRoutePoints();
  } else if (key === "g") {
    event.preventDefault();
    generateAnimationFromRoute();
  } else if (key === "k") {
    event.preventDefault();
    saveCurrentShot();
  } else if (key === "c") {
    event.preventDefault();
    downloadStillFrame();
  } else if (event.code === "Space" && !isAnimating) {
    event.preventDefault();
    playAnimation(false);
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLElement &&
    (target.matches("input, select, textarea") || target.isContentEditable);
}

function getSelectedStory() {
  return stories.find((story) => story.id === els.storySelect.value) || stories[0];
}

function resetRouteDraft() {
  routePoints = [];
  renderRoutePointList();
  updateRouteLayer();
}

function renderRoutePointList() {
  els.routePointList.innerHTML = "";

  if (routePoints.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Sin puntos marcados";
    els.routePointList.append(item);
    return;
  }

  routePoints.forEach((point, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${point[1].toFixed(4)}, ${point[0].toFixed(4)}`;
    els.routePointList.append(item);
  });
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
    map.addLayer({
      id: ROUTE_LINE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      filter: ["==", ["geometry-type"], "LineString"],
      paint: {
        "line-color": "#ffca57",
        "line-width": 4,
        "line-opacity": 0.88
      }
    });
  }

  if (!map.getLayer(ROUTE_POINT_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_POINT_LAYER_ID,
      type: "circle",
      source: ROUTE_SOURCE_ID,
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-color": "#30c7a3",
        "circle-radius": 6,
        "circle-stroke-color": "#071712",
        "circle-stroke-width": 2
      }
    });
  }

  updateRouteLayer();
}

function updateRouteLayer() {
  if (!map || !map.isStyleLoaded()) return;

  const source = map.getSource(ROUTE_SOURCE_ID);
  if (source) {
    source.setData(getRouteGeoJson());
  } else {
    ensureRouteLayers();
  }
}

function getRouteGeoJson() {
  const features = routePoints.map((point, index) => ({
    type: "Feature",
    properties: { index: index + 1 },
    geometry: {
      type: "Point",
      coordinates: point
    }
  }));

  if (routePoints.length > 1) {
    features.unshift({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: routePoints
      }
    });
  }

  return {
    type: "FeatureCollection",
    features
  };
}

function createRouteShots(route) {
  const bounds = getRouteBounds(route);
  const center = [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2
  ];
  const distance = getRouteDistanceKm(route);
  const routeZoom = getRouteZoom(distance);
  const overviewBearing = getPointBearing(route[0], route[route.length - 1]) - 28;
  const shots = [
    {
      label: "Vista general",
      center,
      zoom: clamp(routeZoom - 2.1, 1.8, 7),
      pitch: 18,
      bearing: overviewBearing,
      duration: 2200
    }
  ];

  route.forEach((point, index) => {
    const next = route[index + 1] || route[index];
    shots.push({
      label: index === 0 ? "Inicio" : index === route.length - 1 ? "Final" : `Punto ${index + 1}`,
      center: point,
      zoom: routeZoom,
      pitch: 58,
      bearing: getPointBearing(point, next),
      duration: index === route.length - 1 ? 0 : 2600
    });
  });

  return shots;
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
  els.timelineInput.value = String(Math.round(safeElapsed));
  updateTimelineLabel(safeElapsed, duration);

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

async function playAnimation(shouldRecord) {
  if (!map) {
    setStatus("Falta el mapa", "Guarda primero tu token publico de Mapbox.");
    return;
  }

  cancelAnimationFrame(animationFrame);
  map.stop();
  isAnimating = true;
  setControls(false);
  setMapInteractivity(false);
  jumpToFirstShot();
  await wait(500);

  let stopRecording = () => {};
  if (shouldRecord) {
    stopRecording = startRecording();
  }

  const duration = getAnimationDuration();
  const startedAt = performance.now();
  startTimelinePlayback(startedAt, duration);
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

  cancelAnimationFrame(timelineFrame);
  setTimelineElapsed(duration);
  isAnimating = false;
  setControls(true);
  setViewerMode();
  setStatus(shouldRecord ? "Grabacion finalizada" : "Vista previa finalizada", "Puedes ajustar la historia, el estilo o el formato y volver a grabar.");
}

function getAnimationDuration() {
  return currentStory.shots.reduce((total, shot) => total + shot.duration, 0);
}

function playKeyframeAnimation(startedAt, duration) {
  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = Math.min(now - startedAt, duration);
      const camera = getCameraAtElapsed(elapsed, duration);
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
  const fps = clamp(Number(els.fpsInput.value) || 30, 24, 60);
  const stream = exportCanvas.captureStream(fps);
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

function setControls(enabled) {
  els.previewButton.disabled = !enabled;
  els.recordButton.disabled = !enabled;
  els.stillButton.disabled = !enabled;
  els.loadProjectRouteButton.disabled = !enabled;
  els.addPointButton.disabled = !enabled;
  els.undoPointButton.disabled = !enabled;
  els.clearRouteButton.disabled = !enabled;
  els.generateRouteButton.disabled = !enabled;
  els.saveShotButton.disabled = !enabled;
  els.timelineInput.disabled = !enabled;
  els.viewerModeSelect.disabled = !enabled;
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
