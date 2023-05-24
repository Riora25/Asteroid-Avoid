/*
INSTRUCTIONS
You are a spaceship travelling through an asteroid field.  
If you hit the floor, ceiling, or asteroid it will cause the game to end.
You can control the spaceship via the space bar to go up on the vertical plane only. 
There is a constantly increasing gravity effect that you must fight against as you play.

CODING QUALITY AND VISUAL DESIGN
During the course of this class I fell in love with the random ability and very early on decided that I wanted to create
a neat space themed game so I could create stars. I am most proud of my code to generate the asteroids because it was the most challenging
on several levels, getting the sound to work on collision and getting the collision to detect correctly and transition to the gameover screen.
My final project is great because my coding skills were able to produce a simple yet elegant 'The Helicopter game' or 'FlappyBird' clone with a twist on the 
theme being in space. I feel that my visual design and sound use is appealing and my code is clean and offers a neat little program for others to 
play with. 

VIDEO
https://vimeo.com/534518528/cbcc477160

RELEASE
I Amber Szpular grant permission to CS 105 course staff to use
my Final Project program and video for the purpose of promoting CS 105.
<if you don't grant permission, erase the line above>
*/

// All image/sound content is free or royalty free
// Songs from epidemicsound.com
// Title Card song is A Heart made of Pixels by Christoffer Moe Ditlevsen
// Game Play song is Moving to Miami by Lexica
// Sound Effect for explosion is from freesoundeffects.com called Torpedo Explosion

// all code goes below here ....

//Images
let imgSpaceship;
let imgAsteroidBorder;
let imgAsteroidDodge;

//Sounds
let songTitleCard;
let songGamePlay;
let soundExplosion;

//Global Variables
let distanceTravelled = 0;
let gravityDrop = 1;
let state;
let state1 = titleScreen;
let state2 = asteroidAvoid;
let state3 = gameOver;

//create an array for the stars and asteroids
let stars = [];
let asteroidPos = [];
let lastAsteroidIndex = 0;

// Preload the images and sounds
function perload() {
  imgSpaceship = loadImage("spaceship.png");
  imgAsteroidBorder = loadImage("asteroids.png");
  imgAsteroidDodge = loadImage("Asteroid.png");

  songTitleCard = loadSound("TitleCard.mp3");
  songGamePlay = loadSound("GamePlay.mp3");
  soundExplosion = loadSound("Explosion.wav");
}

function setup() {
  createCanvas(1000, 700);
  noCursor();
  state = state1;
  songTitleCard.loop();

  for (let i = 0; i < 500; i++) {
    makeStars();
  }
}

function draw() {
  background(0);
  makeStars();
  state();
}

//Title Screen
function titleScreen() {
  fill(0, 55, 255); // Dark Blue
  quad(100, 125, 900, 125, 850, 175, 150, 175);
  quad(200, 325, 800, 325, 750, 375, 250, 375);
  rect(150, 525, 700, 50);

  stroke(53, 233, 255); // Light Blue
  fill(255); // White
  textSize(150);
  textAlign(CENTER, CENTER);
  text("Asteroid", width / 2, 150);
  text("Avoid!", width / 2, 350);
  textSize(75);
  text("Press Enter to Play", width / 2, 550);
}

// ** This is where I used a Basic Concept User-Defined Function to create the GamePlay
function asteroidAvoid() {
  // Loop the Asteroid image along the upper and lower border
  for (let asteroidNumber = 0; asteroidNumber < 8; asteroidNumber++) {
    drawAsteroidBorder(asteroidNumber * 140, asteroidNumber - 50);
    drawAsteroidBorder(asteroidNumber * 140, asteroidNumber + 650);
  }

  // Use the asteroidPos and last AsteroidIndex arrays to track asteroid Pos
  // If the last asteroid placed is less the 300
  if (asteroidPos[lastAsteroidIndex][0] < width - 700) {
    // Replace the oldest Asteroid and keep the array at length 3
    lastAsteroidIndex = (lastAsteroidIndex + 1) % 3;
    // 0:x, 1:y
    // Set the X value of every initial asteroid to the width of the canvas and the Y to a random value
    asteroidPos[lastAsteroidIndex] = [width, random(55, height - 355)];
  }

  //** This is the best use of the basic concept Loops
  // Loop the asteroids and set the x and y position to the appropriate arrays and draw the asteroids
  for (
    let asteroidNumber = 0;
    asteroidNumber < asteroidPos.length;
    asteroidNumber++
  ) {
    let x = asteroidPos[asteroidNumber][0];
    let y = asteroidPos[asteroidNumber][1];
    drawAsteroids(x, y);
    // **  This is the best use of the Extended Concept of Rectangle hit test hitting another rectangle
    // Collision Hit Test with Asteroids
    if (
      spaceshipX >= x - 124 &&
      spaceshipX + 124 <= x + 268 &&
      spaceshipY >= y - 26 &&
      spaceshipY + 53 <= y + 300
    ) {
      soundExplosion.play();
      distanceTravelled -= 1;
      spaceshipY = -100;
      state = state3;
    }

    // If the X value of the asteroid reaches the end of the ship increase the gravity drop
    if (x > 46 && x < 50) {
      // since asteroids are moving by 3 this makes sure we get a hit once.
      gravityDrop += 1;
    }
    // Asteroid Speed is -3
    asteroidPos[asteroidNumber][0] -= 3;
  }

  //** This is the best use of the basic concept of conditionals
  // Hit Test for border Collision
  if (spaceshipY >= 650 - 54 || spaceshipY <= 50) {
    soundExplosion.play();
    background(0);
    // Pause Distance Travelled
    distanceTravelled -= 1;
    // Move the ship offscreen
    spaceshipY = -100;
    // Run gameOver
    state = state3;
  }
  drawSpaceship(spaceshipX, spaceshipY);
  spaceshipY += gravityDrop;
  distanceTravelled += 1;

  textAlign(LEFT, CENTER);
  textSize(40);
  text("High Score: " + distanceTravelled, 10, 680);
}

