const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreAmount = document.querySelector('#scoreAmount');
const level = document.querySelector('#level');
const startBox = document.querySelector('.startBox');
const endBox = document.querySelector('.endBox');
const finalScoreNumber = document.querySelector('#finalscorenumber');
const namescore = document.querySelector('#namescore');
const lb = document.querySelector('.lb');
const grid = document.querySelector('.grid-container');
canvas.width = innerWidth
canvas.height = innerHeight

//DECLARATION SECTION
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let player;
let projectiles;
let enemis;
let particles;
let scoreDelta;
let score;
const pointForElimination = 50;
const pointForHit = 10;
let isStarted = false;
let intervalId;


function showLB() {

    const url = `https://shootem-be.alfox10.repl.co/api/v1/leaderboard`
    fetch(url)
        .then(response => response.json())
        .then(js => {
            const resp = js.data
            let gridChild = '';
            resp.forEach(row =>{
                console.log(row.position,row.name,row.score);
                gridChild += `<div class="grid-item">${row.position}</div><div class="grid-item">${row.name}</div><div class="grid-item">${row.score}</div>`
            });
            grid.innerHTML = gridChild;
            startBox.style.display = 'none';
            lb.style.display = 'flex';
        });

}

function hideLB() {
    startBox.style.display = 'block';
    lb.style.display = 'none';
}

function init() {
    projectiles = [];
    enemis = [];
    particles = [];
    scoreDelta = 1;
    score = 0;
    scoreAmount.innerHTML = score;
    level.innerHTML = scoreDelta;
    player = new BaseCircleObject(c, { x: centerX, y: centerY }, 18, 'white', null);
    animate();
    intervalId = setInterval(createEnemis, 1000);
}

function start() {
    isStarted = true;
    startBox.style.display = 'none';
}

function restart() {
    let name;
    if (namescore.value === '' || namescore.value === ' ') {
        name = 'unknown';
    } else {
        name = namescore.value;
    }
    const url = `https://shootem-be.alfox10.repl.co/api/v1/player?name=${name}&score=${score}`
    fetch(url)
        .then(response => {
            console.log(response)
        });
    endBox.style.display = 'none';
    init();
}

function createEnemis() {
    if (isStarted) {
        if (scoreDelta * 1000 < score) {
            scoreDelta++;
            level.innerHTML = scoreDelta;
        }
        const radius = Math.random() * 40 + 10;
        let x, y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {
            x: Math.cos(angle) * scoreDelta,
            y: Math.sin(angle) * scoreDelta
        }
        enemis.push(new BaseCircleObject(
            c,
            { x: x, y: y },
            radius,
            `hsl(${Math.random() * 360},80%,50%)`,
            velocity
        ));
    }
}
let animationId
function animate() {
    animationId = requestAnimationFrame(animate);
    if (isStarted) {
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        player.update();

        particles.forEach((pa, k) => {
            if (pa.alpha <= 0) {
                setTimeout(() => {
                    particles.splice(k, 1);
                }, 0);
            } else
                pa.update();
        });

        enemis.forEach((en, j) => {
            let isEliminated = false;
            projectiles.forEach((pj, i) => {
                if (pj.position.x + pj.radius < 0 || pj.position.x - pj.radius > canvas.width ||
                    pj.position.y + pj.radius < 0 || pj.position.y - pj.radius > canvas.height) {
                    projectiles.splice(i, 1);
                } else {
                    const dist = Math.hypot(pj.position.x - en.position.x, pj.position.y - en.position.y);
                    if (dist - en.radius - pj.radius < 1) {

                        for (let p = 0; p < en.radius * 2; p++) {
                            particles.push(new Particles(
                                c,
                                { x: pj.position.x, y: pj.position.y },
                                Math.random() * 2,
                                en.color,
                                {
                                    x: (Math.random() - 0.5) * (Math.random() * 6),
                                    y: (Math.random() - 0.5) * (Math.random() * 6),
                                }));
                        }

                        if (en.radius - 10 < 5) {
                            setTimeout(() => {
                                projectiles.splice(i, 1);
                                enemis.splice(j, 1);
                                isEliminated = true;
                                score += pointForElimination;
                                scoreAmount.innerHTML = score;
                            }, 0);
                        } else {
                            setTimeout(() => {
                                projectiles.splice(i, 1);
                                en.radius -= 5;
                                score += pointForHit;
                                scoreAmount.innerHTML = score;
                            }, 0);

                        }
                    } else {
                        pj.update();
                    }
                }

            });
            const p_dist = Math.hypot(player.position.x - en.position.x, player.position.y - en.position.y);
            if (p_dist - en.radius - player.radius < 1) {
                endBox.style.display = 'block';
                const s_score = score + '';
                const remeining = (6 - s_score.length) > 0 ? 6 - s_score.length : 0;
                finalScoreNumber.innerHTML = "0".repeat(remeining).concat(s_score);
                cancelAnimationFrame(animationId);
                clearInterval(intervalId);
            } else if (!isEliminated)
                en.update();
        });
    }
}

addEventListener('click', (e) => {
    if (isStarted) {
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const x = (Math.cos(angle)) * 3;
        const y = (Math.sin(angle)) * 3;
        projectiles.push(
            new BaseCircleObject(c, position = { x: centerX, y: centerY }, 3, 'white', velocity = { x: x, y: y })
        );
    }
});

init();

