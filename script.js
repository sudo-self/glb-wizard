// Three.js variables
let scene, camera, renderer, controls, currentMesh, font;
const objects = [];
let isWireframe = false;

// Initialize the 3D scene
function init3DScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Create camera
    const container = document.getElementById('3d-container');
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 3;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.maxDistance = 20;
    controls.minDistance = 1;
    
    // Add enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x696969, 0.3);
    scene.add(hemisphereLight);
    
    // Add a subtle grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    // Load font for text
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
        font = loadedFont;
    });
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
    
    // Initial update
    updatePolyCount();
}

// Text to 3D Functions
function generateFromText() {
    const textInput = document.getElementById('textInput').value.trim();
    if (textInput) {
        createText3D(textInput);
    }
}

function createText3D(text) {
    showLoading("Creating 3D text...");
    
    setTimeout(() => {
        if (!font) {
            console.warn("Font not loaded yet");
            return;
        }
        
        // Remove previous mesh
        if (currentMesh) {
            scene.remove(currentMesh);
        }
        
        const color = document.getElementById('customColor').value;
        const depth = parseFloat(document.getElementById('textDepth').value);
        
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: depth,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelSegments: 3
        });
        
        textGeometry.computeBoundingBox();
        textGeometry.center();
        
        const material = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color),
            shininess: 100,
            specular: 0x222222
        });
        
        currentMesh = new THREE.Mesh(textGeometry, material);
        currentMesh.position.y = 0;
        
        scene.add(currentMesh);
        updatePolyCount();
        hideLoading();
        
        // Update UI
        document.getElementById('widthSlider').value = 1;
        document.getElementById('heightSlider').value = 1;
        document.getElementById('depthSlider').value = depth;
        updateSliderValues();
    }, 500);
}

// Image to 3D Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showLoading("Converting image to 3D...");
    
    const reader = new FileReader();
    reader.onload = function(e) {
        createHeightmapFromImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

function generateFromSample(type) {
    showLoading(`Generating ${type}...`);
    
    setTimeout(() => {
        // Create sample heightmap or logo
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        if (type === 'heightmap') {
            // Generate terrain-like pattern
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'black');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
            
            // Add some noise
            const imageData = ctx.getImageData(0, 0, 128, 128);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const noise = Math.random() * 50;
                imageData.data[i] = Math.min(255, imageData.data[i] + noise);
                imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + noise);
                imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + noise);
            }
            ctx.putImageData(imageData, 0, 0);
        } else if (type === 'logo') {
            // Generate star logo
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 128, 128);
            
            ctx.fillStyle = 'black';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⭐', 64, 64);
        }
        
        createHeightmapFromImage(canvas.toDataURL());
        hideLoading();
    }, 1000);
}

function createHeightmapFromImage(imageSrc) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
        // Remove previous mesh
        if (currentMesh) {
            scene.remove(currentMesh);
        }
        
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 64, 64);
            
            const imageData = ctx.getImageData(0, 0, 64, 64);
            const data = imageData.data;
            
            // Create plane geometry
            const geometry = new THREE.PlaneGeometry(10, 10, 63, 63);
            const vertices = geometry.attributes.position.array;
            
            // Modify vertices based on image brightness
            const heightScale = parseFloat(document.getElementById('heightScale').value);
            for (let i = 0, j = 0; i < vertices.length; i += 3, j += 4) {
                const x = i / 3 % 64;
                const y = Math.floor(i / 3 / 64);
                const pixelIndex = (y * 64 + x) * 4;
                
                if (pixelIndex < data.length) {
                    const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
                    vertices[i + 2] = (brightness / 255) * heightScale;
                }
            }
            
            geometry.computeVertexNormals();
            
            const material = new THREE.MeshPhongMaterial({
                color: 0x4f46e5,
                shininess: 30,
                side: THREE.DoubleSide
            });
            
            currentMesh = new THREE.Mesh(geometry, material);
            currentMesh.rotation.x = -Math.PI / 2;
            scene.add(currentMesh);
            
            updatePolyCount();
            hideLoading();
        };
    });
}

function updateHeightScale() {
    if (currentMesh && currentMesh.geometry.type === 'PlaneGeometry') {
        const heightScale = parseFloat(document.getElementById('heightScale').value);
        const vertices = currentMesh.geometry.attributes.position.array;
        const originalHeights = currentMesh.userData.originalHeights || vertices.slice();
        
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = originalHeights[i + 2] * heightScale;
        }
        
        currentMesh.geometry.attributes.position.needsUpdate = true;
        currentMesh.geometry.computeVertexNormals();
    }
}

function updateTextDepth() {
    if (currentMesh && currentMesh.geometry.type === 'TextGeometry') {
        const depth = parseFloat(document.getElementById('textDepth').value);
        document.getElementById('depthSlider').value = depth;
        document.getElementById('depthValue').textContent = depth.toFixed(1);
        updateSize();
    }
}

// Enhanced shape creation
function createShape(type) {
    showLoading(`Creating ${type}...`);
    
    setTimeout(() => {
        // Remove previous mesh
        if (currentMesh) {
            scene.remove(currentMesh);
        }
        
        let geometry;
        const color = document.getElementById('customColor').value;
        
        switch(type) {
            case 'box':
                geometry = new THREE.BoxGeometry(2, 2, 2);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        const materialType = document.getElementById('materialType').value;
        let material;
        
        switch(materialType) {
            case 'phong':
                material = new THREE.MeshPhongMaterial({ 
                    color: new THREE.Color(color),
                    shininess: 100,
                    specular: 0x111111
                });
                break;
            case 'lambert':
                material = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(color)
                });
                break;
            case 'basic':
                material = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color(color)
                });
                break;
        }
        
        currentMesh = new THREE.Mesh(geometry, material);
        scene.add(currentMesh);
        
        updateSlidersForShape(type);
        updatePolyCount();
        hideLoading();
    }, 300);
}

