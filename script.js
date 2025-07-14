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

let state = load();
updateDifficulty();
updateUI();

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
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

// ---------------- Мини-игра 1. Анаграммы ----------------
const anagramWords = [
    'dragon','sword','castle','forest','magic','quest','puzzle','memory','logic','shield','health','potion','knight','victory','battle'
];
const anagramGame = { word: '', timeout: null };

function startAnagramGame() {
    const len = 4 + Math.floor(state.difficultyMultiplier);
    const candidates = anagramWords.filter(w => w.length >= len);
    const raw = candidates[Math.floor(Math.random() * candidates.length)];
    anagramGame.word = raw.slice(0, len).toLowerCase();
    const arr = anagramGame.word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    document.getElementById('anagram-question').textContent = arr.join('');
    document.getElementById('anagram-input').value = '';
    document.getElementById('anagram-result').textContent = '';
    document.getElementById('anagram-game').classList.remove('hidden');
}

function submitAnagram() {
    const val = document.getElementById('anagram-input').value.trim().toLowerCase();
    if (val === anagramGame.word) {
        incrementStat('attention');
        addXp(10);
        document.getElementById('anagram-result').textContent = 'Верно!';
    } else {
        document.getElementById('anagram-result').textContent = `Неверно! Слово: ${anagramGame.word}`;
    }
    setTimeout(() => document.getElementById('anagram-game').classList.add('hidden'), 1500);
}

// ---------------- Мини-игра 2. Запомни последовательность ----------------
const memoryGame = { sequence: [], deadline: 0, timeout: null };

function startMemoryGame() {
    generateMemorySequence();
    document.getElementById('memory-input').value = '';
    document.getElementById('memory-result').textContent = '';
    document.getElementById('memory-game').classList.remove('hidden');
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
    setTimeout(() => document.getElementById('memory-game').classList.add('hidden'), 1500);
}

// ---------------- Мини-игра 3. Числовая последовательность ----------------
const logicGame = { expected: [] };

function startLogicGame() {
    document.getElementById('logic-game').classList.remove('hidden');
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

// ---------------- Мини-игра 4. Логические связки ----------------
const logicLinksGame = { result: false, timeout: null };

function startLogicLinksGame() {
    const count = 1 + Math.floor(state.difficultyMultiplier);
    const ops = [];
    const operands = [];
    for (let i = 0; i < count + 1; i++) {
        const val = Math.random() < 0.5;
        const useNot = Math.random() < 0.5;
        operands.push({ val, not: useNot });
        if (i < count) ops.push(Math.random() < 0.5 ? 'AND' : 'OR');
    }
    let display = '';
    let expr = '';
    for (let i = 0; i < operands.length; i++) {
        const o = operands[i];
        display += (o.not ? 'NOT ' : '') + (o.val ? 'True' : 'False');
        expr += (o.not ? '!' : '') + (o.val ? 'true' : 'false');
        if (i < ops.length) {
            display += ' ' + ops[i] + ' ';
            expr += ops[i] === 'AND' ? ' && ' : ' || ';
        }
    }
    logicLinksGame.result = eval(expr);
    document.getElementById('logiclinks-question').textContent = display;
    document.getElementById('logiclinks-game').classList.remove('hidden');
    const time = 2000 / state.difficultyMultiplier;
    clearTimeout(logicLinksGame.timeout);
    logicLinksGame.timeout = setTimeout(() => endLogicLinksGame(false), time);
    document.getElementById('logiclinks-timer').textContent = (time / 1000).toFixed(1);
}

function answerLogicLinks(val) {
    clearTimeout(logicLinksGame.timeout);
    endLogicLinksGame(val === logicLinksGame.result);
}

function endLogicLinksGame(success) {
    document.getElementById('logiclinks-game').classList.add('hidden');
    if (success) {
        incrementStat('reaction');
        addXp(10);
        alert('Верно!');
    } else {
        alert('Неверно!');
    }
}
