const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const pageSelect = document.getElementById("pageSelect");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushSizeLabel = document.getElementById("brushSizeLabel");
const brushButton = document.getElementById("brushButton");
const eraserButton = document.getElementById("eraserButton");
const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const canvasTitle = document.getElementById("canvasTitle");
const canvasHelp = document.getElementById("canvasHelp");
const modePill = document.getElementById("modePill");
const promptText = document.getElementById("promptText");
const promptButton = document.getElementById("promptButton");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let drawing = false;
let mode = "brush";
let lastPoint = null;
let undoStack = [];

const pageTitles = {
  blank: "Blank drawing page",
  flower: "Flower garden coloring page",
  butterfly: "Butterfly coloring page",
  mandala: "Simple mandala coloring page",
  ocean: "Ocean scene coloring page",
  house: "Cozy house coloring page"
};

const prompts = [
  "Try drawing one slow line while taking one slow breath.",
  "Choose a color that matches how you feel right now.",
  "Fill one small space at a time. There is no rush.",
  "Draw a shape, pattern, or color that feels calming.",
  "Let your hand move gently across the page.",
  "Try coloring only the edges first, then the middle."
];

function setWhiteBackground() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

function saveState() {
  undoStack.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
  if (undoStack.length > 20) undoStack.shift();
}

function restoreLastState() {
  if (undoStack.length === 0) return;
  const imageData = undoStack.pop();
  ctx.putImageData(imageData, 0, 0);
}

function clearCanvas(saveFirst = true) {
  if (saveFirst) saveState();
  setWhiteBackground();
  drawSelectedTemplate();
}

function drawLineArtSetup() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.fillStyle = "transparent";
}

function finishLineArt() {
  ctx.restore();
}

function drawPetal(cx, cy, rx, ry, rotation) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFlowerGarden() {
  drawLineArtSetup();
  ctx.lineWidth = 6;

  for (let i = 0; i < 4; i += 1) {
    const cx = 230 + i * 230;
    const cy = 365 + (i % 2) * 35;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 80);
    ctx.quadraticCurveTo(cx - 22, cy + 20, cx, cy - 30);
    ctx.stroke();

    for (let p = 0; p < 8; p += 1) {
      drawPetal(cx, cy - 70, 34, 72, (Math.PI * 2 * p) / 8);
    }

    ctx.beginPath();
    ctx.arc(cx, cy - 70, 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx - 38, cy + 8, 36, 16, -0.5, 0, Math.PI * 2);
    ctx.ellipse(cx + 38, cy + 18, 36, 16, 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(60, 610);
  ctx.bezierCurveTo(260, 560, 420, 660, 620, 610);
  ctx.bezierCurveTo(830, 555, 990, 650, 1140, 600);
  ctx.stroke();

  finishLineArt();
}

function drawButterfly() {
  drawLineArtSetup();
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.ellipse(600, 360, 34, 145, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(600, 205, 34, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(582, 180);
  ctx.quadraticCurveTo(520, 120, 465, 135);
  ctx.moveTo(618, 180);
  ctx.quadraticCurveTo(680, 120, 735, 135);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(570, 290);
  ctx.bezierCurveTo(420, 120, 170, 160, 210, 365);
  ctx.bezierCurveTo(235, 500, 440, 500, 575, 380);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(630, 290);
  ctx.bezierCurveTo(780, 120, 1030, 160, 990, 365);
  ctx.bezierCurveTo(965, 500, 760, 500, 625, 380);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(575, 405);
  ctx.bezierCurveTo(470, 500, 450, 675, 590, 640);
  ctx.bezierCurveTo(640, 610, 630, 480, 610, 410);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(625, 405);
  ctx.bezierCurveTo(730, 500, 750, 675, 610, 640);
  ctx.bezierCurveTo(560, 610, 570, 480, 590, 410);
  ctx.stroke();

  ctx.lineWidth = 5;
  [350, 850].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 340, 55, 0, Math.PI * 2);
    ctx.arc(x, 470, 34, 0, Math.PI * 2);
    ctx.stroke();
  });

  finishLineArt();
}

function drawMandala() {
  drawLineArtSetup();
  ctx.lineWidth = 6;
  const cx = 600;
  const cy = 380;

  for (let r = 70; r <= 300; r += 58) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 16; i += 1) {
    const angle = (Math.PI * 2 * i) / 16;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * 330, cy + Math.sin(angle) * 330);
    ctx.stroke();

    drawPetal(cx + Math.cos(angle) * 155, cy + Math.sin(angle) * 155, 28, 72, angle);
    drawPetal(cx + Math.cos(angle) * 250, cy + Math.sin(angle) * 250, 22, 52, angle + Math.PI / 2);
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.stroke();
  finishLineArt();
}

