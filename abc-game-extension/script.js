const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const encouragements = [
  "You can take your time.",
  "Nice job staying with it.",
  "Pause for one slow breath before the next letter.",
  "There is no perfect answer here.",
  "Keep going gently."
];

const currentLetter = document.getElementById("currentLetter");
const promptText = document.getElementById("promptText");
const answerInput = document.getElementById("answerInput");
const categoryInput = document.getElementById("categoryInput");
const saveButton = document.getElementById("saveButton");
const skipButton = document.getElementById("skipButton");
const clearButton = document.getElementById("clearButton");
const progressList = document.getElementById("progressList");
const encouragement = document.getElementById("encouragement");
const saveReflectionButton = document.getElementById("saveReflectionButton");
const reflectionInput = document.getElementById("reflectionInput");
const modeButtons = document.querySelectorAll(".mode-button");
const categoryButtons = document.querySelectorAll("[data-category]");

let state = {
  letterIndex: 0,
  mode: "solo",
  entries: [],
  reflections: []
};

function hasChromeStorage() {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
}

function storageGet(callback) {
  if (hasChromeStorage()) {
    chrome.storage.local.get(["abcGameState"], (result) => callback(result.abcGameState));
  } else {
    callback(JSON.parse(localStorage.getItem("abcGameState") || "null"));
  }
}

function storageSet(value) {
  if (hasChromeStorage()) {
    chrome.storage.local.set({ abcGameState: value });
  } else {
    localStorage.setItem("abcGameState", JSON.stringify(value));
  }
}

function formatCategory(category) {
  const clean = category.trim() || "your category";
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}

function updatePrompt() {
  const letter = letters[state.letterIndex] || "A";
  currentLetter.textContent = letter;
  promptText.textContent = `Name ${formatCategory(categoryInput.value)} that starts with ${letter}.`;
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === state.mode));
}

function renderProgress() {
  progressList.innerHTML = "";

  if (state.entries.length === 0 && state.reflections.length === 0) {
    progressList.innerHTML = '<p class="empty">No answers saved yet.</p>';
    return;
  }

  state.entries.slice().reverse().forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${entry.letter}</strong> — ${entry.answer}<br><small>${entry.category} • ${entry.mode}</small>`;
    progressList.appendChild(div);
  });

  state.reflections.slice().reverse().forEach((reflection) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>Reflection</strong> — ${reflection.text}`;
    progressList.appendChild(div);
  });
}

function nextLetter() {
  state.letterIndex = (state.letterIndex + 1) % letters.length;
  encouragement.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
  answerInput.value = "";
  updatePrompt();
  storageSet(state);
}

function saveAnswer() {
  const answer = answerInput.value.trim();
  if (!answer) {
    encouragement.textContent = "Type an answer or skip this letter when you are ready.";
    return;
  }

  state.entries.push({
    letter: letters[state.letterIndex],
    answer,
    category: categoryInput.value.trim() || "Custom category",
    mode: state.mode === "solo" ? "Solo" : "Take turns",
    savedAt: new Date().toISOString()
  });

  if (state.entries.length > 80) state.entries = state.entries.slice(-80);
  renderProgress();
  nextLetter();
}

function saveReflection() {
  const text = reflectionInput.value.trim();
  if (!text) return;

  state.reflections.push({ text, savedAt: new Date().toISOString() });
  if (state.reflections.length > 20) state.reflections = state.reflections.slice(-20);
  reflectionInput.value = "";
  renderProgress();
  storageSet(state);
}

saveButton.addEventListener("click", saveAnswer);
skipButton.addEventListener("click", nextLetter);
saveReflectionButton.addEventListener("click", saveReflection);
categoryInput.addEventListener("input", updatePrompt);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    updatePrompt();
    storageSet(state);
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryInput.value = button.dataset.category;
    updatePrompt();
  });
});

clearButton.addEventListener("click", () => {
  state.entries = [];
  state.reflections = [];
  state.letterIndex = 0;
  storageSet(state);
  renderProgress();
  updatePrompt();
});

storageGet((saved) => {
  if (saved) state = { ...state, ...saved };
  updatePrompt();
  renderProgress();
});
