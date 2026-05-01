// --- 1. Geographic Data Setup ---
// Real-world cities with Latitude and Longitude
const cities = [
    { id: 1, name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 2, name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { id: 3, name: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { id: 4, name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { id: 5, name: 'Shirdi', lat: 19.7645, lng: 74.4762 },
    { id: 6, name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 }
];

// Roads connecting cities with exact distances in kilometers
const initialRoads = [
    { u: 1, v: 2, dist: 150 }, // Mumbai - Pune
    { u: 1, v: 3, dist: 165 }, // Mumbai - Nashik
    { u: 1, v: 4, dist: 280 }, // Mumbai - Surat
    { u: 2, v: 5, dist: 185 }, // Pune - Shirdi
    { u: 3, v: 5, dist: 90 },  // Nashik - Shirdi
    { u: 3, v: 4, dist: 230 }, // Nashik - Surat
    { u: 4, v: 6, dist: 260 }  // Surat - Ahmedabad
];

// We map roads into a mutable array so we can add "traffic" penalties
let roads = initialRoads.map(r => ({ ...r, weight: r.dist, isTraffic: false }));

const numNodes = cities.length;

// Helper to get city by ID
function getCity(id) {
    return cities.find(c => c.id === id);
}

// --- 2. Leaflet Map Initialization ---
// Initialize map centered around Mumbai/Maharashtra region
const map = L.map('map').setView([20.0, 73.5], 6);

// Add a dark theme tile layer from CARTO for a premium "Navigation" look
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Draw City Markers
cities.forEach(city => {
    L.circleMarker([city.lat, city.lng], {
        radius: 8,
        fillColor: "#3b82f6",
        color: "#f8fafc",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map).bindTooltip(`<b>${city.name}</b>`, { permanent: true, direction: "top", offset: [0, -10] });
});

// Polyline references to manipulate them later
let roadLayers = [];

// --- 3. Floyd-Warshall Algorithm ---
let dist = [];
let next = [];

function runFloydWarshall() {
    const INF = Infinity;
    
    // Matrices need to handle 1-indexed IDs up to max ID
    const maxId = Math.max(...cities.map(c => c.id));
    dist = Array.from({ length: maxId + 1 }, () => Array(maxId + 1).fill(INF));
    next = Array.from({ length: maxId + 1 }, () => Array(maxId + 1).fill(null));

    for (let i = 1; i <= maxId; i++) {
        dist[i][i] = 0;
        next[i][i] = i;
    }

    roads.forEach(road => {
        dist[road.u][road.v] = road.weight;
        dist[road.v][road.u] = road.weight; // Undirected road
        
        next[road.u][road.v] = road.v;
        next[road.v][road.u] = road.u;
    });

    for (let k = 1; k <= maxId; k++) {
        for (let i = 1; i <= maxId; i++) {
            for (let j = 1; j <= maxId; j++) {
                if (dist[i][k] !== INF && dist[k][j] !== INF && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }
}

function getShortestPath(u, v) {
    if (next[u][v] === null) return [];
    
    const path = [u];
    let curr = u;
    while (curr !== v) {
        curr = next[curr][v];
        path.push(curr);
    }
    return path;
}

// --- 4. Rendering Roads on Map ---
function drawRoads(highlightPath = []) {
    // Clear existing roads
    roadLayers.forEach(layer => map.removeLayer(layer));
    roadLayers = [];

    roads.forEach((road, index) => {
        const city1 = getCity(road.u);
        const city2 = getCity(road.v);
        
        // Check if this road is part of the highlighted shortest path
        let isPartOfPath = false;
        for (let i = 0; i < highlightPath.length - 1; i++) {
            if ((highlightPath[i] === road.u && highlightPath[i+1] === road.v) || 
                (highlightPath[i] === road.v && highlightPath[i+1] === road.u)) {
                isPartOfPath = true;
                break;
            }
        }

        // Styling based on state (Traffic vs Normal, Path vs Not Path)
        let color = '#334155'; // default dark gray
        let weight = 4;
        let dashArray = null;

        if (road.isTraffic) {
            color = '#ef4444'; // Red for traffic
            dashArray = "10, 10"; // Dashed to show issue
        } else if (isPartOfPath) {
            color = '#10b981'; // Green for optimal path
            weight = 6;
        }

        const polyline = L.polyline([[city1.lat, city1.lng], [city2.lat, city2.lng]], {
            color: color,
            weight: weight,
            dashArray: dashArray,
            opacity: isPartOfPath ? 1 : 0.6
        }).addTo(map);

        // Add popup with distance
        polyline.bindPopup(`${city1.name} ↔ ${city2.name}<br><b>${road.weight} km</b> ${road.isTraffic ? '(TRAFFIC)' : ''}`);

        // Click to add traffic
        polyline.on('click', () => {
            if (!road.isTraffic) {
                // Simulate traffic: add +500 km penalty to force rerouting
                roads[index].weight += 500;
                roads[index].isTraffic = true;
                
                runFloydWarshall();
                calculateAndDisplayRoute(); // instantly visually update
            }
        });

        roadLayers.push(polyline);
    });
}

// --- 5. UI Integration ---
const sourceSelect = document.getElementById('source');
const destSelect = document.getElementById('destination');

cities.forEach(city => {
    const opt1 = document.createElement('option');
    opt1.value = city.id;
    opt1.textContent = city.name;
    sourceSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = city.id;
    opt2.textContent = city.name;
    destSelect.appendChild(opt2);
});

// Set defaults (e.g., Pune to Ahmedabad)
sourceSelect.value = "2";
destSelect.value = "6";

function calculateAndDisplayRoute() {
    const sourceId = parseInt(sourceSelect.value);
    const destId = parseInt(destSelect.value);

    if (sourceId === destId) {
        document.getElementById('path-result').textContent = "Already at destination!";
        document.getElementById('total-weight').textContent = "0 km";
        drawRoads();
        return;
    }

    const path = getShortestPath(sourceId, destId);
    
    if (path.length === 0) {
        document.getElementById('path-result').textContent = "No path found.";
        document.getElementById('total-weight').textContent = "-- km";
        drawRoads();
        return;
    }

    // Since traffic penalty is artificial, we recalculate original distance for display
    let realDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        const originalRoad = initialRoads.find(r => (r.u === u && r.v === v) || (r.u === v && r.v === u));
        realDistance += originalRoad.dist;
    }

    document.getElementById('total-weight').textContent = realDistance + " km";

    const pathNames = path.map(id => getCity(id).name);
    document.getElementById('path-result').textContent = pathNames.join(' ➔ ');

    // Redraw map with highlight
    drawRoads(path);
    
    // Auto-fit bounds to the path
    const pathCoords = path.map(id => [getCity(id).lat, getCity(id).lng]);
    map.fitBounds(pathCoords, { padding: [50, 50], animate: true });
}

document.getElementById('calculate-btn').addEventListener('click', calculateAndDisplayRoute);

document.getElementById('reset-btn').addEventListener('click', () => {
    // Reset all roads to initial
    roads = initialRoads.map(r => ({ ...r, weight: r.dist, isTraffic: false }));
    runFloydWarshall();
    calculateAndDisplayRoute();
});

// Initial load
runFloydWarshall();
setTimeout(calculateAndDisplayRoute, 500);
