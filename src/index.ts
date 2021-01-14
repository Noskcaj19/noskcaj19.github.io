import { random, range } from './utilities'

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

const radius = 3
const linkingDist = 90
const fadeRange = 10
const fadeDist = linkingDist + fadeRange
var running = reducedMotionQuery && !reducedMotionQuery.matches
var timeout: NodeJS.Timeout

function distance(x1: number, y1: number, x2: number, y2: number): number {
  var a = x1 - x2
  var b = y1 - y2

  return Math.hypot(a, b)
}

let setup = () => {
  const width = window.innerWidth
  const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  )
  const seed = (width * height) / 2
  const count = Math.min(seed * 0.0005, 1000)

  let canvas = <HTMLCanvasElement>document.getElementById('canvas')
  let pauseButton = <HTMLButtonElement>document.getElementById('pause-button')!
  canvas.width = width
  canvas.height = height
  canvas.setAttribute('width', width.toString())
  canvas.setAttribute('height', height.toString())

  let ctx = canvas.getContext('2d')!

  interface Node {
    x: number
    y: number
    xs: number
    ys: number
  }

  let nodes = range(0, count).map(
    () =>
      <Node>{
        x: random(0, width),
        y: random(0, height),
        xs: random(-0.3, 0.3),
        ys: random(-0.3, 0.3),
      },
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

      node.x = (node.x + node.xs) % (width + radius)
      node.y = (node.y + node.ys) % (height + radius)

      if (node.x < -radius) {
        node.x = width + radius
      }

      if (node.y < -radius) {
        node.y = height + radius
      }
    }
    clearTimeout(timeout)
    if (running) {
      timeout = setTimeout(draw, 50)
    }
  }

  function setPauseState(newRunning: boolean) {
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
