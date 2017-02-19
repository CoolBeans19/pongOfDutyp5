var backgroundImage;
var sprite_sheet;
var explode_animation;

//camo variables
var tigerStripe;
var weed;
var camo;
var cherryBlossom;
var p1skinChosen;
var p2skinChosen;
var skinsArray = [];


//sound variables
var hitmarker;
var tacticalNuke;
var alarm;
var bounce;
var bgm;
var niceShot;

//scores and streaks
var p1score;
var p1streak;
var p2score;
var p2streak;

//player 1 variables
var p1;
var p1image;
var p1speed;
var p1tempSpeed;

//player 2 variables
var p2;
var p2image;
var p2speed;
var p2tempSpeed;

//ball variables
var ball;
var ballImage;
var ballSpeed_x;
var ballSpeed_y;

//timer variables
var p1timerActivation;
var p1count;
var p2timerActivation;
var p2count;

//nuke variables
var p1nukeReady;
var p2nukeReady;

//win condition
var pointLimit;
var isGameOver;

function preload() {
    hitmarker = loadSound('sounds/hitmarker.mp3');
    tacticalNuke = loadSound('sounds/tacticalNuke.mp3');
    alarm = loadSound('sounds/alarm.mp3');
    bounce = loadSound('sounds/bounce.mp3');
    bgm = loadSound('sounds/bgm.mp3');
    niceShot = loadSound('sounds/niceShot.mp3');
    
    backgroundImage = loadImage("backgrounds/desertbg.png");
    p1image = loadImage("skins/default.png");
    p2image = loadImage("skins/default.png");
    ballImage = loadImage("misc_assets/blue_ball.png");
    
    tigerStripe = loadImage("skins/tigerPaddle.png");
    weed = loadImage("skins/weedPaddle.png");
    camo = loadImage("skins/camoPaddle.png");
    cherryBlossom = loadImage("skins/cherryBlossomPaddle.png");
    skinsArray = [tigerStripe,weed,camo,cherryBlossom];
    
}

function setup() {
    
    createCanvas(400, 600);
    
    reset();
    
    p1 = createSprite(width/2, 10, 50, 10);
    p1.addImage(p1image);
    
    p2 = createSprite(width/2, height - 10, 50, 10);
    p2.addImage(p2image);
    
    ball = createSprite(width/2, height/2, 16, 16);
    ball.addImage(ballImage);
    
    
    //sprite_sheet = loadSpriteSheet('misc_assets/explosion.png', 96, 96, 12);
    //explode_animation = loadAnimation(sprite_sheet);

}