// Enhanced color change with animations
function changeColor(color) {
    if (currentMesh) {
        // Animate color change
        const startColor = currentMesh.material.color.clone();
        const endColor = new THREE.Color(color);
        const duration = 300;
        const startTime = Date.now();
        
        function animateColor() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            currentMesh.material.color.lerpColors(startColor, endColor, progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateColor);
            }
        }
        
        animateColor();
        
        // Update color picker
        document.getElementById('customColor').value = color;
    }
}

function changeMaterial() {
    if (currentMesh) {
        const materialType = document.getElementById('materialType').value;
        const color = document.getElementById('customColor').value;
        
        let newMaterial;
        switch(materialType) {
            case 'phong':
                newMaterial = new THREE.MeshPhongMaterial({ 
                    color: new THREE.Color(color),
                    shininess: 100
                });
                break;
            case 'lambert':
                newMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(color)
                });
                break;
            case 'basic':
                newMaterial = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color(color)
                });
                break;
        }
        
        currentMesh.material.dispose();
        currentMesh.material = newMaterial;
    }
}

// Enhanced size controls
function updateSize() {
    if (currentMesh) {
        const width = parseFloat(document.getElementById('widthSlider').value);
        const height = parseFloat(document.getElementById('heightSlider').value);
        const depth = parseFloat(document.getElementById('depthSlider').value);
        
        updateSliderValues();
        
        if (currentMesh.geometry.type === 'TextGeometry') {
            // For text, we need to recreate with new depth
            const textDepth = depth;
            document.getElementById('textDepth').value = textDepth;
            createText3D(currentMesh.geometry.parameters.text || 'Text');
        } else {
            currentMesh.scale.set(width, height, depth);
        }
        
        updatePolyCount();
    }
}

function updateSliderValues() {
    document.getElementById('widthValue').textContent = document.getElementById('widthSlider').value;
    document.getElementById('heightValue').textContent = document.getElementById('heightSlider').value;
    document.getElementById('depthValue').textContent = document.getElementById('depthSlider').value;
}

function updateSlidersForShape(type) {
    const defaults = {
        box: { w: 1, h: 1, d: 1 },
        sphere: { w: 1, h: 1, d: 1 },
        cylinder: { w: 1, h: 1, d: 1 },
        torus: { w: 1, h: 1, d: 1 }
    };
    
    const def = defaults[type] || defaults.box;
    
    document.getElementById('widthSlider').value = def.w;
    document.getElementById('heightSlider').value = def.h;
    document.getElementById('depthSlider').value = def.d;
    updateSliderValues();
}

// New export options
function exportGLB() {
    showLoading("Exporting GLB file...");
    
    setTimeout(() => {
        if (!currentMesh) {
            hideLoading();
            return;
        }
        
        const exporter = new THREE.GLTFExporter();
        exporter.parse(currentMesh, (glb) => {
            const blob = new Blob([glb], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'model.glb';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
            
            // Show success notification
            showNotification('GLB file downloaded successfully!', 'success');
        }, { binary: true });
    }, 500);
}

function exportSTL() {
    showLoading("Exporting STL file...");
    showNotification('STL export coming soon!', 'info');
    hideLoading();
}

function shareModel() {
    const data = {
        type: currentMesh?.geometry?.type || 'unknown',
        color: document.getElementById('customColor').value,
        size: {
            width: document.getElementById('widthSlider').value,
            height: document.getElementById('heightSlider').value,
            depth: document.getElementById('depthSlider').value
        }
    };
    
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?model=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Model link copied to clipboard!', 'success');
    });
}

// UI Helper functions
function toggleWireframe() {
    if (currentMesh) {
        isWireframe = !isWireframe;
        currentMesh.material.wireframe = isWireframe;
        showNotification(isWireframe ? 'Wireframe enabled' : 'Wireframe disabled', 'info');
    }
}

function resetView() {
    controls.reset();
    showNotification('View reset to default', 'info');
}

function updatePolyCount() {
    if (currentMesh) {
        const count = currentMesh.geometry.attributes.position.count / 3;
        document.getElementById('poly-count').textContent = `${count.toLocaleString()} triangles`;
    }
}

function showLoading(message) {
    document.getElementById('loadingOverlay').classList.remove('hidden');
    document.getElementById('loadingMessage').textContent = message;
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('3d-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) controls.update();
    
    // Add subtle animation to current mesh
    if (currentMesh) {
        currentMesh.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    updateSliderValues();
    
    // Check for shared model in URL
    const urlParams = new URLSearchParams(window.location.search);
    const modelData = urlParams.get('model');
    if (modelData) {
        try {
            const data = JSON.parse(atob(modelData));
            // Apply shared model settings
            document.getElementById('customColor').value = data.color;
            document.getElementById('widthSlider').value = data.size.width;
            document.getElementById('heightSlider').value = data.size.height;
            document.getElementById('depthSlider').value = data.size.depth;
            updateSliderValues();
            
            if (data.type === 'TextGeometry') {
                createText3D('Shared');
            } else {
                createShape(data.type.toLowerCase());
            }
        } catch (e) {
            console.error('Failed to parse shared model:', e);
        }
    }
});

// Add drag and drop for images
document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.querySelector('input[type="file"]').parentElement;
    
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('border-indigo-400', 'bg-indigo-50');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('border-indigo-400', 'bg-indigo-50');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('border-indigo-400', 'bg-indigo-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageUpload({ target: { files } });
        }
    });
});
