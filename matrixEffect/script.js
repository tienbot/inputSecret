// Время анимации в миллисекундах
const animationDuration = 3000;

// Получаем контейнер
const matrixOverlay = document.getElementById('matrixOverlay');

// Переменные для управления анимацией
let animationIntervals = [];
let activeSymbols = 0;
let launchCount = 0;
let currentIntensity = 5; // Базовая интенсивность

// Функция для создания случайного символа (0 или 1)
function getRandomSymbol() {
    return Math.random() > 0.5 ? '0' : '1';
}

// Функция для создания падающего символа
function createFallingSymbol() {
    const symbol = document.createElement('div');
    symbol.className = 'matrix-symbol';
    symbol.textContent = getRandomSymbol();

    // Случайная позиция по горизонтали
    const left = Math.random() * window.innerWidth;
    symbol.style.left = `${left}px`;

    // Начальная позиция сверху
    symbol.style.top = '-30px';

    // Случайная скорость падения
    const baseSpeed = 2 + Math.random() * 2;
    const duration = baseSpeed + Math.random();

    // Применяем анимацию
    symbol.style.animation = `fall ${duration}s linear forwards`;

    // Случайный размер символа
    const size = 14 + Math.random() * 10;
    symbol.style.fontSize = `${size}px`;

    // Случайная прозрачность
    const opacity = 0.5 + Math.random() * 0.5;
    symbol.style.opacity = opacity;

    // Добавляем символ
    matrixOverlay.appendChild(symbol);
    activeSymbols++;

    // Удаляем символ после завершения анимации
    setTimeout(() => {
        if (symbol.parentNode) {
            symbol.parentNode.removeChild(symbol);
            activeSymbols--;
        }
    }, duration * 1000);
}

// Основная функция эффекта Матрицы
function matrixEffect() {
    launchCount++;

    // Увеличиваем интенсивность с каждым запуском (но не более 20)
    currentIntensity = Math.min(5 + launchCount * 2, 20);

    // Интенсивность
    const intensity = currentIntensity;

    // Запускаем создание символов
    const intervalId = setInterval(() => {
        for (let i = 0; i < intensity; i++) {
            createFallingSymbol();
        }
    }, 50);

    animationIntervals.push(intervalId);

    // Останавливаем анимацию через заданное время
    setTimeout(() => {
        const index = animationIntervals.indexOf(intervalId);
        if (index > -1) {
            clearInterval(intervalId);
            animationIntervals.splice(index, 1);
        }
    }, animationDuration);
}

// Экспортируем в глобальную область
window.matrixEffect = matrixEffect;
