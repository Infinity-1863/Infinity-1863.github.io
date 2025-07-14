const defaultState = {
  level: 1,
  xp: 0,
  stats: {
    int: 0,
    will: 0,
    imag: 0,
    att: 0
  },
  inventory: [],
  completed: []
};

const quests = [
  {
    id: 1,
    title: 'Прочитать статью о JavaScript',
    description: 'Найди и прочитай обучающую статью по JavaScript.',
    reward: { xp: 30, int: 5 },
    item: { name: 'Блокнот', desc: 'Для заметок и идей.' }
  },
  {
    id: 2,
    title: 'Медитация 10 минут',
    description: 'Спокойно медитируй в течение 10 минут.',
    reward: { xp: 20, will: 3, att: 2 },
    item: null
  },
  {
    id: 3,
    title: 'Нарисовать эскиз',
    description: 'Сделай небольшой эскиз своей идеи.',
    reward: { xp: 50, imag: 7 },
    item: { name: 'Карандаш', desc: 'Любимый карандаш для творчества.' }
  }
];

let state = loadState();
updateUI();
renderQuests();

function loadState() {
  const saved = localStorage.getItem('rpg-state');
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  localStorage.setItem('rpg-state', JSON.stringify(state));
}

function updateUI() {
  document.getElementById('stat-int').textContent = state.stats.int;
  document.getElementById('stat-will').textContent = state.stats.will;
  document.getElementById('stat-imag').textContent = state.stats.imag;
  document.getElementById('stat-att').textContent = state.stats.att;
  document.getElementById('level').textContent = state.level;
  document.getElementById('xp').textContent = state.xp;

  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';
  state.inventory.forEach(it => {
    const li = document.createElement('li');
    li.textContent = `${it.name} — ${it.desc}`;
    itemList.appendChild(li);
  });
}

function renderQuests() {
  const container = document.getElementById('quest-list');
  container.innerHTML = '';
  quests.forEach(q => {
    const div = document.createElement('div');
    const done = state.completed.includes(q.id);
    div.innerHTML = `<strong>${q.title}</strong><p>${q.description}</p>` +
      `<p>Награда: ${q.reward.xp} XP` +
      `${q.reward.int ? ', Интеллект +' + q.reward.int : ''}` +
      `${q.reward.will ? ', Воля +' + q.reward.will : ''}` +
      `${q.reward.imag ? ', Воображение +' + q.reward.imag : ''}` +
      `${q.reward.att ? ', Внимание +' + q.reward.att : ''}` +
      `${q.item ? ', предмет: ' + q.item.name : ''}</p>`;
    const btn = document.createElement('button');
    btn.textContent = done ? 'Выполнено' : 'Выполнить';
    btn.disabled = done;
    btn.addEventListener('click', () => completeQuest(q));
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function completeQuest(q) {
  if (state.completed.includes(q.id)) return;
  state.xp += q.reward.xp;
  while (state.xp >= 100) {
    state.xp -= 100;
    state.level += 1;
  }
  state.stats.int = Math.min(100, state.stats.int + (q.reward.int || 0));
  state.stats.will = Math.min(100, state.stats.will + (q.reward.will || 0));
  state.stats.imag = Math.min(100, state.stats.imag + (q.reward.imag || 0));
  state.stats.att = Math.min(100, state.stats.att + (q.reward.att || 0));
  if (q.item) {
    state.inventory.push(q.item);
  }
  state.completed.push(q.id);
  saveState();
  updateUI();
  renderQuests();
}
