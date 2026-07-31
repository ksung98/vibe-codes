const animalBase = document.getElementById("animalBase");
const stage = document.getElementById("dressUpStage");
const outfitMessage = document.getElementById("outfitMessage");
const animalButtons = document.querySelectorAll("[data-animal]");
const itemButtons = document.querySelectorAll(".item");
const randomButton = document.getElementById("randomButton");
const resetButton = document.getElementById("resetButton");
const wearableLayers = document.querySelectorAll(".wearable-layer");

const animals = {
  capybara: {
    name: "capybara",
    image: "assets/capybara.webp?v=2",
    message: "Your capybara is ready to dress up!"
  },
  panda: {
    name: "panda",
    image: "assets/panda-fixed.webp?v=2",
    message: "Your panda is ready to dress up!"
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

function setAnimal(animal) {
  currentAnimal = animal;
  animalBase.src = animals[animal].image;
  animalBase.alt = `${animal} ready to dress up`;
  stage.classList.toggle("animal-capybara", animal === "capybara");
  stage.classList.toggle("animal-panda", animal === "panda");
  animalButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.animal === animal);
  });
  updateStage();
}

function setItem(category, item) {
  outfit[category] = item;
  itemButtons.forEach((button) => {
    if (button.dataset.category === category) {
      button.classList.toggle("active", button.dataset.item === item);
    }
  });
  updateStage();
}

function updateStage() {
  wearableLayers.forEach((layer) => {
    const matchesAnimal = layer.dataset.animal === currentAnimal;
    const matchesItem = outfit[layer.dataset.category] === layer.dataset.item;
    layer.classList.toggle("show", matchesAnimal && matchesItem);
  });

  const dressedPieces = Object.values(outfit).filter((value) => value !== "none").length;
  outfitMessage.textContent = dressedPieces === 0
    ? animals[currentAnimal].message
    : `Your ${animals[currentAnimal].name} is wearing ${dressedPieces} fun item${dressedPieces === 1 ? "" : "s"}.`;
}

function randomizeOutfit() {
  currentAnimal = Math.random() < 0.5 ? "capybara" : "panda";
  Object.keys(categoryChoices).forEach((category) => {
    const choices = categoryChoices[category];
    outfit[category] = choices[Math.floor(Math.random() * choices.length)];
  });
  animalBase.src = animals[currentAnimal].image;
  animalBase.alt = `${currentAnimal} ready to dress up`;
  animalButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.animal === currentAnimal);
  });
  itemButtons.forEach((button) => {
    button.classList.toggle("active", outfit[button.dataset.category] === button.dataset.item);
  });
  updateStage();
}

function resetOutfit() {
  Object.keys(outfit).forEach((category) => {
    outfit[category] = "none";
  });
  itemButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.item === "none");
  });
  updateStage();
}

animalButtons.forEach((button) => {
  button.addEventListener("click", () => setAnimal(button.dataset.animal));
});

itemButtons.forEach((button) => {
  button.addEventListener("click", () => setItem(button.dataset.category, button.dataset.item));
});

randomButton.addEventListener("click", randomizeOutfit);
resetButton.addEventListener("click", resetOutfit);

setAnimal(currentAnimal);
resetOutfit();
