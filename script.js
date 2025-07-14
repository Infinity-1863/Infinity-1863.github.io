const STORAGE_KEY = 'innerRpgSaveV2';

const DEFAULT_STATE = {
    attention: 0,
    memory: 0,
    reaction: 0,
    logic: 0,
    xp: 0,
    level: 0,
    nextLevelXp: 100,
    difficultyMultiplier: 1
};

const translations = {
    ru: {
        find_evens: 'Найдите все чётные числа',
        find_mult3: 'Найдите все числа, кратные 3',
        start_button: 'Начать тренировку',
        check_button: 'Проверить',
        close_button: 'Закрыть',
        brand: 'RPG Саморазвитие',
        nav_stats: 'Статистики',
        nav_games: 'Игры',
        tagline: 'Развивайте свои навыки в RPG стиле',
        stats_heading: 'Ваши характеристики',
        stat_attention: 'Внимательность',
        stat_memory: 'Память',
        stat_reaction: 'Реакция',
        stat_logic: 'Логика',
        games_heading: 'Тренировочные квесты',
        memory_title: 'Запомни последовательность',
        memory_desc: 'Повторите показанную цепочку символов.',
        sequence_title: 'Числовая последовательность',
        sequence_desc: 'Найдите закономерность и продолжите последовательность!',
        numbercell_title: 'Числовая клетка',
        numbercell_desc: 'Нужно быстро найти все числа, кратные 3, или все чётные.',
        reaction_title: 'Тест реакции',
        reaction_desc: 'Нажмите, когда увидите сигнал!',
        click_now: 'Жми!',
        reset_button: 'Сбросить статы',
        reset_confirm: 'Вы уверены?'
    },
    en: {
        find_evens: 'Find all even numbers',
        find_mult3: 'Find all numbers divisible by 3',
        start_button: 'Start',
        check_button: 'Check',
        close_button: 'Close',
        brand: 'RPG Self-Development',
        nav_stats: 'Stats',
        nav_games: 'Games',
        tagline: 'Improve your skills RPG-style',
        stats_heading: 'Your Attributes',
        stat_attention: 'Attention',
        stat_memory: 'Memory',
        stat_reaction: 'Reaction',
        stat_logic: 'Logic',
        games_heading: 'Training Quests',
        memory_title: 'Remember the Sequence',
        memory_desc: 'Repeat the shown sequence of symbols.',
        sequence_title: 'Number Sequence',
        sequence_desc: 'Find the pattern and continue!',
        numbercell_title: 'Number Cell',
        numbercell_desc: 'Quickly find all numbers divisible by 3 or all even ones.',
        reaction_title: 'Reaction Test',
        reaction_desc: 'Press when you see the signal!',
        click_now: 'Click!',
        reset_button: 'Reset stats',
        reset_confirm: 'Are you sure?'
    }
};

let lang = localStorage.getItem('lang') || 'ru';

let state = load();
updateDifficulty();
updateUI();
applyTranslations();
document.getElementById('language-select').value = lang;
document.getElementById('language-select').addEventListener('change', e => {
    lang = e.target.value;
    localStorage.setItem('lang', lang);
    applyTranslations();
});

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
}

function resetStats() {
    if (confirm(translations[lang].reset_confirm)) {
        state = { ...DEFAULT_STATE };
        save();
        updateUI();
    }
}

function updateDifficulty() {
    const avgStat = (state.attention + state.memory + state.reaction + state.logic) / 4;
    state.difficultyMultiplier = 1 + avgStat / 50;
}

function addXp(amount) {
    state.xp += amount;
    let leveled = false;
    while (state.xp >= state.nextLevelXp) {
        state.xp -= state.nextLevelXp;
        state.level++;
        state.nextLevelXp = Math.ceil(state.nextLevelXp * 1.5) || 100;
        leveled = true;
    }
    if (leveled) showLevelModal();
    save();
    updateUI();
}

function incrementStat(stat) {
    state[stat]++;
    updateDifficulty();
    save();
    updateUI();
}

function updateUI() {
    document.getElementById('attention-stat').textContent = state.attention;
    document.getElementById('memory-stat').textContent = state.memory;
    document.getElementById('reaction-stat').textContent = state.reaction;
    document.getElementById('logic-stat').textContent = state.logic;

    document.getElementById('attention-progress').style.width = `${state.attention}%`;
    document.getElementById('memory-progress').style.width = `${state.memory}%`;
    document.getElementById('reaction-progress').style.width = `${state.reaction}%`;
    document.getElementById('logic-progress').style.width = `${state.logic}%`;

    document.getElementById('level-value').textContent = state.level;
    document.getElementById('xp-value').textContent = `${state.xp}/${state.nextLevelXp}`;
}

function showLevelModal() {
    const modal = document.getElementById('level-modal');
    document.getElementById('level-modal-text').textContent = `Уровень ${state.level}!`;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('hidden'), 2000);
}

