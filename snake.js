const REFRESH_RATE = 10;
const SPEED = 1;
const HEIGHT = 7;
const WIDTH = 70;
const FOOD_SIZE = 6;
const GROWTH = 6;
const WINDOW_WIDTH = 336.5; //window.innerWidth/2;
const WINDOW_HEIGHT = 330.5; //window.innerHeight/2;
const Direction = {left:37, up:38, right:39, down:40,}

var highscore = 0;

function node(data){
    this.data = data;
    this.next = null;
    this.prev = null;
}

function queue(){
    this.first = null;
    this.last = null;

    this.isEmpty = function(){
        if(this.first == null){
            return true;
        }
        else{
            return false;
        }
    }

    this.enqueue = function(element){
        if(this.isEmpty()){
            this.first = new node(element);
            this.last = this.first;
        }
        else{
            n = new node(element);
            n.prev = this.last; 
            this.last.next = n;
            this.last = this.last.next;
        }
    }

    this.peek = function(){
        if(this.isEmpty()){
            return null;
        }
        return this.first.data;
    }

    this.peekQueue = function(){
        var d = [];
        var i = 0;
        q = this.first;

        while(q != null){
            d[i++] = q.data;
            q = q.next;
        }
        return d;
    }

    this.dequeue = function(){
        if(!this.isEmpty()){
            n = new node(this.first.data);
        
            this.first = this.first.next;
            if(this.isEmpty()){
                this.last = null;
            }
            else{
                this.first.prev = null;
            }

            return node.data;
        }
        else{
            return null;
        }
    }
}

function change(x, y, direction){
    this.x = x;
    this.y = y; 
    this.direction = direction;
}
    

var gamePiece;
var eat;

function startGame(){
    gameArea.start();
    gamePiece = new component(WIDTH, HEIGHT, "black", "green", 10, 120);
    makeFood();
    //eat = new component(5,5,'black','black', Math.floor((Math.random() * 480)+1), Math.floor((Math.random()*270)+1));
   // eat.bodyParts[0].direction = false;

}

function makeFood(){
    do{
        eat = new component(FOOD_SIZE, FOOD_SIZE,'black','black', Math.floor((Math.random() * (WINDOW_WIDTH-7))+1), Math.floor((Math.random()*(WINDOW_HEIGHT-7))+1));

        var inSnake = false;

        for(i = 0; i < gamePiece.numParts; i++){
            if(isTouching(eat.bodyParts[0].x, eat.bodyParts[0].y, eat.bodyParts[0].width, eat.bodyParts[0].height, gamePiece.bodyParts[i].x, gamePiece.bodyParts[i].y, gamePiece.width, gamePiece.height)){
                inSnake = true;
                break;
            }
        }
    }while(inSnake == true);
    eat.bodyParts[0].direction = false;
}
function part(width, height, colour, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.direction = Direction.right;
    this.speedX = 0;
    this.speedY = 0;

    this.movement = new queue();

    this.stopMove = function(){
        this.speedX = 0;
        this.speedY = 0;
    }

    this.changeDir = function(x, y, dir){
        this.movement.enqueue(new change(x, y, dir));
    }

    this.newPos = function(){
        if(!this.movement.isEmpty()){
            this.swagx = this.movement.peek().x;
            this.swagy = this.movement.peek().y;
            if(this.x == this.movement.peek().x){
                if(this.y == this.movement.peek().y){
                    this.direction = this.movement.peek().direction;
                    this.movement.dequeue();
                }
            }
        }
        this.stopMove();
        switch(this.direction){
            case Direction.left:
                this.speedX = -1*SPEED;
                break;
            case Direction.right:
                this.speedX = SPEED;
                break;
            case Direction.up:
                this.speedY = -1*SPEED;
                break;
            case Direction.down:
                this.speedY = SPEED;
                break;
            default:
                break;
        }
        if(this.x + this.speedX < -HEIGHT){
            this.x = gameArea.canvas.width-1;
        }
        else{
            if(this.x + this.speedX >= gameArea.canvas.width)
            {
                this.x = -HEIGHT;
            }
            else{
                this.x = (this.x + this.speedX) % gameArea.canvas.width;
            }
        }

        if(this.y + this.speedY < -HEIGHT){
            this.y = gameArea.canvas.height-1;
        }
        else{
            if(this.y + this.speedY >= gameArea.canvas.height){
                this.y = -HEIGHT;
            }
            else{
                this.y = (this.y + this.speedY) % gameArea.canvas.height;
            }
        }
    }
}

