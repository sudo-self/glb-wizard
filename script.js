// Three.js variables
let scene, camera, renderer, controls, currentMesh, font;
const objects = [];
let isWireframe = false;
let isInitialized = false;

// Initialize the 3D scene
function init3DScene() {
    try {
        // Wait for DOM to be ready
        const container = document.getElementById('3d-container');
        if (!container) {
            console.error('3D container not found');
            setTimeout(init3DScene, 100);
            return;
        }

        // Hide loading indicator
        const canvasLoading = document.getElementById('canvasLoading');
        if (canvasLoading) {
            canvasLoading.style.display = 'none';
        }

        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 8;
        camera.position.y = 3;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        // Check if WebGL is supported
        if (!renderer) {
            console.error('WebGL not supported');
            showNotification('WebGL is not supported in your browser. Please try a different browser.', 'error');
            return;
        }
        
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
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', 
            (loadedFont) => {
                font = loadedFont;
                console.log('Font loaded successfully');
            },
            undefined,
            (error) => {
                console.error('Error loading font:', error);
                // Create a simple placeholder font
                createFallbackFont();
            }
        );
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start animation loop
        animate();
        
        // Create initial shape
        setTimeout(() => {
            createShape('box');
        }, 500);
        
        // Mark as initialized
        isInitialized = true;
        console.log('3D scene initialized successfully');
        
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
        showNotification('Failed to initialize 3D engine. Please refresh the page.', 'error');
        
        // Try to show fallback content
        const container = document.getElementById('3d-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #666;">
                    <i data-feather="alert-triangle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
                    <h3>3D Engine Failed to Load</h3>
                    <p>Please ensure your browser supports WebGL and try refreshing the page.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
            if (window.feather) {
                feather.replace();
            }
        }
    }
}

// Fallback font creation
function createFallbackFont() {
    // Create a simple geometry as fallback
    font = {
        data: {},
        generateShapes: function(text, size) {
            return [new THREE.Shape()];
        }
    };
    console.log('Using fallback font');
}

// Text to 3D Functions
function generateFromText() {
    const textInput = document.getElementById('textInput').value.trim();
    if (textInput) {
        createText3D(textInput);
    } else {
        showNotification('Please enter some text first', 'warning');
    }
}

function createText3D(text) {
    if (!isInitialized) {
        showNotification('3D engine not ready yet', 'warning');
        return;
    }
    
    showLoading("Creating 3D text...");
    
    setTimeout(() => {
        try {
            if (!font) {
                console.warn("Font not loaded yet, using fallback");
                showNotification('Font still loading, using basic shape', 'info');
                createShape('box');
                hideLoading();
                return;
            }
            
            // Remove previous mesh
            if (currentMesh) {
                scene.remove(currentMesh);
            }
            
            const color = document.getElementById('customColor').value || '#6366f1';
            const depth = parseFloat(document.getElementById('textDepth').value) || 0.5;
            
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
            
            // Update UI
            document.getElementById('widthSlider').value = 1;
            document.getElementById('heightSlider').value = 1;
            document.getElementById('depthSlider').value = depth;
            updateSliderValues();
            
            hideLoading();
            showNotification('3D text created successfully!', 'success');
            
        } catch (error) {
            console.error('Error creating text 3D:', error);
            showNotification('Failed to create 3D text. Trying fallback shape.', 'error');
            createShape('box');
        }
    }, 300);
}

// Image to 3D Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File too large. Maximum size is 10MB.', 'error');
        return;
    }
    
    showLoading("Converting image to 3D...");
    
    const reader = new FileReader();
    reader.onload = function(e) {
        createHeightmapFromImage(e.target.result);
    };
    reader.onerror = function() {
        hideLoading();
        showNotification('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
}

function generateFromSample(type) {
    if (!isInitialized) {
        showNotification('3D engine not ready yet', 'warning');
        return;
    }
    
    showLoading(`Generating ${type}...`);
    
    setTimeout(() => {
        try {
            // Create sample heightmap or logo
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            if (type === 'heightmap') {
                // Generate terrain-like pattern
                const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(1, 'black');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 64, 64);
                
                // Add some noise
                const imageData = ctx.getImageData(0, 0, 64, 64);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const noise = Math.random() * 30;
                    imageData.data[i] = Math.min(255, imageData.data[i] + noise);
                    imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + noise);
                    imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + noise);
                }
                ctx.putImageData(imageData, 0, 0);
            } else if (type === 'logo') {
                // Generate star logo
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 64, 64);
                
                ctx.fillStyle = 'black';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⭐', 32, 32);
            }
            
            createHeightmapFromImage(canvas.toDataURL());
            
        } catch (error) {
            console.error('Error generating sample:', error);
            hideLoading();
            showNotification('Failed to generate sample', 'error');
        }
    }, 500);
}

