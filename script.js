const levels = {
    1: ["Yo", "me", "llamo", "Jose"],
    2: ["Ella", "se", "llama", "Maria"],
    3: ["Nosotros", "vamos", "a", "la", "escuela"],
    4: ["El", "perro", "es", "grande"],
    5: ["La", "casa", "es", "azul"]
};

let currentLevel = 1;
let correctOrder = levels[currentLevel];
let completedLevels = [];

const puzzleGrid = document.getElementById('puzzle-grid');
const optionsGrid = document.getElementById('options-grid');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createPuzzle() {
    puzzleGrid.innerHTML = '';
    optionsGrid.innerHTML = '';

    // Create fixed placeholders
    for (let i = 0; i < correctOrder.length; i++) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.dataset.index = i;
        puzzleGrid.appendChild(placeholder);
        placeholder.addEventListener('dragover', dragOver);
        placeholder.addEventListener('drop', drop);
    }

    // Create draggable options
    const shuffledPhrases = shuffle([...levels[currentLevel]]);
    shuffledPhrases.forEach((phrase, index) => {
        const piece = document.createElement('div');
        piece.classList.add('option-piece');
        piece.textContent = phrase;
        piece.draggable = true;
        piece.dataset.index = index;

        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);

        optionsGrid.appendChild(piece);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const draggedElement = document.querySelector(`.option-piece[data-index='${draggedIndex}']`);
    const targetElement = e.target;

    if (targetElement.classList.contains('placeholder')) {
        targetElement.textContent = draggedElement.textContent;
        targetElement.classList.remove('placeholder');
        targetElement.classList.add('puzzle-piece');
        draggedElement.remove();
    }
}

function checkPuzzle() {
    const pieces = Array.from(puzzleGrid.querySelectorAll('.puzzle-piece'));
    const currentOrder = pieces.map(piece => piece.textContent);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    if (isCorrect) {
        alert('¡Correcto!');
        document.getElementById(`level-${currentLevel}`).classList.add('locked');
        document.getElementById(`level-${currentLevel}`).disabled = true;
        completedLevels.push(currentLevel);
    } else {
        alert('Inténtalo de nuevo');
    }
}

function setLevel(level) {
    if (completedLevels.includes(level)) return;
    currentLevel = level;
    correctOrder = levels[currentLevel];
    createPuzzle();
}

document.getElementById('check-puzzle').addEventListener('click', checkPuzzle);

setLevel(1);