function component(width, height, headColour, bodyColour, x, y){
    width = Math.floor(width/height)*height;
    this.width = height;
    this.numParts = width/this.width;
    this.lastIndex = this.numParts - 1;
    this.height = height;
    this.y = y;
    this.arrX = [];
    this.bodyParts = [];
    
    this.arrX[0] = x+(this.width*(this.lastIndex - 0));
    this.bodyParts[0] = new part(this.width, this.height, this.headColour, this.arrX[0], y);

    for(i = 1; i <= this.lastIndex; i++){
        this.arrX[i] = x + (this.width * (this.lastIndex - i));
        this.bodyParts[i] = new part(this.width, this.height, bodyColour, this.arrX[i], y);
    }

    this.grow = function(growth){
        for(j = 1; j <= growth; j++){
            var newX, newY;
            width = width+HEIGHT;
            this.numParts = width/this.width;
            this.lastIndex = this.numParts - 1;
            
            newX = this.bodyParts[this.lastIndex - 1].x;
            newY = this.bodyParts[this.lastIndex - 1].y;

            switch(this.bodyParts[this.lastIndex - 1].direction){
                case Direction.left:
                    newX += HEIGHT;
                    break;
                case Direction.right:
                    newX -= HEIGHT;
                    break;
                case Direction.up:
                    newY += HEIGHT;
                    break;
                case Direction.down:
                    newY -= HEIGHT;
                    break;
                default:
                    break;
            }
            this.bodyParts[this.lastIndex] = new part(this.width, this.height, bodyColour, newX, newY);
            this.bodyParts[this.lastIndex].direction = this.bodyParts[this.lastIndex-1].direction;
            this.bodyParts[this.lastIndex].speedX = this.bodyParts[this.lastIndex-1].speedX;

            this.bodyParts[this.lastIndex].speedY = this.bodyParts[this.lastIndex-1].speedY;
            
            var moves = this.bodyParts[this.lastIndex-1].movement.peekQueue();

            for(i = 0; i < moves.length; i++){
                this.bodyParts[this.lastIndex].movement.enqueue(moves[i]);
            }
            //this.bodyParts[this.lastIndex].movement = JSON.parse(JSON.stringify(this.bodyParts[this.lastIndex-1].movement));
    
        }
    }
    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = headColour;
        ctx.fillRect(this.bodyParts[0].x, this.bodyParts[0].y, this.bodyParts[0].width, this.bodyParts[0].height);
        this.bodyParts[0].newPos();

        for(i = 1; i <= this.lastIndex; i++){
            ctx.fillStyle = bodyColour;

            ctx.fillRect(this.bodyParts[i].x, this.bodyParts[i].y, this.bodyParts[i].width, this.bodyParts[i].height);
            this.bodyParts[i].newPos();
        }
        
        //ctx.fillStyle = headColour;
        //i = this.headIndex;
        //ctx.fillRect(this.bodyParts[i].x, this.bodyParts[i].y, this.bodyParts[i].width, this.bodyParts[i].height);
        //this.bodyParts[i].newPos();

        for(i = 2; i <= this.lastIndex; i++){
            if(isTouching(this.bodyParts[0].x, this.bodyParts[0].y, this.width, this.height, this.bodyParts[i].x, this.bodyParts[i].y,this.width, this.height)){ 
                gameArea.gameover = true;
                gameArea.paused = true;
                break;
            }
           
        }
        
    }
    this.newPos = function(dir){
        if(!(dir < Direction.left || dir > Direction.down)){
            var buff = false;
            var diff = this.bodyParts[0].direction - dir;
            if(diff != -2 && diff != 2){
                
                var headir = this.bodyParts[0].diretion;
                i = 2;
                diff = this.bodyParts[i].direction - dir;
                if(diff == 2 || diff == -2){
                    if(dir == Direction.right && isTouching(this.bodyParts[0].x+8, this.bodyParts[0].y, this.width, this.height, this.bodyParts[i].x, this.bodyParts[i].y,this.width, this.height)){
                        buff = true;
                    }
                    if(dir == Direction.left && isTouching(this.bodyParts[0].x-8, this.bodyParts[0].y, this.width, this.height, this.bodyParts[i].x, this.bodyParts[i].y,this.width, this.height)){
                        buff = true;
                    } 
                    if(dir == Direction.down && isTouching(this.bodyParts[0].x, this.bodyParts[0].y+8, this.width, this.height, this.bodyParts[i].x, this.bodyParts[i].y,this.width, this.height)){
                        buff = true;
                    } 
                    if(dir == Direction.up && isTouching(this.bodyParts[0].x, this.bodyParts[0].y-8, this.width, this.height, this.bodyParts[i].x, this.bodyParts[i].y,this.width, this.height)){
                        buff = true;
                    }
                }
                
                if(buff == true){
                    switch(this.bodyParts[0].direction){
                        case Direction.left: 
                            for(i = 0; i < this.numParts; i++){
                                this.bodyParts[i].changeDir(this.bodyParts[2].x-HEIGHT, this.bodyParts[0].y, dir);
                            }
                            break;
                        case Direction.right: 0
                            for(i = 0; i < this.numParts; i++){
                                this.bodyParts[i].changeDir(this.bodyParts[2].x+HEIGHT, this.bodyParts[0].y, dir);
                            }
                            
                            break;
                        case Direction.up: 
                            for(i = 0; i < this.numParts; i++){
                                this.bodyParts[i].changeDir(this.bodyParts[0].x, this.bodyParts[2].y-HEIGHT, dir);
                            }
                            
                            break;
                        case Direction.down: 
                            for(i = 0; i < this.numParts; i++){
                                this.bodyParts[i].changeDir(this.bodyParts[0].x, this.bodyParts[2].y+HEIGHT, dir);
                            }
                            
                            break;
                        default:
                            break;
                    }
                }
                else{
                    for(i = 0; i < this.numParts; i++){
                        this.bodyParts[i].changeDir(this.bodyParts[0].x, this.bodyParts[0].y, dir);
                    }
                }
            }
        }
    }
}

