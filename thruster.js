// thruster.js

// Bild laden
const thrusterImage = new Image();
thrusterImage.src = './assets/thrusterAnimEnemy.png'; // 4 Frames nebeneinander, z. B. 4 × 32px

// thrusterImage.onload = () => {
  // console.log('Thruster-Sprite erfolgreich geladen!');
// };
thrusterImage.onerror = () => {
  console.error("Failed to load thrusterAnimEnemy.png image");
};

// Thruster-Factory
export function createThruster(offsetX, offsetY, startFrame = 0, frameDelay = 5, image = null, size = { width: 8, height: 8 }) {
  return {
    offsetX,
    offsetY,
    frame: startFrame,
    direction: 1,
    frameDelay,
    frameCounter: 0,
	image,
	size
  };
}

// Offset-Berechnung für zentrierten Thruster
export function getThrusterOffset(player, thrusterWidth = 8, thrusterHeight = 8) {
  const offsetX = player.width / 2 - thrusterWidth / 2;
  const offsetY = player.height * 0.75 - thrusterHeight / 2;
  return { offsetX, offsetY };
}


// Animation aktualisieren
export function updateThruster(thruster) {
  thruster.frameCounter++;
  if (thruster.frameCounter >= thruster.frameDelay) {
    thruster.frame += thruster.direction;

    // Richtungswechsel bei Frame-Grenzen
    if (thruster.frame >= 3 || thruster.frame <= 0) {
      thruster.direction *= -1;
    }

    thruster.frameCounter = 0;
  }
}

// Thruster zeichnen
export function drawThruster(ctx, thruster, enemyX, enemyY) {
  const img = thruster.image;
  if (!img || !img.complete || img.naturalWidth === 0) return;
  
  const x = enemyX + thruster.offsetX;
  const y = enemyY + thruster.offsetY;
  
  const width = thruster.size?.width || 8;
  const height = thruster.size?.height || 8;

  ctx.save(); // Zustand sichern

  // Glow-Effekt
  ctx.shadowColor = 'lime';       // Glow-Farbe
  ctx.shadowBlur = 12;            // Intensität
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.drawImage(
    img,
    thruster.frame * 32, 0, 32, 32,
    x, y, width, height
  );

  ctx.restore(); // Zustand zurücksetzen
}

// Optional: Bild exportieren, falls du es woanders brauchst
export { thrusterImage };
