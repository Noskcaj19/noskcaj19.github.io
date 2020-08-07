import { range, random } from "lodash-es";

const radius = 3;
const linkingDist = 40;

function distance(x1: number, y1: number, x2: number, y2: number): number {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.hypot(a, b);
}

var timeout: NodeJS.Timeout;

let setup = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const seed = (width * height) / 2;
  const count = Math.min(seed * 0.0005, 1000);

  let canvas = <HTMLCanvasElement>document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute("width", width.toString());
  canvas.setAttribute("height", height.toString());

  let ctx = canvas.getContext("2d")!;

  interface Node {
    x: number;
    y: number;
    xs: number;
    ys: number;
  }

  let nodes = range(0, count).map(
    () =>
      <Node>{
        x: random(0, width),
        y: random(0, height),
        xs: random(-2, 2.0),
        ys: random(-2, 2.0),
      }
  );

  ctx.strokeStyle = "grey";
  ctx.fillStyle = "clear";
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const node of nodes) {
      for (const otherNode of nodes) {
        if (node.x != otherNode.x && node.y != otherNode.y)
          if (
            distance(node.x, node.y, otherNode.x, otherNode.y) < linkingDist
          ) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
      }
    }

    for (const node of nodes) {
      ctx.moveTo(node.x + radius, node.y);
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      node.x = (node.x + node.xs) % (width + radius);
      node.y = (node.y + node.ys) % (height + radius);

      if (node.x < -radius) {
        node.x = width + radius;
      }

      if (node.y < -radius) {
        node.y = height + radius;
      }
    }
    clearTimeout(timeout);
    timeout = setTimeout(draw, 50);
  };

  onresize = () => {
    setup();
  };

  draw();
};
onload = setup;
