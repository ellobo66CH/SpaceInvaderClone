// enemiies.js

// Thruster-Funktionen importieren
import {
  createThruster,
  updateThruster,
  drawThruster
} from './thruster.js';

// Gegner-Grafik laden
export const enemyImage = new Image();
enemyImage.src = 'assets/Enemie01_64x32.png';
const enemyThrusterImage = new Image();
enemyThrusterImage.src = './assets/thrusterAnimEnemy.png';


// Gegner-Größe
export const enemyWidth = 64;
export const enemyHeight = 32;

// Gegner-Zustand
export let enemyCols = 6;
export let enemyRows = 2;
export let enemySpeed = 30;
export let enemyDirection = 1;

//️ Randwechsel-Sperre
let edgeCooldown = 0.3;

// Gegner-Array
export let enemies = [];

// Gegner erzeugen
const middleThrusterSize = { width: 12, height: 12 };
export function createEnemies() {
  enemies = [];
  for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
      const x = 80 * col + 30;
      const y = 30 + row * 40;

      // const middleThrusterOffsetX = (enemyWidth - middleThrusterSize.width) / 2;
	  const middleThrusterOffsetX = Math.round((enemyWidth - middleThrusterSize.width) / 2);

      const thrusters = [
        createThruster(18, enemyHeight - 4, Math.floor(Math.random() * 4), 10, enemyThrusterImage, { width: 8, height: 8 }),
        createThruster(middleThrusterOffsetX, enemyHeight - 4, Math.floor(Math.random() * 4), 10, enemyThrusterImage, { width: 12, height: 12 }),
        createThruster(40, enemyHeight - 4, Math.floor(Math.random() * 4), 10, enemyThrusterImage, { width: 8, height: 8 })
      ];

      enemies.push({
        x,
        y,
        width: enemyWidth,
        height: enemyHeight,
        thrusters
      });
    }
  }
}

// Gegner aktualisieren (Bewegung + Thruster)
export function updateEnemies(deltaTime, canvasWidth) {
  let edgeReached = false;

  enemies.forEach(enemy => {
    enemy.x += enemySpeed * deltaTime * enemyDirection;

    if (enemy.x + enemy.width > canvasWidth || enemy.x < 0) {
      edgeReached = true;
    }

    enemy.thrusters?.forEach(updateThruster);
  });

  if (edgeReached && edgeCooldown <= 0) {
    setEnemyDirection(enemyDirection * -1);
    enemies.forEach(e => e.y += 20);
    edgeCooldown = 0.3;
  } else {
    edgeCooldown -= deltaTime;
  }
}

// Gegner + Thruster zeichnen
export function drawEnemies(ctx) {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.thrusters?.forEach(t => drawThruster(ctx, t, enemy.x, enemy.y));
  });
}

// Level 
export function handleEnemyDefeatProgression(increaseLevelCallback, bulletsArray) {
  if (enemies.length === 0) {
    increaseLevelCallback();

    const nextRows = Math.min(5, enemyRows + 1);
    const nextSpeed = Math.min(enemySpeed + 10, 240);

    setEnemyRows(nextRows);
    setEnemySpeed(nextSpeed);

    bulletsArray.length = 0;
    createEnemies();
  }
}

// Steuerfunktionen
export function getEnemyRows() {
  return enemyRows;
}

export function setEnemyRows(value) {
  enemyRows = value;
}

export function getEnemySpeed() {
  return enemySpeed;
}

export function setEnemySpeed(newSpeed) {
  enemySpeed = newSpeed;
}

export function setEnemyDirection(newDirection) {
  enemyDirection = newDirection;
}

export function getEnemies() {
  return enemies;
}

export function clearEnemies() {
  enemies.length = 0;
}

export function resetEnemies() {
  setEnemyRows(2);
  setEnemySpeed(30);
  setEnemyDirection(1);
  clearEnemies();
  createEnemies();
}
