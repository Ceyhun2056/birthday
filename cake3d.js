import * as THREE from 'three';

function init3DCake() {
    const container = document.getElementById('cake-3d');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 80, 180);
    camera.lookAt(0, 30, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xff79c6, 0.5);
    pointLight1.position.set(-100, 100, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x50fa7b, 0.5);
    pointLight2.position.set(100, 100, -100);
    scene.add(pointLight2);

    // Create 3D Cake using geometries
    const cakeGroup = new THREE.Group();

    // Bottom layer (largest)
    const bottomLayerGeom = new THREE.CylinderGeometry(40, 40, 20, 32);
    const bottomLayerMat = new THREE.MeshPhongMaterial({ color: 0xff69b4 }); // Pink
    const bottomLayer = new THREE.Mesh(bottomLayerGeom, bottomLayerMat);
    bottomLayer.position.y = 10;
    bottomLayer.castShadow = true;
    cakeGroup.add(bottomLayer);

    // Bottom frosting
    const bottomFrostingGeom = new THREE.TorusGeometry(40, 3, 8, 32);
    const frostingMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const bottomFrosting = new THREE.Mesh(bottomFrostingGeom, frostingMat);
    bottomFrosting.rotation.x = Math.PI / 2;
    bottomFrosting.position.y = 20;
    cakeGroup.add(bottomFrosting);

    // Middle layer
    const middleLayerGeom = new THREE.CylinderGeometry(30, 30, 18, 32);
    const middleLayerMat = new THREE.MeshPhongMaterial({ color: 0xff85a2 }); // Light pink
    const middleLayer = new THREE.Mesh(middleLayerGeom, middleLayerMat);
    middleLayer.position.y = 29;
    middleLayer.castShadow = true;
    cakeGroup.add(middleLayer);

    // Middle frosting
    const middleFrostingGeom = new THREE.TorusGeometry(30, 2.5, 8, 32);
    const middleFrosting = new THREE.Mesh(middleFrostingGeom, frostingMat);
    middleFrosting.rotation.x = Math.PI / 2;
    middleFrosting.position.y = 38;
    cakeGroup.add(middleFrosting);

    // Top layer (smallest)
    const topLayerGeom = new THREE.CylinderGeometry(20, 20, 15, 32);
    const topLayerMat = new THREE.MeshPhongMaterial({ color: 0xffb6c1 }); // Lighter pink
    const topLayer = new THREE.Mesh(topLayerGeom, topLayerMat);
    topLayer.position.y = 45.5;
    topLayer.castShadow = true;
    cakeGroup.add(topLayer);

    // Top frosting
    const topFrostingGeom = new THREE.TorusGeometry(20, 2, 8, 32);
    const topFrosting = new THREE.Mesh(topFrostingGeom, frostingMat);
    topFrosting.rotation.x = Math.PI / 2;
    topFrosting.position.y = 53;
    cakeGroup.add(topFrosting);

    // Candles
    const candleColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 12;

        // Candle stick
        const candleGeom = new THREE.CylinderGeometry(1.5, 1.5, 12, 8);
        const candleMat = new THREE.MeshPhongMaterial({ color: candleColors[i] });
        const candle = new THREE.Mesh(candleGeom, candleMat);
        candle.position.set(Math.cos(angle) * radius, 59, Math.sin(angle) * radius);
        cakeGroup.add(candle);

        // Flame
        const flameGeom = new THREE.ConeGeometry(2, 5, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flame = new THREE.Mesh(flameGeom, flameMat);
        flame.position.set(Math.cos(angle) * radius, 67, Math.sin(angle) * radius);
        flame.userData.originalY = 67;
        flame.userData.flickerOffset = Math.random() * Math.PI * 2;
        cakeGroup.add(flame);

        // Flame glow (inner)
        const glowGeom = new THREE.SphereGeometry(2.5, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.6 });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.set(Math.cos(angle) * radius, 66, Math.sin(angle) * radius);
        cakeGroup.add(glow);
    }

    // Decorations - small spheres on the cake
    const decorColors = [0xff0000, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const decorGeom = new THREE.SphereGeometry(2, 8, 8);
        const decorMat = new THREE.MeshPhongMaterial({ color: decorColors[i % decorColors.length] });
        const decor = new THREE.Mesh(decorGeom, decorMat);
        decor.position.set(Math.cos(angle) * 38, 15, Math.sin(angle) * 38);
        cakeGroup.add(decor);
    }

    scene.add(cakeGroup);

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        requestAnimationFrame(animate);

        // Rotate the cake slowly
        cakeGroup.rotation.y += 0.005;

        // Animate flames flickering
        cakeGroup.children.forEach(child => {
            if (child.userData.originalY !== undefined) {
                child.position.y = child.userData.originalY + Math.sin(time * 0.01 + child.userData.flickerOffset) * 0.5;
                child.scale.y = 1 + Math.sin(time * 0.015 + child.userData.flickerOffset) * 0.2;
            }
        });

        renderer.render(scene, camera);
    }
    animate(0);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCake);
} else {
    init3DCake();
}
