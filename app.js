const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 상수 정의
const SKY_COLOR = '#87CEEB';
const SUN_COLOR = '#FFD700';
const CLOUD_COLOR = '#FFFFFF';
const GROUND_COLOR = '#228B22';

const GROUND_HEIGHT = 60;


// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 600;

// 강아지 객체
const dogImage = new Image();
dogImage.src = 'pomeranian.png'; // 가지고 계신 파일 이름으로 변경!

const dog = {
    x: canvas.width / 2 - 30,
    y: canvas.height - GROUND_HEIGHT - 70, // 땅 위에 있도록 y좌표 조정
    width: 80, // 이미지 크기에 맞게 조절
    height: 70, // 이미지 크기에 맞게 조절
    speed: 5,
    dx: 0 // x축 이동 방향
};

// 구름 배열
const clouds = [
    { x: 100, y: 120, radius: 30 },
    { x: 300, y: 80, radius: 40 },
    { x: 550, y: 150, radius: 35 },
];

// 키보드 입력 상태
const keys = {
    right: false,
    left: false
};

// 낮 배경 그리기
function drawBackground() {
    // 하늘
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 태양
    ctx.fillStyle = SUN_COLOR;
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    // 구름 그리기
    drawClouds();

    // 땅
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
}

// 구름 그리기 함수
function drawClouds() {
    ctx.fillStyle = CLOUD_COLOR;
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.arc(cloud.x + 30, cloud.y + 10, cloud.radius, 0, Math.PI * 2);
        ctx.arc(cloud.x - 20, cloud.y + 15, cloud.radius - 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 강아지 그리기
function drawDog() {
    // 이미지를 캔버스에 그립니다.
    // 캐릭터가 왼쪽을 보고 있다면 x좌표를 뒤집어 그릴 수 있습니다.
    // 지금은 간단하게 이미지 그대로 그립니다.
    ctx.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height);
}

// 강아지 위치 업데이트
function moveDog() {
    dog.x += dog.dx;

    // 화면 경계 처리
    if (dog.x < 0) {
        dog.x = 0;
    }
    if (dog.x + dog.width > canvas.width) {
        dog.x = canvas.width - dog.width;
    }
}

// 화면 지우고 새로 그리기
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 게임 루프
function update() {
    clear();

    drawBackground();
    drawDog();
    moveDog();

    requestAnimationFrame(update);
}

// 이미지가 모두 로드된 후 게임 시작
dogImage.onload = () => {
    update(); // 게임 시작
};

// 키보드 이벤트 처리 (이 부분은 변경 없습니다)
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        keys.right = true;
        dog.dx = dog.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = true;
        dog.dx = -dog.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        keys.right = false;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = false;
    }

    // 양쪽 키가 모두 떼졌을 때만 멈춤
    if (!keys.left && !keys.right) {
        dog.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
