// game.js
// im root ordner mit cmd dies ausführen: python -m http.server
// seite mit http://localhost:8000/ aufrufen!

// Import Player
import {
  createPlayer,
  playerImage,
  drawPlayer,
  updatePlayer,
  resetPlayer
} from './player.js';

// Import enemies
import {
  createEnemies,
  clearEnemies,
  resetEnemies,
  updateEnemies,
  drawEnemies,
  handleEnemyDefeatProgression,
  setEnemyRows,
  setEnemySpeed,
  setEnemyDirection,
  getEnemyRows,
  getEnemies
} from './enemies.js';

// Import Mothership
import {
  mothership,
  mothershipNextSpawn,
  setNextMothershipSpawn,
  resetMothership,
  delayMothershipSpawn,
  drawMothership 
} from './mothership.js';

// Import Shot
import { Shot 
} from './shot.js';

// Import gameState
import {
  score,
  level,
  isGameOver,
  lastTime,
  keys,
  bullets,
  setLevel,
  increaseLevel,
  setGameOver,
  setLastTime,
  setScore,
  addScore,
  resetKeys
} from './gameState.js';

// import partikel hintergrund
import { initDebris, 
  updateDebris, 
  drawDebris 
} from './debris.js';

import { SoundManager 
} from './sound.js';
const soundManager = new SoundManager();


const hudCanvas = document.getElementById('hudCanvas');
const hudCtx = hudCanvas.getContext('2d');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spieler erstellen
const player = createPlayer(canvas);
// Schüsse
let shots = [];


// Spielzustand
let isGameStarted = false;
let isPaused = false;
let pauseStartTime = 0;

// Spieler bewegung
let playerDirection = 0; // -1 = links, 1 = rechts, 0 = neutral

// nächstes Mutterschiff generieren
setNextMothershipSpawn();

let edgeCooldown = 0;

// Restart-Button im Canvas
let restartButton = {
  x: canvas.width / 2 - 75,
  y: canvas.height / 2 + 70,
  width: 150,
  height: 40
};

// Tasteneingaben
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

createEnemies();

// Kollision 
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function checkShotCollisions() {
  const currentEnemies = getEnemies();

  for (let si = shots.length - 1; si >= 0; si--) {
    const s = shots[si];
    let hit = false;

    for (let ei = currentEnemies.length - 1; ei >= 0; ei--) {
      const e = currentEnemies[ei];
      if (isColliding(s, e)) {
        currentEnemies.splice(ei, 1);
        addScore(20);
        hit = true;
        soundManager.play('explosion001', true);
        break;
      }
    }

    if (!hit && mothership.active && isColliding(s, mothership)) {
      addScore(100);
      mothership.active = false;
      setNextMothershipSpawn();
      soundManager.stop('enemyShips001');
      soundManager.play('explosion002');
      hit = true;
    }

    if (hit) {
      shots.splice(si, 1);
    }
  }
}

function update(deltaTime) {
  // Spielerbewegung
  if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) {
    player.x -= player.speed * deltaTime;
	playerDirection = -1;
  } else if ((keys['ArrowRight'] || keys['d']) && player.x + player.width < canvas.width) {
    player.x += player.speed * deltaTime;
	playerDirection = 1;
  } else {
	playerDirection = 0;  
  }
  updatePlayer(player, deltaTime);
  
  // Fire only if space is held AND no active shots exist
  if ((keys[' '] || keys['Spacebar']) && shots.length === 0) {
    const shot = new Shot(
      player.x + player.width / 2 - 3,
      player.y,
      -400,
      'laser'
    );
    shots.push(shot);
    soundManager.play('laserShot', true);
  }

  // Update and clean up shots
  shots.forEach(shot => shot.updateShot(deltaTime, canvas.height));
  shots = shots.filter(shot => shot.active);

  // Randwechsel-Sperre aktualisieren
  if (edgeCooldown > 0) {
    edgeCooldown -= deltaTime;
  }

  // Gegnerbewegung
  updateEnemies(deltaTime, canvas.width);
  
  // Cooldown runterzählen
  if (mothership.active) {
    mothership.x += mothership.speed * mothership.direction * deltaTime;
    // Wenn außerhalb des Bildschirms, deaktivieren und neuen Spawn vorbereiten
    if (mothership.x < -mothership.width || mothership.x > canvas.width + mothership.width) {
      mothership.active = false;
      setNextMothershipSpawn();
      soundManager.stop('enemyShips001');
    }
  } else {
    if (performance.now() >= mothershipNextSpawn) {
      mothership.active = true;
      mothership.direction = Math.random() < 0.5 ? 1 : -1;
      mothership.x = mothership.direction === 1 ? -mothership.width : canvas.width;
      soundManager.play('enemyShips001');
    }
  }
  // Kollisionen abfragen
  checkShotCollisions();

  // Game Over prüfen
  for (let e of getEnemies()) {
    if (e.y + e.height >= player.y) {
      setGameOver(true);
      player.isAlive = false;
      canvas.style.cursor = 'default';
      return;
    }
  }

  // Level-Up
  handleEnemyDefeatProgression(increaseLevel, bullets);
}

