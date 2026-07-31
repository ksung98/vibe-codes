const animalBase = document.getElementById("animalBase");
const stage = document.getElementById("dressUpStage");
const outfitMessage = document.getElementById("outfitMessage");
const animalButtons = [...document.querySelectorAll(".choice[data-animal]")];
const itemButtons = [...document.querySelectorAll(".item[data-category][data-item]")];
const randomButton = document.getElementById("randomButton");
const resetButton = document.getElementById("resetButton");
const wearableLayers = [...document.querySelectorAll(".wearable-layer")];

const animals = {
  capybara: {
    name: "capybara",
    image: "assets/capybara.webp?v=2"
  },
  panda: {
    name: "panda",
    image: "assets/panda-fixed.webp?v=2",
    completeOutfit: "assets/panda-adventure.svg?v=1"
  }
};

const categoryChoices = {
  hat: ["none", "sun", "party"],
  top: ["none", "shirt", "scarf"],
  bottom: ["none", "shorts"],
  accessory: ["none", "purse"],
  shoes: ["none", "sneakers"]
};

let currentAnimal = "capybara";
const outfit = {
  hat: "none",
  top: "none",
  bottom: "none",
  accessory: "none",
  shoes: "none"
};

function isCompletePandaOutfit() {
  return currentAnimal === "panda" &&
    outfit.hat === "sun" &&
    outfit.top === "shirt" &&
    outfit.bottom === "shorts" &&
    outfit.accessory === "purse" &&
    outfit.shoes === "sneakers";
}

function updateLabels() {
  const cap = document.querySelector('[data-category="hat"][data-item="sun"]');
  const accessory = document.querySelector('[data-category="accessory"][data-item="purse"]');

  if (cap) cap.textContent = currentAnimal === "panda" ? "Baseball cap" : "Sun hat";
  if (accessory) accessory.textContent = currentAnimal === "panda" ? "Backpack" : "Purse";
}

function render() {
  const completePanda = isCompletePandaOutfit();

  animalBase.src = completePanda
    ? animals.panda.completeOutfit
    : animals[currentAnimal].image;
  animalBase.alt = completePanda
    ? "Panda wearing a fitted cap, T-shirt, shorts, backpack, and sneakers"
    : `${currentAnimal} ready to dress up`;

  stage.classList.toggle("animal-capybara", currentAnimal === "capybara");
  stage.classList.toggle("animal-panda", currentAnimal === "panda");
  stage.classList.toggle("complete-panda-outfit", completePanda);

  wearableLayers.forEach((layer) => {
    const shouldShow = !completePanda &&
      layer.dataset.animal === currentAnimal &&
      outfit[layer.dataset.category] === layer.dataset.item;
    layer.classList.toggle("show", shouldShow);
  });

  animalButtons.forEach((button) => {
    const active = button.dataset.animal === currentAnimal;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  itemButtons.forEach((button) => {
    const active = outfit[button.dataset.category] === button.dataset.item;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updateLabels();

  const count = Object.values(outfit).filter((value) => value !== "none").length;
  outfitMessage.textContent = completePanda
    ? "Your panda is wearing the complete fitted adventure outfit!"
    : count
      ? `Your ${currentAnimal} is wearing ${count} fun item${count === 1 ? "" : "s"}.`
      : `Your ${currentAnimal} is ready to dress up!`;
}

animalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentAnimal = button.dataset.animal;
    render();
  });
});

itemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    outfit[button.dataset.category] = button.dataset.item;
    render();
  });
});

randomButton.addEventListener("click", () => {
  currentAnimal = Math.random() < 0.5 ? "capybara" : "panda";
  Object.keys(categoryChoices).forEach((category) => {
    const choices = categoryChoices[category];
    outfit[category] = choices[Math.floor(Math.random() * choices.length)];
  });
  render();
});

resetButton.addEventListener("click", () => {
  Object.keys(outfit).forEach((category) => {
    outfit[category] = "none";
  });
  render();
});

render();