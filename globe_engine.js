/**
 * ══════════════════════════════════════════════════════════════════════════════
 * RUSSIA · SYRIA STRATEGIC AXIS — COMMAND CENTER 3D MAP ENGINE v5.0
 * Powered by MapLibre GL JS (High-Precision 2.5D/3D Tactical GIS)
 * 
 * Strict Anti-Slop & Command Center Architecture:
 * - 3 Zero-API-Key Cartographic Tiers (Zero Watermarks, 100% Free):
 *     1. ESRI World Dark Gray Base (Clean, high-contrast command center NOC)
 *     2. ESRI World Imagery (Sub-meter photorealistic satellite detail)
 *     3. OSM Detailed Streets & Hydrography (Full road/harbor/city labels)
 * - Complete 11-Vector Strategic Corridors Network:
 *     Air bridges, Maritime oil/grain/fleet corridors, Coastal defensive arc,
 *     Damascus highway axis, African transit vector, Secure diplo comms.
 * - Dynamic Interactive Corridor Selection & Bounding Box Framing:
 *     Clicking any line highlights connected nodes, pulses line glow,
 *     and opens operational dossier.
 * - Pixel-Perfect Zero-Dimension Anchor Pins:
 *     Centered at (0,0) geographic coordinates with directional anti-collision tooltips.
 * ══════════════════════════════════════════════════════════════════════════════
 */
'use strict';

