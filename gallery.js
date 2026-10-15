
document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // 1. MEMORY ENVELOPES AND PROGRESS BAR
  // =====================================

  const cards = document.querySelectorAll(".memory-card");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const progressTrack = document.getElementById("progressTrack");

  function updateProgress() {
    const opened = document.querySelectorAll(
      ".memory-card.is-open"
    ).length;

    const total = cards.length;

    if (progressText) {
      progressText.textContent =
        `${opened} of ${total} letters opened 💌`;
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
      if (card.classList.contains("is-open")) {
        closeMemory();
      } else {
        openMemory();
      }
    });

    closeButton?.addEventListener("click", closeMemory);
  });

  // =====================================
  // 2. FINAL LITTLE NOTE
  // =====================================

  const finalButton = document.getElementById("finalNoteButton");
  const finalNote = document.getElementById("finalNote");

  if (finalButton && finalNote) {
    const originalText = finalButton.textContent.trim();

    finalButton.addEventListener("click", () => {
      const opening = finalNote.hidden;

      finalNote.hidden = !opening;

      finalButton.setAttribute(
        "aria-expanded",
        String(opening)
      );

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

  // =====================================
  // 3. SOFT FALLING HEARTS
  // =====================================

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const MAX_HEARTS = 10;
  const HEART_INTERVAL = 1800;

  function makeHeart() {
    if (document.hidden || reducedMotion) return;

    if (
      document.querySelectorAll(".soft-falling-heart").length >=
      MAX_HEARTS
    ) {
      return;
    }

    const heart = document.createElement("span");

    heart.className = "soft-falling-heart";
    heart.textContent = "♡";
    heart.setAttribute("aria-hidden", "true");

    heart.style.left = `${Math.random() * 94 + 3}vw`;

    heart.style.setProperty(
      "--drift",
      `${Math.random() * 100 - 50}px`
    );

    heart.style.fontSize =
      `${14 + Math.random() * 10}px`;

    heart.style.animationDuration =
      `${7 + Math.random() * 5}s`;

    document.body.appendChild(heart);

    heart.addEventListener(
      "animationend",
      () => heart.remove(),
      { once: true }
    );
  }

  if (!reducedMotion) {
    makeHeart();
    window.setInterval(makeHeart, HEART_INTERVAL);
  }

  // Initialize progress
  updateProgress();
});
