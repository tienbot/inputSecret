
function topSection(){
    const WIDTH = 700;
    const HEIGHT = 700;
    const TEXT_J = "J";
    const TEXT_S = "S";
    const FONT = "bold 530px Arturito, sans-serif";
    const VERTICAL_SPACING = 160; // Расстояние между буквами по вертикали
    const HORIZONTAL_SPACING = -20; // Расстояние между буквами по горизонтали

    const bgCanvas = document.getElementById("bgCanvas");
    const fgCanvas = document.getElementById("fgCanvas");
    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    const completionMessage = document.getElementById("completionMessage");

    // Ждем загрузки шрифта
    const arturitoFont = new FontFace('Arturito', 'url(./fonts/arturito.ttf)');

    arturitoFont.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        initializeCanvas();
    }).catch((error) => {
        console.error('Ошибка загрузки шрифта:', error);
        initializeCanvas(); // Все равно инициализируем с fallback шрифтом
    });

    function initializeCanvas() {
        // Создаем временный canvas для определения области текста
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = WIDTH;
        tempCanvas.height = HEIGHT;

        // Маска для определения точной области текста
        let textMask = null;

        // Функция для измерения ширины текста
        function getTextWidth(text, ctx) {
        ctx.font = FONT;
        return ctx.measureText(text).width;
        }

        // универсальная функция для отрисовки текста
        function drawText(ctx, fillStyle) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = fillStyle;
        ctx.font = FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Измеряем ширину букв
        const jWidth = getTextWidth(TEXT_J, ctx);
        const sWidth = getTextWidth(TEXT_S, ctx);
        
        // Вычисляем позиции для центрирования
        const totalWidth = jWidth + sWidth + HORIZONTAL_SPACING;
        const startX = (WIDTH - totalWidth) / 2;
        
        // Рисуем букву J
        const jX = startX + jWidth / 2;
        const jY = HEIGHT / 2 - VERTICAL_SPACING / 2;
        ctx.fillText(TEXT_J, jX, jY);
        
        // Рисуем букву S
        const sX = startX + jWidth + HORIZONTAL_SPACING + sWidth / 2;
        const sY = HEIGHT / 2 + VERTICAL_SPACING / 2;
        ctx.fillText(TEXT_S, sX, sY);
        }

        // Создаем маску текста для точной проверки
        function createTextMask() {
        tempCtx.clearRect(0, 0, WIDTH, HEIGHT);
        tempCtx.fillStyle = "#000";
        tempCtx.font = FONT;
        tempCtx.textAlign = "center";
        tempCtx.textBaseline = "middle";
        
        // Измеряем ширину букв
        const jWidth = getTextWidth(TEXT_J, tempCtx);
        const sWidth = getTextWidth(TEXT_S, tempCtx);
        
        // Вычисляем позиции для центрирования
        const totalWidth = jWidth + sWidth + HORIZONTAL_SPACING;
        const startX = (WIDTH - totalWidth) / 2;
        
        // Рисуем букву J
        const jX = startX + jWidth / 2;
        const jY = HEIGHT / 2 - VERTICAL_SPACING / 2;
        tempCtx.fillText(TEXT_J, jX, jY);
        
        // Рисуем букву S
        const sX = startX + jWidth + HORIZONTAL_SPACING + sWidth / 2;
        const sY = HEIGHT / 2 + VERTICAL_SPACING / 2;
        tempCtx.fillText(TEXT_S, sX, sY);
        
        const imageData = tempCtx.getImageData(0, 0, WIDTH, HEIGHT);
        textMask = imageData.data;
        }

        // проверка, полностью ли стёрта надпись
        function checkCompletion() {
        if (!textMask) return false;

        const imageData = fgCtx.getImageData(0, 0, WIDTH, HEIGHT);
        const pixels = imageData.data;

        // Проверяем только пиксели текста
        for (let i = 0; i < pixels.length; i += 4) {
            if (textMask[i + 3] > 128) { 
            // если хотя бы один пиксель текста ещё непрозрачный — возвращаем false
            if (pixels[i + 3] >= 128) {
                return false;
            }
            }
        }

        // если ВСЕ пиксели текста прозрачные
        return true;
        }

        // стираем часть чёрной надписи
        function erase(x, y) {
        fgCtx.globalCompositeOperation = "destination-out";
        fgCtx.beginPath();
        fgCtx.arc(x, y, 30, 0, Math.PI * 2);
        fgCtx.fill();
        fgCtx.globalCompositeOperation = "source-over";
        
        // Проверяем завершение после каждого стирания
        if (checkCompletion() && !completionMessage.classList.contains('show')) {
            completionMessage.classList.add('show');
        }
        }

        // события мыши и касаний
        let isDrawing = false;

        fgCanvas.addEventListener("mousedown", e => {
        isDrawing = true;
        erase(e.offsetX, e.offsetY);
        });

        fgCanvas.addEventListener("mousemove", e => {
        if (isDrawing) erase(e.offsetX, e.offsetY);
        });

        fgCanvas.addEventListener("mouseup", () => isDrawing = false);
        fgCanvas.addEventListener("mouseleave", () => isDrawing = false);

        fgCanvas.addEventListener("touchstart", e => {
        e.preventDefault();
        isDrawing = true;
        const rect = fgCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        erase(touch.clientX - rect.left, touch.clientY - rect.top);
        });

        fgCanvas.addEventListener("touchmove", e => {
        e.preventDefault();
        if (isDrawing) {
            const rect = fgCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            erase(touch.clientX - rect.left, touch.clientY - rect.top);
        }
        });

        fgCanvas.addEventListener("touchend", () => isDrawing = false);

        // запуск
        drawText(bgCtx, "#E45319"); // новый цвет фона
        drawText(fgCtx, "#000");    // чёрная надпись поверх
        createTextMask(); // создаем маску текста для точной проверки
    }
}

