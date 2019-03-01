var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var bluePlayer = 0;
var redPlayer = 0;
var paddle1Y = 250;
var paddle2Y = 250;
var showWinScreen = false;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 10;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if(showWinScreen) {
    bluePlayer = 0;
    redPlayer = 0;
    showWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);
  canvas.addEventListener('mousedown',handleMouseClick);

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function ballReset() {
  if(bluePlayer >= WINNING_SCORE ||
    redPlayer >= WINNING_SCORE) {
      showWinScreen = true;
    }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY-45) {
    paddle2Y += 7;
  } else if(paddle2YCenter > ballY+45) {
    paddle2Y -= 7;
  }
}

function moveEverything() {
  if(showWinScreen) {
    return;
  }
  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if(ballX < 20) {
    if(ballY > paddle1Y &&
      ballY < paddle1Y+PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;

        var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
        ballSpeedY = deltaY*0.35;
      }  else {
        redPlayer += 1;
        ballReset();
      }
  }
  if(ballX > canvas.width-20) {
    if(ballY > paddle2Y &&
      ballY < paddle2Y+PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;

        var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
        ballSpeedY = deltaY*0.35;
      }  else {
        bluePlayer += 1;
        ballReset();
      }
  }
  if(ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if(ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for(var i=0; i<canvas.height; i+=40) {
  colorRect(canvas.width/2-1,i,2,20,'white');
  }
}

function drawEverything() {
  //draw screen
  colorRect(0,0,canvas.width,canvas.height, 'black');
  if(showWinScreen) {
    canvasContext.fillStyle = 'white';
    if(bluePlayer >= WINNING_SCORE) {
    canvasContext.fillText("Player Wins!", 350, 200);
    }
    else if(redPlayer >= WINNING_SCORE) {
    canvasContext.fillText("Computer Wins!", 350, 200);
    }
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Click to play again!", 350, 500);
    return;
  }
  drawNet();
  //left paddle
  colorRect(10,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'blue');
  //right paddle
  colorRect(canvas.width-PADDLE_THICKNESS-10,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'red');
  //ball
  colorCircle(ballX, ballY, 10, 'white');
  //scores
  canvasContext.fillText(bluePlayer, 100, 100);
  canvasContext.fillText(redPlayer, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, 7, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX,topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY, width, height);
}