function openOverlay(id) {
    document.getElementById('overlay-mask').classList.remove('hidden');
    const el = document.getElementById(id);
    el.classList.remove('hidden');
    el.classList.add('overlay');
}

function closeOverlay(id) {
    document.getElementById('overlay-mask').classList.add('hidden');
    const el = document.getElementById(id);
    el.classList.add('hidden');
    el.classList.remove('overlay');
}

function applyTranslations() {
    document.getElementById('brand').textContent = translations[lang].brand || 'RPG';
    document.getElementById('nav-stats').textContent = translations[lang].nav_stats;
    document.getElementById('nav-games').textContent = translations[lang].nav_games;
    document.getElementById('tagline').textContent = translations[lang].tagline;
    document.getElementById('stats-heading').textContent = translations[lang].stats_heading;
    document.getElementById('attention-label').textContent = translations[lang].stat_attention;
    document.getElementById('memory-label').textContent = translations[lang].stat_memory;
    document.getElementById('reaction-label').textContent = translations[lang].stat_reaction;
    document.getElementById('logic-label').textContent = translations[lang].stat_logic;
    document.getElementById('games-heading').textContent = translations[lang].games_heading;
    document.getElementById('memory-title').innerHTML = `<i class="fas fa-brain text-success"></i> ${translations[lang].memory_title}`;
    document.getElementById('memory-desc').textContent = translations[lang].memory_desc;
    document.getElementById('sequence-title').innerHTML = `<i class="fas fa-puzzle-piece text-danger"></i> ${translations[lang].sequence_title}`;
    document.getElementById('sequence-desc').textContent = translations[lang].sequence_desc;
    document.getElementById('numbercell-title').innerHTML = `<i class="fas fa-th text-info"></i> ${translations[lang].numbercell_title}`;
    document.getElementById('numbercell-desc').textContent = translations[lang].numbercell_desc;
    document.getElementById('reaction-title').innerHTML = `<i class="fas fa-bolt text-warning"></i> ${translations[lang].reaction_title}`;
    document.getElementById('reaction-desc').textContent = translations[lang].reaction_desc;
    document.getElementById('reset-btn').textContent = translations[lang].reset_button;
    document.querySelectorAll('.btn-start').forEach(btn => btn.textContent = translations[lang].start_button);
    document.querySelectorAll('.btn-check').forEach(btn => btn.textContent = translations[lang].check_button);
    document.querySelectorAll('.btn-close').forEach(btn => btn.textContent = translations[lang].close_button);
    document.title = translations[lang].brand;
}

// ---------------- Мини-игра 2. Запомни последовательность ----------------
const memoryGame = { sequence: [], deadline: 0, timeout: null };

function openMemoryGame() {
    openOverlay('memory-game');
    clearTimeout(memoryGame.timeout);
    document.getElementById('memory-play').classList.remove('hidden');
    document.getElementById('memory-content').classList.add('hidden');
    document.getElementById('memory-result').textContent = '';
}

function startMemoryGame() {
    generateMemorySequence();
    document.getElementById('memory-input').value = '';
    document.getElementById('memory-result').textContent = '';
    document.getElementById('memory-play').classList.add('hidden');
    document.getElementById('memory-content').classList.remove('hidden');
    displayMemorySequence();
}

function generateMemorySequence() {
    const length = 3 + Math.floor(state.difficultyMultiplier);
    const symbols = ['A','B','C','D','E','F','G','H'];
    memoryGame.sequence = [];
    for (let i = 0; i < length; i++) {
        let s;
        do { s = symbols[Math.floor(Math.random() * symbols.length)]; } while (i > 0 && s === memoryGame.sequence[i - 1]);
        memoryGame.sequence.push(s);
    }
}

function displayMemorySequence() {
    const el = document.getElementById('memory-sequence');
    el.textContent = memoryGame.sequence.join(' ');
    setTimeout(() => {
        el.textContent = '';
        memoryGame.deadline = Date.now() + 1000 * state.difficultyMultiplier;
        memoryGame.timeout = setTimeout(() => submitMemory(), 1000 * state.difficultyMultiplier);
    }, 1000);
}

function submitMemory() {
    clearTimeout(memoryGame.timeout);
    const val = document.getElementById('memory-input').value.trim().toUpperCase().split(/\s+/).join(' ');
    const correct = memoryGame.sequence.join(' ');
    if (Date.now() <= memoryGame.deadline && val === correct) {
        incrementStat('memory');
        addXp(10);
        document.getElementById('memory-result').textContent = 'Верно!';
    } else {
        document.getElementById('memory-result').textContent = `Неверно! ${correct}`;
    }
    setTimeout(() => closeOverlay('memory-game'), 1500);
}

// ---------------- Мини-игра 3. Числовая последовательность ----------------
const logicGame = { expected: [] };

function openLogicGame() {
    openOverlay('logic-game');
    document.getElementById('logic-play').classList.remove('hidden');
    document.getElementById('logic-content').classList.add('hidden');
}

