// Three.js 3D Animated Scene for Little Giggles Dental Clinic

let scene, camera, renderer, teeth = [], particles = [];
let mouseX = 0, mouseY = 0;

// ==================== HOME PAGE 3D ====================
function initHome() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    camera.position.z = 30;
    
    createTeeth();
    createParticles();
    
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

function createToothGeometry() {
    const shape = new THREE.Shape();
    
    shape.moveTo(0, 2);
    shape.bezierCurveTo(1.5, 2, 2, 1.5, 2, 0);
    shape.bezierCurveTo(2, -1, 1.5, -2, 1, -2.5);
    shape.bezierCurveTo(0.5, -3, -0.5, -3, -1, -2.5);
    shape.bezierCurveTo(-1.5, -2, -2, -1, -2, 0);
    shape.bezierCurveTo(-2, 1.5, -1.5, 2, 0, 2);
    
    const extrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.3,
        bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

function createTeeth() {
    const toothGeometry = createToothGeometry();
    const colors = [0xffffff, 0xFFE66D, 0x4ECDC4, 0xFF6B6B];
    
    for (let i = 0; i < 12; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        const tooth = new THREE.Mesh(toothGeometry, material);
        
        tooth.position.x = (Math.random() - 0.5) * 60;
        tooth.position.y = (Math.random() - 0.5) * 40;
        tooth.position.z = (Math.random() - 0.5) * 20;
        
        tooth.rotation.x = Math.random() * Math.PI;
        tooth.rotation.y = Math.random() * Math.PI;
        
        tooth.userData = {
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: tooth.position.y
        };
        
        teeth.push(tooth);
        scene.add(tooth);
    }
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xFF6B6B, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x4ECDC4, 0.8, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
}

function createParticles() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.4,
        transparent: true,
        opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    particles.push(particleSystem);
    scene.add(particleSystem);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

function onWindowResize() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    teeth.forEach(tooth => {
        tooth.rotation.x += tooth.userData.rotationSpeed;
        tooth.rotation.y += tooth.userData.rotationSpeed;
        
        tooth.position.y = tooth.userData.originalY + 
            Math.sin(time * tooth.userData.floatSpeed + tooth.userData.floatOffset) * 2;
    });
    
    particles.forEach(particle => {
        if (particle.type === 'Points') {
            particle.rotation.y += 0.001;
        }
    });
    
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// ==================== ABOUT PAGE 3D - Dentist Theme ====================
let aboutScene, aboutCamera, aboutRenderer, aboutObjects = [];

function initAbout3D() {
    const canvas = document.getElementById('page-canvas');
    if (!canvas) return;
    
    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight * 0.5, 0.1, 1000);
    aboutRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    const rect = canvas.parentElement.getBoundingClientRect();
    aboutRenderer.setSize(rect.width, rect.height * 0.5);
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    aboutCamera.position.z = 25;
    
    // Create tooth shapes
    const toothGeo = createToothGeometry();
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x667eea];
    
    for (let i = 0; i < 8; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.7,
            shininess: 80
        });
        
        const tooth = new THREE.Mesh(toothGeo, material);
        
        tooth.position.x = (Math.random() - 0.5) * 40;
        tooth.position.y = (Math.random() - 0.5) * 25;
        tooth.position.z = (Math.random() - 0.5) * 15;
        
        tooth.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        tooth.userData = {
            rotSpeed: (Math.random() - 0.5) * 0.015,
            floatSpeed: 0.3 + Math.random() * 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: tooth.position.y
        };
        
        aboutObjects.push(tooth);
        aboutScene.add(tooth);
    }
    
    // Add sparkle spheres
    for (let i = 0; i < 15; i++) {
        const sparkleGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const sparkleMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
        sparkle.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20
        );
        sparkle.userData = {
            speed: 0.02 + Math.random() * 0.03,
            offset: Math.random() * Math.PI * 2
        };
        
        aboutObjects.push(sparkle);
        aboutScene.add(sparkle);
    }
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    aboutScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFF6B6B, 1, 50);
    light1.position.set(10, 10, 10);
    aboutScene.add(light1);
    
    const light2 = new THREE.PointLight(0x4ECDC4, 0.8, 50);
    light2.position.set(-10, -10, 10);
    aboutScene.add(light2);
    
    animateAbout();
}

