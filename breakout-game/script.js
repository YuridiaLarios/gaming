// Grabs reference to the canvas
var canvas = document.getElementById("myCanvas");
// Creates a drawing context for the canvas and allow us to draw on it
var ctx = canvas.getContext("2d");

// centered bottom ball
var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2.6;
var dy = -2.6;
var ballRadius = 10;
var paddleHeight= 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;        // number of rows of bricks
var brickColumnCount = 5;     // number of columns of bricks
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;        // padding between the bricks so they don't overlap
var brickOffsetTop = 30;      // some margin from the top of the canvas
var brickOffsetLeft = 30;     // some margin from the left of the canvas
var bricks = [];              // array for bricks
var score = 0;
var lives = 3;
var soundGameOver;
var soundBrickHit;
var soundMissed;
var soundBounce;

// function to build sound objects
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}


for(i = 0; i < brickColumnCount; i++ ){
  bricks[i] = [];             // creates another array inside
  for(j = 0; j < brickRowCount; j++){
    bricks[i][j] = {x: 0, y: 0, status:1} // x and y position of each brick and also the status of each brick
  }
}


// event listener
document.addEventListener("keydown", keyDownHandler); // when a key is press
document.addEventListener("keyup", keyUpHandler); // when a key is release

// when key is pressed down
function keyDownHandler(e){
  if(e.keyCode == 39){ // right arrow button
    rightPressed = true;
  }
  else if(e.keyCode == 37){ // left arrow button
    leftPressed = true;
  }
}

// when key is released
function keyUpHandler(e){
  if(e.keyCode == 39){ //right arrow button
    rightPressed = false;
  }
  else if(e.keyCode == 37){ // left arrow button
    leftPressed = false;
  }
}

// function to draw the ball
function drawBall(){
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0,Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// function to draw paddle
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); // xpos, ypos, width, height
  ctx.fillStyle = "#bf783c";
  ctx.fill();
  ctx.closePath();
}

// function to draw the bricks
function drawBricks() {
  for(i = 0; i < brickColumnCount; i++){
    for(j = 0; j < brickRowCount; j++){
      if(bricks[i][j].status == 1){
        var brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (j *(brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle = "#4e595d";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// function: every time the frame is drawn we want to loop thru all the bricks and
// compare every brick's position with the position of the center of the ball
function collisionDetection(){
  // loop thru columns
  for(i = 0; i < brickColumnCount; i++){
    // loop thru rows
    for(j = 0; j < brickRowCount; j++){
      var currentBrick = bricks[i][j];     // stores position of the current brick
      if(currentBrick.status == 1){
        if(x > currentBrick.x && x < currentBrick.x + brickWidth && y > currentBrick.y && y < currentBrick.y + brickHeight){
          dy = -dy;                 // if the ball hits the brick, direction of movement changes
          soundBrickHit.play();

          currentBrick.status = 0;  // brick has been hit and shouldn't be hit again
          score++;                  // score gets another point.
          if(score == brickRowCount * brickColumnCount){
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}


function drawScore(){
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives(){
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + lives, canvas.width-75, 20);
}

function draw(){
  ctx.clearRect(0,0,canvas.width, canvas.height);// clears any context previously painted
  drawScore();
  drawLives();
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  if(y + dy < ballRadius){
    dy = -dy;
    // if paddle hits the ball
  } else if (y + dy > canvas.height - ballRadius){
    if(x > paddleX && x < paddleX + paddleWidth){
      dy=-dy;
      soundBounce.play();
    }else{
      soundMissed.play();
      lives--;
      if(!lives){
        soundMissed.play();
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 2.6 + 0.5;
        dy = -2.6 - 0.5;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }

  if((x + dx < ballRadius) || (x + dx > canvas.width - ballRadius)){
    dx = -dx;
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth){
    paddleX += 7;
  }

  else if(leftPressed && paddleX > 0){
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  // browser has control of the framing of the game
  requestAnimationFrame(draw);
}

// adding mouse control to paddle
document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2){
    paddleX = relativeX - paddleWidth/2;
  }
}


// MAIN METHOD
window.onload = function() { // as soon as page loads run this code
  soundMissed = new sound("sounds/missed_effect2.wav");
  soundBrickHit = new sound("sounds/hit_effect.wav");
  soundBounce = new sound("sounds/bounce_effect.wav")
  draw();
//setInterval(draw, 10);  //paramFunction, paramMilliseconds
}
