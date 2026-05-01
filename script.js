// --- 1. Graph Data Setup ---
// We use nodes (junctions) and edges (roads)
const nodes = new vis.DataSet([
    { id: 1, label: 'A (Downtown)' },
    { id: 2, label: 'B (North Hill)' },
    { id: 3, label: 'C (West Side)' },
    { id: 4, label: 'D (East End)' },
    { id: 5, label: 'E (South Park)' },
    { id: 6, label: 'F (Suburbs)' }
]);

// Initial default edges with weights (travel time in minutes)
// We keep a custom 'originalWeight' to reset later if needed, and 'weight' is current.
const initialEdges = [
    { id: 1, from: 1, to: 2, weight: 5, label: '5 min' },
    { id: 2, from: 1, to: 3, weight: 2, label: '2 min' },
    { id: 3, from: 2, to: 4, weight: 8, label: '8 min' },
    { id: 4, from: 3, to: 4, weight: 4, label: '4 min' },
    { id: 5, from: 3, to: 5, weight: 6, label: '6 min' },
    { id: 6, from: 4, to: 6, weight: 3, label: '3 min' },
    { id: 7, from: 5, to: 6, weight: 7, label: '7 min' }
];

const edges = new vis.DataSet(initialEdges.map(e => ({...e, originalWeight: e.weight})));

const numNodes = nodes.length;

// --- 2. Floyd-Warshall Algorithm Implementation ---
let dist = [];
let next = [];

function runFloydWarshall() {
    const INF = Infinity;
    
    // Initialize matrices
    dist = Array.from({ length: numNodes + 1 }, () => Array(numNodes + 1).fill(INF));
    next = Array.from({ length: numNodes + 1 }, () => Array(numNodes + 1).fill(null));

    // Distance to self is 0
    for (let i = 1; i <= numNodes; i++) {
        dist[i][i] = 0;
        next[i][i] = i;
    }

    // Set distances based on current edges
    edges.get().forEach(edge => {
        // Assuming undirected graph for roads (two-way streets)
        dist[edge.from][edge.to] = edge.weight;
        dist[edge.to][edge.from] = edge.weight;
        
        next[edge.from][edge.to] = edge.to;
        next[edge.to][edge.from] = edge.from;
    });

    // Core Algorithm
    for (let k = 1; k <= numNodes; k++) {
        for (let i = 1; i <= numNodes; i++) {
            for (let j = 1; j <= numNodes; j++) {
                if (dist[i][k] !== INF && dist[k][j] !== INF && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k]; // Update predecessor
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

// --- 3. UI and Visualization Setup ---
const container = document.getElementById('network');
const data = { nodes: nodes, edges: edges };
const options = {
    nodes: {
        shape: 'dot',
        size: 20,
        font: { size: 16, color: '#f8fafc', face: 'Outfit' },
        color: { background: '#3b82f6', border: '#2563eb' },
        borderWidth: 2,
        shadow: true
    },
    edges: {
        width: 3,
        font: { size: 14, color: '#94a3b8', face: 'Outfit', align: 'top' },
        color: { color: '#334155', highlight: '#ef4444' },
        smooth: { type: 'continuous' }
    },
    physics: {
        barnesHut: { gravitationalConstant: -2000, centralGravity: 0.3, springLength: 150 }
    },
    interaction: { hover: true, selectConnectedEdges: false }
};

const network = new vis.Network(container, data, options);

// Populate Select Dropdowns
const sourceSelect = document.getElementById('source');
const destSelect = document.getElementById('destination');

nodes.get().forEach(node => {
    const opt1 = document.createElement('option');
    opt1.value = node.id;
    opt1.textContent = node.label;
    sourceSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = node.id;
    opt2.textContent = node.label;
    destSelect.appendChild(opt2);
});

// Set default destination
destSelect.value = "6";

// --- 4. Event Listeners ---

// Initial run
runFloydWarshall();

function resetGraphVisuals() {
    // Reset node colors
    const updatedNodes = nodes.get().map(n => ({ ...n, color: { background: '#3b82f6', border: '#2563eb' } }));
    nodes.update(updatedNodes);
    
    // Reset edge colors
    const currentEdges = edges.get();
    const updatedEdges = currentEdges.map(e => ({ 
        ...e, 
        color: { color: e.weight > e.originalWeight ? '#ef4444' : '#334155' }, // Keep red if trafficked
        width: e.weight > e.originalWeight ? 5 : 3
    }));
    edges.update(updatedEdges);
}

function calculateAndDisplayRoute() {
    resetGraphVisuals();
    
    const sourceId = parseInt(sourceSelect.value);
    const destId = parseInt(destSelect.value);

    if (sourceId === destId) {
        document.getElementById('path-result').textContent = "Already at destination!";
        document.getElementById('total-weight').textContent = "0";
        return;
    }

    const path = getShortestPath(sourceId, destId);
    
    if (path.length === 0) {
        document.getElementById('path-result').textContent = "No path found.";
        document.getElementById('total-weight').textContent = "--";
        return;
    }

    const totalWeight = dist[sourceId][destId];
    document.getElementById('total-weight').textContent = totalWeight;

    // Build readable path string
    const pathLabels = path.map(nodeId => nodes.get(nodeId).label.split(' ')[0]);
    document.getElementById('path-result').textContent = pathLabels.join(' ➔ ');

    // Highlight Nodes
    const nodesToHighlight = path.map(nodeId => ({
        id: nodeId,
        color: { background: '#10b981', border: '#059669' }
    }));
    nodes.update(nodesToHighlight);

    // Highlight Edges
    const edgesToHighlight = [];
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        // Find the specific edge in dataset
        const edge = edges.get().find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
        if (edge) {
            edgesToHighlight.push({
                id: edge.id,
                color: { color: '#10b981' },
                width: 6
            });
        }
    }
    edges.update(edgesToHighlight);
}

document.getElementById('calculate-btn').addEventListener('click', calculateAndDisplayRoute);

// Add Traffic (Increase Weight) on Edge Click
network.on("click", function (params) {
    if (params.edges.length > 0) {
        const edgeId = params.edges[0];
        const edge = edges.get(edgeId);
        
        // Increase weight to simulate severe traffic
        const newWeight = edge.weight + 10;
        
        edges.update({
            id: edgeId,
            weight: newWeight,
            label: newWeight + ' min (Traffic!)',
            font: { color: '#ef4444' }
        });

        // Recalculate graph
        runFloydWarshall();
        
        // Automatically recalculate current route if there is one
        calculateAndDisplayRoute();
    }
});

// Reset Traffic Button
document.getElementById('reset-btn').addEventListener('click', () => {
    const resetData = edges.get().map(e => ({
        id: e.id,
        weight: e.originalWeight,
        label: e.originalWeight + ' min',
        font: { color: '#94a3b8' }
    }));
    edges.update(resetData);
    
    runFloydWarshall();
    calculateAndDisplayRoute();
});

// Run once on load to show initial route
setTimeout(calculateAndDisplayRoute, 500);