function animateAbout() {
    requestAnimationFrame(animateAbout);
    
    const time = Date.now() * 0.001;
    
    aboutObjects.forEach(obj => {
        if (obj.userData.rotSpeed) {
            obj.rotation.x += obj.userData.rotSpeed;
            obj.rotation.y += obj.userData.rotSpeed;
            obj.rotation.z += obj.userData.rotSpeed * 0.5;
        }
        
        if (obj.userData.floatSpeed) {
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.5;
        }
        
        if (obj.userData.speed) {
            obj.position.y += Math.sin(time * 2 + obj.userData.offset) * 0.02;
            obj.scale.setScalar(1 + Math.sin(time * 3 + obj.userData.offset) * 0.2);
        }
    });
    
    aboutCamera.position.x += (mouseX * 3 - aboutCamera.position.x) * 0.03;
    aboutCamera.position.y += (-mouseY * 3 - aboutCamera.position.y) * 0.03;
    aboutCamera.lookAt(aboutScene.position);
    
    aboutRenderer.render(aboutScene, aboutCamera);
}

// ==================== SERVICES PAGE 3D - Tools Theme ====================
let servicesScene, servicesCamera, servicesRenderer, serviceObjects = [];

function initServices3D() {
    const canvas = document.getElementById('page-canvas');
    if (!canvas) return;
    
    servicesScene = new THREE.Scene();
    servicesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight * 0.5, 0.1, 1000);
    servicesRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    const rect = canvas.parentElement.getBoundingClientRect();
    servicesRenderer.setSize(rect.width, rect.height * 0.5);
    servicesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    servicesCamera.position.z = 25;
    
    // Create floating tools (spheres, rings, etc.)
    const colors = [0x4ECDC4, 0x667eea, 0xFF6B6B, 0xFFE66D];
    
    // Floating spheres (like dental tools)
    for (let i = 0; i < 10; i++) {
        const geo = new THREE.SphereGeometry(1 + Math.random() * 1.5, 16, 16);
        const mat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        
        const sphere = new THREE.Mesh(geo, mat);
        sphere.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15
        );
        
        sphere.userData = {
            type: 'sphere',
            rotSpeed: (Math.random() - 0.5) * 0.02,
            floatSpeed: 0.4 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: sphere.position.y
        };
        
        serviceObjects.push(sphere);
        servicesScene.add(sphere);
    }
    
    // Torus rings
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(2, 0.3, 8, 32);
        const ringMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.5,
            wireframe: false
        });
        
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 10
        );
        
        ring.userData = {
            type: 'ring',
            rotSpeed: 0.01 + Math.random() * 0.01,
            floatSpeed: 0.3 + Math.random() * 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: ring.position.y
        };
        
        serviceObjects.push(ring);
        servicesScene.add(ring);
    }
    
    // Particles
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 60;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0x4ECDC4,
        size: 0.3,
        transparent: true,
        opacity: 0.5
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    serviceObjects.push(particles);
    servicesScene.add(particles);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    servicesScene.add(ambient);
    
    const light1 = new THREE.PointLight(0x4ECDC4, 1, 50);
    light1.position.set(10, 10, 10);
    servicesScene.add(light1);
    
    const light2 = new THREE.PointLight(0x667eea, 0.8, 50);
    light2.position.set(-10, -10, 10);
    servicesScene.add(light2);
    
    animateServices();
}

function animateServices() {
    requestAnimationFrame(animateServices);
    
    const time = Date.now() * 0.001;
    
    serviceObjects.forEach(obj => {
        if (obj.userData.type === 'sphere' || obj.userData.type === 'ring') {
            obj.rotation.x += obj.userData.rotSpeed;
            obj.rotation.y += obj.userData.rotSpeed;
            
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 2;
        }
        
        if (obj.type === 'Points') {
            obj.rotation.y += 0.002;
        }
    });
    
    servicesCamera.position.x += (mouseX * 3 - servicesCamera.position.x) * 0.03;
    servicesCamera.position.y += (-mouseY * 3 - servicesCamera.position.y) * 0.03;
    servicesCamera.lookAt(servicesScene.position);
    
    servicesRenderer.render(servicesScene, servicesCamera);
}

