const animalButtons = [...document.querySelectorAll('[data-animal]')];
const itemButtons = [...document.querySelectorAll('.item')];
const animals = [...document.querySelectorAll('.animal')];
const wearableSets = [...document.querySelectorAll('.wearable-set')];
const randomButton = document.getElementById('randomButton');
const resetButton = document.getElementById('resetButton');
const outfitMessage = document.getElementById('outfitMessage');

let selectedAnimal = 'capybara';
const outfit = { hat: 'none', top: 'none', bottom: 'none', accessory: 'none', shoes: 'none' };

function labelFor(value) {
  const labels = {
    sun: 'a sun hat',
    party: 'a party hat',
    shirt: 'a T-shirt',
    scarf: 'a scarf',
    shorts: 'shorts',
    purse: 'a purse',
    sneakers: 'sneakers'
  };
  return labels[value] || value;
}

function render() {
  animals.forEach(animal => animal.classList.toggle('hidden', animal.id !== selectedAnimal));
  animalButtons.forEach(button => button.classList.toggle('active', button.dataset.animal === selectedAnimal));

  wearableSets.forEach(set => {
    const isSelectedSet = set.id === `${selectedAnimal}-wearables`;
    set.classList.toggle('hidden', !isSelectedSet);
    [...set.querySelectorAll('.wearable')].forEach(wearable => {
      const chosen = outfit[wearable.dataset.category] === wearable.dataset.item;
      wearable.classList.toggle('hidden', !isSelectedSet || !chosen);
    });
  });

  itemButtons.forEach(button => {
    button.classList.toggle('active', outfit[button.dataset.category] === button.dataset.item);
  });

  const chosen = Object.values(outfit).filter(item => item !== 'none').map(labelFor);
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