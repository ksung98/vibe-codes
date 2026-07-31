const bubbleContainer = document.getElementById("bubbleContainer");
const resetButton = document.getElementById("resetButton");

const colors = [
  "rgba(118, 205, 255, 0.62)",
  "rgba(186, 153, 255, 0.58)",
  "rgba(255, 180, 217, 0.56)",
  "rgba(166, 232, 190, 0.58)",
  "rgba(255, 217, 143, 0.58)",
  "rgba(145, 210, 255, 0.52)"
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const smallestSide = Math.min(viewportWidth, viewportHeight);

  const size = randomBetween(30, Math.max(90, smallestSide * 0.18));
  const left = randomBetween(-size * 0.35, viewportWidth - size * 0.65);
  const top = randomBetween(120, viewportHeight - size * 0.35);
  const moveX = randomBetween(-viewportWidth * 0.22, viewportWidth * 0.22);
  const moveY = randomBetween(-viewportHeight * 0.28, viewportHeight * 0.18);

  // Each bubble gets its own speed.
  // Smaller duration = faster bubble, larger duration = slower bubble.
  const floatSpeed = randomBetween(4, 26);
  const glowSpeed = randomBetween(3, 9);
  const spinSpeed = randomBetween(8, 34);

  const delay = randomBetween(-10, 0);
  const scale = randomBetween(0.82, 1.24);
  const color = colors[Math.floor(Math.random() * colors.length)];

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
  bubble.style.background = color;
  bubble.style.setProperty("--move-x", `${moveX}px`);
  bubble.style.setProperty("--move-y", `${moveY}px`);
  bubble.style.setProperty("--scale", scale);
  bubble.style.setProperty("--float-speed", `${floatSpeed}s`);
  bubble.style.setProperty("--glow-speed", `${glowSpeed}s`);
  bubble.style.setProperty("--spin-speed", `${spinSpeed}s`);
  bubble.style.animationDelay = `${delay}s, ${delay / 2}s, ${delay / 3}s`;

  bubbleContainer.appendChild(bubble);
}

function makeBubbles() {
  bubbleContainer.innerHTML = "";

  const bubbleCount = Math.max(26, Math.min(58, Math.round((window.innerWidth * window.innerHeight) / 26000)));

  for (let i = 0; i < bubbleCount; i += 1) {
    createBubble();
  }
}

resetButton.addEventListener("click", makeBubbles);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(makeBubbles, 250);
});

makeBubbles();