// ==================== GALLERY PAGE 3D - Sparkle Theme ====================
let galleryScene, galleryCamera, galleryRenderer, galleryObjects = [];

function initGallery3D() {
    const canvas = document.getElementById('page-canvas');
    if (!canvas) return;
    
    galleryScene = new THREE.Scene();
    galleryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight * 0.5, 0.1, 1000);
    galleryRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    const rect = canvas.parentElement.getBoundingClientRect();
    galleryRenderer.setSize(rect.width, rect.height * 0.5);
    galleryRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    galleryCamera.position.z = 25;
    
    // Create sparkling crystals
    const colors = [0xFFE66D, 0xFF6B6B, 0x4ECDC4, 0x667eea, 0xffffff];
    
    // Crystal shapes (octahedrons)
    for (let i = 0; i < 12; i++) {
        const crystalGeo = new THREE.OctahedronGeometry(1 + Math.random() * 1.5, 0);
        const crystalMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.7,
            shininess: 150,
            flatShading: true
        });
        
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15
        );
        
        crystal.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.03,
            rotSpeedY: (Math.random() - 0.5) * 0.03,
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: crystal.position.y
        };
        
        galleryObjects.push(crystal);
        galleryScene.add(crystal);
    }
    
    // Star shapes
    for (let i = 0; i < 8; i++) {
        const starGeo = new THREE.IcosahedronGeometry(0.8, 0);
        const starMat = new THREE.MeshBasicMaterial({
            color: 0xFFE66D,
            transparent: true,
            opacity: 0.8
        });
        
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 20
        );
        
        star.userData = {
            rotSpeedX: 0.02,
            rotSpeedY: 0.02,
            floatSpeed: 0.6 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: star.position.y,
            scale: 1
        };
        
        galleryObjects.push(star);
        galleryScene.add(star);
    }
    
    // Sparkle particles
    const sparkleCount = 100;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount * 3; i += 3) {
        sparklePositions[i] = (Math.random() - 0.5) * 80;
        sparklePositions[i + 1] = (Math.random() - 0.5) * 50;
        sparklePositions[i + 2] = (Math.random() - 0.5) * 30;
    }
    
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    
    const sparkleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    galleryObjects.push(sparkles);
    galleryScene.add(sparkles);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    galleryScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFFE66D, 1.2, 60);
    light1.position.set(10, 10, 15);
    galleryScene.add(light1);
    
    const light2 = new THREE.PointLight(0xFF6B6B, 0.8, 60);
    light2.position.set(-10, -10, 15);
    galleryScene.add(light2);
    
    const light3 = new THREE.PointLight(0x4ECDC4, 0.6, 60);
    light3.position.set(0, 0, 20);
    galleryScene.add(light3);
    
    animateGallery();
}

function animateGallery() {
    requestAnimationFrame(animateGallery);
    
    const time = Date.now() * 0.001;
    
    galleryObjects.forEach(obj => {
        if (obj.userData.rotSpeedX) {
            obj.rotation.x += obj.userData.rotSpeedX;
            obj.rotation.y += obj.userData.rotSpeedY;
            
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 2;
        }
        
        if (obj.userData.scale !== undefined) {
            obj.scale.setScalar(1 + Math.sin(time * 4 + obj.userData.floatOffset) * 0.3);
        }
        
        if (obj.type === 'Points') {
            obj.rotation.y += 0.003;
        }
    });
    
    galleryCamera.position.x += (mouseX * 4 - galleryCamera.position.x) * 0.04;
    galleryCamera.position.y += (-mouseY * 4 - galleryCamera.position.y) * 0.04;
    galleryCamera.lookAt(galleryScene.position);
    
    galleryRenderer.render(galleryScene, galleryCamera);
}

// ==================== CONTACT PAGE 3D ====================
let contactScene, contactCamera, contactRenderer, contactObjects = [];