function draw() {
    
    if (isGameOver) {
        gameOver();
    } else {
        if (p1score == pointLimit || p2score == pointLimit) {
            isGameOver = true;
        }
        if (!bgm.isPlaying()) {
            bgm.play();
        }
        
        background(backgroundImage);
        drawSprites();
        //clear();
        //animation(explode_animation, 100, 130);
        
        ball.position.x += ballSpeed_x;
        ball.position.y += ballSpeed_y;
        
        //score display
        textSize(18);
        fill("#003bff");
        text("Score: " + p1score, 10, 20);
        text("Streak: " + p1streak, 10, 36);
        text("Score: " + p2score, 10, height - 26);
        text("Streak: " + p2streak, 10, height - 10);
        
        //ball boundaries
        if (ball.position.x < 0 + ball.width/2) {
            bounce.play();
            ballSpeed_x = -ballSpeed_x;
        }
        if (ball.position.x > width - ball.width/2) {
            bounce.play();
            ballSpeed_x = -ballSpeed_x;
        }
        
        //making a goal
        if (ball.position.y < 0 - ball.height/2) {
            
            niceShot.setVolume(0.3);
            niceShot.play();
            p2score++;
            p2streak++;
            p1streak = 0;
            ball.position.x = width/2;
            ball.position.y = height/2;
            ballSpeed_x = 0;
            ballSpeed_y = -ballSpeed_y;
        }
        if (ball.position.y > height + ball.height/2) {
            
            niceShot.setVolume(0.3);
            niceShot.play();
            p1score++;
            p1streak++;
            p2streak = 0;
            ball.position.x = width/2;
            ball.position.y = height/2;
            ballSpeed_x = 0;
            ballSpeed_y = -ballSpeed_y;
        }
        
        //player 1 controls
        if (keyDown(65) && p1.position.x > 0 + p1.width/2) {
            p1.position.x-=p1speed;
            p1tempSpeed = -p1speed;
        }
        if (keyDown(68) && p1.position.x < width - p1.width/2) {
            p1.position.x+=p1speed;
            p1tempSpeed = p1speed;
        }
        
        //player 2 controls
        if (keyDown(37) && p2.position.x > 0 + p2.width/2) {
            p2.position.x-=p2speed;
            p2tempSpeed = -p2speed;
        }
        if (keyDown(39) && p2.position.x < width - p1.width/2) {
            p2.position.x+=p2speed;
            p2tempSpeed = p2speed;
        }
        
        //ball collides with paddles
        if(ball.overlap(p1)){
            hitmarker.play();
            ballSpeed_y = -ballSpeed_y;
            ballSpeed_x += (p1tempSpeed / 2);
        }
        if(ball.overlap(p2)){
            hitmarker.play();
            ballSpeed_y = -ballSpeed_y;
            ballSpeed_x += (p2tempSpeed / 2);
        }
        
        //streak conditions
        
        //resets values, allowing streaks to be recompleted
        if(p1streak == 0) {
            p1timerActivation = true;
            p1skinChosen = false;
            p1nukeReady = true;
        }
        if(p2streak == 0) {
            p2timerActivation = true;
            p2skinChosen = false;
            p2nukeReady = true;
        }
        
        //speed boost
        if (p1streak == 2) {
            
            text("Player 1 Pongstreak", width/2 - 85, height/4);
            
            if (p1count >= 0) {
                text("Boost Time: " + p1count, width - 120, 20);
            }
            
            if (p1timerActivation == true) {
                p1count = 10;
                p1speed = 7;
                p1timerActivation = false;
                setInterval(p1countDown, 1000);
            }
        }
        
        //camo change
        if (p1streak == 3) {
            
            var chosenImage
            var num = Math.floor(Math.random() * (skinsArray.length));
                      
            if (!p1skinChosen) {
                text("New skin!", width/2 - 85, height/4);
                
                chosenImage = skinsArray[num];
                p1skinChosen = true;
                p1.addImage(chosenImage);
            }
        }
        
        //nuke activates at 4 consecutive goals
        if (p1streak >= 4) {
            
            if (p1nukeReady) {
                text("Press S to call in airstrike", width/2 - 100, height/4);
                if (keyDown(83)) {
                    tacticalNuke.play();
                    alarm.play();
                    p2speed = 0;
                    p1nukeReady = false;
                    setTimeout(p1nukeRecovery, 4000);
                    console.log(p2speed);
                }
            }
            
        }
        
        
        
        if (p2streak == 2) {
            
            text("Player 2 Pongstreak", width/2 - 85, 3*height/4);
            
            if (p2count >= 0) {
                text("Boost Time: " + p2count, width - 120, height - 10);
            }
            
            
            if (p2timerActivation == true) {
                p2count = 10;
                p2speed = 7;
                p2timerActivation = false;
                setInterval(p2countDown, 1000);
            }
        }
        
        if (p2streak == 3) {
            
            var chosenImage
            var rand = Math.floor(Math.random() * (skinsArray.length));
            if (!p2skinChosen) {
                text("New skin!", width/2 - 85, 3*height/4);
                
                chosenImage = skinsArray[rand];
                p2skinChosen = true;
                p2.addImage(chosenImage);
            }
        }
        
        if (p2streak >= 4) {
            
            if (p2nukeReady) {
                text("Press down to call in airstrike", width/2 - 116, 3*height/4);
                if (keyDown(40)) {
                    tacticalNuke.play();
                    alarm.play();
                    p1speed = 0;
                    p2nukeReady = false;
                    setTimeout(p2nukeRecovery, 4000);
                    console.log(p1speed);
                }
            }
            
        }
        
    }
    
    
}

//sets a timer for the duration of p1's boost
function p1countDown() {

    p1count--;
    
    if (p1count == 0) {
        p1speed = 4;
        clearInterval();
    }
}

//makes p2's movement recover from p1's nuke
function p1nukeRecovery() {
    p2speed = 4;
}

function p2nukeRecovery() {
    p1speed = 4;
}

//sets a timer for the duration of p2's boost
function p2countDown() {

    p2count--;
    
    if (p2count == 0) {
        p2speed = 4;
        clearInterval();
    }
}

//when game has been won or lost
function gameOver() {
    bgm.stop();
    background(0);
    var winningPlayer;
    if (p1score >= pointLimit) {
        winningPlayer = "1";
    } else {
        winningPlayer = "2";
    }
    textAlign(CENTER);
    fill("white");
    text("Game Over! Player " + winningPlayer + " wins!", width/2, height/2);
    text("Click anywhere to try again", width/2, 3*height/4);
}

//player resets game
function mouseClicked() {
    isGameOver = false;
    reset();
    p1.position.x = width/2;
    p2.position.x = width/2;
}

function reset() {
    
    bgm.play();
    bgm.setVolume(0.2);
    
    p1skinChosen = false;
    p2skinChosen = false;
    
    p1score = 0;
    p1streak = 0;
    
    p2score = 0;
    p2streak = 0;
    
    p1speed = 4;
    p1tempSpeed = 0;
    
    p2speed = 4;
    p2tempSpeed = 0;
    
    ballSpeed_x = 0;
    ballSpeed_y = 4;
    
    p1timerActivation = true;
    p2timerActivation = true;
    
    p1nukeReady = true;
    p2nukeReady = true;
    
    pointLimit = 10;
    
    isGameOver = false;
}