function drawOcean() {
  drawLineArtSetup();
  ctx.lineWidth = 7;

  ctx.beginPath();
  ctx.arc(965, 145, 70, 0, Math.PI * 2);
  ctx.stroke();

  for (let y = 470; y <= 640; y += 55) {
    ctx.beginPath();
    ctx.moveTo(70, y);
    for (let x = 70; x <= 1130; x += 110) {
      ctx.quadraticCurveTo(x + 55, y - 34, x + 110, y);
    }
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(210, 410);
  ctx.quadraticCurveTo(300, 330, 390, 410);
  ctx.quadraticCurveTo(300, 490, 210, 410);
  ctx.moveTo(390, 410);
  ctx.lineTo(465, 365);
  ctx.lineTo(465, 455);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(270, 392, 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(720, 420);
  ctx.bezierCurveTo(650, 365, 650, 300, 720, 250);
  ctx.bezierCurveTo(790, 300, 790, 365, 720, 420);
  ctx.moveTo(720, 420);
  ctx.lineTo(720, 520);
  ctx.moveTo(720, 470);
  ctx.quadraticCurveTo(660, 520, 600, 470);
  ctx.moveTo(720, 470);
  ctx.quadraticCurveTo(780, 520, 840, 470);
  ctx.stroke();

  finishLineArt();
}

function drawHouse() {
  drawLineArtSetup();
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.rect(330, 310, 540, 330);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(290, 330);
  ctx.lineTo(600, 115);
  ctx.lineTo(910, 330);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(555, 455, 90, 185);
  ctx.rect(390, 395, 105, 90);
  ctx.rect(705, 395, 105, 90);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(443, 395);
  ctx.lineTo(443, 485);
  ctx.moveTo(390, 440);
  ctx.lineTo(495, 440);
  ctx.moveTo(758, 395);
  ctx.lineTo(758, 485);
  ctx.moveTo(705, 440);
  ctx.lineTo(810, 440);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(625, 550, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(150, 640);
  ctx.bezierCurveTo(320, 585, 500, 675, 670, 630);
  ctx.bezierCurveTo(840, 590, 1000, 670, 1120, 620);
  ctx.stroke();

  finishLineArt();
}

function drawSelectedTemplate() {
  const page = pageSelect.value;
  if (page === "flower") drawFlowerGarden();
  if (page === "butterfly") drawButterfly();
  if (page === "mandala") drawMandala();
  if (page === "ocean") drawOcean();
  if (page === "house") drawHouse();
  canvasTitle.textContent = pageTitles[page];
  canvasHelp.textContent = page === "blank" ? "Use your mouse, trackpad, or finger to draw." : "Color inside the outlines or add your own drawings around them.";
}

function setMode(nextMode) {
  mode = nextMode;
  brushButton.classList.toggle("active", mode === "brush");
  eraserButton.classList.toggle("active", mode === "eraser");
  modePill.textContent = mode === "brush" ? "Brush mode" : "Eraser mode";
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  return {
    x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT
  };
}

function beginDraw(event) {
  event.preventDefault();
  saveState();
  drawing = true;
  lastPoint = getCanvasPoint(event);
}

function draw(event) {
  if (!drawing || !lastPoint) return;
  event.preventDefault();
  const point = getCanvasPoint(event);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Number(brushSize.value);

  if (mode === "eraser") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#ffffff";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colorPicker.value;
  }

  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  ctx.restore();

  lastPoint = point;
}

function endDraw() {
  drawing = false;
  lastPoint = null;
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "drawing-and-coloring.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function newPrompt() {
  const nextPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  promptText.textContent = nextPrompt;
}

pageSelect.addEventListener("change", () => clearCanvas(true));
colorPicker.addEventListener("input", () => setMode("brush"));
brushSize.addEventListener("input", () => {
  brushSizeLabel.textContent = brushSize.value;
});

brushButton.addEventListener("click", () => setMode("brush"));
eraserButton.addEventListener("click", () => setMode("eraser"));
undoButton.addEventListener("click", restoreLastState);
clearButton.addEventListener("click", () => clearCanvas(true));
saveButton.addEventListener("click", saveImage);
promptButton.addEventListener("click", newPrompt);

canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseleave", endDraw);

canvas.addEventListener("touchstart", beginDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
window.addEventListener("touchend", endDraw);

setWhiteBackground();
drawSelectedTemplate();