function initContact3D() {
    const canvas = document.getElementById('page-canvas');
    if (!canvas) return;
    
    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight * 0.5, 0.1, 1000);
    contactRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    const rect = canvas.parentElement.getBoundingClientRect();
    contactRenderer.setSize(rect.width, rect.height * 0.5);
    contactRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    contactCamera.position.z = 25;
    
    // Create mixed shapes
    const colors = [0xFF6B6B, 0x4ECDC4, 0x667eea, 0xFFE66D];
    
    for (let i = 0; i < 15; i++) {
        const geo = new THREE.TorusKnotGeometry(0.8, 0.3, 50, 8);
        const mat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        
        const knot = new THREE.Mesh(geo, mat);
        knot.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15
        );
        
        knot.userData = {
            rotSpeed: (Math.random() - 0.5) * 0.01,
            floatSpeed: 0.3 + Math.random() * 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: knot.position.y
        };
        
        contactObjects.push(knot);
        contactScene.add(knot);
    }
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    contactScene.add(ambient);
    
    const light1 = new THREE.PointLight(0x667eea, 1, 50);
    light1.position.set(10, 10, 10);
    contactScene.add(light1);
    
    animateContact();
}

function animateContact() {
    requestAnimationFrame(animateContact);
    
    const time = Date.now() * 0.001;
    
    contactObjects.forEach(obj => {
        obj.rotation.x += obj.userData.rotSpeed;
        obj.rotation.y += obj.userData.rotSpeed;
        
        obj.position.y = obj.userData.originalY + 
            Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.5;
    });
    
    contactRenderer.render(contactScene, contactCamera);
}

// Check if mobile
function isMobile() {
    return window.innerWidth < 768;
}

// ==================== HOME MIDDLE SECTION 3D ====================
let middleScene, middleCamera, middleRenderer, middleObjects = [];

function initMiddle3D() {
    const canvas = document.getElementById('middle-canvas');
    if (!canvas) return;
    
    middleScene = new THREE.Scene();
    middleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    middleRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    middleRenderer.setSize(window.innerWidth, 400);
    middleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1 : 2));
    
    middleCamera.position.z = 25;
    
    if (isMobile()) {
        initMobileMiddle3D();
    } else {
        initDesktopMiddle3D();
    }
    
    animateMiddle();
}

function initDesktopMiddle3D() {
    // Desktop: Rich detailed animation
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x667eea, 0xff9a9e];
    
    // Floating teeth
    for (let i = 0; i < 8; i++) {
        const toothGeo = createToothGeometry();
        const toothMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.85,
            shininess: 100,
            side: THREE.DoubleSide
        });
        
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.scale.setScalar(0.8 + Math.random() * 0.6);
        tooth.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 8
        );
        
        tooth.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        tooth.userData = {
            type: 'tooth',
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            floatSpeed: 0.4 + Math.random() * 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: tooth.position.y
        };
        
        middleObjects.push(tooth);
        middleScene.add(tooth);
    }
    
    // Floating smileys
    for (let i = 0; i < 6; i++) {
        const smileGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const smileMat = new THREE.MeshPhongMaterial({
            color: colors[(i + 2) % colors.length],
            transparent: true,
            opacity: 0.8,
            shininess: 120
        });
        
        const smile = new THREE.Mesh(smileGeo, smileMat);
        smile.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 6
        );
        
        smile.userData = {
            type: 'smile',
            floatSpeed: 0.35 + Math.random() * 0.35,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: smile.position.y
        };
        
        middleObjects.push(smile);
        middleScene.add(smile);
    }
    
    // Stars
    for (let i = 0; i < 10; i++) {
        const starGeo = new THREE.OctahedronGeometry(0.6, 0);
        const starMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(
            (Math.random() - 0.5) * 55,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        
        star.userData = {
            type: 'star',
            rotSpeed: 0.03 + Math.random() * 0.02,
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: star.position.y
        };
        
        middleObjects.push(star);
        middleScene.add(star);
    }
    
    // Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    const colorOptions = [
        new THREE.Color(0xFF6B6B),
        new THREE.Color(0x4ECDC4),
        new THREE.Color(0xFFE66D),
        new THREE.Color(0x667eea)
    ];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 70;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.6,
        transparent: true,
        opacity: 0.8,
        vertexColors: true
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    middleObjects.push(particles);
    middleScene.add(particles);
    
    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    middleScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFF6B6B, 1.2, 40);
    light1.position.set(15, 8, 15);
    middleScene.add(light1);
    
    const light2 = new THREE.PointLight(0x4ECDC4, 1, 40);
    light2.position.set(-15, -8, 15);
    middleScene.add(light2);
    
    const light3 = new THREE.PointLight(0xFFE66D, 0.8, 40);
    light3.position.set(0, 0, 20);
    middleScene.add(light3);
}

