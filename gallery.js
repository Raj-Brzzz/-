
document.addEventListener("DOMContentLoaded", () => {
  // MEMORY ENVELOPES
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
      if (card.classList.contains("is-open")) {
        closeMemory();
      } else {
        openMemory();
      }
    });

    closeButton?.addEventListener("click", closeMemory);
  });

  // FINAL LITTLE NOTE
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

  // SOFT, MINIMAL FALLING HEARTS ONLY
  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MAX_HEARTS = 5;

  function makeHeart() {
    if (document.hidden || reducedMotion) return;

    if (document.querySelectorAll(".soft-falling-heart").length >= MAX_HEARTS) {
      return;
    }

    const heart = document.createElement("span");
    heart.className = "soft-falling-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♡";

    heart.style.left = `${Math.random() * 96 + 2}vw`;
    heart.style.setProperty(
      "--drift",
      `${Math.random() * 50 - 25}px`
    );

    heart.style.animationDuration =
      `${9 + Math.random() * 4}s`;

    document.body.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    }, { once: true });
  }

  if (!reducedMotion) {
    makeHeart();
    window.setInterval(makeHeart, 3500);
  }

  updateProgress();
});
