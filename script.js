const appreciationMessage = `I just wanted to say that I appreciate you.
The way you smile, the little things you do, and the energy you bring can make an ordinary day feel a bit brighter.

You don't have to do anything special to deserve kindness. I hope life gives you plenty of reasons to smile, and that you never forget how wonderful you are.

This is just a small reminder — no expectations, no pressure. Just something nice, because you deserve nice things. ♡`;

const intro = document.getElementById("intro");
const letterWrap = document.getElementById("letterWrap");
const openNote = document.getElementById("openNote");
const typedMessage = document.getElementById("typedMessage");
const cursor = document.getElementById("cursor");
const signoff = document.getElementById("signoff");
const surpriseButton = document.getElementById("surpriseButton");

let typingTimer = null;
let typingIndex = 0;

function typeMessage() {
  clearInterval(typingTimer);

  typedMessage.textContent = "";
  cursor.classList.remove("hidden");
  signoff.classList.add("hidden");
  typingIndex = 0;

  typingTimer = setInterval(() => {
    typedMessage.textContent += appreciationMessage.charAt(typingIndex);
    typingIndex++;

    if (typingIndex >= appreciationMessage.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      cursor.classList.add("hidden");
      signoff.classList.remove("hidden");
    }
  }, 24);
}

// Open the appreciation letter.
openNote.addEventListener("click", () => {
  intro.classList.add("hidden");
  letterWrap.classList.remove("hidden");

  surpriseButton.classList.remove("hidden");
  typeMessage();
});

// Open the gallery page.
surpriseButton.addEventListener("click", () => {
  window.location.href = "./gallery.html";
});

// Lightweight floating hearts and sparkles.
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const symbols = ["♡", "✧", "♥", "·"];
const MAX_PETALS = 12;

function makePetal() {
  if (document.hidden || reducedMotion) return;

  const existingPetals = document.querySelectorAll(".petal");

  if (existingPetals.length >= MAX_PETALS) return;

  const petal = document.createElement("span");

  petal.className = "petal";
  petal.setAttribute("aria-hidden", "true");
  petal.textContent = symbols[
    Math.floor(Math.random() * symbols.length)
  ];

  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${12 + Math.random() * 15}px`;
  petal.style.setProperty(
    "--drift",
    `${Math.random() * 150 - 75}px`
  );
  petal.style.animationDuration = `${4 + Math.random() * 4}s`;

  document.body.appendChild(petal);

  petal.addEventListener("animationend", () => {
    petal.remove();
  }, { once: true });
}

if (!reducedMotion) {
  setInterval(makePetal, 2600);
}