function initMobileMiddle3D() {
    // Mobile: Simple bubble animation
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x667eea, 0xff9a9e];
    
    // Simple floating bubbles
    for (let i = 0; i < 6; i++) {
        const bubbleGeo = new THREE.SphereGeometry(0.8 + Math.random() * 0.8, 16, 16);
        const bubbleMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.7,
            shininess: 150
        });
        
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 5
        );
        
        bubble.userData = {
            type: 'bubble',
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: bubble.position.y,
            wobbleSpeed: 1 + Math.random()
        };
        
        middleObjects.push(bubble);
        middleScene.add(bubble);
    }
    
    // Simple twinkling dots
    for (let i = 0; i < 15; i++) {
        const dotGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.9
        });
        
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 5
        );
        
        dot.userData = {
            type: 'dot',
            floatSpeed: 0.4 + Math.random() * 0.6,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: dot.position.y,
            originalX: dot.position.x
        };
        
        middleObjects.push(dot);
        middleScene.add(dot);
    }
    
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    middleScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFF6B6B, 0.8, 25);
    light1.position.set(8, 5, 10);
    middleScene.add(light1);
    
    const light2 = new THREE.PointLight(0x4ECDC4, 0.6, 25);
    light2.position.set(-8, -5, 10);
    middleScene.add(light2);
    
    animateMiddle();
}

function animateMiddle() {
    requestAnimationFrame(animateMiddle);
    
    const time = Date.now() * 0.001;
    
    middleObjects.forEach(obj => {
        if (obj.userData.type === 'tooth') {
            obj.rotation.x += obj.userData.rotSpeedX;
            obj.rotation.y += obj.userData.rotSpeedY;
        }
        
        if (obj.userData.type === 'star') {
            obj.rotation.x += obj.userData.rotSpeed;
            obj.rotation.y += obj.userData.rotSpeed;
        }
        
        if (obj.userData.floatSpeed) {
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.5;
            
            // Add wobble for mobile bubbles
            if (obj.userData.type === 'bubble') {
                obj.position.x += Math.sin(time * obj.userData.wobbleSpeed + obj.userData.floatOffset) * 0.01;
            }
            
            // Add side movement for dots
            if (obj.userData.type === 'dot') {
                obj.position.x = obj.userData.originalX + Math.sin(time * 0.5 + obj.userData.floatOffset) * 2;
            }
        }
        
        if (obj.type === 'Points') {
            obj.rotation.y += 0.001;
        }
    });
    
    middleRenderer.render(middleScene, middleCamera);
}

// ==================== HOME FOOTER CTA 3D ====================
let footerScene, footerCamera, footerRenderer, footerObjects = [];

function initFooter3D() {
    const canvas = document.getElementById('footer-canvas');
    if (!canvas) return;
    
    footerScene = new THREE.Scene();
    footerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    footerRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    footerRenderer.setSize(window.innerWidth, 400);
    footerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1 : 2));
    
    footerCamera.position.z = 25;
    
    if (isMobile()) {
        initMobileFooter3D();
    } else {
        initDesktopFooter3D();
    }
    
    animateFooter();
}

