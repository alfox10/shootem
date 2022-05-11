
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
const audioBtn = document.querySelector('.audioBtn');
const offsetMatrixBg = 140;
const powerUpIntervalTimer = 10000;
const enemiesIntervalTimer = 2500;
const pointForElimination = 50;
const pointForHit = 10;
const enemyShrinkFactor = 1.2;
const ROCKET_FULL_AMMO = 10;
const MG_FULL_AMMO = 60;
const DEFAULT_AMMO_COLOR = 'white';
const perfectFrameTime = 1000 / 60;
const deltaTime = 200;
const AMMO_VELOCITY_DELTA = 3;

const music = {
    bgm1: new Howl({
        src:['./audio/bgm.mp3'],
        html5:true,
        loop:true,
        volume: 0.5
    })
};

const sfx = {
    back: new Howl({
        src:['./audio/back.mp3'],
        loop:false,
        html5:true
    }),
    hit: new Howl({
        src:['./audio/hit.mp3'],
        loop:false,
        html5:true
    }),
    machineGun: new Howl({
        src:['./audio/machine_gun.mp3'],
        loop:true,
        html5:true
    }),
    normal: new Howl({
        src:['./audio/normal_laser.mp3'],
        loop:false,
        html5:true
    }),
    pu: new Howl({
        src:['./audio/pu.mp3'],
        loop:false,
        html5:true
    }),
    rocket: new Howl({
        src:['./audio/rocket.mp3'],
        loop:false,
        html5:true
    }),
    start: new Howl({
        src:['./audio/start.mp3'],
        loop:false,
        html5:true
    }),
};


let centerX;
let centerY;
let player;
let playerBlackEffect;
let playerGrowEffect;
let projectiles;
let enemis;
let powerups;
let particles;
let scoreDelta;
let score;
let matrixBg;
let isStarted = false;
let enemiesIntervalId;
let powerupIntervalId;
let lastKilledEnemyColor;
let animationId;
let isEliminated;
let keys;
let rocketGunRatio;
let current_ammo;
let isPowered;
let curr_mouse_pos;
let isMachineGun;
let isMouseDown;
let lastTimestamp;
let deltaAmmo;
let isAudioOn = true;