const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 상수 정의
const SKY_COLOR = '#87CEEB';
const SUN_COLOR = '#FFD700';
const CLOUD_COLOR = '#FFFFFF';
const GROUND_COLOR = '#228B22';

const GROUND_HEIGHT = 60;
const GRAVITY = 0.8; // 중력 값
const JUMP_STRENGTH = 18; // 점프 세기


// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 600;

// 강아지 객체
const puppyImage = new Image();
puppyImage.src = 'puppy.png?v=1';

const dog = {
    x: canvas.width / 2 - 30,
    y: canvas.height - GROUND_HEIGHT - 70, // 땅 위에 있도록 y좌표 조정
    width: 80, // 강아지 이미지 크기에 맞게 조절
    height: 70, // 강아지 이미지 크기에 맞게 조절
    speed: 5,
    dx: 0, // x축 이동 방향
    dy: 0, // y축 이동 방향 (점프를 위해 추가)
    isJumping: false, // 점프 상태 (중복 점프 방지)
    direction: 'right' // 바라보는 방향 추가 (기본값: 오른쪽)
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
    left: false,
    up: false
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
    ctx.save(); // 현재 캔버스 상태(변환, 스타일 등)를 저장합니다.

    if (dog.direction === 'left') {
        // 캔버스의 축을 좌우 반전시킵니다.
        ctx.scale(-1, 1);
        // 반전된 축에서 이미지를 그립니다. 위치 계산이 조금 복잡해집니다.
        // 이미지의 오른쪽 끝을 기준으로 위치를 잡아야 하므로 (-강아지 x좌표 - 강아지 너비)가 새로운 x좌표가 됩니다.
        ctx.drawImage(puppyImage, -dog.x - dog.width, dog.y, dog.width, dog.height);
    } else {
        // 오른쪽을 볼 때는 원래대로 그립니다.
        ctx.drawImage(puppyImage, dog.x, dog.y, dog.width, dog.height);
    }
    ctx.restore(); // save() 시점에 저장했던 캔버스 상태로 되돌립니다.
}

// 조작법 안내 그리기
function drawInstructions() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('이동: ← →', 10, 25);
    ctx.fillText('점프: ↑ 또는 Space', 10, 45);
}

// 강아지 위치 업데이트
function moveDog() {
    dog.x += dog.dx;
    dog.y += dog.dy;

    // 강아지가 점프 중일 때만 중력 적용
    if (dog.isJumping) {
        dog.dy += GRAVITY;
    }

    // 화면 경계 처리
    if (dog.x < 0) {
        dog.x = 0;
    }
    if (dog.x + dog.width > canvas.width) {
        dog.x = canvas.width - dog.width;
    }
    // 땅에 닿았을 때 처리
    if (dog.y + dog.height > canvas.height - GROUND_HEIGHT) {
        dog.y = canvas.height - GROUND_HEIGHT - dog.height;
        dog.dy = 0;
        dog.isJumping = false;
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
    drawInstructions();
    drawDog();
    moveDog();

    requestAnimationFrame(update);
}

// 강아지 이미지가 모두 로드된 후 게임 시작
puppyImage.onload = () => {
    update(); // 게임 시작
};

// 키보드 이벤트 처리 (이 부분은 변경 없습니다)
function keyDown(e) {
    if ((e.key === 'ArrowRight' || e.key === 'Right')) {
        keys.right = true;
        dog.dx = dog.speed;
        dog.direction = 'right'; // 방향을 오른쪽으로 설정
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = true;
        dog.dx = -dog.speed;
        dog.direction = 'left'; // 방향을 왼쪽으로 설정
    } else if ((e.key === 'ArrowUp' || e.key === 'Up' || e.key === ' ') && !dog.isJumping) {
        // 스페이스바 또는 위쪽 화살표를 누르고, 점프 중이 아닐 때 점프
        keys.up = true;
        dog.isJumping = true;
        dog.dy = -JUMP_STRENGTH;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        keys.right = false;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = false;
    } else if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === ' ') {
        keys.up = false;
    }

    // 양쪽 키가 모두 떼졌을 때만 멈춤
    if (!keys.left && !keys.right) {
        dog.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
