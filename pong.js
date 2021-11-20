(function(){
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }
    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){
            this.context.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            for(let i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.context, el);
            };
        },
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.checkCollisions();
                this.board.ball.move();
            }
        },
        checkCollisions: function(){
            for(var i=this.board.bars.length - 1; i>=0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        }
    }

    function hit(a, b){
        var hit = false;
        if(b.x + b.width >= a.x && b.y < a.x +a.width){
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        else if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        else if(a.x <= b.y && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }
        return hit;
    }

    function draw(context, element){
        switch(element.kind){
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(element.x, element.y, element.radius, 0, 7);
                context.fill();
                context.closePath();
                break;
        }
    }
})();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 3;
        this.speed_x = 3;
        this.speed_y = 0;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI/12;
        this.board = board;
        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function(){
            this.x += this.speed_x * this.direction;
            this.y += this.speed_y;
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){
            var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;
            var normalized_intersect_y = (relative_intersect_y) / (bar.height/2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        }
    }
})();

(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: " + this.x + " y: " + this.y ;
        }
    }
})();

var board = new Board(800, 400);
var bar  = new Bar(20, 100, 40, 100, board);
var bar2  = new Bar(750, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(400, 200, 10, board);
boardView.draw();

window.requestAnimationFrame(controller);
document.addEventListener("keydown", function(ev){
    if(ev.keyCode == 87){
        ev.preventDefault();
        bar.up();
    }
    if(ev.keyCode == 38){
        ev.preventDefault();
        bar2.up();
    }
    if(ev.keyCode == 40){
        ev.preventDefault();
        bar2.down();
    }
    else if(ev.keyCode == 83){
        ev.preventDefault();
        bar.down();
    }
    else if(ev.keyCode == 32){
        ev.preventDefault();
        board.playing = !board.playing;
    }
})

function controller(){
    boardView.play();
    window.requestAnimationFrame(controller);
}