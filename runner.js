document.addEventListener("DOMContentLoaded", () => {
  // OVERALL
  // caching HTML references to shorten code
  const grid = document.querySelector(".grid");
  const player = document.querySelector(".player");
  const menu = document.getElementById("menu");
  const body = document.querySelector("body");
  const heading = document.getElementById("heading");
  const insts = document.getElementById("inst");
  const gameOver = document.getElementById("gameOver");

  const bird = document.getElementById("bird")
  // for background
  const background1 = document.querySelector(".background1");
  const background2 = document.querySelector(".background2");
  const backgroundWidth = background1.clientWidth;

  const cloud1 = document.querySelector(".cloud1");
  const cloud2 = document.querySelector(".cloud2");
  const cloud3 = document.querySelector(".cloud3");

  // Player
  player.style.backgroundImage = "url(Asset/Side-View-Run-1.png)";

  let playerPosition = 13;
  let ground = playerPosition;
  let isMenu = true;
  let isJumping = false;
  let isGameOver = false;

  // PLAYER MOVEMENT VARIABLES
  let frame = 1; 
  let jumpHeight = playerPosition;
  let jumpTimeInterval = 10;
  jumpHeight += 30;
  let jumpSpeed = 1; 
  let downSpeed = 0.1;
  let gravity = 2; 


// Sound
var jumpSound = [];
var gameOverSound = [];

  function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

  // Moving background
  let posX = 0;

  background1.style.left = 0;
  background2.style.left = backgroundWidth + "px";
  let cloudMoveSpeed = 0.1;
  let backgroundMoveSpeed = 1.2;

  // score system
  const scoresHTML = document.querySelector(".scores");
  const scoreHTML = document.getElementById("score");
  const highScoreHTML = document.getElementById("highScore");

  // score variables
  let highScore = localStorage.getItem("highScore");
  let score = 0;
  let scoreSpeed = 0.02; 

  let playerAnimationSpeed = 125;

  let obstacleSpeed = 1.3;
  let obstacle1Speed = 2;
  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- INPUT CHECK -------- ||||||||||||||||||||||||||||||||||||||||||||||||

  document.addEventListener("keydown", (e) => {
    if (!isGameOver) {
      if( e.code === "Space"){
      input();
      console.log("Pressed");
    }else{
      e.preventDefault();
    }
    } else if (isGameOver && e.code === "Space") {
      location.reload();
    }else{
      e.preventDefault();
    }
  });

  document.addEventListener("touchstart", (e) => {
    if (isGameOver) {
      location.reload();
    } else {
      input();
      console.log("Touched");
    }
  });
  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- Menu Transitions -------- ||||||||||||||||||||||||||||||||||||||||||||||||

  function menuTransitions() {
    console.log("Menu switched off.");
    heading.style.visibility = "hidden";
    insts.style.visibility = "hidden";
    bird.style.visibility = "hidden";
  }

  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- Main Game Logic -------- ||||||||||||||||||||||||||||||||||||||||||||||||

  function input(e) {

    if (isMenu) {
      isMenu = false;
      posX = 0;
      menuTransitions();
      playerRun();

      
      
      console.log("Start");
      manageObstacles();
      scrollBackground();
      scrollcloud();
      addScore();
    }


    if (!isMenu && !isJumping && !isGameOver) {
      isJumping = true;
      jump();
      console.log("Jumping");
      
    }
  }

  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- Player Animation -------- ||||||||||||||||||||||||||||||||||||||||||||||||

  function playerRun() {
    setInterval(runningLoop, playerAnimationSpeed);

    function runningLoop() {
      console.log("Running");


      if (frame == 1 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-2.png)";
        player.style.bottom = "12%";

        frame = 2;
      } else if (frame == 2 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-3.png)";
        player.style.bottom = "12%";
        frame = 3;
      } else if (frame == 3 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-4.png)";
        player.style.bottom = "12%";
        frame = 4;
      } else if (frame == 4 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-5.png)";
        player.style.bottom = "12%";
        frame = 5;
      } else if (frame == 5 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-6.png)";
        player.style.bottom = "12%";
        frame = 6;
      } else if (frame == 6 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-7.png)";
        player.style.bottom = "12%";
        frame = 7;
      } else if (frame == 7 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-8.png)";
        player.style.bottom = "12%";
        frame = 8;
      } else if (frame == 8 && !isJumping && !isGameOver) {
        player.style.backgroundImage = "url(Asset/Side-View-Run-1.png)";
        player.style.bottom = "12%";
        frame = 1;

      } else if (isGameOver) {
        player.style.backgroundImage = "url('Asset/Kuro-death.png')";
        player.style.bottom = "10%";

      }
    }
  }

  // ----------------------- Player Jump -----------------------
  function jump() {
    jumpSound = new sound("Asset/Jump.wav");
    jumpSound.play();

    let timer = setInterval(function () 
    {
      console.log("UP");

      // ---- Player Going Up ---- //


      player.style.backgroundImage = "url(Asset/Side-View-Jump-1.png)";


      jumpSpeed = 1;
      playerPosition += jumpSpeed;
      jumpSpeed = jumpSpeed * gravity;
      if (jumpSpeed <= 0.17) {
        jumpSpeed = 0.2;
      }


      player.style.bottom = playerPosition + "%";


      if (playerPosition >= jumpHeight) {
        console.log("DOWN");

        clearInterval(timer); 

        let downTimer = setInterval(function () {



          playerPosition -= downSpeed;
          downSpeed = downSpeed + downSpeed * 0.08;

          player.style.bottom = playerPosition + "%";

          player.style.backgroundImage = "url(Asset/Side-View-Jump-2.png)"; // Replace the player going up sprite with player landing sprite

          if (playerPosition <= ground) {
            console.log("Ground");

            clearInterval(downTimer);
            jumpSpeed = 1;
            downSpeed = 0.3;
            isJumping = false;
            playerPosition = ground;
            player.style.bottom = playerPosition + "%";
          }
        }, jumpTimeInterval);
      }
    }, jumpTimeInterval);
  }

  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- OBSTACLES -------- ||||||||||||||||||||||||||||||||||||||||||||||||


  function manageObstacles() {

    randomCall();
  }

  //||| -------- RANDOM OBSTACLE CALL -------- |


  var randomTime;


  function changeTime() {

    randomTime = Math.floor(Math.random() * (4000 - 1000) + 1000); 
  }


  function randomCall() {

    console.log("RANDOM CALL at " + randomTime + " milliseconds");


    changeTime();

    setTimeout(randomCall, randomTime); 


    generateObstacle();
  }

  //||| -------- GENERATE AND MOVE OBSTACLE -------- |

  function generateObstacle() {
    console.log("OBSTACLE CREATION");

    let obstacleXPosition = 1800;
    let obstacle1XPosition = 9500;



    // |||||||Obstacle 1|||||
    const obstacle = document.createElement("div");

    if (!isGameOver) {
      obstacle.classList.add("obstacle");
    }

    grid.appendChild(obstacle);
    obstacle.style.left = obstacleXPosition + "px";

    // |||||||Obstacle 2|||||
    const obstacle1 = document.createElement("div");

    if (!isGameOver) {
      obstacle1.classList.add("obstacle1");
    }

    grid.appendChild(obstacle1);
    obstacle1.style.left = obstacle1XPosition + "px";

    // Move Obstacle
    let moveObstacle = setInterval(() =>
      // create interval ...
      {
        // ||| -------- MOVE -------- |||

        if (!isGameOver) {
       
          obstacleXPosition -= obstacleSpeed;

          obstacle.style.left = obstacleXPosition + "px";

          obstacle1XPosition -= obstacle1Speed;

          obstacle1.style.left = obstacle1XPosition + "px";
        }

        // ||| -------- DELETE WHEN OFF SCREEN -------- |||
        if (obstacleXPosition <= -50) {
          obstacle.classList.remove("obstacle");
          try {
            grid.removeChild(obstacle);
          } catch (error) {}
        }
        if (obstacle1XPosition <= -50) {
          obstacle1.classList.remove("obstacle1");
          try {
            grid.removeChild(obstacle1);
          } catch (error) {}
        }

        // ||| -------- DETECT COLLISION WITH PLAYER -------- |||

        if (
          obstacleXPosition > 5 &&
          obstacleXPosition < 45 &&
          playerPosition < 25
        ) {
          console.log("Collision!");
          clearInterval(moveObstacle);
          GameOver();
          gameOverSound = new sound("Asset/game-over.wav");
          gameOverSound.play();
        }
        if (
          obstacle1XPosition > 5 &&
          obstacle1XPosition < 45 &&
          playerPosition < 25
        ) {
          console.log("Collision!");
          clearInterval(moveObstacle);
          GameOver();
          gameOverSound = new sound("Asset/game-over.wav");
          gameOverSound.play();
        }
      }, 1);
  }

  //  ||||||||||| MOVING ANIMATION|||||||||||||

  function scrollBackground() {
    let background1Pos = 0;
    let background2Pos = backgroundWidth;

    setInterval(() => {
      if (!isGameOver) {
        background1Pos = background1Pos - backgroundMoveSpeed;
        background1.style.left = background1Pos + "px";

        background2Pos = background2Pos - backgroundMoveSpeed;
        background2.style.left = background2Pos + "px";

        if (background1Pos <= -backgroundWidth - 1) {
          background1Pos = backgroundWidth - posX;
        }

        if (background2Pos <= -backgroundWidth - 1) {
          background2Pos = backgroundWidth - posX;
        }

        if (score % 1000 == 0) {
          posX += 1;
        }
      }
    }, 1);
  }

  function scrollcloud() {
    let cloud1Pos = 0;
    let cloud2Pos = 100;
    let cloud3Pos = 200;
    setInterval(() => {
      if (!isGameOver) {
        cloud1Pos = cloud1Pos - cloudMoveSpeed;
        cloud1.style.left = cloud1Pos + "%";

        cloud2Pos = cloud2Pos - cloudMoveSpeed;
        cloud2.style.left = cloud2Pos + "%";

        cloud3Pos = cloud3Pos - cloudMoveSpeed;
        cloud3.style.left = cloud3Pos + "%";
      }

      if (cloud1Pos <= -100) {
        cloud1Pos = 200;
      }
      if (cloud2Pos <= -100) {
        cloud2Pos = 200;
      }
      if (cloud3Pos <= -100) {
        cloud3Pos = 200;
      }
    }, 1);
  }

  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- SCORE SYSTEM-------- ||||||||||||||||||||||||||||||||||||||||||||||||

  function addScore() {
    setInterval(() => {
      if (!isGameOver) {
        score += 1;

        if (score > highScore) {
          highScore = score;
        }

        scoreHTML.innerHTML = score;

        highScoreHTML.innerHTML = "High Score: " + highScore;

        if (score % 1000 == 0) {
          backgroundMoveSpeed += 0.2;
          obstacleSpeed += 0.2;
          obstacle1Speed += 0.3;
        }
      }

      if (isGameOver) {
        localStorage.setItem("highScore", highScore);
      } 
    }, scoreSpeed);
  }

  // |||||||||||||||||||||||||||||||||||||||||||||||| -------- GAME OVER -------- ||||||||||||||||||||||||||||||||||||||||||||||||

  function GameOver() {
    gameOver.style.visibility = "visible";
    isGameOver = true;
  }
});
