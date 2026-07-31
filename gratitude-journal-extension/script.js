const gratitudeInput = document.getElementById("gratitudeInput");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const saveMessage = document.getElementById("saveMessage");
const entriesList = document.getElementById("entriesList");

const STORAGE_KEY = "gratitudeEntries";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getEntries(callback) {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    callback(result[STORAGE_KEY] || []);
  });
}

function saveEntries(entries, callback) {
  chrome.storage.local.set({ [STORAGE_KEY]: entries }, callback);
}

function renderEntries(entries) {
  entriesList.innerHTML = "";

  if (entries.length === 0) {
    entriesList.innerHTML = '<p class="empty-state">Your saved gratitude notes will appear here.</p>';
    return;
  }

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "entry";

    const date = document.createElement("p");
    date.className = "entry-date";
    date.textContent = formatDate(entry.createdAt);

    const text = document.createElement("p");
    text.className = "entry-text";
    text.textContent = entry.text;

    article.appendChild(date);
    article.appendChild(text);
    entriesList.appendChild(article);
  });
}

function showMessage(message) {
  saveMessage.textContent = message;
  setTimeout(() => {
    saveMessage.textContent = "";
  }, 2200);
}

saveButton.addEventListener("click", () => {
  const text = gratitudeInput.value.trim();

  if (!text) {
    showMessage("Write one thing you are grateful for first.");
    return;
  }

  getEntries((entries) => {
    const newEntry = {
      text,
      createdAt: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries, () => {
      gratitudeInput.value = "";
      renderEntries(updatedEntries);
      showMessage("Saved with gratitude.");
    });
  });
});

clearButton.addEventListener("click", () => {
  getEntries((entries) => {
    if (entries.length === 0) {
      showMessage("There are no entries to clear.");
      return;
    }

    const confirmed = confirm("Clear all gratitude entries?");
    if (!confirmed) return;

    saveEntries([], () => {
      renderEntries([]);
      showMessage("Entries cleared.");
    });
  });
});

getEntries(renderEntries);
