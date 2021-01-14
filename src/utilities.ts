export function random(low: number, high: number): number {
  return low + Math.random() * (high - low)
}

export function range(low: number, high: number): number[] {
  let out = []
  for (let i = low; i < high; i++) {
    out.push(i)
  }
  return out
}
