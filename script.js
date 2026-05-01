// --- 1. India-wide Geographic Database ---

// 40+ Major Cities across all states of India
const cities = [
    { id: 1, state: 'Andhra Pradesh', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { id: 2, state: 'Andhra Pradesh', name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { id: 3, state: 'Arunachal Pradesh', name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
    { id: 4, state: 'Assam', name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
    { id: 5, state: 'Bihar', name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { id: 6, state: 'Chhattisgarh', name: 'Raipur', lat: 21.2514, lng: 81.6296 },
    { id: 7, state: 'Goa', name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    { id: 8, state: 'Gujarat', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { id: 9, state: 'Gujarat', name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { id: 10, state: 'Haryana', name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { id: 11, state: 'Himachal Pradesh', name: 'Shimla', lat: 31.1048, lng: 77.1734 },
    { id: 12, state: 'Jharkhand', name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { id: 13, state: 'Karnataka', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { id: 14, state: 'Karnataka', name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
    { id: 15, state: 'Kerala', name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { id: 16, state: 'Kerala', name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { id: 17, state: 'Madhya Pradesh', name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { id: 18, state: 'Madhya Pradesh', name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { id: 19, state: 'Maharashtra', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 20, state: 'Maharashtra', name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { id: 21, state: 'Maharashtra', name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { id: 22, state: 'Manipur', name: 'Imphal', lat: 24.8170, lng: 93.9368 },
    { id: 23, state: 'Meghalaya', name: 'Shillong', lat: 25.5788, lng: 91.8933 },
    { id: 24, state: 'Mizoram', name: 'Aizawl', lat: 23.7271, lng: 92.7176 },
    { id: 25, state: 'Nagaland', name: 'Kohima', lat: 25.6701, lng: 94.1077 },
    { id: 26, state: 'Odisha Orissa', name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { id: 27, state: 'Odisha Orissa', name: 'Cuttack', lat: 20.4625, lng: 85.8830 },
    { id: 28, state: 'Punjab', name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    { id: 29, state: 'Punjab', name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
    { id: 30, state: 'Rajasthan', name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { id: 31, state: 'Rajasthan', name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
    { id: 32, state: 'Sikkim', name: 'Gangtok', lat: 27.3389, lng: 88.6065 },
    { id: 33, state: 'Tamil Nadu', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { id: 34, state: 'Tamil Nadu', name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { id: 35, state: 'Telangana', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { id: 36, state: 'Tripura', name: 'Agartala', lat: 23.8315, lng: 91.2868 },
    { id: 37, state: 'Uttar Pradesh', name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { id: 38, state: 'Uttar Pradesh', name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { id: 39, state: 'Uttarakhand', name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { id: 40, state: 'West Bengal', name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { id: 41, state: 'West Bengal', name: 'Darjeeling', lat: 27.0410, lng: 88.2663 },
    { id: 42, state: 'Delhi', name: 'New Delhi', lat: 28.6139, lng: 77.2090 }
];

// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return Math.round(R * c);
}

// Procedural Generation: Connect each city to its 4 nearest neighbors
let initialRoads = [];
cities.forEach(city1 => {
    let distances = cities
        .filter(c => c.id !== city1.id)
        .map(c => ({ id: c.id, dist: getDistance(city1.lat, city1.lng, c.lat, c.lng) }))
        .sort((a, b) => a.dist - b.dist);
    
    // Nearest 4 neighbors creates a highly interconnected web for Floyd Warshall
    for (let i = 0; i < 4; i++) {
        if (distances[i]) {
            const u = city1.id;
            const v = distances[i].id;
            if (!initialRoads.find(r => (r.u === u && r.v === v) || (r.u === v && r.v === u))) {
                initialRoads.push({ u: u, v: v, dist: distances[i].dist });
            }
        }
    }
});

let roads = initialRoads.map(r => ({ ...r, weight: r.dist, isTraffic: false }));

// --- 2. Leaflet Map Initialization ---
const map = L.map('map').setView([22.0, 79.0], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

let geoJsonLayer = null;
let cityLayers = [];
let roadLayers = [];

// --- 3. Interactive Selection State ---
let step = 0; 
let selOriginState = null;
let selOriginCityId = null;
let selDestState = null;
let selDestCityId = null;

const instrText = document.getElementById('instruction-text');
const btnCalc = document.getElementById('calculate-btn');

// --- 4. GeoJSON Integration ---
fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson')
    .then(response => response.json())
    .then(data => {
        geoJsonLayer = L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#3b82f6",
                    weight: 2,
                    opacity: 0.8,
                    fillColor: "#1e293b",
                    fillOpacity: 0.4
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        const layer = e.target;
                        layer.setStyle({ fillColor: '#3b82f6', fillOpacity: 0.7 });
                    },
                    mouseout: function(e) {
                        if (layer.feature.properties.NAME_1 !== selOriginState && layer.feature.properties.NAME_1 !== selDestState) {
                            geoJsonLayer.resetStyle(e.target);
                        } else {
                            layer.setStyle({ fillColor: '#10b981', fillOpacity: 0.6 }); // Green if selected
                        }
                    },
                    click: function(e) {
                        const clickedState = feature.properties.NAME_1; // NAME_1 contains state name
                        handleStateClick(clickedState, e.target);
                    }
                });
                
                // Add tooltip with State name
                layer.bindTooltip(feature.properties.NAME_1, { sticky: true });
            }
        }).addTo(map);
        
        updateUI(); // Start UI once loaded
    })
    .catch(error => {
        console.error("Failed to load GeoJSON. Ensure you have internet connection.", error);
        instrText.textContent = "Error: Could not load India Map GeoJSON.";
    });

function handleStateClick(stateName, layer) {
    if (step === 0) {
        // Find if we have cities in this state (handle slight name mismatches)
        const hasCities = cities.some(c => c.state.toLowerCase().includes(stateName.toLowerCase()) || stateName.toLowerCase().includes(c.state.toLowerCase()));
        if (!hasCities) {
            alert(`We don't have major cities mapped for ${stateName} yet. Try Maharashtra, Odisha, Gujarat, etc.`);
            return;
        }

        selOriginState = stateName;
        document.getElementById('source-state').innerHTML = `<option>${stateName}</option>`;
        layer.setStyle({ fillColor: '#10b981', fillOpacity: 0.6 });
        step = 1;
        updateUI();
        map.fitBounds(layer.getBounds());
    } 
    else if (step === 2) {
        const hasCities = cities.some(c => c.state.toLowerCase().includes(stateName.toLowerCase()) || stateName.toLowerCase().includes(c.state.toLowerCase()));
        if (!hasCities) {
            alert(`We don't have major cities mapped for ${stateName} yet. Try another state.`);
            return;
        }

        selDestState = stateName;
        document.getElementById('dest-state').innerHTML = `<option>${stateName}</option>`;
        layer.setStyle({ fillColor: '#10b981', fillOpacity: 0.6 });
        step = 3;
        updateUI();
        map.fitBounds(layer.getBounds());
    }
}

function updateUI() {
    cityLayers.forEach(l => map.removeLayer(l)); cityLayers = [];
    roadLayers.forEach(l => map.removeLayer(l)); roadLayers = [];

    if (step === 0) {
        instrText.textContent = "Step 1: Click ANY State in India for Origin.";
        map.flyTo([22.0, 79.0], 5);
        if(geoJsonLayer) {
            geoJsonLayer.eachLayer(l => geoJsonLayer.resetStyle(l)); // reset all colors
        }
    } 
    else if (step === 1) {
        instrText.textContent = `Step 2: Click a City in ${selOriginState}.`;
        drawCities(selOriginState);
    }
    else if (step === 2) {
        instrText.textContent = "Step 3: Click ANY State in India for Destination.";
        map.flyTo([22.0, 79.0], 5);
    }
    else if (step === 3) {
        instrText.textContent = `Step 4: Click a City in ${selDestState}.`;
        drawCities(selDestState);
    }
    else if (step === 4) {
        instrText.textContent = "Route Calculated! Click a green road to add traffic.";
        btnCalc.style.opacity = '1';
        btnCalc.style.pointerEvents = 'auto';
        calculateAndDisplayRoute();
    }
}

function drawCities(stateName, showAll = false) {
    const citiesToDraw = showAll ? cities : cities.filter(c => c.state.toLowerCase().includes(stateName.toLowerCase()) || stateName.toLowerCase().includes(c.state.toLowerCase()));
    
    citiesToDraw.forEach(city => {
        let isOrigin = (city.id === selOriginCityId);
        let isDest = (city.id === selDestCityId);
        
        let color = '#3b82f6';
        if (isOrigin) color = '#10b981'; 
        if (isDest) color = '#ef4444'; 

        const marker = L.circleMarker([city.lat, city.lng], {
            radius: 10, fillColor: color, color: "#f8fafc", weight: 2, opacity: 1, fillOpacity: 1
        }).addTo(map).bindTooltip(`<b>${city.name}</b>`, { permanent: true, direction: "top", offset: [0, -12] });
        
        marker.on('click', () => {
            if (step === 1) {
                selOriginCityId = city.id;
                document.getElementById('source').innerHTML = `<option>${city.name}</option>`;
                step = 2;
                updateUI();
            } else if (step === 3) {
                selDestCityId = city.id;
                document.getElementById('destination').innerHTML = `<option>${city.name}</option>`;
                step = 4;
                updateUI();
            }
        });
        cityLayers.push(marker);
    });
}

// --- 5. Floyd-Warshall Algorithm ---
let dist = [];
let next = [];

function runFloydWarshall() {
    const INF = Infinity;
    const maxId = Math.max(...cities.map(c => c.id));
    
    dist = Array.from({ length: maxId + 1 }, () => Array(maxId + 1).fill(INF));
    next = Array.from({ length: maxId + 1 }, () => Array(maxId + 1).fill(null));

    for (let i = 1; i <= maxId; i++) {
        dist[i][i] = 0;
        next[i][i] = i;
    }

    roads.forEach(road => {
        dist[road.u][road.v] = road.weight;
        dist[road.v][road.u] = road.weight; 
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

// --- 6. Routing Execution ---
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

function calculateAndDisplayRoute() {
    runFloydWarshall(); 
    
    cityLayers.forEach(l => map.removeLayer(l)); cityLayers = [];
    roadLayers.forEach(l => map.removeLayer(l)); roadLayers = [];
    
    drawCities(null, true); // draw all cities across India

    if (selOriginCityId === selDestCityId) {
        document.getElementById('path-result').textContent = "Already at destination!";
        document.getElementById('total-weight').textContent = "0 km";
        return;
    }

    const path = getShortestPath(selOriginCityId, selDestCityId);
    
    if (path.length === 0) {
        document.getElementById('path-result').textContent = "No path found. Disconnected node.";
        document.getElementById('total-weight').textContent = "-- km";
        return;
    }

    let realDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        const originalRoad = initialRoads.find(r => (r.u === u && r.v === v) || (r.u === v && r.v === u));
        realDistance += originalRoad.dist;
    }

    document.getElementById('total-weight').textContent = realDistance + " km";
    const pathNames = path.map(id => cities.find(c => c.id === id).name);
    document.getElementById('path-result').textContent = pathNames.join(' ➔ ');

    // Draw ALL Roads so we can see the full procedural network, but highlight the path
    roads.forEach((road, index) => {
        const city1 = cities.find(c => c.id === road.u);
        const city2 = cities.find(c => c.id === road.v);

        let isPartOfPath = false;
        for (let i = 0; i < path.length - 1; i++) {
            if ((path[i] === road.u && path[i+1] === road.v) || 
                (path[i] === road.v && path[i+1] === road.u)) {
                isPartOfPath = true; break;
            }
        }

        // Only draw roads that are part of the path, or traffic roads to avoid massive clutter
        // Actually, drawing the whole network looks super impressive! Let's draw it faint.
        let color = road.isTraffic ? '#ef4444' : (isPartOfPath ? '#10b981' : '#334155');
        let weight = isPartOfPath ? 6 : 2;
        let dashArray = road.isTraffic ? "10, 10" : null;
        let opacity = isPartOfPath ? 1 : 0.2; // Faint for non-path roads

        const polyline = L.polyline([[city1.lat, city1.lng], [city2.lat, city2.lng]], {
            color: color, weight: weight, dashArray: dashArray, opacity: opacity
        }).addTo(map);

        polyline.bindPopup(`${city1.name} ↔ ${city2.name}<br><b>${road.weight} km</b> ${road.isTraffic ? '(TRAFFIC)' : ''}`);

        polyline.on('click', () => {
            if (!road.isTraffic) {
                roads[index].weight += 2000; 
                roads[index].isTraffic = true;
                calculateAndDisplayRoute();
            }
        });

        roadLayers.push(polyline);
    });
    
    const pathCoords = path.map(id => [cities.find(c => c.id === id).lat, cities.find(c => c.id === id).lng]);
    map.fitBounds(pathCoords, { padding: [50, 50], animate: true });
}

document.getElementById('restart-btn').addEventListener('click', () => {
    step = 0;
    selOriginState = null; selOriginCityId = null;
    selDestState = null; selDestCityId = null;
    document.getElementById('source-state').innerHTML = '';
    document.getElementById('source').innerHTML = '';
    document.getElementById('dest-state').innerHTML = '';
    document.getElementById('destination').innerHTML = '';
    document.getElementById('path-result').textContent = "Awaiting selection.";
    document.getElementById('total-weight').textContent = "-- km";
    btnCalc.style.opacity = '0.5';
    btnCalc.style.pointerEvents = 'none';
    updateUI();
});

document.getElementById('calculate-btn').addEventListener('click', calculateAndDisplayRoute);

document.getElementById('reset-traffic-btn').addEventListener('click', () => {
    roads = initialRoads.map(r => ({ ...r, weight: r.dist, isTraffic: false }));
    runFloydWarshall();
    if(step === 4) calculateAndDisplayRoute();
});

// Run once to initialize matrices
runFloydWarshall();
