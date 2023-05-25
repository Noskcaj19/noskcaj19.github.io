const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

var radius = 3
var linkingDist = 90
var fadeRange = 10
var fadeDist = linkingDist + fadeRange
var running = reducedMotionQuery && !reducedMotionQuery.matches
var timeout

function random(low, high) {
  return low + Math.random() * (high - low)
}

function range(low, high) {
  let out = []
  for (let i = low; i < high; i++) {
    out.push(i)
  }
  return out
}

function distance(x1, y1, x2, y2) {
  let a = x1 - x2
  let b = y1 - y2

  return Math.sqrt(a ** 2 + b ** 2)
}

let setup = () => {
  const width = window.innerWidth
  const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  )
  const bias = ((width + fadeDist) * (height + fadeDist)) / 2
  const count = Math.min(bias * 0.0005, 1000)

  let canvas = document.getElementById('canvas')
  let pauseButton = document.getElementById('pause-button')
  canvas.width = width
  canvas.height = height
  canvas.setAttribute('width', width.toString())
  canvas.setAttribute('height', height.toString())

  let ctx = canvas.getContext('2d')

  let nodes = range(0, count).map(
    () => ({
      x: random(-fadeDist, width + fadeDist),
      y: random(-fadeDist, height + fadeDist),
      xs: random(-0.3, 0.3),
      ys: random(-0.3, 0.3),
    }),
  )

  ctx.strokeStyle = '#404040'
  ctx.fillStyle = 'clear'
  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    for (const node of nodes) {
      for (const otherNode of nodes) {
        if (node.x != otherNode.x && node.y != otherNode.y) {
          let nodeDistance = distance(node.x, node.y, otherNode.x, otherNode.y)
          if (nodeDistance < linkingDist) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          } else if (nodeDistance < fadeDist) {
            ctx.globalAlpha = (fadeDist - nodeDistance) / fadeRange
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    for (const node of nodes) {
      ctx.moveTo(node.x + radius, node.y)
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      node.x = node.x + node.xs
      node.y = node.y + node.ys

      if (node.x > (width + radius + fadeDist)) {
        node.x = -(radius + fadeDist)
      }

      if (node.y > (height + radius + fadeDist)) {
        node.y = -(radius + fadeDist)
      }

      if (node.x < -(radius + fadeDist)) {
        node.x = width + radius + fadeDist
      }

      if (node.y < -(radius + fadeDist)) {
        node.y = height + radius + fadeDist
      }
    }
    clearTimeout(timeout)
    if (running) {
      timeout = setTimeout(draw, 50)
    }
  }

  function setPauseState(newRunning) {
    running = newRunning
    if (running) {
      pauseButton.className = ''
      draw()
    } else {
      pauseButton.className = 'paused'
    }
  }

  pauseButton.onclick = () => setPauseState(!running)

  onresize = setup
  reducedMotionQuery.addEventListener('change', () => {
    setPauseState(!reducedMotionQuery.matches)
  })
  setPauseState(running)

  draw()
}
onload = setup
