const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    areaCont = document.querySelector('.areaCont'),
    car = document.createElement('div'),
    fire = document.querySelector('.fire'),
    smoke = document.querySelector('.smoke'),
    sound = document.createElement('embed'),
    easy = document.querySelector('.easy'),
    medium = document.querySelector('.medium'),
    hard = document.querySelector('.hard'),
    music = document.querySelector('.music');

car.classList.add('car');

easy.addEventListener('click', function() {
    setting.speed = 3;
    setting.traffic = 3;
});
medium.addEventListener('click', function() {
    setting.speed = 3;
    setting.traffic = 2;
});
hard.addEventListener('click', function() {
    setting.speed = 5;
    setting.traffic = 2;
});

music.addEventListener('click', startMusic);
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startMusic() {
    sound.classList.toggle('sound');
    sound.setAttribute('type', 'audio/mp3');
    sound.setAttribute('src', './sound.mp3');
    gameArea.appendChild(sound);
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    w: false,
    s: false,
    d: false,
    a: false
};

const setting = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 2
};
let arr = [];

function getQuantityElements(heightElement) {
    return gameArea.offsetHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = i * 100 + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 3) + 0;
        console.log('enemyImg: ', enemyImg);
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * i + 1;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `url(./img/enemy${enemyImg}.png) center / contain no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';

    car.appendChild(fire);
    car.appendChild(smoke);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if ((keys.ArrowLeft || keys.a) && setting.x > 0) {
            setting.x -= setting.speed;
            car.style.transform = 'rotate(-10deg)';
        }
        if ((keys.ArrowRight || keys.d) && setting.x < gameArea.offsetWidth - car.offsetWidth) {
            setting.x += setting.speed;
            car.style.transform = 'rotate(10deg)';
        }
        if ((keys.ArrowUp || keys.w) && setting.y > 0) {
            setting.y -= setting.speed;
            fire.style.display = 'block';
        }
        if ((keys.ArrowDown || keys.s) && setting.y < gameArea.offsetHeight - car.offsetHeight) {
            setting.y += setting.speed;
            smoke.style.display = 'flex';
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    } else {
        localStorage.setItem('score', `${setting.score}`);
        arr.push(localStorage.getItem('score'));
        arr = [...new Set(arr)];
        minScore = Math.min(...arr);
        maxScore = Math.max(...arr);

        if (localStorage.getItem('score') >= maxScore) {
            score.innerHTML = `New record! ${maxScore}`;
        }
    }
}

function startRun(event) {
    event.preventDefault(); // отменяем скроллинг страницы стрелочками
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true; // event - показывает какое событие произошло со всем описанием события. event.key - показыват только нажатую кнопку.
    }
}

function stopRun(event) {
    event.preventDefault();
    car.style.transform = '';
    fire.style.display = '';
    smoke.style.display = '';
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false; // event - показывает какое событие произошло со всем описанием события. event.key - показыват только нажатую кнопку.
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (
            carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top
        ) {
            setting.start = false;
            start.classList.remove('hide');
            score.style.top = start.offsetHeight + 'px';
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}