//** This is the best use of the basic Concept Array to create Stars
// Create a Function to make Stars
function makeStars() {
  // If the stars array length is less then 300
  if (stars.length < 300) {
    // Randomly spawn 2-3 stars
    let numberOfStarsToSpawn = random(2, 3);
    for (let i = 0; i < numberOfStarsToSpawn; i++) {
      // 0:x, 1:y, 2:speed, 3:color, 4:size
      stars[stars.length] = [
        0,
        random(
          (i * width) / numberOfStarsToSpawn,
          ((i + 1) * width) / numberOfStarsToSpawn
        ),
        random(3, 6),
        random(200, 255),
        random(1, 3),
      ];
    }
  }

  for (let i = 0; i < stars.length; i++) {
    strokeWeight(stars[i][4]);
    stroke(stars[i][3], stars[i][3], stars[i][3]);
    point(stars[i][0], stars[i][1]);
    stars[i][0] += stars[i][2];
  }

  let filteredStars = [];
  for (let i = 0; i < stars.length; i++) {
    if (stars[i][0] <= width) {
      filteredStars[filteredStars.length] = stars[i];
    }
  }
  stars = filteredStars;
}

// Draw Asteroids 268 x 300
function drawAsteroids(x, y) {
  imgAsteroidDodge.resize(0, 300);
  image(imgAsteroidDodge, x, y);
}

// Draw Asteroids for the Border 125 x 99
function drawAsteroidBorder(x, y) {
  imgAsteroidBorder.resize(125, 0);
  image(imgAsteroidBorder, x, y);
}

// Create a Function to draw a ship - Ship is 125 x 54
//** This is the second part of the extended concept for loading Displaying images
function drawSpaceship(x, y) {
  stroke(0, 55, 255); // Dark Blue
  fill(53, 233, 255); // Light Blue
  triangle(
    spaceshipX + 15,
    spaceshipY + 20,
    spaceshipX + 15,
    spaceshipY + 35,
    spaceshipX - 40 + random(-4, 4),
    spaceshipY + 27.5
  );
  noStroke();
  fill(255); // White
  triangle(
    spaceshipX + 15,
    spaceshipY + 23,
    spaceshipX + 15,
    spaceshipY + 32,
    spaceshipX - 35 + random(-4, 4),
    spaceshipY + 27.5
  );
  imgSpaceship.resize(125, 0);
  image(imgSpaceship, x, y);
}

//** This is the best use of keyboard event functions from the extended concepts
function keyPressed() {
  //Ship Movement
  if (key === " " && state === state2) {
    spaceshipY += -54;
  }

  //** This is the second part of the extended concept for loading Displaying sounds
  // Play Asteroid Avoid
  if (key === "Enter" && state === state1) {
    songTitleCard.stop();
    songGamePlay.loop();
    distanceTravelled = 0;
    spaceshipX = 50;
    spaceshipY = height / 2;
    gravityDrop = 1;
    asteroidPos = [];
    asteroidPos[0] = [width, random(55, height - 355)];
    lastAsteroidIndex = 0;
    state = state2;
  }

  // Game Over Screen
  if (key === "r" && state === state3) {
    songGamePlay.stop();
    songTitleCard.loop();
    state = state1;
  }
}

// Game Over Screen
function gameOver() {
  stroke(255, 252, 84); // Yellow
  fill(255, 153, 25); // Orange
  quad(100, 125, 900, 125, 850, 175, 150, 175);
  quad(200, 325, 800, 325, 750, 375, 250, 375);
  rect(100, 525, 805, 50);

  fill(255); //White
  textSize(150);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, 150);
  textSize(100);
  text("To Play Again", width / 2, 350);
  textSize(75);
  text("Press r to Return to Start", width / 2, 550);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(40);
  text("High Score: " + distanceTravelled, 10, 680);
}
