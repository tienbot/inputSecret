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

// Фокус на поле ввода при загрузке
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('commandInput').focus();
});