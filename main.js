const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    arrowUp: false,
    arrowDown: false,
    arrowRight: false,
    arrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3
};

function startGame() {
    start.classList.add('hide');
    setting.start = true;
    gameArea.appendChild(car);
    requestAnimationFrame(playGame);
}

function playGame() {
    console.log('play game');
    if (setting.start) {
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault(); // отменяем скроллинг страницы стрелочками
    keys[event.key] = true; // event - показывает какое событие произошло со всем описанием события. event.key - показыват только нажатую кнопку.
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}