function createHeightmapFromImage(imageSrc) {
    try {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(imageSrc, 
            (texture) => {
                // Remove previous mesh
                if (currentMesh) {
                    scene.remove(currentMesh);
                }
                
                // Create plane geometry
                const geometry = new THREE.PlaneGeometry(10, 10, 31, 31);
                const vertices = geometry.attributes.position.array;
                
                // Create canvas to analyze image
                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 32;
                    canvas.height = 32;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 32, 32);
                    
                    const imageData = ctx.getImageData(0, 0, 32, 32);
                    const data = imageData.data;
                    
                    // Store original heights for scaling
                    const originalHeights = [];
                    
                    // Modify vertices based on image brightness
                    const heightScale = parseFloat(document.getElementById('heightScale').value) || 1;
                    for (let i = 0; i < vertices.length; i += 3) {
                        const x = Math.floor((i / 3) % 32);
                        const y = Math.floor((i / 3) / 32);
                        const pixelIndex = (y * 32 + x) * 4;
                        
                        if (pixelIndex < data.length) {
                            const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
                            const height = (brightness / 255) * heightScale;
                            vertices[i + 2] = height;
                            originalHeights[i + 2] = height / heightScale; // Store base height
                        }
                    }
                    
                    geometry.computeVertexNormals();
                    
                    // Store original heights for later scaling
                    geometry.userData = { originalHeights: originalHeights };
                    
                    const material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(document.getElementById('customColor').value || '#6366f1'),
                        shininess: 30,
                        side: THREE.DoubleSide
                    });
                    
                    currentMesh = new THREE.Mesh(geometry, material);
                    currentMesh.rotation.x = -Math.PI / 2;
                    currentMesh.userData.originalHeights = originalHeights;
                    scene.add(currentMesh);
                    
                    updatePolyCount();
                    hideLoading();
                    showNotification('Heightmap created successfully!', 'success');
                };
                
                img.onerror = () => {
                    hideLoading();
                    showNotification('Failed to load image', 'error');
                };
            },
            undefined,
            (error) => {
                hideLoading();
                console.error('Error loading texture:', error);
                showNotification('Failed to load image texture', 'error');
            }
        );
        
    } catch (error) {
        console.error('Error creating heightmap:', error);
        hideLoading();
        showNotification('Failed to create heightmap', 'error');
    }
}

function updateHeightScale() {
    if (currentMesh && currentMesh.geometry && currentMesh.userData.originalHeights) {
        const heightScale = parseFloat(document.getElementById('heightScale').value) || 1;
        const vertices = currentMesh.geometry.attributes.position.array;
        const originalHeights = currentMesh.userData.originalHeights;
        
        for (let i = 0; i < vertices.length; i += 3) {
            if (originalHeights[i + 2] !== undefined) {
                vertices[i + 2] = originalHeights[i + 2] * heightScale;
            }
        }
        
        currentMesh.geometry.attributes.position.needsUpdate = true;
        currentMesh.geometry.computeVertexNormals();
    }
}

function updateTextDepth() {
    if (currentMesh && currentMesh.geometry && currentMesh.geometry.type === 'TextGeometry') {
        const depth = parseFloat(document.getElementById('textDepth').value) || 0.5;
        document.getElementById('depthSlider').value = depth;
        document.getElementById('depthValue').textContent = depth.toFixed(1);
        updateSize();
    }
}

