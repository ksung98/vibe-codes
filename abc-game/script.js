const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const quickCategories = ['animals', 'foods', 'countries', 'cities', 'movies', 'things in a room'];

const sampleAnswers = {
  animals: { A:['ape','antelope','alligator'], B:['bear','beaver','buffalo'], C:['cougar','cat','cheetah'], D:['dolphin','deer','donkey'], E:['elephant','eagle','eel'], F:['fox','frog','falcon'], G:['giraffe','goat','gorilla'], H:['horse','hamster','hawk'], I:['iguana','ibis','impala'], J:['jaguar','jellyfish','jackal'], K:['kangaroo','koala','kingfisher'], L:['lion','lemur','llama'], M:['monkey','moose','mouse'], N:['narwhal','newt','nightingale'], O:['owl','octopus','otter'], P:['penguin','panda','parrot'], Q:['quokka','quail'], R:['rabbit','raccoon','rhino'], S:['snake','seal','shark'], T:['tiger','turtle','toucan'], U:['urial'], V:['vulture','vicuna'], W:['wolf','whale','walrus'], X:['x-ray tetra'], Y:['yak'], Z:['zebra'] },
  foods: { A:['apple','avocado'], B:['banana','bagel'], C:['carrot','cookie'], D:['donut','dumpling'], E:['egg','enchilada'], F:['fries','fajitas'], G:['grapes','granola'], H:['hamburger','hummus'], I:['ice cream'], J:['jam','jello'], K:['kiwi','kale'], L:['lasagna','lemon'], M:['mango','muffin'], N:['nachos','noodles'], O:['orange','omelet'], P:['pizza','pasta'], Q:['quesadilla','quinoa'], R:['rice','raspberry'], S:['sandwich','strawberry'], T:['taco','toast'], U:['udon'], V:['vanilla yogurt'], W:['waffles','watermelon'], X:['xiao long bao'], Y:['yogurt'], Z:['zucchini','ziti'] },
  countries: { A:['Argentina','Australia'], B:['Brazil','Belgium'], C:['Canada','China'], D:['Denmark','Dominican Republic'], E:['Egypt','Ethiopia'], F:['France','Finland'], G:['Germany','Greece'], H:['Hungary','Haiti'], I:['India','Italy'], J:['Japan','Jordan'], K:['Kenya'], L:['Lebanon','Laos'], M:['Mexico','Morocco'], N:['Nigeria','Norway'], O:['Oman'], P:['Peru','Poland'], Q:['Qatar'], R:['Romania','Rwanda'], S:['Spain','Sweden'], T:['Thailand','Turkey'], U:['Uganda','Ukraine'], V:['Vietnam','Venezuela'], W:['Wales'], X:['(no common country)'], Y:['Yemen'], Z:['Zambia','Zimbabwe'] },
  cities: { A:['Atlanta','Austin'], B:['Boston','Baltimore'], C:['Chicago','Cleveland'], D:['Dallas','Denver'], E:['El Paso'], F:['Fresno'], G:['Glendale'], H:['Houston','Honolulu'], I:['Irvine','Indianapolis'], J:['Jackson'], K:['Kansas City'], L:['Los Angeles','London'], M:['Miami','Memphis'], N:['Nashville','New York'], O:['Oakland','Orlando'], P:['Phoenix','Philadelphia'], Q:['Quebec City'], R:['Raleigh','Reno'], S:['Seattle','San Diego'], T:['Tampa','Tokyo'], U:['Utrecht'], V:['Vienna'], W:['Washington','Warsaw'], X:['Xi an'], Y:['Yonkers'], Z:['Zurich'] },
  movies: { A:['Avatar','Aladdin'], B:['Barbie','Brave'], C:['Cars','Coco'], D:['Dune','Dumbo'], E:['Encanto','Elf'], F:['Frozen'], G:['Gladiator'], H:['Holes','Hercules'], I:['Inside Out'], J:['Jaws'], K:['Kung Fu Panda'], L:['Lightyear','Luca'], M:['Moana','Mulan'], N:['Nope'], O:['Onward'], P:['Pinocchio'], Q:['Queen of Katwe'], R:['Ratatouille'], S:['Shrek'], T:['Tangled','Titanic'], U:['Up'], V:['Vertigo'], W:['Wish'], X:['X-Men'], Y:['Yesterday'], Z:['Zootopia'] },
  'things in a room': { A:['armchair','alarm clock'], B:['bed','bookshelf'], C:['couch','curtain'], D:['desk','door'], E:['end table'], F:['fan','frame'], G:['game controller'], H:['hanger'], I:['iron'], J:['jar'], K:['keys'], L:['lamp'], M:['mirror'], N:['notebook'], O:['ottoman'], P:['pillow'], Q:['quilt'], R:['rug'], S:['sofa','shelf'], T:['table','television'], U:['umbrella'], V:['vase'], W:['window'], X:['xylophone'], Y:['yarn'], Z:['zipper pillow'] }
};

