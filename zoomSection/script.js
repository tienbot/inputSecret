// Управление показом/скрытием 3D проекта
const closeProjectBtn = document.getElementById('closeProjectBtn')
const project3d = document.getElementById('project3d')
const websiteSections = document.querySelectorAll('.website-section')

// Используем делегирование событий для динамически созданной кнопки
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'deeper') {
    // Скрываем основные секции сайта
    websiteSections.forEach((section) => {
      section.style.display = 'none'
    })

    // Показываем 3D проект
    project3d.style.display = 'block'

    // Инициализируем скролл для 3D проекта
    init3DScroll()
  }
})

closeProjectBtn.addEventListener('click', function () {
  websiteSections.forEach((section) => (section.style.display = 'flex'))
  project3d.style.display = 'none'

  // сброс скролла и стилей
  document.body.style.height = 'auto'
  document.body.style.overflow = 'auto'
  window.onscroll = null

  // Прокрутка к секции section-input без анимации
  const sectionInput = document.querySelector('.section-input')
  if (sectionInput) {
    sectionInput.scrollIntoView({ behavior: 'instant' })
  }
})

// Функция для инициализации 3D скролла
function init3DScroll() {
  let zSpacing = -1500,
    $frames = document.getElementsByClassName('frame'),
    frames = Array.from($frames)

  const speed = 7
  const depthOffset = 4000 // двигает всё ближе к камере

  const maxScroll = ((frames.length - 1) * Math.abs(zSpacing)) / speed + 500
  document.body.style.height = `${maxScroll}px`

  window.onscroll = function () {
    let top = document.documentElement.scrollTop
    if (top < 0) top = 0
    if (top > maxScroll) top = maxScroll

    frames.forEach(function (frame, i) {
      let z = i * zSpacing + zSpacing + top * speed + depthOffset

      let opacity = z < Math.abs(zSpacing) / 1.8 ? 1 : 0
      if (i === frames.length - 1) opacity = 1

      frame.style.transform = `translateZ(${z}px)`
      frame.style.opacity = opacity
    })
  }

  document.addEventListener(
    'wheel',
    function (e) {
      e.preventDefault()
      let newScroll = document.documentElement.scrollTop + e.deltaY
      if (newScroll < 0) newScroll = 0
      if (newScroll > maxScroll) newScroll = maxScroll
      window.scrollTo(0, newScroll)
    },
    { passive: false }
  )

  window.scrollTo(0, 1)
}