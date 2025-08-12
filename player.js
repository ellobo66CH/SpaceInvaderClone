// player.js

// Thruster importieren
import { 
  createThruster,
  updateThruster,
  getThrusterOffset,
  drawThruster  
} from './thruster.js';

// 📦 Load player images
export const playerImage = new Image();
playerImage.src = './assets/PlayerShip01_64.png';

playerImage.onerror = () => {
  console.error("Failed to load PlayerShip01_64.png");
};

const playerThrusterImage = new Image();
playerThrusterImage.src = './assets/thrusterAnim.png';

// playerThrusterImage.onload = () => {
  // console.log("Thruster image loaded successfully");
// };

playerThrusterImage.onerror = () => {
  console.error("Failed to load thrusterAnim.png");
};

// Player object
export function createPlayer(canvas) {
  const player = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
    width: 64,
    height: 64,
    speed: 250,
    isAlive: true
  };

  // Thruster grösse
  const thrusterSize = { width: 12, height: 12 }; // Beispielgröße, anpassbar
  // Dynamisch berechnete Thruster-Position
  const { offsetX, offsetY } = getThrusterOffset(player, thrusterSize.width, thrusterSize.height);
  // Thruster erstellen mit berechneten Offsets
  player.thruster = createThruster(offsetX, offsetY, 0, 5, playerThrusterImage, thrusterSize);

  return player;
}

export function drawPlayer(player, ctx) {
  // Spieler-Sprite zeichnen
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

  // Thruster zeichnen
  drawThruster(ctx, player.thruster, player.x, player.y);
}

export function resetPlayer(player, canvas) {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 10;
}

export function updatePlayer(player, deltaTime) {
  updateThruster(player.thruster);
  // Hier kannst du später auch Bewegung, Boost etc. ergänzen
}