function initDesktopFooter3D() {
    // Desktop: Glowing orbs
    const colors = [0xFFE66D, 0xFF6B6B, 0x4ECDC4, 0x667eea, 0xffffff];
    
    for (let i = 0; i < 12; i++) {
        const orbGeo = new THREE.SphereGeometry(1 + Math.random() * 1.5, 16, 16);
        const orbMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.6,
            shininess: 150,
            emissive: colors[i % colors.length],
            emissiveIntensity: 0.3
        });
        
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        
        orb.userData = {
            floatSpeed: 0.2 + Math.random() * 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: orb.position.y,
            scaleDir: 1
        };
        
        footerObjects.push(orb);
        footerScene.add(orb);
    }
    
    // Ring shapes
    for (let i = 0; i < 6; i++) {
        const ringGeo = new THREE.TorusGeometry(1.5, 0.2, 8, 32);
        const ringMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.5,
            wireframe: true
        });
        
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 8
        );
        
        ring.userData = {
            rotSpeed: 0.01 + Math.random() * 0.01,
            floatSpeed: 0.25 + Math.random() * 0.25,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: ring.position.y
        };
        
        footerObjects.push(ring);
        footerScene.add(ring);
    }
    
    // Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 70;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = (Math.random() - 0.5) * 15;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.4,
        transparent: true,
        opacity: 0.7
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    footerObjects.push(particles);
    footerScene.add(particles);
    
    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    footerScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFFE66D, 1.2, 40);
    light1.position.set(10, 5, 15);
    footerScene.add(light1);
    
    const light2 = new THREE.PointLight(0xFF6B6B, 1, 40);
    light2.position.set(-10, -5, 15);
    footerScene.add(light2);
}

function initMobileFooter3D() {
    // Mobile: Simple rising bubbles
    const colors = [0xFFE66D, 0xFF6B6B, 0x4ECDC4, 0x667eea];
    
    // Rising bubbles
    for (let i = 0; i < 8; i++) {
        const bubbleGeo = new THREE.SphereGeometry(0.5 + Math.random() * 0.7, 12, 12);
        const bubbleMat = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.6,
            shininess: 120
        });
        
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set(
            (Math.random() - 0.5) * 25,
            -8 + Math.random() * 2,
            (Math.random() - 0.5) * 5
        );
        
        bubble.userData = {
            type: 'bubble',
            riseSpeed: 0.02 + Math.random() * 0.02,
            wobbleSpeed: 1 + Math.random() * 2,
            wobbleOffset: Math.random() * Math.PI * 2,
            originalX: bubble.position.x,
            startY: bubble.position.y
        };
        
        footerObjects.push(bubble);
        footerScene.add(bubble);
    }
    
    // Simple glow dots
    for (let i = 0; i < 12; i++) {
        const dotGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.8
        });
        
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 5
        );
        
        dot.userData = {
            type: 'dot',
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: dot.position.y
        };
        
        footerObjects.push(dot);
        footerScene.add(dot);
    }
    
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    footerScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xFFE66D, 0.8, 25);
    light1.position.set(5, 3, 12);
    footerScene.add(light1);
}

function animateFooter() {
    requestAnimationFrame(animateFooter);
    
    const time = Date.now() * 0.001;
    
    footerObjects.forEach(obj => {
        if (obj.userData.rotSpeed) {
            obj.rotation.x += obj.userData.rotSpeed;
            obj.rotation.y += obj.userData.rotSpeed;
        }
        
        if (obj.userData.floatSpeed) {
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.2;
        }
        
        if (obj.type === 'Points') {
            obj.rotation.y += 0.001;
        }
    });
    
    footerRenderer.render(footerScene, footerCamera);
}

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Detect page and initialize appropriate 3D
    const path = window.location.pathname;
    const canvas = document.getElementById('page-canvas');
    
    if (document.getElementById('hero-canvas')) {
        initHome();
        
        // Add home page extra 3D sections
        if (document.getElementById('middle-canvas')) {
            initMiddle3D();
        }
        if (document.getElementById('footer-canvas')) {
            initFooter3D();
        }
    }
    else if (canvas) {
        if (path === '/about' || document.querySelector('.about-section')) {
            initAbout3D();
        } else if (path === '/services' || document.querySelector('.services-showcase')) {
            initServices3D();
        } else if (path === '/gallery' || document.querySelector('.gallery-grid')) {
            initGallery3D();
        } else if (path === '/contact' || document.querySelector('.contact-form-card')) {
            initContact3D();
        } else {
            // Default: About style
            initAbout3D();
        }
    }
    
    // Form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for booking an appointment! We will contact you shortly.');
            this.reset();
        });
    }
    
    // Gallery lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.querySelector('.lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        
        document.querySelectorAll('.gallery-grid img').forEach(img => {
            img.addEventListener('click', function() {
                if (lightboxImg) lightboxImg.src = this.src;
                lightbox.classList.add('active');
            });
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
    
    // Set minimum date for appointment form
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});
