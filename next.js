(() => {
  const canvas = document.getElementById("heartCanvas");
  const stage = document.querySelector(".heart-stage");
  const glowButton = document.getElementById("glowButton");

  if (!canvas || !stage || !glowButton) {
    console.error(
      "Heart setup failed: check heartCanvas, heart-stage and glowButton in next.html."
    );
    return;
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Your browser could not create a 2D canvas.");
    return;
  }

  let width = 0;
  let height = 0;
  let scaleFactor = 1;

  let particles = [];
  let drawn = 0;
  let boosted = false;

  let animationFrame = null;
  let lastTime = 0;
  let progress = 0;

  // Around 20 seconds for the entire heart.
  const DRAW_SPEED = 650;

  const random = (min, max) =>
    Math.random() * (max - min) + min;

  // Original mathematical heart equation.
  // The equation itself supplies the heart's natural dimensions.
  function heart(a) {
    return {
      x: 16 * Math.pow(Math.sin(a), 3),

      y:
        13 * Math.cos(a)
        - 5 * Math.cos(2 * a)
        - 2 * Math.cos(3 * a)
        - Math.cos(4 * a)
    };
  }

  function addStroke(
    x,
    y,
    angle,
    length,
    color,
    alpha,
    lineWidth
  ) {
    particles.push({
      x,
      y,
      angle,
      length,
      color,
      alpha,
      lineWidth
    });
  }

  function makeParticles() {
    particles = [];

    // PASS 1: Outline, following the mathematical curve.
    const outlineCount = 2200;

    for (let i = 0; i < outlineCount; i++) {
      const a = (i / outlineCount) * Math.PI * 2;
      const point = heart(a);

      // Estimate the curve's tangent for natural-looking strokes.
      const next = heart(a + 0.003);
      const tangent = Math.atan2(
        next.y - point.y,
        next.x - point.x
      );

      addStroke(
        point.x + random(-0.07, 0.07),
        point.y + random(-0.07, 0.07),
        tangent + random(-0.3, 0.3),
        random(0.6, 1.8),
        `rgb(255, ${Math.floor(random(65, 135))}, ${Math.floor(random(125, 205))})`,
        random(0.65, 1),
        random(0.6, 1.2)
      );
    }

    // PASS 2: Interior particles.
    // Scaling a boundary point toward the origin keeps each point
    // inside the heart while preserving its original shape.
    const fillCount = 8500;
    const fillParticles = [];

    for (let i = 0; i < fillCount; i++) {
      const a = random(0, Math.PI * 2);
      const amount = Math.sqrt(Math.random());
      const boundary = heart(a);

      const x = boundary.x * amount;
      const y = boundary.y * amount;

      const bright = Math.random() > 0.68;

      fillParticles.push({
        x,
        y,

        angle: random(0, Math.PI * 2),

        length: random(0.25, bright ? 1.6 : 1.0),

        color: bright
          ? `rgb(255, ${Math.floor(random(160, 245))}, ${Math.floor(random(190, 255))})`
          : `rgb(255, ${Math.floor(random(45, 125))}, ${Math.floor(random(100, 190))})`,

        alpha: random(0.35, 0.95),
        lineWidth: random(0.35, 0.85),

        // Used to draw the outer fill before the inner fill.
        depth: amount
      });
    }

    fillParticles.sort((a, b) => b.depth - a.depth);

    // The complete outline is always drawn before the fill.
    particles.push(...fillParticles);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    width = rect.width;
    height = rect.height;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // The heart is about 32 units wide and 34 units tall.
    // This margin prevents the heart from being cut off.
    scaleFactor = Math.min(width / 36, height / 38);

    redrawProgress();
  }

  function drawStroke(p) {
    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + p.x * scaleFactor;
    const y = centerY - p.y * scaleFactor;

    const endX =
      x + p.length * Math.cos(p.angle) * scaleFactor;

    const endY =
      y - p.length * Math.sin(p.angle) * scaleFactor;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);

    ctx.strokeStyle = p.color;
    ctx.globalAlpha = boosted
      ? Math.min(1, p.alpha * 1.35)
      : p.alpha;

    ctx.lineWidth = p.lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  function updateGlow() {
    stage.classList.toggle("boosted", boosted);

    glowButton.textContent = boosted
      ? "Glow level: bright ♡"
      : "Glow level: soft ✧";

    glowButton.setAttribute(
      "aria-pressed",
      String(boosted)
    );
  }

  function redrawProgress() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < drawn; i++) {
      drawStroke(particles[i]);
    }

    updateGlow();
  }

  function animateHeart(timestamp) {
    if (!lastTime) {
      lastTime = timestamp;
    }

    const elapsed = Math.min(
      (timestamp - lastTime) / 1000,
      0.05
    );

    lastTime = timestamp;
    progress += DRAW_SPEED * elapsed;

    const target = Math.min(
      particles.length,
      Math.floor(progress)
    );

    // Draw only the newly reached particles each frame.
    for (let i = drawn; i < target; i++) {
      drawStroke(particles[i]);
    }

    drawn = target;

    if (drawn < particles.length) {
      animationFrame = requestAnimationFrame(animateHeart);
    } else {
      animationFrame = null;
    }
  }

  // Change the glow without interrupting the drawing.
  glowButton.addEventListener("click", () => {
    boosted = !boosted;
    redrawProgress();
  });

  window.addEventListener("resize", resizeCanvas);

  // Build the particles, size the canvas, then start drawing.
  makeParticles();
  resizeCanvas();

  animationFrame = requestAnimationFrame(animateHeart);
})();