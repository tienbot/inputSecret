function topSection() {
  const WIDTH = 700
  const HEIGHT = 700
  const TEXT_J = 'J'
  const TEXT_S = 'S'
  const FONT = 'bold 530px Arturito, sans-serif'
  const VERTICAL_SPACING = 160 // Расстояние между буквами по вертикали
  const HORIZONTAL_SPACING = -20 // Расстояние между буквами по горизонтали

  const bgCanvas = document.getElementById('bgCanvas')
  const fgCanvas = document.getElementById('fgCanvas')
  const bgCtx = bgCanvas.getContext('2d')
  const fgCtx = fgCanvas.getContext('2d')
  const completionMessage = document.getElementById('completionMessage')

  // Ждем загрузки шрифта
  const arturitoFont = new FontFace('Arturito', 'url(./fonts/arturito.ttf)')

  arturitoFont
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont)
      initializeCanvas()
    })
    .catch((error) => {
      console.error('Ошибка загрузки шрифта:', error)
      initializeCanvas() // Все равно инициализируем с fallback шрифтом
    })

  function initializeCanvas() {
    // Создаем временный canvas для определения области текста
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    tempCanvas.width = WIDTH
    tempCanvas.height = HEIGHT

    // Маска для определения точной области текста
    let textMask = null

    // Функция для измерения ширины текста
    function getTextWidth(text, ctx) {
      ctx.font = FONT
      return ctx.measureText(text).width
    }

    // универсальная функция для отрисовки текста
    function drawText(ctx, fillStyle) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = fillStyle
      ctx.font = FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Измеряем ширину букв
      const jWidth = getTextWidth(TEXT_J, ctx)
      const sWidth = getTextWidth(TEXT_S, ctx)

      // Вычисляем позиции для центрирования
      const totalWidth = jWidth + sWidth + HORIZONTAL_SPACING
      const startX = (WIDTH - totalWidth) / 2

      // Рисуем букву J
      const jX = startX + jWidth / 2
      const jY = HEIGHT / 2 - VERTICAL_SPACING / 2
      ctx.fillText(TEXT_J, jX, jY)

      // Рисуем букву S
      const sX = startX + jWidth + HORIZONTAL_SPACING + sWidth / 2
      const sY = HEIGHT / 2 + VERTICAL_SPACING / 2
      ctx.fillText(TEXT_S, sX, sY)
    }

    // Создаем маску текста для точной проверки
    function createTextMask() {
      tempCtx.clearRect(0, 0, WIDTH, HEIGHT)
      tempCtx.fillStyle = '#000'
      tempCtx.font = FONT
      tempCtx.textAlign = 'center'
      tempCtx.textBaseline = 'middle'

      // Измеряем ширину букв
      const jWidth = getTextWidth(TEXT_J, tempCtx)
      const sWidth = getTextWidth(TEXT_S, tempCtx)

      // Вычисляем позиции для центрирования
      const totalWidth = jWidth + sWidth + HORIZONTAL_SPACING
      const startX = (WIDTH - totalWidth) / 2

      // Рисуем букву J
      const jX = startX + jWidth / 2
      const jY = HEIGHT / 2 - VERTICAL_SPACING / 2
      tempCtx.fillText(TEXT_J, jX, jY)

      // Рисуем букву S
      const sX = startX + jWidth + HORIZONTAL_SPACING + sWidth / 2
      const sY = HEIGHT / 2 + VERTICAL_SPACING / 2
      tempCtx.fillText(TEXT_S, sX, sY)

      const imageData = tempCtx.getImageData(0, 0, WIDTH, HEIGHT)
      textMask = imageData.data
    }

    // проверка, полностью ли стёрта надпись
    function checkCompletion() {
      if (!textMask) return false

      const imageData = fgCtx.getImageData(0, 0, WIDTH, HEIGHT)
      const pixels = imageData.data

      // Проверяем только пиксели текста
      for (let i = 0; i < pixels.length; i += 4) {
        if (textMask[i + 3] > 128) {
          // если хотя бы один пиксель текста ещё непрозрачный — возвращаем false
          if (pixels[i + 3] >= 128) {
            return false
          }
        }
      }

      // если ВСЕ пиксели текста прозрачные
      return true
    }

    // стираем часть чёрной надписи
    function erase(x, y) {
      fgCtx.globalCompositeOperation = 'destination-out'
      fgCtx.beginPath()
      fgCtx.arc(x, y, 30, 0, Math.PI * 2)
      fgCtx.fill()
      fgCtx.globalCompositeOperation = 'source-over'

      // Проверяем завершение после каждого стирания
      if (checkCompletion() && !completionMessage.classList.contains('show')) {
        completionMessage.classList.add('show')
      }
    }

    // события мыши и касаний
    let isDrawing = false

    fgCanvas.addEventListener('mousedown', (e) => {
      isDrawing = true
      erase(e.offsetX, e.offsetY)
    })

    fgCanvas.addEventListener('mousemove', (e) => {
      if (isDrawing) erase(e.offsetX, e.offsetY)
    })

    fgCanvas.addEventListener('mouseup', () => (isDrawing = false))
    fgCanvas.addEventListener('mouseleave', () => (isDrawing = false))

    fgCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      isDrawing = true
      const rect = fgCanvas.getBoundingClientRect()
      const touch = e.touches[0]
      erase(touch.clientX - rect.left, touch.clientY - rect.top)
    })

    fgCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      if (isDrawing) {
        const rect = fgCanvas.getBoundingClientRect()
        const touch = e.touches[0]
        erase(touch.clientX - rect.left, touch.clientY - rect.top)
      }
    })

    fgCanvas.addEventListener('touchend', () => (isDrawing = false))

    // запуск
    drawText(bgCtx, '#E45319') // новый цвет фона
    drawText(fgCtx, '#000') // чёрная надпись поверх
    createTextMask() // создаем маску текста для точной проверки
  }
}

