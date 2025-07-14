        // Система сохранения прогресса
        class GameProgress {
            constructor() {
                this.stats = this.loadStats();
                this.updateDisplay();
            }

            loadStats() {
                const saved = localStorage.getItem('rpg-stats');
                return saved ? JSON.parse(saved) : {
                    attention: { value: 50, scores: [] },
                    memory: { value: 50, scores: [] },
                    reaction: { value: 50, scores: [] },
                    logic: { value: 50, scores: [] }
                };
            }

            saveStats() {
                localStorage.setItem('rpg-stats', JSON.stringify(this.stats));
            }

            updateStat(statName, score) {
                const stat = this.stats[statName];
                stat.scores.push(score);
                
                // Оставляем только последние 20 результатов
                if (stat.scores.length > 20) {
                    stat.scores = stat.scores.slice(-20);
                }
                
                // Вычисляем среднее
                const average = stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length;
                stat.value = Math.round(average);
                
                this.saveStats();
                this.updateDisplay();
            }

            updateDisplay() {
                ['attention', 'memory', 'reaction', 'logic'].forEach(stat => {
                    const value = this.stats[stat].value;
                    document.getElementById(`${stat}-stat`).textContent = value;
                    document.getElementById(`${stat}-progress`).style.width = `${value}%`;
                });
            }
        }

        const gameProgress = new GameProgress();

        // Игра на внимательность
        let attentionGame = {
            score: 0,
            timeLeft: 30,
            interval: null,
            targetInterval: null,
            active: false
        };

        function startAttentionGame() {
            attentionGame.score = 0;
            attentionGame.timeLeft = 30;
            attentionGame.active = true;
            
            document.getElementById('attention-game').style.display = 'block';
            document.querySelector('[onclick="startAttentionGame()"]').style.display = 'none';
            
            createAttentionGrid();
            updateAttentionDisplay();
            
            attentionGame.interval = setInterval(() => {
                attentionGame.timeLeft--;
                updateAttentionDisplay();
                
                if (attentionGame.timeLeft <= 0) {
                    endAttentionGame();
                }
            }, 1000);
            
            spawnTarget();
        }

        function createAttentionGrid() {
            const grid = document.getElementById('attention-grid');
            grid.innerHTML = '';
            
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement('div');
                cell.className = 'attention-cell';
                cell.onclick = () => cellClick(cell);
                grid.appendChild(cell);
            }
        }

        function spawnTarget() {
            if (!attentionGame.active) return;
            
            const cells = document.querySelectorAll('.attention-cell');
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            
            // Убираем предыдущие цели
            cells.forEach(cell => cell.classList.remove('target'));
            
            randomCell.classList.add('target');
            
            // Цель исчезает через 1.5 секунды
            setTimeout(() => {
                if (randomCell.classList.contains('target')) {
                    randomCell.classList.remove('target');
                    spawnTarget();
                }
            }, 1500);
        }

        function cellClick(cell) {
            if (!attentionGame.active) return;
            
            if (cell.classList.contains('target')) {
                attentionGame.score++;
                cell.classList.remove('target');
                updateAttentionDisplay();
                spawnTarget();
            }
        }

        function updateAttentionDisplay() {
            document.getElementById('attention-timer').textContent = attentionGame.timeLeft;
            document.getElementById('attention-score').textContent = `Очки: ${attentionGame.score}`;
        }

        function endAttentionGame() {
            attentionGame.active = false;
            clearInterval(attentionGame.interval);
            
            const score = Math.min(100, Math.max(1, attentionGame.score * 3));
            gameProgress.updateStat('attention', score);
            
            alert(`Игра окончена! Ваш счет: ${attentionGame.score}\nОчки характеристики: ${score}`);
            
            document.getElementById('attention-game').style.display = 'none';
            document.querySelector('[onclick="startAttentionGame()"]').style.display = 'block';
        }

        // Игра на память
        let memoryGame = {
            sequence: [],
            playerSequence: [],
            level: 1,
            showingSequence: false,
            gameActive: false
        };

        function startMemoryGame() {
            memoryGame.sequence = [];
            memoryGame.playerSequence = [];
            memoryGame.level = 1;
            memoryGame.gameActive = true;
            
            document.getElementById('memory-game').style.display = 'block';
            document.querySelector('[onclick="startMemoryGame()"]').style.display = 'none';
            
            createMemoryGrid();
            nextMemoryLevel();
        }

        function createMemoryGrid() {
            const grid = document.getElementById('memory-grid');
            grid.innerHTML = '';
            
            for (let i = 0; i < 16; i++) {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.textContent = i + 1;
                card.onclick = () => memoryCardClick(i);
                grid.appendChild(card);
            }
        }

        function nextMemoryLevel() {
            // Добавляем новый элемент в последовательность
            memoryGame.sequence.push(Math.floor(Math.random() * 16));
            memoryGame.playerSequence = [];
            
            updateMemoryDisplay();
            showMemorySequence();
        }

        function showMemorySequence() {
            memoryGame.showingSequence = true;
            document.getElementById('memory-status').textContent = 'Смотрите и запоминайте!';
            
            let index = 0;
            const interval = setInterval(() => {
                if (index < memoryGame.sequence.length) {
                    highlightMemoryCard(memoryGame.sequence[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    memoryGame.showingSequence = false;
                    document.getElementById('memory-status').textContent = 'Повторите последовательность!';
                }
            }, 800);
        }

        function highlightMemoryCard(index) {
            const cards = document.querySelectorAll('.memory-card');
            const card = cards[index];
            
            card.classList.add('flipped');
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 400);
        }

        function memoryCardClick(index) {
            if (memoryGame.showingSequence || !memoryGame.gameActive) return;
            
            memoryGame.playerSequence.push(index);
            
            // Проверяем правильность
            const currentIndex = memoryGame.playerSequence.length - 1;
            
            if (memoryGame.playerSequence[currentIndex] !== memoryGame.sequence[currentIndex]) {
                // Ошибка
                endMemoryGame();
                return;
            }
            
            // Если последовательность завершена
            if (memoryGame.playerSequence.length === memoryGame.sequence.length) {
                memoryGame.level++;
                
                if (memoryGame.level > 5) {
                    // Игра завершена успешно
                    endMemoryGame();
                } else {
                    setTimeout(() => {
                        nextMemoryLevel();
                    }, 1000);
                }
            }
        }

        function updateMemoryDisplay() {
            document.getElementById('memory-score').textContent = `Уровень: ${memoryGame.level}`;
        }

        function endMemoryGame() {
            memoryGame.gameActive = false;
            
            const score = Math.min(100, Math.max(1, memoryGame.level * 20));
            gameProgress.updateStat('memory', score);
            
            alert(`Игра окончена! Достигнут уровень: ${memoryGame.level}\nОчки характеристики: ${score}`);
            
            document.getElementById('memory-game').style.display = 'none';
            document.querySelector('[onclick="startMemoryGame()"]').style.display = 'block';
        }

        // Игра на реакцию
        let reactionGame = {
            attempt: 1,
            maxAttempts: 5,
            startTime: 0,
            times: [],
            waiting: false
        };

        function startReactionGame() {
            reactionGame.attempt = 1;
            reactionGame.times = [];
            reactionGame.waiting = false;
            
            document.getElementById('reaction-game').style.display = 'block';
            document.querySelector('[onclick="startReactionGame()"]').style.display = 'none';
            
            nextReactionRound();
        }

        function nextReactionRound() {
            if (reactionGame.attempt > reactionGame.maxAttempts) {
                endReactionGame();
                return;
            }
            
            updateReactionDisplay();
            
            document.getElementById('reaction-button').style.display = 'none';
            document.getElementById('reaction-status').textContent = 'Приготовьтесь...';
            
            // Случайная задержка от 1 до 5 секунд
            const delay = Math.random() * 4000 + 1000;
            
            setTimeout(() => {
                if (reactionGame.attempt <= reactionGame.maxAttempts) {
                    document.getElementById('reaction-status').textContent = 'КЛИКНИТЕ СЕЙЧАС!';
                    document.getElementById('reaction-button').style.display = 'block';
                    reactionGame.startTime = Date.now();
                    reactionGame.waiting = true;
                }
            }, delay);
        }

        function reactionClick() {
            if (!reactionGame.waiting) return;
            
            const reactionTime = Date.now() - reactionGame.startTime;
            reactionGame.times.push(reactionTime);
            reactionGame.waiting = false;
            
            document.getElementById('reaction-status').textContent = `Время реакции: ${reactionTime}мс`;
            document.getElementById('reaction-button').style.display = 'none';
            
            reactionGame.attempt++;
            
            setTimeout(() => {
                nextReactionRound();
            }, 1500);
        }

        function updateReactionDisplay() {
            document.getElementById('reaction-score').textContent = `Попытка: ${reactionGame.attempt}/${reactionGame.maxAttempts}`;
        }

        function endReactionGame() {
            const averageTime = reactionGame.times.reduce((a, b) => a + b, 0) / reactionGame.times.length;
            
            // Преобразуем время в очки (чем меньше время, тем больше очков)
            const score = Math.min(100, Math.max(1, Math.round(1000 / averageTime * 100)));
            
            gameProgress.updateStat('reaction', score);
            
            alert(`Игра окончена! Среднее время реакции: ${Math.round(averageTime)}мс\nОчки характеристики: ${score}`);
            
            document.getElementById('reaction-game').style.display = 'none';
            document.querySelector('[onclick="startReactionGame()"]').style.display = 'block';
        }

        // Игра на логику
        let logicGame = {
            task: 1,
            maxTasks: 5,
            currentSequence: [],
            correctAnswer: 0,
            correctAnswers: 0
        };

        function startLogicGame() {
            logicGame.task = 1;
            logicGame.correctAnswers = 0;
            
            document.getElementById('logic-game').style.display = 'block';
            document.querySelector('[onclick="startLogicGame()"]').style.display = 'none';
            
            nextLogicTask();
        }

function nextLogicTask() {
    if (logicGame.task > logicGame.maxTasks) {
        endLogicGame();
        return;
    }

    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 1;
    logicGame.currentSequence = [start, start + diff, start + 2 * diff, start + 3 * diff];
    logicGame.correctAnswer = start + 4 * diff;

    const seq = document.getElementById('logic-sequence');
    seq.innerHTML = '';
    logicGame.currentSequence.forEach(num => {
        const el = document.createElement('div');
        el.className = 'logic-number';
        el.textContent = num;
        seq.appendChild(el);
    });

    document.getElementById('logic-score').textContent = `Задача: ${logicGame.task}/${logicGame.maxTasks}`;
    document.getElementById('logic-input').value = '';
}

function checkLogicAnswer() {
    const value = parseInt(document.getElementById('logic-input').value, 10);
    if (value === logicGame.correctAnswer) {
        logicGame.correctAnswers++;
        alert('Верно!');
    } else {
        alert(`Неверно! Правильный ответ: ${logicGame.correctAnswer}`);
    }
    logicGame.task++;
    nextLogicTask();
}

function endLogicGame() {
    const score = Math.min(100, Math.max(1, logicGame.correctAnswers * 20));
    gameProgress.updateStat('logic', score);

    alert(`Игра окончена! Правильных ответов: ${logicGame.correctAnswers}/${logicGame.maxTasks}\nОчки характеристики: ${score}`);

    document.getElementById('logic-game').style.display = 'none';
    document.querySelector('[onclick="startLogicGame()"]').style.display = 'block';
}