// Enhanced shape creation
function createShape(type) {
    if (!isInitialized) {
        showNotification('3D engine not ready yet', 'warning');
        return;
    }
    
    showLoading(`Creating ${type}...`);
    
    setTimeout(() => {
        try {
            // Remove previous mesh
            if (currentMesh) {
                scene.remove(currentMesh);
            }
            
            let geometry;
            const color = document.getElementById('customColor').value || '#6366f1';
            
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
            
            const materialType = document.getElementById('materialType').value || 'phong';
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
            
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`, 'success');
            
        } catch (error) {
            console.error('Error creating shape:', error);
            hideLoading();
            showNotification('Failed to create shape', 'error');
        }
    }, 300);
}

// Enhanced color change with animations
function changeColor(color) {
    if (currentMesh && currentMesh.material) {
        try {
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
            const colorPicker = document.getElementById('customColor');
            if (colorPicker) {
                colorPicker.value = color;
            }
            
        } catch (error) {
            console.error('Error changing color:', error);
        }
    }
}

function changeMaterial() {
    if (currentMesh) {
        try {
            const materialType = document.getElementById('materialType').value || 'phong';
            const color = document.getElementById('customColor').value || '#6366f1';
            
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
            
            if (currentMesh.material.dispose) {
                currentMesh.material.dispose();
            }
            currentMesh.material = newMaterial;
            
        } catch (error) {
            console.error('Error changing material:', error);
        }
    }
}

// Enhanced size controls
function updateSize() {
    if (currentMesh) {
        try {
            const width = parseFloat(document.getElementById('widthSlider').value) || 1;
            const height = parseFloat(document.getElementById('heightSlider').value) || 1;
            const depth = parseFloat(document.getElementById('depthSlider').value) || 1;
            
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
            
        } catch (error) {
            console.error('Error updating size:', error);
        }
    }
}

function updateSliderValues() {
    const widthValue = document.getElementById('widthValue');
    const heightValue = document.getElementById('heightValue');
    const depthValue = document.getElementById('depthValue');
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightSlider');
    const depthSlider = document.getElementById('depthSlider');
    
    if (widthValue && widthSlider) widthValue.textContent = parseFloat(widthSlider.value).toFixed(1);
    if (heightValue && heightSlider) heightValue.textContent = parseFloat(heightSlider.value).toFixed(1);
    if (depthValue && depthSlider) depthValue.textContent = parseFloat(depthSlider.value).toFixed(1);
}

function updateSlidersForShape(type) {
    const defaults = {
        box: { w: 1, h: 1, d: 1 },
        sphere: { w: 1, h: 1, d: 1 },
        cylinder: { w: 1, h: 1, d: 1 },
        torus: { w: 1, h: 1, d: 1 }
    };
    
    const def = defaults[type] || defaults.box;
    
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightSlider');
    const depthSlider = document.getElementById('depthSlider');
    
    if (widthSlider) widthSlider.value = def.w;
    if (heightSlider) heightSlider.value = def.h;
    if (depthSlider) depthSlider.value = def.d;
    
    updateSliderValues();
}

// New export options
function exportGLB() {
    if (!currentMesh) {
        showNotification('No model to export', 'warning');
        return;
    }
    
    showLoading("Exporting GLB file...");
    
    setTimeout(() => {
        try {
            const exporter = new THREE.GLTFExporter();
            exporter.parse(currentMesh, 
                (glb) => {
                    try {
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
                        showNotification('GLB file downloaded successfully!', 'success');
                        
                    } catch (error) {
                        console.error('Error creating download:', error);
                        hideLoading();
                        showNotification('Failed to create download', 'error');
                    }
                }, 
                { binary: true },
                (error) => {
                    console.error('Error exporting GLB:', error);
                    hideLoading();
                    showNotification('Failed to export GLB file', 'error');
                }
            );
            
        } catch (error) {
            console.error('Error in export process:', error);
            hideLoading();
            showNotification('Export failed', 'error');
        }
    }, 500);
}

function exportSTL() {
    showLoading("Exporting STL file...");
    setTimeout(() => {
        hideLoading();
        showNotification('STL export coming soon!', 'info');
    }, 500);
}

function shareModel() {
    if (!currentMesh) {
        showNotification('No model to share', 'warning');
        return;
    }
    
    try {
        const data = {
            type: currentMesh?.geometry?.type || 'unknown',
            color: document.getElementById('customColor').value || '#6366f1',
            size: {
                width: document.getElementById('widthSlider').value || 1,
                height: document.getElementById('heightSlider').value || 1,
                depth: document.getElementById('depthSlider').value || 1
            }
        };
        
        const encoded = btoa(JSON.stringify(data));
        const url = `${window.location.origin}${window.location.pathname}?model=${encoded}`;
        
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Model link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for browsers that don't support clipboard API
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showNotification('Model link copied to clipboard!', 'success');
        });
        
    } catch (error) {
        console.error('Error sharing model:', error);
        showNotification('Failed to share model', 'error');
    }
}

// UI Helper functions
function toggleWireframe() {
    if (currentMesh && currentMesh.material) {
        isWireframe = !isWireframe;
        currentMesh.material.wireframe = isWireframe;
        showNotification(isWireframe ? 'Wireframe enabled' : 'Wireframe disabled', 'info');
    }
}

function resetView() {
    if (controls) {
        controls.reset();
        showNotification('View reset to default', 'info');
    }
}

function updatePolyCount() {
    if (currentMesh && currentMesh.geometry) {
        try {
            const count = currentMesh.geometry.attributes.position.count / 3;
            const polyCountElement = document.getElementById('poly-count');
            if (polyCountElement) {
                polyCountElement.textContent = `${count.toLocaleString()} triangles`;
            }
        } catch (error) {
            console.error('Error updating poly count:', error);
        }
    }
}

function showLoading(message) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
    if (loadingMessage) {
        loadingMessage.textContent = message || 'Loading...';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    try {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification animate-slide-up';
        
        const colors = {
            info: 'info',
            success: 'success',
            warning: 'warning',
            error: 'error'
        };
        
        notification.innerHTML = `
            <div class="toast-content ${colors[type]}">
                <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        if (window.feather) {
            feather.replace(notification);
        }
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert for critical errors
        if (type === 'error') {
            alert(message);
        }
    }
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('3d-container');
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }

    
    if (currentMesh) {
        currentMesh.rotation.y += 0.002;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing 3D scene...');
    

    updateSliderValues();
    

    const urlParams = new URLSearchParams(window.location.search);
    const modelData = urlParams.get('model');
    
   
    setTimeout(() => {
        init3DScene();
        
        
        if (modelData) {
            setTimeout(() => {
                try {
                    const data = JSON.parse(atob(modelData));
                   
                    const colorPicker = document.getElementById('customColor');
                    const widthSlider = document.getElementById('widthSlider');
                    const heightSlider = document.getElementById('heightSlider');
                    const depthSlider = document.getElementById('depthSlider');
                    
                    if (colorPicker) colorPicker.value = data.color;
                    if (widthSlider) widthSlider.value = data.size.width;
                    if (heightSlider) heightSlider.value = data.size.height;
                    if (depthSlider) depthSlider.value = data.size.depth;
                    
                    updateSliderValues();
                    
                    if (data.type === 'TextGeometry') {
                        createText3D('Shared');
                    } else {
                        createShape(data.type.toLowerCase());
                    }
                } catch (e) {
                    console.error('Failed to parse shared model:', e);
                }
            }, 1000);
        }
    }, 100);
});


document.addEventListener('DOMContentLoaded', () => {
    const fileUploadArea = document.getElementById('fileUploadArea');
    if (fileUploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.classList.remove('drag-over');
            }, false);
        });

        fileUploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                handleImageUpload({ target: { files } });
            } else {
                showNotification('Please drop an image file', 'warning');
            }
        }, false);
    }
    
 
    document.querySelectorAll('[title]').forEach(el => {
        el.classList.add('tooltip');
        el.setAttribute('data-tooltip', el.getAttribute('title'));
    });
});