function revolverSlider() {
  ;(function () {
    const items = Array.from({ length: 16 }, (_, i) => ({
      title: `Карта ${i + 1}`,
      text: `Описание ${i + 1}`,
    }))

    const carousel = document.getElementById('carousel')
    const total = items.length
    const nodes = []

    for (let i = 0; i < total; i++) {
      const el = document.createElement('div')
      el.className = 'slide'
      el.dataset.index = i
      el.innerHTML = `
          <div class="inner">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            <div>${items[i].title}</div>
            <p>${items[i].text}</p>
          </div>`
      carousel.appendChild(el)
      nodes.push(el)

      // обработчик клика
      el.addEventListener('click', () => {
        // вычисляем offset карточки от текущего центра
        const baseCenter = Math.floor(center)
        const offset = relOffset(i, mod(baseCenter, total))
        center = center + offset // сдвигаем центр
        render(true)
      })
    }

    const GAP = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 120
    const CARD_W = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-w')) || 240

    let center = 0
    function mod(n, m) {
      return ((n % m) + m) % m
    }
    function relOffset(i, center) {
      let raw = i - center
      if (raw > total / 2) raw -= total
      if (raw <= -total / 2) raw += total
      return raw
    }

    function renderAt(centerValue, animated = true) {
      const baseCenter = Math.floor(centerValue)
      const frac = centerValue - baseCenter

      nodes.forEach((node, i) => {
        const offsetInt = relOffset(i, mod(baseCenter, total))
        const exactOffset = offsetInt - frac

        const abs = Math.abs(exactOffset)
        const z = -abs * 120
        const x = exactOffset * (CARD_W * 0.6 + GAP * 0.4)
        // const ry = exactOffset * -14;
        const ry = 0
        const scale = exactOffset === 0 ? 1 : Math.max(0.68, 1 - abs * 0.01)

        // показываем только в пределах 3-х соседей
        const opacity = abs > 3 ? 0 : 1

        // НОВЫЙ КОД: Устанавливаем прозрачность для внутреннего контента
        const innerEl = node.querySelector('.inner')
        if (innerEl) {
          if (exactOffset === 0) {
            // Активная карточка - без прозрачности
            innerEl.style.opacity = '1'
          } else if (abs <= 3) {
            // Боковые карточки - чем дальше, тем более прозрачные
            // Формула: 1 - (расстояние * 0.25) - чем дальше, тем прозрачнее
            const innerOpacity = Math.max(0.2, 1 - abs * 0.25)
            innerEl.style.opacity = innerOpacity.toString()
          } else {
            // Карточки за пределами видимости
            innerEl.style.opacity = '0'
          }
        }

        node.style.zIndex = Math.round(100 - abs)
        node.style.opacity = opacity
        node.style.transitionDuration = animated ? '420ms' : '0ms'
        node.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) translateY(-50%) translateX(-50%) scale(${scale})`

        if (Math.round(exactOffset) === 0) {
          node.setAttribute('aria-current', 'true')
          node.classList.add('active')
        } else {
          node.removeAttribute('aria-current')
          node.classList.remove('active')
        }
        node.dataset.index = mod(i, total)
      })
    }

    function render(animated = true) {
      renderAt(center, animated)
    }
    render(false)

    // свайп
    let pointer = { down: false, startX: 0, lastX: 0, dx: 0, startTime: 0 }
    const stage = document.querySelector('.section-revolver')
    const MIN_SWIPE_DISTANCE_FACTOR = 0.12
    const VELOCITY_INFLUENCE = 0.25
    const MAX_SHIFT = 5

    function onPointerDown(e) {
      pointer.down = true
      pointer.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      pointer.lastX = pointer.startX
      pointer.dx = 0
      pointer.startTime = performance.now()
      nodes.forEach((n) => (n.style.transitionDuration = '0ms'))
    }

    function onPointerMove(e) {
      if (!pointer.down) return
      const x = e.clientX || (e.touches && e.touches[0].clientX) || pointer.lastX
      pointer.lastX = x
      pointer.dx = x - pointer.startX
      const deltaIndex = -pointer.dx / (CARD_W + GAP)
      renderAt(center + deltaIndex, false)
    }

    function onPointerUp() {
      if (!pointer.down) return
      pointer.down = false
      const elapsed = Math.max(1, performance.now() - pointer.startTime)
      const deltaIndex = -pointer.dx / (CARD_W + GAP)
      const velIdxPerSec = deltaIndex / (elapsed / 1000)

      const minDist = (CARD_W + GAP) * MIN_SWIPE_DISTANCE_FACTOR
      let rawShift = 0
      if (Math.abs(pointer.dx) > minDist || Math.abs(velIdxPerSec) > 0.6) {
        rawShift = deltaIndex + velIdxPerSec * VELOCITY_INFLUENCE
      }
      let shift = Math.round(rawShift)
      if (shift > MAX_SHIFT) shift = MAX_SHIFT
      if (shift < -MAX_SHIFT) shift = -MAX_SHIFT
      center = center + shift
      render(true)
    }

    stage.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    // стрелки
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        center = center + 1
        render(true)
      }
      if (e.key === 'ArrowLeft') {
        center = center - 1
        render(true)
      }
    })

    // автопрокрутка
    let autoId = null
    function startAuto() {
      stopAuto()
      autoId = setInterval(() => {
        center = center + 1
        render(true)
      }, 5000)
    }
    function stopAuto() {
      if (autoId) clearInterval(autoId), (autoId = null)
    }
    stage.addEventListener('mouseenter', stopAuto)
    stage.addEventListener('mouseleave', startAuto)
    startAuto()

    window.addEventListener('resize', () => render(false))
  })()
}

function centerSection() {
  const input = document.getElementById('commandInput')
  let secretCounter = document.querySelector('#secret-counter')
  let counterValue = 0
  secretCounter.innerHTML = counterValue
  let totalEffects = document.querySelector('#total-effects')
  let totalEffectsNumber = 4
  totalEffects.innerHTML = totalEffectsNumber

  // Храним какие команды уже были выполнены (для счетчика)
  let executedCommands = new Set()

function incrementCount(command) {
    // Если команда уже выполнялась - не увеличиваем счетчик
    if (executedCommands.has(command)) {
        return false
    }

    // Первое выполнение команды - увеличиваем счетчик
    counterValue++
    secretCounter.innerHTML = counterValue
    executedCommands.add(command)
    input.placeholder = 'Введите команду...'

    // Показываем кнопку когда счетчик меньше общего количества эффектов
    if (counterValue === totalEffectsNumber) {
        const empty = document.querySelector('.empty')
        // Очищаем контейнер перед добавлением кнопки (на случай повторного вызова)
        empty.innerHTML = ''
        
        // Добавляем кнопку
        const button = document.createElement('button')
        button.id = 'deeper'
        button.textContent = 'Погружаемся глубже!'
        
        empty.appendChild(button)
    }
    return true
}

  function executeCommand() {
    const command = input.value.trim()

    // Обрабатываем команды
    switch (command) {
      case 'hellFire();':
        incrementCount(command)
        hellFire()
        break
      case 'matrixEffect();':
        incrementCount(command)
        matrixEffect()
        break
      case 'makeSomeMagic();':
        incrementCount(command)
        makeSomeMagic()
        break
      case 'volumeObject();':
        incrementCount(command)
        volumeObject()
        break
      default:
        if (command) {
          input.placeholder = 'Нет такой команды!'
        }
        break
    }

    // Очищаем поле ввода
    input.value = ''
  }

  // Обработка нажатия Enter
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      executeCommand()
    }
  })
}

function footerSection() {
  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card')
    const fullscreenMessage = document.getElementById('fullscreenMessage')
    const cardsContainer = document.getElementById('cardsContainer')

    // Правильная последовательность
    const correctSequence = [4, 2, 6, 1, 5, 3]
    let currentSequence = []
    let gameCompleted = false

    // Обработчик клика по карточке
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        if (gameCompleted) return

        const cardIndex = parseInt(card.getAttribute('data-index'))

        // Если карточка уже перевернута, игнорируем клик
        if (card.classList.contains('flipped')) return

        // Переворачиваем карточку
        card.classList.add('flipped')

        // Добавляем индекс в текущую последовательность
        currentSequence.push(cardIndex)

        // Проверяем последовательность
        checkSequence()
      })
    })

    // Функция проверки последовательности
    function checkSequence() {
      // Если последовательность нарушена
      for (let i = 0; i < currentSequence.length; i++) {
        if (currentSequence[i] !== correctSequence[i]) {
          // Сбрасываем игру через небольшую задержку для визуального эффекта
          setTimeout(resetGame, 500)
          return
        }
      }

      // Если последовательность правильная и все карточки открыты
      if (currentSequence.length === correctSequence.length) {
        gameCompleted = true

        // Активируем полноэкранный режим
        activateFullscreenMode()
      }
    }

    // Функция сброса игры
    function resetGame() {
      cards.forEach((card) => {
        card.classList.remove('flipped')
      })
      currentSequence = []
    }

    // Функция активации полноэкранного режима
    function activateFullscreenMode() {
      // Добавляем класс для полноэкранного режима
      cardsContainer.classList.add('fullscreen')

      // Показываем сообщение поверх карточек
      setTimeout(() => {
        fullscreenMessage.style.display = 'flex'
      }, 1000)

      // Добавляем обработчик клика для сброса полноэкранного режима
      cardsContainer.addEventListener('click', resetFullscreenMode)
      fullscreenMessage.addEventListener('click', resetFullscreenMode)
    }

    // Функция сброса полноэкранного режима
    function resetFullscreenMode() {
      cardsContainer.classList.remove('fullscreen')
      fullscreenMessage.style.display = 'none'

      // Убираем обработчики событий
      cardsContainer.removeEventListener('click', resetFullscreenMode)
      fullscreenMessage.removeEventListener('click', resetFullscreenMode)
    }
  })
}

topSection()
revolverSlider()
centerSection()
footerSection()
