export const mothershipImage = new Image();
mothershipImage.src = './assets/mothership001.png'; // Pfad anpassen

// mothershipImage.onload = () => {
  // console.log('Mutterschiff-Grafik geladen');
// };

mothershipImage.onerror = () => {
  console.error('Fehler beim Laden der Mutterschiff-Grafik');
};

export const mothershipWidth = 71;
export const mothershipHeight = 35;

export let mothership = {
  x: -mothershipWidth,
  y: 7,
  width: mothershipWidth,
  height: mothershipHeight,
  speed: 120,
  direction: 1,
  active: false
};

export function getNextMothershipSpawnTime() {
  return performance.now() + (Math.random() * 20000 + 40000);
}

export let mothershipNextSpawn = getNextMothershipSpawnTime();

export function setNextMothershipSpawn() {
  mothershipNextSpawn = getNextMothershipSpawnTime();
}

export function delayMothershipSpawn(ms) {
  mothershipNextSpawn += ms;
}

export function drawMothership(ctx) {
  if (!mothership.active) return;
  if (!mothershipImage.complete || mothershipImage.naturalWidth === 0) return;

  // Pulsierender Glow
  const time = performance.now() / 1000; // Sekunden
  const pulse = Math.sin(time * 6) * 8 + 12; // Schwankt zwischen 8 und 20

  ctx.save();
  ctx.shadowColor = 'cyan';
  ctx.shadowBlur = pulse;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.drawImage(
    mothershipImage,
    mothership.x,
    mothership.y,
    mothership.width,
    mothership.height
  );
  ctx.restore();
}

export function resetMothership(canvas) {
  mothership.active = false;
  mothership.x = -mothership.width;
  mothership.direction = 1;
  mothership.y = 7;
  setNextMothershipSpawn();
}



