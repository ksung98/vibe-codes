const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushSizeLabel = document.getElementById("brushSizeLabel");
const stampSize = document.getElementById("stampSize");
const stampSizeLabel = document.getElementById("stampSizeLabel");
const brushButton = document.getElementById("brushButton");
const eraserButton = document.getElementById("eraserButton");
const stampButtons = [...document.querySelectorAll(".stamp-button")];
const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const canvasHelp = document.getElementById("canvasHelp");
const modePill = document.getElementById("modePill");
const promptText = document.getElementById("promptText");
const promptButton = document.getElementById("promptButton");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let drawing = false;
let mode = "brush";
let selectedShape = null;
let lastPoint = null;
let undoStack = [];

const prompts = [
  "Try drawing one slow line while taking one slow breath.",
  "Choose a color that matches how you feel right now.",
  "Stamp a repeating pattern across the page.",
  "Draw a shape, pattern, or color that feels calming.",
  "Let your hand move gently across the page.",
  "Try combining two shapes into something new."
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
  ctx.putImageData(undoStack.pop(), 0, 0);
}

function clearCanvas(saveFirst = true) {
  if (saveFirst) saveState();
  setWhiteBackground();
}

function setMode(nextMode, shape = null) {
  mode = nextMode;
  selectedShape = shape;

  brushButton.classList.toggle("active", mode === "brush");
  eraserButton.classList.toggle("active", mode === "eraser");
  stampButtons.forEach((button) => {
    button.classList.toggle("active", mode === "stamp" && button.dataset.shape === selectedShape);
  });

  if (mode === "brush") {
    modePill.textContent = "Brush mode";
    canvasHelp.textContent = "Use your mouse, trackpad, or finger to draw.";
    canvas.style.cursor = "crosshair";
  } else if (mode === "eraser") {
    modePill.textContent = "Eraser mode";
    canvasHelp.textContent = "Drag across the page to erase.";
    canvas.style.cursor = "crosshair";
  } else {
    const label = selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1);
    modePill.textContent = `${label} stamp`;
    canvasHelp.textContent = "Tap or click anywhere on the page to place the selected shape.";
    canvas.style.cursor = "copy";
  }
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches ? event.touches[0] : event;
  return {
    x: ((source.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((source.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
  };
}

function beginDraw(event) {
  event.preventDefault();
  const point = getCanvasPoint(event);

  if (mode === "stamp") {
    saveState();
    drawStamp(point.x, point.y, selectedShape, Number(stampSize.value));
    return;
  }

  saveState();
  drawing = true;
  lastPoint = point;
}

function draw(event) {
  if (!drawing || !lastPoint || mode === "stamp") return;
  event.preventDefault();
  const point = getCanvasPoint(event);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Number(brushSize.value);
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = mode === "eraser" ? "#ffffff" : colorPicker.value;

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

function drawStamp(x, y, shape, size) {
  const half = size / 2;
  ctx.save();
  ctx.fillStyle = colorPicker.value;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = Math.max(3, size * 0.08);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();

  if (shape === "circle") {
    ctx.arc(x, y, half, 0, Math.PI * 2);
  } else if (shape === "square") {
    ctx.rect(x - half, y - half, size, size);
  } else if (shape === "triangle") {
    ctx.moveTo(x, y - half);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x - half, y + half);
    ctx.closePath();
  } else if (shape === "star") {
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? half : half * 0.45;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (shape === "heart") {
    ctx.moveTo(x, y + half * 0.8);
    ctx.bezierCurveTo(x - half * 1.15, y + half * 0.1, x - half, y - half * 0.85, x, y - half * 0.25);
    ctx.bezierCurveTo(x + half, y - half * 0.85, x + half * 1.15, y + half * 0.1, x, y + half * 0.8);
    ctx.closePath();
  } else if (shape === "flower") {
    const petalRadius = size * 0.22;
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      const px = x + Math.cos(angle) * size * 0.28;
      const py = y + Math.sin(angle) * size * 0.28;
      ctx.moveTo(px + petalRadius, py);
      ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
    }
    ctx.moveTo(x + size * 0.18, y);
    ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.restore();
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "drawing-calm-space.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function newPrompt() {
  promptText.textContent = prompts[Math.floor(Math.random() * prompts.length)];
}

colorPicker.addEventListener("input", () => {
  if (mode === "eraser") setMode("brush");
});

brushSize.addEventListener("input", () => {
  brushSizeLabel.textContent = brushSize.value;
});

stampSize.addEventListener("input", () => {
  stampSizeLabel.textContent = stampSize.value;
});

brushButton.addEventListener("click", () => setMode("brush"));
eraserButton.addEventListener("click", () => setMode("eraser"));
stampButtons.forEach((button) => {
  button.addEventListener("click", () => setMode("stamp", button.dataset.shape));
});
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
setMode("brush");
