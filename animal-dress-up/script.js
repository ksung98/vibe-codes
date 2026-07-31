const animalButtons = [...document.querySelectorAll('.choice[data-animal]')];
const itemButtons = [...document.querySelectorAll('.item[data-category][data-item]')];
const animalGroups = {
  capybara: document.getElementById('capybara'),
  panda: document.getElementById('panda')
};
const wearableSets = {
  capybara: document.getElementById('capybara-wearables'),
  panda: document.getElementById('panda-wearables')
};
const randomButton = document.getElementById('randomButton');
const resetButton = document.getElementById('resetButton');
const outfitMessage = document.getElementById('outfitMessage');

let selectedAnimal = 'capybara';
const outfit = {
  hat: 'none',
  top: 'none',
  bottom: 'none',
  accessory: 'none',
  shoes: 'none'
};

const labels = {
  sun: 'a sun hat',
  party: 'a party hat',
  shirt: 'a T-shirt',
  scarf: 'a scarf',
  shorts: 'shorts',
  purse: 'a purse',
  sneakers: 'sneakers'
};

function setVisible(element, visible) {
  if (!element) return;
  element.classList.toggle('hidden', !visible);
  element.style.display = visible ? 'inline' : 'none';
}

function render() {
  Object.entries(animalGroups).forEach(([name, group]) => {
    setVisible(group, name === selectedAnimal);
  });

  Object.entries(wearableSets).forEach(([name, set]) => {
    const selected = name === selectedAnimal;
    setVisible(set, selected);

    if (!set) return;
    set.querySelectorAll('.wearable').forEach(wearable => {
      const category = wearable.dataset.category;
      const item = wearable.dataset.item;
      setVisible(wearable, selected && outfit[category] === item);
    });
  });

  animalButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.animal === selectedAnimal);
    button.setAttribute('aria-pressed', button.dataset.animal === selectedAnimal ? 'true' : 'false');
  });

  itemButtons.forEach(button => {
    const active = outfit[button.dataset.category] === button.dataset.item;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const chosen = Object.values(outfit)
    .filter(item => item !== 'none')
    .map(item => labels[item] || item);
  const animalName = selectedAnimal[0].toUpperCase() + selectedAnimal.slice(1);

  outfitMessage.textContent = chosen.length
    ? `${animalName} is wearing ${chosen.join(', ')}!`
    : `Your ${selectedAnimal} is ready to dress up!`;
}

animalButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedAnimal = button.dataset.animal;
    render();
  });
});

itemButtons.forEach(button => {
  button.addEventListener('click', () => {
    outfit[button.dataset.category] = button.dataset.item;
    render();
  });
});

randomButton.addEventListener('click', () => {
  const options = {
    hat: ['none', 'sun', 'party'],
    top: ['none', 'shirt', 'scarf'],
    bottom: ['none', 'shorts'],
    accessory: ['none', 'purse'],
    shoes: ['none', 'sneakers']
  };

  selectedAnimal = Math.random() < 0.5 ? 'capybara' : 'panda';
  Object.keys(outfit).forEach(category => {
    const choices = options[category];
    outfit[category] = choices[Math.floor(Math.random() * choices.length)];
  });
  render();
});

resetButton.addEventListener('click', () => {
  Object.keys(outfit).forEach(category => {
    outfit[category] = 'none';
  });
  render();
});

render();