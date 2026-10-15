
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // 1. MEMORY ENVELOPES + PROGRESS BAR
  // ========================================
  const cards = document.querySelectorAll(".memory-card");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const progressTrack = document.getElementById("progressTrack");

  function updateProgress() {
    const opened = document.querySelectorAll(".memory-card.is-open").length;
    const total = cards.length;

    if (progressText) {
      progressText.textContent = `${opened} of ${total} letters opened 💌`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${total ? (opened / total) * 100 : 0}%`;
    }

    if (progressTrack) {
      progressTrack.setAttribute("aria-valuenow", String(opened));
      progressTrack.setAttribute("aria-valuemax", String(total));
    }
  }

  cards.forEach((card) => {
    const envelope = card.querySelector(".envelope");
    const content = card.querySelector(".memory-content");
    const closeButton = card.querySelector(".close-memory");

    if (!envelope || !content) return;

    function openMemory() {
      card.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      content.hidden = false;
      updateProgress();
    }

    function closeMemory() {
      card.classList.remove("is-open");
      envelope.setAttribute("aria-expanded", "false");
      content.hidden = true;
      updateProgress();
    }

    envelope.addEventListener("click", () => {
      card.classList.contains("is-open")
        ? closeMemory()
        : openMemory();
    });

    closeButton?.addEventListener("click", closeMemory);
  });

  // ========================================
  // 2. FINAL NOTE
  // ========================================
  const finalButton = document.getElementById("finalNoteButton");
  const finalNote = document.getElementById("finalNote");

  if (finalButton && finalNote) {
    const originalText = finalButton.textContent.trim();

    finalButton.addEventListener("click", () => {
      const opening = finalNote.hidden;

      finalNote.hidden = !opening;
      finalButton.setAttribute("aria-expanded", String(opening));
      finalButton.textContent = opening
        ? "Close my little note ♡"
        : originalText;

      if (opening) {
        finalNote.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }

  // ========================================
  // 3. REAL CONTINUOUS WIND-BLOWN PETALS
  // ========================================
  function startPetalAnimation() {
    // Prevent duplicate canvases.
    if (document.getElementById("petal-canvas")) return;

    const canvas = document.createElement("canvas");
    canvas.id = "petal-canvas";

    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "9999",
      display: "block"
    });

    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let petals = [];
    let lastTime = 0;

    const colors = [
      "#ffc0d4",
      "#ffb0ca",
      "#ffd6e3",
      "#f6a6c1",
      "#fff0f5",
      "#eeb5d0"
    ];

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makePetal(randomHeight = false) {
      return {
        x: Math.random() * Math.max(width, 1),
        y: randomHeight
          ? Math.random() * Math.max(height, 1)
          : -20 - Math.random() * 100,
        size: 4 + Math.random() * 7,
        speedY: 35 + Math.random() * 55,
        speedX: 8 + Math.random() * 25,
        sway: 15 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 3,
        opacity: 0.55 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Soft, curved cherry-blossom petal.
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(
        p.size * 1.2, -p.size * 0.7,
        p.size * 1.1, p.size * 0.6,
        0, p.size
      );
      ctx.bezierCurveTo(
        -p.size * 1.1, p.size * 0.6,
        -p.size * 1.2, -p.size * 0.7,
        0, -p.size
      );
      ctx.fill();

      ctx.restore();
    }

    function animate(time) {
      requestAnimationFrame(animate);

      // Keep movement smooth even when the tab pauses briefly.
      const dt = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0.016;

      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.phase += dt * 1.2;
        p.y += p.speedY * dt;

        // Gentle sideways breeze + natural swaying.
        p.x += (
          p.speedX +
          Math.sin(p.phase) * p.sway
        ) * dt;

        p.spin += p.spinSpeed * dt;

        // Wrap around the sides for a continuous breeze.
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        drawPetal(p);

        // Replace petals once they fall off the screen.
        if (p.y > height + 30) {
          petals[i] = makePetal(false);
        }
      }

      // Gradually create more petals until the scene is full.
      if (petals.length < 42 && Math.random() < 0.12) {
        petals.push(makePetal(false));
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Start with petals already across the screen.
    for (let i = 0; i < 42; i++) {
      petals.push(makePetal(true));
    }

    requestAnimationFrame(animate);

    console.log("Cherry blossom petal animation is running!");
  }

  startPetalAnimation();
  updateProgress();
});