function centerSection(){
    let secretCounter = document.querySelector('#secret-counter');
    let counterValue = 0;
    secretCounter.innerHTML = counterValue;
    let totalEffects = document.querySelector('#total-effects');
    let totalEffectsNumber = 4;
    totalEffects.innerHTML = totalEffectsNumber;

    // Храним какие команды уже были выполнены (для счетчика)
    let executedCommands = new Set();

    function incrementCount(command){
        // Если команда уже выполнялась - не увеличиваем счетчик
        if (executedCommands.has(command)) {
            return false;
        }
        
        // Первое выполнение команды - увеличиваем счетчик
        counterValue++;
        secretCounter.innerHTML = counterValue;
        executedCommands.add(command);
        
        if (counterValue === totalEffectsNumber) {
            console.log('Ебать ты программист!')
        }
        return true;
    }

    function executeCommand() {
        const input = document.getElementById('commandInput');
        const command = input.value.trim();
        
        // Обрабатываем команды
        switch(command) {
            case 'hellFire();':
                incrementCount(command); // Счетчик увеличится только при первом вызове
                hellFire(); // Функция выполняется всегда
                break;
            case 'matrixEffect();':
                incrementCount(command); // Счетчик увеличится только при первом вызове
                matrixEffect(); // Функция выполняется всегда
                break;
            case 'makeSomeMagic();':
                incrementCount(command); // Счетчик увеличится только при первом вызове
                makeSomeMagic(); // Функция выполняется всегда
                break;
            case 'volumeObject();':
                incrementCount(command); // Счетчик увеличится только при первом вызове
                volumeObject(); // Функция выполняется всегда
                break;
            default:
                if (command) {
                    console.error(`Ошибка: неизвестная команда "${command}"`);
                }
                break;
        }
        
        // Очищаем поле ввода
        input.value = '';
    }

    // Обработка нажатия Enter
    document.getElementById('commandInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
}

function footerSection(){
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.card');
        const fullscreenMessage = document.getElementById('fullscreenMessage');
        const cardsContainer = document.getElementById('cardsContainer');
        
        // Правильная последовательность
        const correctSequence = [4, 2, 6, 1, 5, 3];
        let currentSequence = [];
        let gameCompleted = false;
        
        // Обработчик клика по карточке
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (gameCompleted) return;
                
                const cardIndex = parseInt(card.getAttribute('data-index'));
                
                // Если карточка уже перевернута, игнорируем клик
                if (card.classList.contains('flipped')) return;
                
                // Переворачиваем карточку
                card.classList.add('flipped');
                
                // Добавляем индекс в текущую последовательность
                currentSequence.push(cardIndex);
                
                // Проверяем последовательность
                checkSequence();
            });
        });
        
        // Функция проверки последовательности
        function checkSequence() {
            // Если последовательность нарушена
            for (let i = 0; i < currentSequence.length; i++) {
                if (currentSequence[i] !== correctSequence[i]) {
                    // Сбрасываем игру через небольшую задержку для визуального эффекта
                    setTimeout(resetGame, 500);
                    return;
                }
            }
            
            // Если последовательность правильная и все карточки открыты
            if (currentSequence.length === correctSequence.length) {
                gameCompleted = true;
                
                // Активируем полноэкранный режим
                activateFullscreenMode();
            }
        }
        
        // Функция сброса игры
        function resetGame() {
            cards.forEach(card => {
                card.classList.remove('flipped');
            });
            currentSequence = [];
        }
        
        // Функция активации полноэкранного режима
        function activateFullscreenMode() {
            // Добавляем класс для полноэкранного режима
            cardsContainer.classList.add('fullscreen');
            
            // Показываем сообщение поверх карточек
            setTimeout(() => {
                fullscreenMessage.style.display = 'flex';
            }, 1000);
            
            // Добавляем обработчик клика для сброса полноэкранного режима
            cardsContainer.addEventListener('click', resetFullscreenMode);
            fullscreenMessage.addEventListener('click', resetFullscreenMode);
        }
        
        // Функция сброса полноэкранного режима
        function resetFullscreenMode() {
            cardsContainer.classList.remove('fullscreen');
            fullscreenMessage.style.display = 'none';
            
            // Убираем обработчики событий
            cardsContainer.removeEventListener('click', resetFullscreenMode);
            fullscreenMessage.removeEventListener('click', resetFullscreenMode);
        }
    });
}


topSection()
centerSection()
footerSection()