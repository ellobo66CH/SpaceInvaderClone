const debrisLayers = [
  { speed: 30, particles: [], color: 'rgba(255,255,255,0.1)', glow: 'rgba(255,255,255,0.5)', sizeRange: [0.5, 1.5] },
  { speed: 60, particles: [], color: 'rgba(255,255,255,0.2)', glow: 'rgba(255,255,255,0.5)', sizeRange: [1, 2] },
  { speed: 120, particles: [], color: 'rgba(255,200,100,0.3)', glow: 'rgba(255,200,100,0.5)', sizeRange: [1.5, 3] }
];

let canvasWidth = 0;
let canvasHeight = 0;

export function initDebris(ctx) {
  canvasWidth = ctx.canvas.width;
  canvasHeight = ctx.canvas.height;

  debrisLayers.forEach(layer => {
    for (let i = 0; i < 50; i++) {
      layer.particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0]
      });
    }
  });
  
  // Test-Partikel mit starkem Glow in Layer 3 (Vordergrund)
  // debrisLayers[2].particles.push({
  //  x: canvasWidth / 2,
  //  y: canvasHeight / 2,
  //  size: 8
  //});
}

export function updateDebris(deltaTime, playerDirection = 0) {
  debrisLayers.forEach(layer => {
    const drift = playerDirection * layer.speed * 0.3; // sanfter, layer-spezifischer Drift
    layer.particles.forEach(p => {
      p.y += layer.speed * deltaTime;
      p.x -= drift * deltaTime;
      if (p.y > canvasHeight) {
        p.y = 0;
        p.x = Math.random() * canvasWidth;
      }
      // Optional: Begrenzung seitlich
      p.x = Math.max(0, Math.min(canvasWidth, p.x));
    });
  });
}

export function drawDebris(ctx) {
  debrisLayers.forEach(layer => {
    layer.particles.forEach(p => {
      // Partikelkörper mit echter Farbe
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}