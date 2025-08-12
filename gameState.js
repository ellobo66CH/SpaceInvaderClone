export let score = 0;
export let level = 1;
export let isGameOver = false;
export let lastTime = 0;
export let mothershipNextSpawn = performance.now() + (Math.random() * 20000 + 40000);
export let keys = {};
export const bullets = [];

export function setLevel(value) {
  level = value;
}
export function increaseLevel() {
  level++;
}
export function setGameOver(value) {
  isGameOver = value;
}
export function setLastTime(value) {
  lastTime = value;
}
export function setScore(value) {
  score = value;
}
export function addScore(points) {
  score += points;
}

export function resetKeys() {
  for (let key in keys) {
    keys[key] = false;
  }
}