function gameOver(){
    var img = new Image;
    img.src = "giphy.gif";
    
    //gameArea.paused = true;
    var ctx = gameArea.context;
    ctx.drawImage(img, 0,0, WINDOW_WIDTH, WINDOW_HEIGHT);
    clearInterval(gameArea.interval);
}

function gamePaused(){
    var img = new Image;
    img.src = "pause_logo_large.png";
    
    //gameArea.paused = true;
    var ctx = gameArea.context;
    ctx.drawImage(img, 0,0, WINDOW_WIDTH, WINDOW_HEIGHT);
}


function isBetween(num, start, end){
    if(num >= start && num <= end){
       return true;
    }
    else{
       return false;
    }
} 
function isTouching(x1, y1, w1, h1, x2, y2, w2, h2){
    
    if(isBetween(x1, x2, x2+w2-1) && isBetween(y1, y2, y2+h2-1)){
        return true;
    }
    if(isBetween(x1+w1-1, x2, x2+w2-1) && isBetween(y1, y2, y2+h2-1)){
        return true;
    }
    if(isBetween(x1, x2, x2+w2-1) && isBetween(y1+h1-1, y2, y2+h2-1)){
        return true;
    }
    if(isBetween(x1+w1-1, x2, x2+w2-1) && isBetween(y1+h1-1, y2, y2+h2-1)){
        return true;
    }
    
    return false;
}

var score = 0;

function updateArea(){
    gameArea.clear();
    if(!gameArea.paused){
        if(gameArea.key){
            if(gameArea.key == 78)//keyCode for 'n'
            {
                makeFood();
            }
            gamePiece.newPos(gameArea.key);
            gameArea.key = false;
        }
        if(isTouching(eat.bodyParts[0].x+2, eat.bodyParts[0].y+2, eat.bodyParts[0].width-2, eat.bodyParts[0].height-2, gamePiece.bodyParts[0].x, gamePiece.bodyParts[0].y, gamePiece.width, gamePiece.height)){
            //eat = new component(5,5,'black','black', Math.floor((Math.random() * 480)+1), Math.floor((Math.random()*270)+1));
            //eat.bodyParts[0].direction = false;
            gamePiece.grow(GROWTH);
            makeFood();
            score += GROWTH;
            document.getElementById("score").innerHTML = score.toString();
            if(score > highscore){
                highscore = score;
                document.getElementById("highscore").innerHTML = "Hi: "+highscore.toString();
            }
        }

        gamePiece.update();
        
        eat.update();
    }
    else{
        if(gameArea.gameover){
            gameOver();
        } 
        else{
            gamePaused();
        }
    }
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.paused = false;
        this.gameover = false;
        this.key = false;
        this.canvas.width = WINDOW_WIDTH;
        this.canvas.height = WINDOW_HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);

        var img = new Image;
        img.src = "giphy.gif";
    
        //gameArea.paused = true;
        var ctx = gameArea.context;
        ctx.drawImage(img, 0,0, WINDOW_WIDTH, WINDOW_HEIGHT);

        
        var upButton = document.getElementById("up");
        var downButton = document.getElementById("down");
        var leftButton = document.getElementById("left");
        var rightButton = document.getElementById("right");
        var pauseButton = document.getElementById("pause");

        this.interval = setInterval(updateArea, REFRESH_RATE);
        
        leftButton.addEventListener('click', function(e){
            gameArea.key = 37;
        });
        upButton.addEventListener('click', function(e){
            gameArea.key = 38;
        });

        rightButton.addEventListener('click', function(e){
            gameArea.key = 39;
        });

        downButton.addEventListener('click', function(e){
            gameArea.key = 40;
        });
       
        pauseButton.addEventListener('click', function(e){
               gameArea.paused = !gameArea.paused;
        });


        window.addEventListener('keyup', function(e){
            gameArea.key = false;
        });
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.addEventListener('keydown', function(e){
    //if(!gameArea.key){
        gameArea.key = e.keyCode;
        if(gameArea.key == 32){
            gameArea.paused = !gameArea.paused;
            if(gameArea.gameover == true){
                gameArea.gameover = false;
                if(score > highscore)
                    highscore = score;
                score = 0;
                gamePiece = null;
                eat = null;
                document.getElementById("score").innerHTML = score.toString();
                document.getElementById("highscore").innerHTML = "Hi: "+highscore.toString();
                //gameArea.paused = false;
                //clearInterval(gameArea.interval);
                //gameArea.interval = setInterval(updateArea, REFRESH_RATE);
                startGame();
            }
        }
    //}
});

