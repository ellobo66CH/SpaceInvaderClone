// Shot.js

export class Shot {
  constructor(x, y, velocity, type = 'laser') {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.type = type;
    this.active = true;
    this.width = 4;
    this.height = 10;
    this.frame = 0; // Für Animation
  }

  updateShot(deltaTime, canvasHeight) {
    this.y += this.velocity * deltaTime; // velocity is pixels per second
    if (this.y < 0 || this.y > canvasHeight) {
      this.active = false;
    }
    this.frame++;
  }


  drawShot(ctx) {
    ctx.save();

    switch (this.type) {
      case 'laser':
        ctx.fillStyle = 'red';
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        break;

      case 'rakete':
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'plasma':
        ctx.fillStyle = 'magenta';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      // Weitere Typen können hier ergänzt werden
      default:
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        break;
    }

    ctx.restore();
  }
}