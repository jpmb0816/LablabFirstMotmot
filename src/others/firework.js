class Firework {
  constructor(x, y, targetY, colors) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.colors = colors;
    this.trail = [];
    this.exploded = false;
    this.explosionParticles = [];
    this.explodeTime = Math.random() * 2 + 0.5; // Random time between 0.5 and 2.5 seconds
    this.timeElapsed = 0;
  }

  update(deltaTime) {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 3) this.trail.shift(); // Shorter trail

      const dy = this.targetY - this.y;
      const distance = Math.abs(dy);

      this.timeElapsed += deltaTime;

      if (this.timeElapsed >= this.explodeTime || distance < 2) {
        this.exploded = true;
        this.createExplosion();
      } else {
        this.y += dy * 0.05;
      }
    } else {
      this.explosionParticles.forEach((particle) => particle.update());
    }
  }

  createExplosion() {
    const numParticles = 50; // Fewer particles for smaller fireworks
    const angleStep = (Math.PI * 2) / numParticles;
    const radius = 30; // Adjust size for smaller fireworks

    for (let i = 0; i < numParticles; i++) {
      const angle = i * angleStep;
      const speed = Math.random() * 4; // Adjust speed if needed
      const color = this.colors[i % this.colors.length]; // Cycle through colors
      this.explosionParticles.push(
        new Particle(this.x, this.y, color, angle, speed, radius)
      );
    }
  }

  draw(context) {
    context.save(); // Save the current state of the context

    if (!this.exploded) {
      context.beginPath();
      context.moveTo(this.x, this.y);
      this.trail.forEach((point) => context.lineTo(point.x, point.y));
      context.strokeStyle = this.colors[0]; // Only use one color for trail
      context.stroke();
    } else {
      this.explosionParticles.forEach((particle) => particle.draw(context));
    }

    context.restore(); // Restore the previous state of the context
  }
}

class Particle {
  constructor(x, y, color, angle, speed, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 2 + 1; // Smaller size
    this.angle = angle;
    this.speed = speed;
    this.gravity = 0.02; // Less gravity for smaller particles
    this.alpha = 1;
    this.radius = radius;
  }

  update() {
    // Update position in circular pattern
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle) + this.gravity;
    this.alpha -= 0.01;
    if (this.alpha <= 0) this.alpha = 0;
  }

  draw(context) {
    context.save(); // Save the current state of the context

    // Set shadow properties
    context.shadowColor = "rgba(0, 0, 0, 1)"; // Shadow color
    context.shadowBlur = 5; // Shadow blur amount
    context.shadowOffsetX = 2; // Horizontal offset
    context.shadowOffsetY = 400; // Vertical offset

    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();

    context.restore(); // Restore the previous state of the context
  }
}

const colors = [
  "red",
  "blue",
  "yellow",
  "pink",
  "white",
  "orange",
  "magenta",
  "cyan",
  "purple",
  "lightgray",
  "gold",
  "silver",
];
let fireworks = [];

function animateFireworks(canvas, deltaTime) {
  const ctx = canvas.getContext("2d");

  if (Math.random() < 0.03) {
    const startX = Math.random() * map.width;
    const startY = map.height;
    const targetY = Math.random() * (map.height / 2 + 400); // Target height is above the starting point
    const colorArray = [];

    // Use two or more colors for the particles

    if (Math.random() < 0.05) {
      for (let i = 0; i < 3; i++) {
        colorArray.push(colors[Math.floor(Math.random() * colors.length)]);
      }
    } else {
      colorArray.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    fireworks.push(new Firework(startX, startY, targetY, colorArray));
  }

  fireworks.forEach((firework, index) => {
    firework.update(deltaTime);
    firework.draw(ctx);
    // Remove firework if all particles are no longer visible
    if (
      firework.exploded &&
      firework.explosionParticles.every((particle) => particle.alpha <= 0)
    ) {
      fireworks.splice(index, 1);
    }
  });
}