function clearScene() {
    if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh = null;
        updatePolyCount();
        showNotification('Scene cleared', 'info');
    }
}

function saveScene() {
    showNotification('Save feature coming soon!', 'info');
}

function loadScene() {
    showNotification('Load feature coming soon!', 'info');
}

function duplicateModel() {
    if (currentMesh) {
        const clonedMesh = currentMesh.clone();
        clonedMesh.position.x += 2;
        scene.add(clonedMesh);
        showNotification('Model duplicated', 'success');
    }
}

function toggleGrid() {
    showNotification('Grid toggle coming soon!', 'info');
}


window.createShape = createShape;
window.createText3D = createText3D;
window.generateFromText = generateFromText;
window.handleImageUpload = handleImageUpload;
window.generateFromSample = generateFromSample;
window.changeColor = changeColor;
window.changeMaterial = changeMaterial;
window.updateSize = updateSize;
window.updateTextDepth = updateTextDepth;
window.updateHeightScale = updateHeightScale;
window.exportGLB = exportGLB;
window.exportSTL = exportSTL;
window.shareModel = shareModel;
window.toggleWireframe = toggleWireframe;
window.resetView = resetView;
window.clearScene = clearScene;
window.saveScene = saveScene;
window.loadScene = loadScene;
window.duplicateModel = duplicateModel;
window.toggleGrid = toggleGrid;
window.showNotification = showNotification;