// Spiele Bildschirm
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // optional, falls du z. B. transparente Elemente hast
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height); // setzt den Hintergrund

  // Hintergrund zeichnen
  drawDebris(ctx);

  // Spieler
  drawPlayer(player, ctx);

  // Schüsse
  shots.forEach(shot => shot.drawShot(ctx));

  // Gegner
  drawEnemies(ctx);
  
  // Mutterschiff
  if (mothership.active) {
    drawMothership(ctx);
  }

  // Game Over Anzeige
  if (isGameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '20px Arial';
    ctx.fillText(`Du hast Level ${level} erreicht`, canvas.width / 2, canvas.height / 2 + 10);
	
    ctx.fillText(`Punkte: ${score}`, canvas.width / 2, canvas.height / 2 + 45);

    // Button
    ctx.fillStyle = 'yellow';
    ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Erneut spielen', canvas.width / 2, restartButton.y + 26);
  }
}

function drawHUD() {
  hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);

  // Punkteanzeige in der Mitte
  hudCtx.fillStyle = 'white';
  hudCtx.font = '16px Arial';
  hudCtx.textAlign = 'center';
  hudCtx.fillText(`][=<( ${score} )>=][`, hudCanvas.width / 2, 30);

  // Levelanzeige rechts
  hudCtx.textAlign = 'right';
  hudCtx.fillStyle = 'yellow';
  hudCtx.fillText(`[ ${level} ]`, hudCanvas.width - 10, 30);
}

// Willkomen Bildschirm
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 2 - 60);

  ctx.font = '20px Arial';
  ctx.fillText('Verteidige die Erde gegen die Invasion!', canvas.width / 2, canvas.height / 2 - 20);

  // Button
  ctx.fillStyle = 'lime';
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 10, 150, 40);

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Let’s Play', canvas.width / 2, canvas.height / 2 + 38);
}

// Pause Bildschirm
function drawPause() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
}

// Wait for the image to load before starting the game loop
playerImage.onload = () => {
  // console.log("Player image loaded");
  initDebris(ctx);
  requestAnimationFrame(loop);
};

function loop(timestamp) {
  if (!isGameStarted) {
    drawStartScreen();
    soundManager.pauseAll();
    requestAnimationFrame(loop);
    return;
  }

  if (isGameOver) {
    draw();
    drawHUD();
    soundManager.pauseAll();
    requestAnimationFrame(loop); // ← Schleife weiterführen!
    return;
  }

  if (isPaused) {
    draw();
    drawHUD();
    drawPause();
	
    // Wenn Pause gerade beginnt, Zeit merken
    if (pauseStartTime === 0) {
      pauseStartTime = timestamp;
    }

    soundManager.pauseAll();
    setLastTime(timestamp); // ← WICHTIG!
    requestAnimationFrame(loop);
    return;
  }

  // Resume sounds if coming out of pause
  if (soundManager.isPaused) {
    soundManager.resumeAll();
  }

  const deltaTime = (timestamp - lastTime) / 1000;
  setLastTime(timestamp);

  update(deltaTime);
  
  // Hintergrund aktualisieren
  updateDebris(deltaTime, playerDirection); 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spieleobjekte zeichnen
  draw();
  
  // Hud zeichnen
  drawHUD();
  
  // Player thruster sound logic
  if (player.isAlive) {
    if (!soundManager.isPlaying('playerThruster')) {
      soundManager.play('playerThruster');
    }
    if (!soundManager.isPlaying('enemyShips002')) {
      soundManager.play('enemyShips002');
    }
  } else {
    soundManager.stop('playerThruster');
    soundManager.stop('enemyShips002');
  }
  
  requestAnimationFrame(loop);
}

// Klick auf Button
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (!isGameStarted) {
    // Let’s Play Button
    if (
      mx >= canvas.width / 2 - 75 &&
      mx <= canvas.width / 2 + 75 &&
      my >= canvas.height / 2 + 10 &&
      my <= canvas.height / 2 + 50
    ) {
      isGameStarted = true;
      setLastTime(performance.now());
      requestAnimationFrame(loop);
	  canvas.style.cursor = 'none';
    }
    return;
  }

  if (isGameOver) {
    if (
      mx >= restartButton.x &&
      mx <= restartButton.x + restartButton.width &&
      my >= restartButton.y &&
      my <= restartButton.y + restartButton.height
    ) {
      restartGame(canvas, loop);
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && isGameStarted && !isGameOver) {
    isPaused = !isPaused;
		
	// Wenn Pause beendet wird, Zeitdifferenz berechnen
    if (!isPaused && pauseStartTime > 0) {
      const pauseDuration = performance.now() - pauseStartTime;
      delayMothershipSpawn(pauseDuration); // ← Hier wird deine Funktion verwendet!
      pauseStartTime = 0;
    }
  }
});

function restartGame() {
  setScore(0);
  setLevel(1);
  bullets.length = 0;
  resetEnemies();
  resetPlayer(player, canvas);
  player.isAlive = true;
  setGameOver(false);
  setLastTime(performance.now());
  resetMothership(canvas);
  setNextMothershipSpawn();
  canvas.style.cursor = 'none';
  resetKeys();
  soundManager.stop('enemyShips001');
}