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
const outfit = { hat: 'none', top: 'none', bottom: 'none', accessory: 'none', shoes: 'none' };

const labels = {
  sun: 'a sun hat', party: 'a party hat', shirt: 'a T-shirt', scarf: 'a scarf',
  shorts: 'shorts', purse: 'a purse', sneakers: 'sneakers'
};

function showSvg(element) {
  if (!element) return;
  element.classList.remove('hidden');
  element.removeAttribute('display');
  element.removeAttribute('visibility');
  element.style.removeProperty('display');
  element.style.removeProperty('visibility');
}

function hideSvg(element) {
  if (!element) return;
  element.classList.add('hidden');
  element.setAttribute('display', 'none');
  element.setAttribute('visibility', 'hidden');
}

function render() {
  Object.entries(animalGroups).forEach(([name, group]) => {
    if (name === selectedAnimal) showSvg(group);
    else hideSvg(group);
  });

  Object.entries(wearableSets).forEach(([name, set]) => {
    const selected = name === selectedAnimal;
    if (selected) showSvg(set);
    else hideSvg(set);

    if (!set) return;
    set.querySelectorAll('.wearable').forEach(wearable => {
      const shouldShow = selected && outfit[wearable.dataset.category] === wearable.dataset.item;
      if (shouldShow) showSvg(wearable);
      else hideSvg(wearable);
    });
  });

  animalButtons.forEach(button => {
    const active = button.dataset.animal === selectedAnimal;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  itemButtons.forEach(button => {
    const active = outfit[button.dataset.category] === button.dataset.item;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const chosen = Object.values(outfit).filter(item => item !== 'none').map(item => labels[item] || item);
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
  Object.keys(outfit).forEach(category => { outfit[category] = 'none'; });
  render();
});

render();