let index = 0;
const el = {
  mode: document.getElementById('mode'),
  firstTurn: document.getElementById('firstTurn'),
  firstTurnField: document.getElementById('firstTurnField'),
  category: document.getElementById('category'),
  currentLetter: document.getElementById('currentLetter'),
  currentCategory: document.getElementById('currentCategory'),
  buddyMessage: document.getElementById('buddyMessage'),
  response: document.getElementById('response'),
  submitBtn: document.getElementById('submitBtn'),
  hintBtn: document.getElementById('hintBtn'),
  resetBtn: document.getElementById('resetBtn'),
  statusBox: document.getElementById('statusBox'),
  quickCategories: document.getElementById('quickCategories'),
  log: document.getElementById('log'),
  checkIn: document.getElementById('checkIn'),
  reflectBtn: document.getElementById('reflectBtn'),
  reflectionBox: document.getElementById('reflectionBox')
};

function currentLetter() { return alphabet[index] || 'Z'; }
function normalizedCategory() { return el.category.value.trim().toLowerCase() || 'category'; }
function showStatus(message) { el.statusBox.textContent = message; el.statusBox.classList.add('show'); }
function hideStatus() { el.statusBox.classList.remove('show'); el.statusBox.textContent = ''; }
function addLogEntry(type, text) {
  const div = document.createElement('div');
  div.className = 'entry ' + type;
  const who = type === 'user' ? 'You' : 'Buddy';
  div.innerHTML = '<small>' + who + '</small>' + text;
  el.log.prepend(div);
}
function getBuddyExample(letter) {
  const category = normalizedCategory();
  const match = sampleAnswers[category] && sampleAnswers[category][letter];
  if (match && match.length) return match[Math.floor(Math.random() * match.length)];
  return null;
}
function renderQuickCategories() {
  el.quickCategories.innerHTML = '';
  quickCategories.forEach(cat => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip' + (normalizedCategory() === cat ? ' active' : '');
    button.textContent = cat;
    button.addEventListener('click', () => { el.category.value = cat; resetGame(); });
    el.quickCategories.appendChild(button);
  });
}
function updateUI() {
  const letter = currentLetter();
  const category = normalizedCategory();
  el.currentLetter.textContent = letter;
  el.currentCategory.textContent = category;
  el.firstTurnField.style.display = el.mode.value === 'turns' ? 'block' : 'none';
  if (index >= alphabet.length) {
    el.buddyMessage.textContent = 'You made it from A to Z. Nice work staying with it.';
    showStatus('Completed! You practiced a full distraction-based coping skill from A to Z.');
    return;
  }
  if (el.mode.value === 'solo') {
    el.buddyMessage.textContent = 'Your turn: name something in ' + category + ' that starts with ' + letter + '.';
  } else {
    const buddyStarts = el.firstTurn.value === 'buddy';
    const userTurnNow = buddyStarts ? index % 2 === 1 : index % 2 === 0;
    el.buddyMessage.textContent = userTurnNow ? 'Your turn for ' + letter + '. After you answer, the buddy will fill the next letter.' : 'Buddy goes first for ' + letter + '. Press submit to let the buddy fill this letter.';
  }
}
function supportivePrompt() {
  const letter = currentLetter();
  const category = normalizedCategory();
  const example = getBuddyExample(letter);
  const prompts = [
    'No pressure. Just think of one ' + category + ' item that starts with ' + letter + '.',
    'Take your time. We are only doing one letter right now: ' + letter + '.',
    example ? 'A gentle clue: one possible answer for ' + letter + ' is "' + example + '".' : 'You only need to do this letter. The buddy will handle the next one.'
  ];
  showStatus(prompts[Math.floor(Math.random() * prompts.length)]);
}
function resetGame() {
  index = 0;
  el.response.value = '';
  el.log.innerHTML = '';
  hideStatus();
  renderQuickCategories();
  updateUI();
}
function submitTurn() {
  if (index >= alphabet.length) return;
  const letter = currentLetter();
  const category = normalizedCategory();
  const answer = el.response.value.trim();
  hideStatus();
  if (el.mode.value === 'solo') {
    if (!answer) { showStatus('Enter one ' + category + ' item for ' + letter + ' to keep going.'); return; }
    addLogEntry('user', '<strong>' + letter + '</strong> is for <strong>' + answer + '</strong>');
    index += 1;
    el.response.value = '';
    updateUI();
    if (index < alphabet.length) addLogEntry('buddy', 'Nice. Next letter: <strong>' + currentLetter() + '</strong>.');
    return;
  }
  const buddyStarts = el.firstTurn.value === 'buddy';
  const userTurnNow = buddyStarts ? index % 2 === 1 : index % 2 === 0;
  if (userTurnNow) {
    if (!answer) { showStatus('Enter one ' + category + ' item for ' + letter + ' to keep going.'); return; }
    addLogEntry('user', '<strong>' + letter + '</strong> is for <strong>' + answer + '</strong>');
    index += 1;
    el.response.value = '';
    if (index >= alphabet.length) { updateUI(); return; }
    const buddyLetter = currentLetter();
    const buddyAnswer = getBuddyExample(buddyLetter) || '[your choice for ' + buddyLetter + ']';
    addLogEntry('buddy', '<strong>' + buddyLetter + '</strong> is for <strong>' + buddyAnswer + '</strong>');
    index += 1;
    updateUI();
    return;
  }
  const buddyLetter = currentLetter();
  const buddyAnswer = getBuddyExample(buddyLetter) || '[your choice for ' + buddyLetter + ']';
  addLogEntry('buddy', '<strong>' + buddyLetter + '</strong> is for <strong>' + buddyAnswer + '</strong>');
  index += 1;
  el.response.value = '';
  updateUI();
}
function generateReflection() {
  const text = el.checkIn.value.trim();
  const reflections = [];
  if (!text) reflections.push('You do not have to have the perfect words. Even taking a minute to practice a simple coping skill can be a solid reset.');
  else reflections.push('It sounds like you may be feeling ' + text + '. Thank you for naming that.');
  reflections.push('Using a distraction-based coping skill can help create a little space between you and the intensity of the moment.');
  reflections.push('You only need to focus on one step at a time, not the whole day at once.');
  el.reflectionBox.textContent = reflections.join(' ');
  el.reflectionBox.classList.add('show');
}

el.submitBtn.addEventListener('click', submitTurn);
el.hintBtn.addEventListener('click', supportivePrompt);
el.resetBtn.addEventListener('click', resetGame);
el.reflectBtn.addEventListener('click', generateReflection);
el.category.addEventListener('change', resetGame);
el.mode.addEventListener('change', resetGame);
el.firstTurn.addEventListener('change', resetGame);
el.response.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitTurn(); } });

renderQuickCategories();
updateUI();
