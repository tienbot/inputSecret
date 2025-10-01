function executeCommand() {
    const input = document.getElementById('commandInput');
    const command = input.value.trim();
    
    // Обрабатываем команды
    switch(command) {
        case 'hellFire();':
            hellFire();
            break;
        case 'matrixEffect();':
            matrixEffect();
            break;
        case 'makeSomeMagic();':
            makeSomeMagic();
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


// Игра Turncards
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