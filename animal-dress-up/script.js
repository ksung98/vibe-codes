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

function pandaLayer(category, item) {
  return document.querySelector(`.wearable-layer[data-animal="panda"][data-category="${category}"][data-item="${item}"]`);
}

function upgradePandaOutfit() {
  const baseballCap = pandaLayer("hat", "sun");
  const beanie = pandaLayer("hat", "party");
  const shirt = pandaLayer("top", "shirt");
  const scarf = pandaLayer("top", "scarf");
  const shorts = pandaLayer("bottom", "shorts");
  const backpack = pandaLayer("accessory", "purse");
  const sneakers = pandaLayer("shoes", "sneakers");

  document.querySelector('[data-category="hat"][data-item="sun"]').textContent = "Baseball cap";
  document.querySelector('[data-category="hat"][data-item="party"]').textContent = "Beanie";
  document.querySelector('[data-category="accessory"][data-item="purse"]').textContent = "Backpack";

  baseballCap.innerHTML = `
    <defs>
      <linearGradient id="capCrown" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9df"/><stop offset="1" stop-color="#e7d8ae"/></linearGradient>
      <linearGradient id="capGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe66f"/><stop offset="1" stop-color="#d9a927"/></linearGradient>
      <filter id="capShadow"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity=".28"/></filter>
    </defs>
    <g filter="url(#capShadow)">
      <path d="M174 92 Q180 28 260 24 Q340 28 346 92 Q316 109 260 108 Q204 109 174 92Z" fill="url(#capCrown)" stroke="#5a401e" stroke-width="7"/>
      <path d="M338 78 Q372 87 387 115 Q357 116 324 100Z" fill="url(#capGold)" stroke="#5a401e" stroke-width="7"/>
      <path d="M164 91 Q232 72 324 91 Q302 126 245 126 Q190 125 153 110 Q155 99 164 91Z" fill="url(#capGold)" stroke="#5a401e" stroke-width="7"/>
      <path d="M181 91 Q243 78 316 94" fill="none" stroke="#fff2a8" stroke-width="5" stroke-linecap="round"/>
      <circle cx="260" cy="27" r="10" fill="#d8aa31" stroke="#5a401e" stroke-width="5"/>
      <g transform="translate(260 63)" fill="#b98347" stroke="#69461f" stroke-width="2">
        <circle cx="0" cy="8" r="10"/><circle cx="-14" cy="-5" r="6"/><circle cx="0" cy="-9" r="6"/><circle cx="14" cy="-5" r="6"/>
      </g>
    </g>`;

  beanie.innerHTML = `
    <defs><linearGradient id="beanieKnit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9db65"/><stop offset="1" stop-color="#bd8c24"/></linearGradient></defs>
    <g filter="url(#capShadow)">
      <path d="M185 101 Q189 33 260 27 Q331 33 335 101Z" fill="url(#beanieKnit)" stroke="#5a401e" stroke-width="8"/>
      <rect x="178" y="88" width="164" height="34" rx="16" fill="#f4cf55" stroke="#5a401e" stroke-width="8"/>
      <path d="M205 48 Q260 70 315 48 M198 68 Q260 89 322 68" fill="none" stroke="#fff0a0" stroke-width="5" opacity=".75"/>
      <circle cx="260" cy="26" r="18" fill="#f8dd75" stroke="#5a401e" stroke-width="7"/>
    </g>`;

  shirt.innerHTML = `
    <defs>
      <linearGradient id="shirtBody" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffdf2"/><stop offset="1" stop-color="#e8e1cf"/></linearGradient>
      <linearGradient id="shirtSleeve" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe775"/><stop offset="1" stop-color="#d9a92f"/></linearGradient>
      <filter id="clothShadow"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity=".25"/></filter>
    </defs>
    <g filter="url(#clothShadow)">
      <path d="M182 229 Q205 201 233 201 L260 220 L287 201 Q315 201 338 229 L329 347 Q260 371 191 347Z" fill="url(#shirtBody)" stroke="#57472f" stroke-width="7"/>
      <path d="M181 228 Q158 244 151 284 L190 300 L205 228Z" fill="url(#shirtSleeve)" stroke="#57472f" stroke-width="7"/>
      <path d="M339 228 Q362 244 369 284 L330 300 L315 228Z" fill="url(#shirtSleeve)" stroke="#57472f" stroke-width="7"/>
      <path d="M229 205 Q260 233 291 205" fill="none" stroke="#d6a927" stroke-width="11" stroke-linecap="round"/>
      <path d="M203 323 Q260 340 317 323" fill="none" stroke="#d6d0c3" stroke-width="5" opacity=".8"/>
    </g>`;

  scarf.innerHTML = `
    <defs><linearGradient id="scarfGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe77a"/><stop offset="1" stop-color="#c79526"/></linearGradient></defs>
    <g filter="url(#clothShadow)">
      <path d="M176 211 Q260 249 344 211 L336 254 Q260 279 184 254Z" fill="url(#scarfGold)" stroke="#5a401e" stroke-width="7"/>
      <path d="M302 246 Q333 268 340 382 L304 366 L278 258Z" fill="url(#scarfGold)" stroke="#5a401e" stroke-width="7"/>
      <path d="M310 341 L336 350 M306 357 L337 365" stroke="#fff1a5" stroke-width="5"/>
    </g>`;

  shorts.innerHTML = `
    <defs>
      <linearGradient id="oliveShorts" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9ca05f"/><stop offset="1" stop-color="#616739"/></linearGradient>
      <filter id="shortShadow"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity=".3"/></filter>
    </defs>
    <g filter="url(#shortShadow)">
      <path d="M181 334 Q260 355 339 334 L337 412 Q315 428 282 420 L260 382 L238 420 Q205 428 183 412Z" fill="url(#oliveShorts)" stroke="#3f4328" stroke-width="8"/>
      <path d="M183 348 Q260 365 337 348" fill="none" stroke="#d3b33f" stroke-width="8"/>
      <path d="M204 360 Q217 378 235 382 M316 360 Q303 378 285 382" fill="none" stroke="#d5c96d" stroke-width="5"/>
      <path d="M260 349 L260 390" stroke="#45492b" stroke-width="6"/>
      <path d="M246 349 Q260 367 274 349" fill="none" stroke="#f3e7c0" stroke-width="6" stroke-linecap="round"/>
      <circle cx="246" cy="349" r="5" fill="#f3e7c0"/><circle cx="274" cy="349" r="5" fill="#f3e7c0"/>
    </g>`;

  backpack.innerHTML = `
    <defs>
      <linearGradient id="packOlive" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a4a568"/><stop offset="1" stop-color="#555b35"/></linearGradient>
      <linearGradient id="packGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe36a"/><stop offset="1" stop-color="#bd8d27"/></linearGradient>
      <filter id="packShadow"><feDropShadow dx="4" dy="6" stdDeviation="4" flood-opacity=".35"/></filter>
    </defs>
    <g filter="url(#packShadow)">
      <path d="M337 228 Q388 220 405 261 L416 361 Q412 398 375 405 L340 392Z" fill="url(#packOlive)" stroke="#3e4228" stroke-width="8"/>
      <path d="M348 247 Q378 229 397 258" fill="none" stroke="url(#packGold)" stroke-width="12" stroke-linecap="round"/>
      <path d="M332 221 Q301 247 305 310" fill="none" stroke="url(#packGold)" stroke-width="14" stroke-linecap="round"/>
      <path d="M188 221 Q219 247 215 310" fill="none" stroke="url(#packGold)" stroke-width="14" stroke-linecap="round"/>
      <rect x="358" y="292" width="49" height="75" rx="16" fill="#767c49" stroke="#3e4228" stroke-width="6"/>
      <path d="M363 316 L401 316" stroke="#e1b737" stroke-width="6" stroke-linecap="round"/>
      <rect x="306" y="260" width="21" height="34" rx="7" fill="#82672d" stroke="#3e4228" stroke-width="5"/>
      <rect x="193" y="260" width="21" height="34" rx="7" fill="#82672d" stroke="#3e4228" stroke-width="5"/>
    </g>`;

  sneakers.innerHTML = `
    <defs>
      <linearGradient id="shoeOlive" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a5a76c"/><stop offset="1" stop-color="#62683f"/></linearGradient>
      <linearGradient id="soleCream" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff8dc"/><stop offset="1" stop-color="#d7c89f"/></linearGradient>
      <filter id="shoeShadow"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity=".32"/></filter>
    </defs>
    <g filter="url(#shoeShadow)">
      <path d="M165 429 Q200 414 239 438 L246 464 Q229 485 165 482 Q145 464 165 429Z" fill="url(#shoeOlive)" stroke="#3f432c" stroke-width="8"/>
      <path d="M355 429 Q320 414 281 438 L274 464 Q291 485 355 482 Q375 464 355 429Z" fill="url(#shoeOlive)" stroke="#3f432c" stroke-width="8"/>
      <path d="M153 463 Q196 478 246 459 L243 482 Q198 497 157 484Z" fill="url(#soleCream)" stroke="#5a5139" stroke-width="6"/>
      <path d="M367 463 Q324 478 274 459 L277 482 Q322 497 363 484Z" fill="url(#soleCream)" stroke="#5a5139" stroke-width="6"/>
      <path d="M177 439 L225 454 M171 450 L228 466 M343 439 L295 454 M349 450 L292 466" stroke="#fff4d7" stroke-width="6" stroke-linecap="round"/>
      <path d="M161 436 Q179 421 198 425 M359 436 Q341 421 322 425" fill="none" stroke="#e5bd39" stroke-width="7"/>
    </g>`;
}

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

upgradePandaOutfit();
setAnimal(currentAnimal);
resetOutfit();
