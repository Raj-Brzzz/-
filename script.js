// ✿ Customize this message to make the page feel like yours.
const appreciationMessage = `I just wanted to say that I appreciate you.
The way you smile, the little things you do, and the energy you bring can make an ordinary day feel a bit brighter.

You don't have to do anything special to deserve kindness. I hope life gives you plenty of reasons to smile, and that you never forget how wonderful you are.

This is just a small reminder — no expectations, no pressure. Just something nice, because you deserve nice things. ♡`;

const intro = document.getElementById('intro');
const letterWrap = document.getElementById('letterWrap');
const openNote = document.getElementById('openNote');
const typedMessage = document.getElementById('typedMessage');
const cursor = document.getElementById('cursor');
const signoff = document.getElementById('signoff');
const surpriseButton = document.getElementById('surpriseButton');
const surprise = document.getElementById('surprise');
const restartButton = document.getElementById('restartButton');

let typingTimer;
let petalTimer;

function typeMessage() {
  clearInterval(typingTimer);
  typedMessage.textContent = '';
  cursor.classList.remove('hidden');
  signoff.classList.add('hidden');
  let index = 0;
  typingTimer = setInterval(() => {
    typedMessage.textContent += appreciationMessage.charAt(index);
    index++;
    if (index >= appreciationMessage.length) {
      clearInterval(typingTimer);
      cursor.classList.add('hidden');
      signoff.classList.remove('hidden');
    }
  }, 24);
}

openNote.addEventListener('click', () => {
  intro.classList.add('hidden');
  letterWrap.classList.remove('hidden');
  surprise.classList.add('hidden');
  surpriseButton.classList.remove('hidden');
  typeMessage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

surpriseButton.addEventListener('click', () => {
  surprise.classList.remove('hidden');
  surpriseButton.classList.add('hidden');
  makePetals(18);
});

restartButton.addEventListener('click', () => {
  clearInterval(typingTimer);
  letterWrap.classList.add('hidden');
  intro.classList.remove('hidden');
  typedMessage.textContent = '';
  surprise.classList.add('hidden');
  surpriseButton.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function makePetals(count = 7) {
  const symbols = ['♡', '✧', '♥', '·'];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.fontSize = `${12 + Math.random() * 15}px`;
    petal.style.setProperty('--drift', `${Math.random() * 150 - 75}px`);
    petal.style.animationDuration = `${4 + Math.random() * 4}s`;
    document.body.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}

// A few gentle floating symbols drift by occasionally.
function startAmbientPetals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  petalTimer = setInterval(() => {
    if (!document.hidden) makePetals(1);
  }, 2600);
}
startAmbientPetals();
