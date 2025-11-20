const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 상수 정의
const SKY_COLOR = '#87CEEB';
const SUN_COLOR = '#FFD700';
const GROUND_COLOR = '#228B22';
const DOG_BODY_COLOR = '#A0522D';
const DOG_ACCENT_COLOR = '#8B4513';

const GROUND_HEIGHT = 60;


// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 600;

// 강아지 객체
const dog = {
    x: canvas.width / 2 - 30,
    y: canvas.height - GROUND_HEIGHT - 70, // 땅 위에 있도록 y좌표 조정
    width: 60,
    height: 50,
    speed: 5,
    dx: 0 // x축 이동 방향
};

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

    // 땅
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
}

// 강아지 그리기
function drawDog() {
    const { x, y, width, height } = dog;

    // 머리 (몸통을 기준으로 상대적 위치 지정)
    const headWidth = width * 0.5;
    const headHeight = height * 0.6;
    const headX = x - headWidth * 0.8;
    const headY = y - headHeight * 0.2;
    ctx.fillStyle = DOG_BODY_COLOR;
    ctx.fillRect(headX, headY, headWidth, headHeight);

    // 귀
    ctx.fillStyle = DOG_ACCENT_COLOR;
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - 5, headY - 10);
    ctx.lineTo(headX + 10, headY);
    ctx.fill();

    // 몸통
    ctx.fillStyle = DOG_BODY_COLOR;
    ctx.fillRect(x, y, width, height);

    // 꼬리
    ctx.beginPath();
    ctx.moveTo(x + width, y + 10);
    ctx.lineTo(x + width + 15, y);
    ctx.strokeStyle = DOG_ACCENT_COLOR;
    ctx.stroke();

    // 다리
    ctx.fillStyle = DOG_ACCENT_COLOR;
    ctx.fillRect(x + 5, y + height, 10, 20);
    ctx.fillRect(x + width - 15, y + height, 10, 20);
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

// 키보드 이벤트 처리
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

update(); // 게임 시작
