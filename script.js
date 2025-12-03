// Three.js variables
let scene, camera, renderer, controls, currentMesh;
const objects = [];

// Initialize the 3D scene
function init3DScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const container = document.getElementById('3d-container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create initial shape
    createShape('box');
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Create a new 3D shape
function createShape(type) {
    // Remove previous mesh if exists
    if (currentMesh) {
        scene.remove(currentMesh);
    }
    
    let geometry;
    const color = document.querySelector('input[type="color"]').value;
    
    switch(type) {
        case 'box':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(color),
        shininess: 30
    });
    
    currentMesh = new THREE.Mesh(geometry, material);
    scene.add(currentMesh);
    
    // Update sliders based on shape
    updateSlidersForShape(type);
}

// Change color of current mesh
function changeColor(color) {
    if (currentMesh) {
        currentMesh.material.color.set(new THREE.Color(color));
    }
}

// Update size of current mesh
function updateSize() {
    if (currentMesh) {
        const width = parseFloat(document.getElementById('widthSlider').value);
        const height = parseFloat(document.getElementById('heightSlider').value);
        const depth = parseFloat(document.getElementById('depthSlider').value);
        
        // Different approach for different shapes
        if (currentMesh.geometry.type === 'BoxGeometry') {
            currentMesh.scale.set(width, height, depth);
        } else if (currentMesh.geometry.type === 'SphereGeometry') {
            currentMesh.scale.set(width, height, depth);
        } else if (currentMesh.geometry.type === 'CylinderGeometry') {
            currentMesh.scale.set(width, height, width); // Keep diameter proportional
        }
    }
}

// Update sliders based on shape type
function updateSlidersForShape(type) {
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightSlider');
    const depthSlider = document.getElementById('depthSlider');
    
    // Reset sliders
    widthSlider.value = 1;
    heightSlider.value = 1;
    depthSlider.value = 1;
    
    // Adjust max values based on shape
    if (type === 'sphere') {
        widthSlider.max = 2;
        heightSlider.max = 2;
        depthSlider.max = 2;
    } else if (type === 'cylinder') {
        widthSlider.max = 2;
        heightSlider.max = 3;
        depthSlider.max = 2;
    } else {
        widthSlider.max = 3;
        heightSlider.max = 3;
        depthSlider.max = 3;
    }
}

// Export current model as GLB
function exportGLB() {
    if (!currentMesh) return;
    
    const exporter = new THREE.GLTFExporter();
    
    exporter.parse(currentMesh, (glb) => {
        const blob = new Blob([glb], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.glb';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, { binary: true });
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('3d-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
});
