canvas.width = innerWidth;
canvas.height = innerHeight;


function showLB() {

    const url = `https://shootem-be.alfox10.repl.co/api/v1/leaderboard`
    fetch(url)
        .then(response => response.json())
        .then(js => {
            const resp = js.data
            let gridChild = '';
            resp.forEach(row => {
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
    keys = {
        w: {
            pressed: false
        },
        a: {
            pressed: false
        },
        s: {
            pressed: false
        },
        d: {
            pressed: false
        },
    };
    projectiles = [];
    enemis = [];
    particles = [];
    powerups = [];
    scoreDelta = 1;
    rocketGunRatio = 0;
    isPowered = false;
    score = 0;
    isEliminated = false;
    isMachineGun = false;
    isMouseDown = false;
    lastTimestamp = Date.now();
    scoreAmount.innerHTML = score;
    level.innerHTML = scoreDelta;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    deltaAmmo = 1;
    player = new Player(c, { x: centerX, y: centerY }, 18, 'rgba(0,0,0,0)');
    playerBlackEffect = new Player(c, { x: centerX, y: centerY }, 130, 'rgba(0,0,0,0)', { x: 0, y: 0 }, 0, 0);
    playerGrowEffect = new Player(c, { x: centerX, y: centerY }, 180, 'rgba(0,0,0,0)', { x: 0, y: 0 }, 0, 0);
    matrixBg = [];
    createBg();
    enemiesIntervalId = setInterval(createEnemis, enemiesIntervalTimer);
    powerupIntervalId = setInterval(spawnPowerUp, powerUpIntervalTimer);
    animate();
}

function createBg() {
    lastKilledEnemyColor = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < canvas.width; i += offsetMatrixBg) {
        for (let j = 0; j < canvas.height; j += offsetMatrixBg) {
            matrixBg.push(new BasePolygonObject(
                c,
                { x: i, y: j },
                5,
                lastKilledEnemyColor,
                { x: 0, y: 0 },
                4
            ));
        }
    }
}

function renderdBg() {
    c.save();
    matrixBg.forEach(bg => {
        const pb_dist = Math.hypot(playerBlackEffect.position.x - bg.position.x, playerBlackEffect.position.y - bg.position.y);
        if (pb_dist - bg.radius - playerBlackEffect.radius > 1) {
            const pg_dist = Math.hypot(playerGrowEffect.position.x - bg.position.x, playerGrowEffect.position.y - bg.position.y);
            if (pg_dist - bg.radius - playerGrowEffect.radius < 1)
                bg.radius = 8.5;
            else
                bg.radius = 5;

            bg.color = lastKilledEnemyColor;
            bg.context.shadowBlur = 2;
            c.globalAlpha = 0.25;
            bg.update();
        }
    });
    c.restore();
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
        const radius = Math.random() * 40 + 16;
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

function spawnPowerUp() {
    console.log(powerups.length);
    if(powerups.length > 1) return;

    let puColor, puType;
    if (Math.random() < 0.5) {
        puColor = '#E8EC67';
        puType = 'mg';
    } else {
        puColor = '#BF211E';
        puType = 'rg';
    }
    const xx = Math.random() * (canvas.width);
    powerups.push(new BasePolygonObject(
        c,
        { x: xx, y: 0 },
        18,
        puColor,
        { x: xx >= (canvas.width / 2) ? -0.5 : 0.5, y: 0.5 },
        6,
        2,
        0,
        true,
        puType
    ));
}


function renderPowerUp() {

    powerups.forEach((pu, i) => {
        if (pu.position.x + pu.radius < 0 || pu.position.x - pu.radius > canvas.width ||
            pu.position.y + pu.radius < 0 || pu.position.y - pu.radius > canvas.height) {

        } else {
            const p_dist = Math.hypot(player.position.x - pu.position.x, player.position.y - pu.position.y);
            if (p_dist - pu.radius - player.radius < 1) {
                isPowered = true;
                player.strokeStyle = pu.color;
                player.shadowColor = pu.color;
                if (pu.powerup === 'rg') {
                    rocketGunRatio = 4;
                    current_ammo = ROCKET_FULL_AMMO;
                    deltaAmmo = 1;
                } else {
                    current_ammo = MG_FULL_AMMO;
                    deltaAmmo = 2.3;
                    rocketGunRatio = 0;
                    isMachineGun = true;
                    lastTimestamp = Date.now();
                }
                powerups.splice(i, 1);
            } else {
                pu.update();
            }
        }

    });
};


function playerUpdate() {
    playerBlackEffect.velocity = player.velocity;
    playerGrowEffect.velocity = player.velocity;
    playerGrowEffect.update();
    playerBlackEffect.update();
    player.update();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    if (isStarted) {
        c.shadowBlur = 0;
        c.shadowColor = 'black';
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        renderdBg();
        playerUpdate();
        particles.forEach((pa, k) => {
            if (pa.alpha <= 0) {
                setTimeout(() => {
                    particles.splice(k, 1);
                }, 0);
            } else
                pa.update();
        });
        if (isMouseDown && isMachineGun && (Date.now() - lastTimestamp >= deltaTime)) {
            createProjectile(curr_mouse_pos);
            lastTimestamp = Date.now();
        }
        renderPowerUp();
        enemis.forEach((en, j) => {
            isEliminated = false;
            projectiles.forEach((pj, i) => {
                if (pj.position.x + pj.radius < 0 || pj.position.x - pj.radius > canvas.width ||
                    pj.position.y + pj.radius < 0 || pj.position.y - pj.radius > canvas.height) {
                    projectiles.splice(i, 1);
                } else {
                    const dist = Math.hypot(pj.position.x - en.position.x, pj.position.y - en.position.y);
                    if (dist - en.radius - pj.radius < 1) {

                        for (let p = 0; p < en.radius / 2; p++) {
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

                        if (en.radius <= (10 + rocketGunRatio)) {
                            projectiles.splice(i, 1);
                            lastKilledEnemyColor = en.color;
                            enemis.splice(j, 1);
                            isEliminated = true;
                            score += pointForElimination;
                            scoreAmount.innerHTML = score;

                        } else {
                            setTimeout(() => {
                                projectiles.splice(i, 1);
                                en.radius / (enemyShrinkFactor + rocketGunRatio) < 10 ? en.radius = 10 : en.radius /= (enemyShrinkFactor + rocketGunRatio);
                                isEliminated = false;
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
                clearInterval(enemiesIntervalId);
                clearInterval(powerupIntervalId);
            } else if (!isEliminated) {
                centerX = player.position.x + player.radius / (Math.PI * 2);
                centerY = player.position.y + player.radius / (Math.PI * 2);
                const angle = Math.atan2(centerY - en.position.y, centerX - en.position.x);
                const velocity = {
                    x: Math.cos(angle) * scoreDelta,
                    y: Math.sin(angle) * scoreDelta
                }
                en.velocity = velocity;
                en.update();
            }
        });
    }
}



function createProjectile(e) {
    isMouseDown = true;
    centerX = player.position.x + player.radius / (Math.PI * 2);
    centerY = player.position.y + player.radius / (Math.PI * 2);
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    let color;
    if (isPowered) {
        color = player.strokeStyle;
        current_ammo -= 1;
        if (current_ammo <= 0) {
            rocketGunRatio = 0;
            isPowered = false;
            player.strokeStyle = 'white';
            player.shadowColor = 'white';
            isMachineGun = false;
            deltaAmmo = 1;
        }

    } else {
        color = DEFAULT_AMMO_COLOR;
        isMachineGun = false;
    }

    const x = (Math.cos(angle)) * AMMO_VELOCITY_DELTA * deltaAmmo;
    const y = (Math.sin(angle)) * AMMO_VELOCITY_DELTA * deltaAmmo;
    projectiles.push(
        new BaseCircleObject(c, position = { x: centerX, y: centerY }, 3, color, velocity = { x: x, y: y })
    );
}

addEventListener('mousedown', (e) => {
    if (isStarted) {
        createProjectile(e);
        isMouseDown = true;
    }
});



addEventListener('mousemove', (e) => {
    if (isStarted) {
        curr_mouse_pos = { clientX: e.clientX, clientY: e.clientY };

    }
});

addEventListener('mouseup', (e) => {
    if (isStarted) {
        isMouseDown = false;
    }
});

addEventListener('keydown', (e) => {
    if (isStarted) {
        switch (e.key.toLowerCase()) {
            case 'a':
                player.moveX(-1);
                keys.a.pressed = true;
                break;
            case 'w':
                player.moveY(-1);
                keys.w.pressed = true;
                break;
            case 's':
                player.moveY(1);
                keys.s.pressed = true;
                break;
            case 'd':
                player.moveX(1);
                keys.d.pressed = true;
                break;
        }
    }
});

addEventListener('keyup', (e) => {
    if (isStarted) {
        switch (e.key.toLowerCase()) {
            case 'a':
                keys.a.pressed = false;
                if (!keys.d.pressed) player.moveX(0); else player.moveX(1);
                break;
            case 'w':
                keys.w.pressed = false;
                if (!keys.s.pressed) player.moveY(0); else player.moveY(1);
                break;
            case 's':
                keys.s.pressed = false;
                if (!keys.w.pressed) player.moveY(0); else player.moveY(-1);
                break;
            case 'd':
                keys.d.pressed = false;
                if (!keys.a.pressed) player.moveX(0); else player.moveX(-1);
                break;
        }
    }
});

init();

