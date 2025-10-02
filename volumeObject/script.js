const threeContainer = document.getElementById('threeContainer');
const content = document.querySelector('.section-input');
const objectInfo = document.getElementById('objectInfo');

// Переменные для Three.js
let scene, camera, renderer, objectGroup;
let isObjectVisible = false;
let autoHideTimeout = null;

// Глобальная функция для показа объемного объекта
window.volumeObject = function() {
    if (!isObjectVisible) {
        showThreeObject();
    }
};

// Инициализация Three.js сцены
function initThreeJS() {
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = null;
    
    // Создание камеры
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;
    
    // Создание рендерера
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeContainer.appendChild(renderer.domElement);
    
    // Создание группы объектов
    objectGroup = new THREE.Group();
    scene.add(objectGroup);
    
    // Основной объект - икосаэдр
    const geometry = new THREE.IcosahedronGeometry(3, 1);
    const material = new THREE.MeshLambertMaterial({ 
        color: 0xE45319,
        // shininess: 100,
        transparent: true,
        opacity: 0.95,
        // specular: 0xffffff
    });
    const mainObject = new THREE.Mesh(geometry, material);
    objectGroup.add(mainObject);
    
    // Внутренний объект - изменен цвет на #E45319
    const innerGeometry = new THREE.OctahedronGeometry(2, 1);
    const innerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xE45319, // Оранжевый цвет
        shininess: 100,
        transparent: true,
        opacity: 0.9,
        specular: 0xE45319
    });
    const innerObject = new THREE.Mesh(innerGeometry, innerMaterial);
    objectGroup.add(innerObject);
    
    // Внешняя сфера
    const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    objectGroup.add(sphere);
    
    // Частицы
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0x00ffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 1);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);
    
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('wheel', onMouseWheel, false);
}

function onMouseWheel(event) {
    if (!isObjectVisible) return;
    
    event.preventDefault();
    camera.position.z += event.deltaY * 0.01;
    camera.position.z = Math.max(5, Math.min(20, camera.position.z));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (objectGroup && isObjectVisible) {
        objectGroup.rotation.x += 0.008;
        objectGroup.rotation.y += 0.012;
        objectGroup.rotation.z += 0.005;
        
        const scale = 1 + Math.sin(Date.now() * 0.0015) * 0.15;
        objectGroup.scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}

function showThreeObject() {
    if (!isObjectVisible) {
        isObjectVisible = true;
        
        // Очищаем предыдущий таймер
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
        }
        
        // Затемняем контент
        content.classList.add('fixed');
        
        // Показываем 3D объект
        threeContainer.classList.add('visible');
        
        // Показываем подсказку
        setTimeout(() => {
            objectInfo.classList.add('visible');
        }, 500);
        
        // Автоматическое скрытие через 7 секунд
        autoHideTimeout = setTimeout(() => {
            hideThreeObject();
        }, 7000);
    }
}

function hideThreeObject() {
    if (isObjectVisible) {
        isObjectVisible = false;
        
        // Возвращаем нормальный вид контенту
        content.classList.remove('fixed');
        content.scrollIntoView({
            block: 'center'
        });
        
        // Скрываем 3D объект
        threeContainer.classList.remove('visible');
        
        // Скрываем подсказку
        objectInfo.classList.remove('visible');
        
        // Сбрасываем позицию камеры
        camera.position.z = 12;
        
        // Очищаем таймер
        autoHideTimeout = null;
    }
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    initThreeJS();
    animate();
});

// Обработчик кнопки
// showButton.addEventListener('click', showThreeObject);

// Скрыть объект при клике
document.addEventListener('click', (e) => {
    if (isObjectVisible && !e.target.closest('.content')) {
        hideThreeObject();
    }
});

// Демонстрация вызова функции из консоли
console.log('Функция volumeObject() доступна глобально!');
console.log('Попробуйте в консоли: volumeObject()');

window.volumeObject = volumeObject;