(function(root) {
  let map = null;
  let activeNodeId = null;
  let activeCorridorId = null;
  let currentBasemap = 'dark';
  let isRotating = false;
  let rotationTimer = null;

  // Crisp, single-weight vector SVG glyphs (Anti-Slop Design compliant)
  const SVG_ICONS = {
    anchor: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M9 18l3 3 3-3"/></svg>',
    jet: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9H2l7 5-3 8 6-4 6 4-3-8 7-5h-7z"/></svg>',
    embassy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z"/></svg>',
    fuel: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>',
    vessel: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l2 3h16l2-3-4-8H6z"/><path d="M8 9V4h8v5"/><path d="M12 4v5"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };

  /**
   * Strategic Node Positions & Anti-Collision Offsets
   * Exact Geographic Coordinates: [Longitude, Latitude]
   */
  const NODE_LOCATIONS = {
    tartus: {
      center: [35.8866, 34.8958], // Naval Training Center / 720th Logistics Point
      zoom: 14.2,
      pitch: 45,
      bearing: -20,
      iconKey: 'anchor',
      tag: 'NAVAL HUB',
      name: 'Tartus Naval Training Center',
      color: '#38bdf8',
      dir: 'dir-west'
    },
    baniyas: {
      center: [35.9421, 35.1842], // Oil Terminal & Refinery
      zoom: 13.5,
      pitch: 35,
      bearing: 0,
      iconKey: 'fuel',
      tag: 'CRUDE OIL & REFINERY',
      name: 'Baniyas Petroleum Terminal',
      color: '#10b981',
      dir: 'dir-east'
    },
    khmeimim: {
      center: [35.9492, 35.4097], // Khmeimim Air Base
      zoom: 13.8,
      pitch: 40,
      bearing: 10,
      iconKey: 'jet',
      tag: 'AEROSPACE HUB',
      name: 'Khmeimim Aerospace Center',
      color: '#f87171',
      dir: 'dir-west'
    },
    latakia: {
      center: [35.7891, 35.5317], // Port of Latakia
      zoom: 13.2,
      pitch: 35,
      bearing: -15,
      iconKey: 'vessel',
      tag: 'GRAIN PORT',
      name: 'Port of Latakia (Grain Terminal)',
      color: '#34d399',
      dir: 'dir-east'
    },
    damascus: {
      center: [36.2765, 33.5138], // Russian Embassy in Damascus
      zoom: 14.5,
      pitch: 45,
      bearing: -15,
      iconKey: 'embassy',
      tag: 'RUSSIAN EMBASSY',
      name: 'Russian Embassy (Damascus)',
      color: '#c084fc',
      dir: 'dir-east'
    },
    novorossiysk: {
      center: [37.7780, 44.7240], // Port of Novorossiysk (Sheskharis)
      zoom: 12.8,
      pitch: 35,
      bearing: -10,
      iconKey: 'vessel',
      tag: 'SHESKHARIS PORT',
      name: 'Port of Novorossiysk',
      color: '#fbbf24',
      dir: 'dir-west'
    },
    moscow: {
      center: [37.6008, 55.7432], // Moscow / MFA Russia / Syrian Embassy
      zoom: 12.2,
      pitch: 30,
      bearing: 0,
      iconKey: 'star',
      tag: 'RUSSIAN CAPITAL',
      name: 'Moscow · MFA & Syrian Embassy',
      color: '#38bdf8',
      dir: 'dir-east'
    },
    sevastopol: {
      center: [33.5224, 44.6166], // Sevastopol Naval Base
      zoom: 12.5,
      pitch: 35,
      bearing: -10,
      iconKey: 'anchor',
      tag: 'BLACK SEA FLEET',
      name: 'Sevastopol Naval Base',
      color: '#60a5fa',
      dir: 'dir-east'
    },
    libya_hub: {
      center: [20.0667, 32.1167], // Benghazi Forward Staging Base
      zoom: 11.5,
      pitch: 30,
      bearing: 0,
      iconKey: 'jet',
      tag: 'NORTH AFRICA HUB',
      name: 'Benghazi Forward Base (Libya)',
      color: '#f97316',
      dir: 'dir-east'
    },
    sahel_hub: {
      center: [-0.0447, 16.2717], // Gao / Sahel Central Operations Hub, Mali
      zoom: 10.5,
      pitch: 28,
      bearing: 0,
      iconKey: 'jet',
      tag: 'SAHEL HUB (MALI)',
      name: 'Sahel Central Base (Gao, Mali)',
      color: '#ea580c',
      dir: 'dir-east'
    }
  };

  const isSmallScreen = (typeof window !== 'undefined' && window.innerWidth < 850);
  const PRESETS = {
    axis: {
      center: isSmallScreen ? [36.0, 36.5] : [35.0, 44.0],
      zoom: isSmallScreen ? 4.8 : 3.3,
      pitch: isSmallScreen ? 18 : 22,
      bearing: 0
    },
    levant: {
      center: [36.0, 34.7],
      zoom: 7.9,
      pitch: 35,
      bearing: -10
    },
    corridors: {
      center: [32.0, 41.5],
      zoom: 4.4,
      pitch: 28,
      bearing: -8
    },
    moscow: {
      center: [37.60, 55.75],
      zoom: 9.5,
      pitch: 30,
      bearing: 0
    },
    maritime: {
      center: [31.5, 39.5],
      zoom: 5.3,
      pitch: 26,
      bearing: -12
    },
    africa: {
      center: [15.0, 24.0],
      zoom: 3.2,
      pitch: 20,
      bearing: 0
    }
  };

  /**
   * Main Initialize Function
   */
  function initEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (typeof maplibregl === 'undefined') {
      console.error('MapLibre GL not detected.');
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-family:sans-serif;font-size:14px;">Loading map engine...</div>';
      return;
    }

    try {
      initMapLibreGlobe(container);
    } catch (err) {
      console.error('MapLibre initialization error:', err);
    }
  }

  function initMapLibreGlobe(container) {
    map = new maplibregl.Map({
      container: container,
      style: {
        version: 8,
        sources: {
          'esri-dark': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap'
          },
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '&copy; Esri &copy; Maxar'
          },
          'osm-streets': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#060b18'
            }
          },
          {
            id: 'base-dark',
            type: 'raster',
            source: 'esri-dark',
            layout: { visibility: 'visible' },
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'base-satellite',
            type: 'raster',
            source: 'esri-satellite',
            layout: { visibility: 'none' },
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'base-streets',
            type: 'raster',
            source: 'osm-streets',
            layout: { visibility: 'none' },
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: PRESETS.axis.center,
      zoom: PRESETS.axis.zoom,
      pitch: PRESETS.axis.pitch,
      bearing: PRESETS.axis.bearing,
      attributionControl: false
    });

    // Auto-resize listeners for mobile viewport stability
    window.addEventListener('resize', () => { if (map) map.resize(); }, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => { if (map) map.resize(); }, 150);
      setTimeout(() => { if (map) map.resize(); }, 500);
    }, { passive: true });

    map.on('load', () => {
      map.resize();
      setupGeoJsonLayers();
      setupTacticalMarkers(container);
      setupZoomLOD(container);
      setTimeout(() => { if (map) map.resize(); }, 250);
    });
  }

  /**
   * Monitor Zoom to toggle Level of Detail (LOD)
   */
  function setupZoomLOD(container) {
    const updateLOD = () => {
      const z = map.getZoom();
      if (z >= 6.4) {
        container.classList.add('lod-theater');
      } else {
        container.classList.remove('lod-theater');
      }
    };
    map.on('zoom', updateLOD);
    updateLOD();
  }

  /**
   * Add Sovereign 2026 Borders and Full Corridors Network
   */
  function setupGeoJsonLayers() {
    // 0. Global Sovereign Landmass & Borders (Zero-Tile Offline Vector Underlay)
    const worldGeo = window.WORLD_VECTOR;
    if (worldGeo) {
      map.addSource('world-vector-source', {
        type: 'geojson',
        data: worldGeo
      });

      // Tactical command-center continent fill (guarantees land is never pitch black)
      map.addLayer({
        id: 'world-land-fill',
        type: 'fill',
        source: 'world-vector-source',
        paint: {
          'fill-color': '#0d182e',
          'fill-opacity': 0.95
        }
      });

      // Sovereign country boundary borders
      map.addLayer({
        id: 'world-country-borders',
        type: 'line',
        source: 'world-vector-source',
        paint: {
          'line-color': '#1e385c',
          'line-width': 0.8,
          'line-opacity': 0.7
        }
      });
    }

    const geo = window.GEO_2026;
    if (!geo) return;

    // 1. Russian Federation 2026 Sovereign Territory (All 89 Constitutional Subjects)
    if (geo.russia) {
      map.addSource('rf-2026-borders', {
        type: 'geojson',
        data: { type: 'Feature', geometry: geo.russia }
      });

      map.addLayer({
        id: 'rf-borders-fill',
        type: 'fill',
        source: 'rf-2026-borders',
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.12
        }
      });

      map.addLayer({
        id: 'rf-borders-line',
        type: 'line',
        source: 'rf-2026-borders',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 1.6,
          'line-opacity': 0.95
        }
      });
    }

    // 2. Syrian Arab Republic Sovereign Territory (including Golan Heights)
    if (geo.syria) {
      map.addSource('syria-2026-borders', {
        type: 'geojson',
        data: { type: 'Feature', geometry: geo.syria }
      });

      map.addLayer({
        id: 'syria-borders-fill',
        type: 'fill',
        source: 'syria-2026-borders',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.18
        }
      });

      map.addLayer({
        id: 'syria-borders-line',
        type: 'line',
        source: 'syria-2026-borders',
        paint: {
          'line-color': '#34d399',
          'line-width': 2.2,
          'line-opacity': 0.98
        }
      });
    }

    // 3. Dynamic Rendering of ALL 11 Strategic Corridors
    if (geo.corridors && Array.isArray(geo.corridors)) {
      geo.corridors.forEach(c => {
        const sourceId = `src-corridor-${c.id}`;
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { id: c.id, name: c.name, category: c.category, color: c.color },
            geometry: {
              type: 'LineString',
              coordinates: c.coordinates
            }
          }
        });

        // Category-Specific High-Contrast Dash Patterns (Aviation, Nautical, Telemetry)
        let dashArray;
        if (c.category === 'air') {
          // Strategic Air Bridge: crisp aviation airway dashes with wide gaps
          dashArray = [4, 3];
        } else if (c.category === 'sea') {
          // Maritime Shipping Lanes: nautical segmented route dashes
          dashArray = [6, 4];
        } else if (c.category === 'diplo') {
          // Encrypted Government Communications / Diplomatic Air Corridor: high-freq telemetry pulse
          dashArray = [2, 3];
        } else if (c.category === 'transit') {
          // Transcontinental African Strategic Axis: long segmented vector
          dashArray = [7, 4];
        } else if (c.category === 'tactical') {
          // Coastal Defense & Pipelines: structured tactical links
          dashArray = [4, 3];
        }

        // 3a. Outer Atmospheric Glow Layer (Synchronized with dash array!)
        const glowPaint = {
          'line-color': c.color || '#38bdf8',
          'line-width': 3.6,
          'line-opacity': 0.35,
          'line-blur': 0.8
        };
        if (dashArray) {
          glowPaint['line-dasharray'] = dashArray;
        }

        map.addLayer({
          id: `layer-glow-${c.id}`,
          type: 'line',
          source: sourceId,
          paint: glowPaint
        });

        // 3b. Inner Crisp Core Layer
        const corePaint = {
          'line-color': c.color || '#38bdf8',
          'line-width': 2.6,
          'line-opacity': 1.0
        };
        if (dashArray) {
          corePaint['line-dasharray'] = dashArray;
        }

        map.addLayer({
          id: `layer-core-${c.id}`,
          type: 'line',
          source: sourceId,
          paint: corePaint
        });

        // 3c. Wide Hit Target Layer for Smooth Touch and Mouse Interaction
        map.addLayer({
          id: `layer-hit-${c.id}`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': 'transparent',
            'line-width': 32
          }
        });

        // Mouse hover effects
        map.on('mouseenter', `layer-hit-${c.id}`, () => {
          map.getCanvas().style.cursor = 'pointer';
          map.setPaintProperty(`layer-glow-${c.id}`, 'line-opacity', 0.85);
          map.setPaintProperty(`layer-glow-${c.id}`, 'line-width', 6.0);
        });

        map.on('mouseleave', `layer-hit-${c.id}`, () => {
          map.getCanvas().style.cursor = '';
          if (activeCorridorId !== c.id) {
            map.setPaintProperty(`layer-glow-${c.id}`, 'line-opacity', 0.35);
            map.setPaintProperty(`layer-glow-${c.id}`, 'line-width', c.category === 'tactical' ? 4.5 : 3.8);
          }
        });

        // Mouse click handler
        map.on('click', `layer-hit-${c.id}`, (e) => {
          e.originalEvent.stopPropagation();
          selectCorridor(c.id);
        });
      });
    }
  }

  /**
   * Setup Pixel-Perfect Zero-Dimension Anchor Tactical Pins
   */
  function setupTacticalMarkers() {
    const geo = window.GEO_2026;
    if (!geo || !geo.nodes) return;

    geo.nodes.forEach(node => {
      const info = NODE_LOCATIONS[node.id];
      if (!info) return;

      const svgIcon = SVG_ICONS[info.iconKey] || SVG_ICONS.star;

      const el = document.createElement('div');
      el.className = `tactical-pin pin-${node.id}`;
      el.id = `map-pin-${node.id}`;

      el.innerHTML = `
        <div class="tp-dot">
          <div class="tp-core" style="border-color:${info.color}">
            <span class="tp-svg" style="color:${info.color}">${svgIcon}</span>
          </div>
        </div>
        <div class="tp-label-wrap ${info.dir}">
          <div class="tp-label">
            <span class="tp-tag" style="color:${info.color}">${info.tag}</span>
            <span class="tp-name">${info.name}</span>
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof window.selectStrategicTarget === 'function') {
          window.selectStrategicTarget(node.id);
        } else {
          selectNode(node.id);
        }
      });

      // Anchor 'center' on a 0x0 element places the coordinate at exact pixel center (0, 0)
      new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(info.center)
        .addTo(map);
    });
  }

  /**
   * Fly to predefined strategic view with calm cubic damping
   */
  function flyToPreset(presetKey) {
    if (!map) return;
    const p = PRESETS[presetKey] || PRESETS.axis;

    map.flyTo({
      center: p.center,
      zoom: p.zoom,
      pitch: p.pitch,
      bearing: p.bearing,
      duration: 1800,
      curve: 1.25,
      essential: true
    });
  }

  /**
   * Select a strategic node: fly in close with deep tactical detail
   */
  function selectNode(nodeId) {
    if (!map) return;
    const info = NODE_LOCATIONS[nodeId];
    if (!info) return;

    activeNodeId = nodeId;
    activeCorridorId = null;

    // Reset corridor glows
    resetCorridorGlows();

    // Highlight active pin on map
    document.querySelectorAll('.tactical-pin').forEach(p => p.classList.remove('active'));
    const activePin = document.getElementById(`map-pin-${nodeId}`);
    if (activePin) activePin.classList.add('active');

    // Smooth organic flyTo right down to harbor/runway/street level
    map.flyTo({
      center: info.center,
      zoom: info.zoom,
      pitch: info.pitch,
      bearing: info.bearing,
      duration: 1800,
      curve: 1.3,
      essential: true
    });

    const geo = window.GEO_2026;
    const node = geo && geo.nodes ? geo.nodes.find(n => n.id === nodeId) : null;
    if (node) {
      window.dispatchEvent(new CustomEvent('strategicNodeSelected', { detail: node }));
    }
  }

  /**
   * Select a strategic corridor: highlight line, endpoints, and frame camera
   */
  function selectCorridor(corridorId) {
    if (!map) return;
    const geo = window.GEO_2026;
    if (!geo || !geo.corridors) return;

    const corridor = geo.corridors.find(c => c.id === corridorId);
    if (!corridor) return;

    activeCorridorId = corridorId;
    activeNodeId = null;

    // Highlight active corridor glow and dim others
    geo.corridors.forEach(c => {
      const glowId = `layer-glow-${c.id}`;
      const coreId = `layer-core-${c.id}`;
      if (map.getLayer(glowId)) {
        if (c.id === corridorId) {
          map.setPaintProperty(glowId, 'line-opacity', 0.95);
          map.setPaintProperty(glowId, 'line-width', 7.0);
          map.setPaintProperty(coreId, 'line-width', 2.8);
        } else {
          map.setPaintProperty(glowId, 'line-opacity', 0.15);
          map.setPaintProperty(glowId, 'line-width', 2.5);
          map.setPaintProperty(coreId, 'line-width', 1.2);
        }
      }
    });

    // Highlight endpoints pins
    document.querySelectorAll('.tactical-pin').forEach(p => p.classList.remove('active'));
    if (corridor.endpoints && Array.isArray(corridor.endpoints)) {
      corridor.endpoints.forEach(epId => {
        const pin = document.getElementById(`map-pin-${epId}`);
        if (pin) pin.classList.add('active');
      });
    }

    // Fit map bounds to corridor coordinates
    if (corridor.coordinates && corridor.coordinates.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      corridor.coordinates.forEach(pt => bounds.extend(pt));
      const isMobile = window.innerWidth < 850;
      const fitPadding = isMobile
        ? { top: 70, bottom: 80, left: 24, right: 24 }
        : { top: 90, bottom: 90, left: 360, right: 380 };
      map.fitBounds(bounds, {
        padding: fitPadding,
        pitch: corridor.category === 'tactical' ? 38 : 25,
        duration: 1600,
        maxZoom: corridor.category === 'tactical' ? 10.5 : 6.5
      });
    }

    // Dispatch event for UI dossier update
    window.dispatchEvent(new CustomEvent('strategicCorridorSelected', { detail: corridor }));
  }

  function resetCorridorGlows() {
    const geo = window.GEO_2026;
    if (!map || !geo || !geo.corridors) return;

    geo.corridors.forEach(c => {
      const glowId = `layer-glow-${c.id}`;
      const coreId = `layer-core-${c.id}`;
      if (map.getLayer(glowId)) {
        map.setPaintProperty(glowId, 'line-opacity', 0.35);
        map.setPaintProperty(glowId, 'line-width', c.category === 'tactical' ? 4.5 : 3.8);
        map.setPaintProperty(coreId, 'line-width', c.category === 'tactical' ? 2.4 : 1.8);
      }
    });
  }

  /**
   * Filter visible corridors on map by category: 'all' | 'sea' | 'air' | 'tactical' | 'transit'
   */
  function filterCorridors(category) {
    const geo = window.GEO_2026;
    if (!map || !geo || !geo.corridors) return;

    geo.corridors.forEach(c => {
      const visible = (category === 'all' || c.category === category || (category === 'air' && c.category === 'diplo'));
      const val = visible ? 'visible' : 'none';
      if (map.getLayer(`layer-glow-${c.id}`)) map.setLayoutProperty(`layer-glow-${c.id}`, 'visibility', val);
      if (map.getLayer(`layer-core-${c.id}`)) map.setLayoutProperty(`layer-core-${c.id}`, 'visibility', val);
      if (map.getLayer(`layer-hit-${c.id}`)) map.setLayoutProperty(`layer-hit-${c.id}`, 'visibility', val);
    });
  }

  /**
   * Switch Basemap Style: 'dark' | 'satellite' | 'streets'
   */
  function setBasemap(styleKey) {
    if (!map) return;
    currentBasemap = styleKey;
    map.setLayoutProperty('base-dark', 'visibility', styleKey === 'dark' ? 'visible' : 'none');
    map.setLayoutProperty('base-satellite', 'visibility', styleKey === 'satellite' ? 'visible' : 'none');
    map.setLayoutProperty('base-streets', 'visibility', styleKey === 'streets' ? 'visible' : 'none');
    return currentBasemap;
  }

  /**
   * Set perspective tilt: 45° (3D Oblique) vs 0° (2D Plan)
   */
  function setPerspective(pitchAngle) {
    if (!map) return;
    map.easeTo({
      pitch: pitchAngle,
      duration: 800
    });
  }

  function toggleAutoRotate() {
    if (!map) return false;
    isRotating = !isRotating;

    if (isRotating) {
      const rotateCamera = () => {
        if (!isRotating || !map) return;
        const currentBearing = map.getBearing();
        map.setBearing((currentBearing + 0.25) % 360);
        rotationTimer = requestAnimationFrame(rotateCamera);
      };
      rotationTimer = requestAnimationFrame(rotateCamera);
    } else {
      if (rotationTimer) cancelAnimationFrame(rotationTimer);
    }

    return isRotating;
  }

  // Public Engine API
  root.GlobeEngine = {
    init: initEngine,
    flyToPreset: flyToPreset,
    selectNode: selectNode,
    selectCorridor: selectCorridor,
    filterCorridors: filterCorridors,
    resetCorridorGlows: resetCorridorGlows,
    setBasemap: setBasemap,
    setPerspective: setPerspective,
    toggleAutoRotate: toggleAutoRotate,
    resize: () => { if (map) map.resize(); },
    getNodeInfo: (id) => NODE_LOCATIONS[id],
    getMap: () => map
  };

})(window);