function startLogicGame() {
    document.getElementById('logic-play').classList.add('hidden');
    document.getElementById('logic-content').classList.remove('hidden');
    newLogicTask();
}

function newLogicTask() {
    const length = 4 + Math.floor(state.difficultyMultiplier);
    const isArith = Math.random() < 0.5;
    const step = Math.floor(Math.random() * 8) + 2;
    let start = Math.floor(Math.random() * 5) + 1;
    const seq = [start];
    for (let i = 1; i < length; i++) {
        seq[i] = isArith ? seq[i - 1] + step : seq[i - 1] * step;
    }
    logicGame.expected = [
        isArith ? seq[seq.length - 1] + step : seq[seq.length - 1] * step,
        isArith ? seq[seq.length - 1] + 2 * step : seq[seq.length - 1] * step * step
    ];
    const cont = document.getElementById('logic-sequence');
    cont.innerHTML = '';
    seq.forEach(n => {
        const d = document.createElement('div');
        d.className = 'logic-number';
        d.textContent = n;
        cont.appendChild(d);
    });
    document.getElementById('logic-input1').value = '';
    document.getElementById('logic-input2').value = '';
}

function checkLogicAnswer() {
    const a = parseInt(document.getElementById('logic-input1').value, 10);
    const b = parseInt(document.getElementById('logic-input2').value, 10);
    if (a === logicGame.expected[0] && b === logicGame.expected[1]) {
        incrementStat('logic');
        addXp(10);
        alert('Верно!');
    } else {
        alert(`Неверно! Правильный ответ: ${logicGame.expected[0]} ${logicGame.expected[1]}`);
    }
    newLogicTask();
}

// ---------------- Мини-игра. Числовая клетка ----------------
const numberCellGame = { target: 'even', remaining: 0 };

function openNumberCellGame() {
    openOverlay('numbercell-game');
    document.getElementById('numbercell-play').classList.remove('hidden');
    document.getElementById('numbercell-content').classList.add('hidden');
}

function startNumberCellGame() {
    const size = Math.random() < 0.5 ? 3 : 4;
    numberCellGame.target = Math.random() < 0.5 ? 'even' : 'mult3';
    numberCellGame.remaining = 0;
    const grid = document.getElementById('numbercell-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size * size; i++) {
        const num = Math.floor(Math.random() * 30) + 1;
        const div = document.createElement('div');
        div.className = 'number-cell';
        div.textContent = num;
        const correct = numberCellGame.target === 'even' ? num % 2 === 0 : num % 3 === 0;
        if (correct) numberCellGame.remaining++;
        div.dataset.correct = correct;
        div.addEventListener('click', handleNumberCellClick);
        grid.appendChild(div);
    }
    document.getElementById('numbercell-task').textContent = numberCellGame.target === 'even'
        ? translations[lang].find_evens
        : translations[lang].find_mult3;
    document.getElementById('numbercell-play').classList.add('hidden');
    document.getElementById('numbercell-content').classList.remove('hidden');
}

function handleNumberCellClick(e) {
    const el = e.target;
    if (el.dataset.clicked) return;
    el.dataset.clicked = true;
    if (el.dataset.correct === 'true') {
        el.classList.add('correct');
        if (--numberCellGame.remaining === 0) {
            incrementStat('attention');
            addXp(10);
            setTimeout(() => closeOverlay('numbercell-game'), 800);
        }
    } else {
        el.classList.add('wrong');
    }
}

// ---------------- Мини-игра. Тест реакции ----------------
const reactionGame = { timeout: null, start: 0 };

function openReactionGame() {
    openOverlay('reaction-game');
    clearTimeout(reactionGame.timeout);
    document.getElementById('reaction-play').classList.remove('hidden');
    document.getElementById('reaction-content').classList.add('hidden');
    document.getElementById('reaction-click').classList.add('hidden');
    document.getElementById('reaction-message').textContent = '';
}

function startReactionGame() {
    document.getElementById('reaction-play').classList.add('hidden');
    document.getElementById('reaction-content').classList.remove('hidden');
    document.getElementById('reaction-message').textContent = '...';
    reactionGame.timeout = setTimeout(() => {
        document.getElementById('reaction-message').textContent = translations[lang].click_now || 'Жми!';
        document.getElementById('reaction-click').classList.remove('hidden');
        reactionGame.start = Date.now();
    }, 1000 + Math.random() * 2000);
}

function finishReactionGame() {
    const t = Date.now() - reactionGame.start;
    document.getElementById('reaction-click').classList.add('hidden');
    if (t < 500) {
        incrementStat('reaction');
        addXp(10);
        document.getElementById('reaction-message').textContent = `Отлично! ${t}мс`;
    } else {
        document.getElementById('reaction-message').textContent = `Медленно: ${t}мс`;
    }
    setTimeout(() => closeOverlay('reaction-game'), 1500);
}

