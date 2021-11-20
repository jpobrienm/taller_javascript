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
            var elements = this.bars;
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
        draw: function(){
            for(let i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.context, el);
            };
        }
    }

    function draw(context, element){
        if(element != null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
                    context.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
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
    }

    self.Bar.prototype = {
        down: function(){

        },
        up: function(){

        }
    }
})();

window.addEventListener("load", main);

function main(){
    var board = new Board(800, 400);
    var bar  = new Bar(20, 100, 40, 100, board);
    var canvas = document.getElementById("canvas");
    var boardView = new BoardView(canvas, board);
    boardView.draw();
}