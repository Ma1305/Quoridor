function draw_board(this_player_pos, opponent_pos, fences){

}

class Board{

    constructor(this_player, opponent_player, fences, board, ctx){
        this.this_player = this_player;
        this.opponent_player = opponent_player;
        this.fences = fences;
        this.board = board;
        this.ctx = ctx;
        this.board_shape = new Square(ctx, 0, 0, 630, 630, rgbToColor(0, 0, 0));
        this.board_shapes = [];
        this.tiles_height = 50;
        this.between_tiles = this.tiles_height*0.20;
        this.player_shape = new Circle(this.ctx, 0, 0, 20, rgbToColor([190, 180, 170]));
        this.opponent_shape = new Circle(this.ctx, 0, 0, 20, rgbToColor([190, 180, 170]));
        this.option_player_pos = 0;
        this.option_player_shape = new Circle(this.ctx, 0, 0, 20, rgbToColor([0, 255, 0]));
        this.draw_option_player = false;
        this.option_fence_pos = [];
        this.option_fence_shape = new Square(ctx, 0, 0, 0, 0, [0, 255, 0]);
        this.draw_option_fence = false;
    }

    create_board_shapes(){
        var normal_color = [170, 125, 100];
        var wall_color = [0, 0, 0];
        var active_color = normal_color;
        for (let line = 0; line < 17; line++){
            if (line%2 == 0 || line == 0){
                for (let i = 0; i < 17; i++){
                    if (this.board[line*17+i+1] == 1){
                        active_color = wall_color;
                    }
                    else{
                        active_color = normal_color;
                    }
                    if (i%2 == 0 || i == 0){
                        this.board_shapes.push(new Square(this.ctx, Math.floor(i/2)*this.between_tiles+Math.ceil(i/2)*this.tiles_height, Math.floor(line/2)*this.between_tiles+Math.ceil(line/2)*this.tiles_height, this.tiles_height, this.tiles_height, rgbToColor([70, 30, 20])));
                    }
                    else{
                        this.board_shapes.push(new Square(this.ctx, Math.floor(i/2)*this.between_tiles+Math.ceil(i/2)*this.tiles_height, Math.floor(line/2)*this.between_tiles+Math.ceil(line/2)*this.tiles_height, this.between_tiles, this.tiles_height, rgbToColor(active_color)));
                    }
                }
            }
            else{
                for (let i = 0; i < 17; i++){
                    if (this.board[line*17+i+1] == 1){
                        active_color = wall_color;
                    }
                    else{
                        active_color = normal_color;
                    }
                    if (i%2 == 0 || i == 0){
                        this.board_shapes.push(new Square(this.ctx, Math.floor(i/2)*this.between_tiles+Math.ceil(i/2)*this.tiles_height, Math.floor(line/2)*this.between_tiles+Math.ceil(line/2)*this.tiles_height, this.tiles_height, this.between_tiles, rgbToColor(active_color)));
                    }
                    else{
                        this.board_shapes.push(new Square(this.ctx, Math.floor(i/2)*this.between_tiles+Math.ceil(i/2)*this.tiles_height, Math.floor(line/2)*this.between_tiles+Math.ceil(line/2)*this.tiles_height, this.between_tiles, this.between_tiles, rgbToColor(active_color)));
                    }
                }
            }
        }
    }

    draw_board(){
        for (let i=0; i < this.board_shapes.length; i++){
            if (this.board[i] == 1){
                this.board_shapes[i].color = rgbToColor([0,0,0]);
            }
            this.board_shapes[i].draw();
        }
        this.player_shape.y = Math.floor((Math.floor((this.this_player.position-1)/17))/2)*this.between_tiles+Math.ceil((Math.floor((this.this_player.position-1)/17))/2)*this.tiles_height + this.tiles_height/2;
        this.player_shape.x = Math.floor(((this.this_player.position-1)%17)/2)*this.between_tiles+Math.ceil(((this.this_player.position-1)%17)/2)*this.tiles_height + this.tiles_height/2;
        this.opponent_shape.y = Math.floor((Math.floor((this.opponent_player.position-1)/17))/2)*this.between_tiles+Math.ceil((Math.floor((this.opponent_player.position-1)/17))/2)*this.tiles_height + this.tiles_height/2;
        this.opponent_shape.x = Math.floor(((this.opponent_player.position-1)%17)/2)*this.between_tiles+Math.ceil(((this.opponent_player.position-1)%17)/2)*this.tiles_height + this.tiles_height/2;
        this.opponent_shape.draw();
        this.player_shape.draw();
        if (this.draw_option_player){
            this.option_player_shape.y = Math.floor((Math.floor((this.option_player_pos-1)/17))/2)*this.between_tiles+Math.ceil((Math.floor((this.option_player_pos-1)/17))/2)*this.tiles_height + this.tiles_height/2;
            this.option_player_shape.x = Math.floor(((this.option_player_pos-1)%17)/2)*this.between_tiles+Math.ceil(((this.option_player_pos-1)%17)/2)*this.tiles_height + this.tiles_height/2;
            this.option_player_shape.draw();
            this.draw_option_player = false;
        }
        if (this.draw_option_fence){
            if (is_consecutive(this.option_fence_pos, 1)){
                this.option_fence_shape.w = this.tiles_height*2 + this.between_tiles;
                this.option_fence_shape.h = this.between_tiles;
            }
            else if(is_consecutive(this.option_fence_pos, 17)){
                this.option_fence_shape.h = this.tiles_height*2 + this.between_tiles;
                this.option_fence_shape.w = this.between_tiles;
            }

            this.option_fence_shape.x = Math.floor(((Math.min(...this.option_fence_pos)-1)%17)/2)*this.between_tiles+Math.ceil(((Math.min(...this.option_fence_pos)-1)%17)/2)*this.tiles_height;
            this.option_fence_shape.y = Math.floor((Math.floor((Math.min(...this.option_fence_pos)-1)/17))/2)*this.between_tiles+Math.ceil((Math.floor((Math.min(...this.option_fence_pos)-1)/17))/2)*this.tiles_height;

            this.option_fence_shape.draw();
            this.draw_option_fence = false;
        }
    }
}
 
class Player{
    constructor(nickname, position, direction, board){
        this.nickname = nickname;
        this.position = position;
        this.direction = direction;
        this.board = board;
    }
    move(movement_type, movement){
        if (!this.check_movement){
            return false;
        }
        // moving the piece
        if (movement_type == "piece move"){
            if (movement == "forward")
                {this.position += this.direction*34}
            else if (movement == "backward")
                {this.position += -1*this.direction*34}
            else if (movement == "right")
                {this.position += this.direction*2}
            else if (movement == "left")
                {this.position -= this.direction*2}
            else if (movement == "jump forward")
                {this.position += this.direction*68}
            else if (movement == "jump backward")
                {this.position -= this.direction*68}
            else if (movement == "jump right")
                {this.position += this.direction*4}
            else if (movement == "jump left")
                {this.position -= this.direction*4}
            else if (movement == "right top diagonal")
                {this.position += this.direction*36}
            else if (movement == "left top diagonal")
                {this.position += this.direction*32}
            else if (movement == "left down diagonal")
                {this.position -= this.direction*36}
            else if (movement == "right down diagonal")
                {this.position -= this.direction*32}
            return true;
        }
        
        // placing fence
        else if (movement_type == "fence placement"){
            for (let i=0; i < movement.length; i++){
                var pos = movement[i];
                this.board.board[pos-1] = 1;
            }
            var opponent = this.board.opponent_player;
            if (!is_path(this.position, this.board.board, [], this.direction) && !is_path(opponent.position, this.board.board, [], opponent.direction)){
                for (let i=0; i < movement.length; i++){
                    var pos = movement[i];
                    this.board.board[pos-1] = 0;
                }
                return false;
            }
            else{
                return true;
            }
        }
    }
    
    check_movement(movement_type, movement){
        var opponent = this.board.opponent_player;
        if (movement_type == "piece move"){
            if (this.position % 17 != 0 && movement == "right" && this.direction == 1 && this.board.board[this.position+this.direction - 1] == 0 && opponent.position != this.position + this.direction*2)
                {return true;}
            else if (this.position % 17 != 0 && movement == "left" && this.direction == -1 && this.board.board[this.position-this.direction - 1] == 0 && opponent.position != this.position - this.direction*2)
                {return true;}
            else if (this.position % 17 != 1 && movement == "left" && this.direction == 1 && this.board.board[this.position-this.direction - 1] == 0 && opponent.position != this.position - this.direction*2)
                {return true;}
            else if (this.position % 17 != 1 && movement == "right" && this.direction == -1 && this.board.board[this.position+this.direction - 1] == 0 && opponent.position != this.position + this.direction*2)
                {return true;}
            else if (movement == "forward" && this.board.board[this.position+(this.direction*17)-1] == 0 && opponent.position != this.position + this.direction*34)
                {return true;}
            else if (movement == "backward" && this.board.board[this.position-(this.direction*17) - 1] == 0 && opponent.position != this.position - this.direction*34)
                {return true;}
            // jumping
            else if (movement == "jump forward" && opponent.position == this.position + this.direction*34 && this.board.board[this.position + this.direction*51 - 1] == 0 && this.board.board[this.position + this.direction*17 - 1] == 0)
                {return true;}
            else if (movement == "jump backward" && opponent.position == this.position - this.direction*34 && this.board.board[this.position - this.direction*51 - 1] == 0 && this.board.board[this.position - this.direction*17 - 1] == 0)
                {return true;}
            else if (movement == "jump right" && opponent.position == this.position + this.direction*2 && this.board.board[this.position + this.direction*3 - 1] == 0 && this.board.board[this.position + this.direction - 1] == 0)
                {return true;}
            else if (movement == "jump left" && opponent.position == this.position - this.direction*2 && this.board.board[this.position - this.direction*3 - 1] == 0 && this.board.board[this.position - this.direction - 1] == 0)
                {return true;}
            // diagonal
            else if (movement == "right top diagonal" && ((this.position + this.direction*2 == opponent.position && this.board.board[this.position + this.direction*2 + this.direction*17 - 1] == 0 && this.board.board[this.position + this.direction - 1] == 0) || (this.position + this.direction*34 == opponent.position && this.board.board[this.position + this.direction*34 + this.direction - 1] == 0 && this.board.board[this.position + this.direction*17 - 1] == 0)))
                {return true;}
            else if (movement == "left top diagonal" && ((this.position - this.direction*2 == opponent.position && this.board.board[this.position - this.direction*2 + this.direction*17 - 1] == 0 && this.board.board[this.position - this.direction - 1] == 0) || (this.position + this.direction*34 == opponent.position && this.board.board[this.position + this.direction*34 - this.direction - 1] == 0 && this.board.board[this.position + this.direction*17 - 1] == 0)))
                {return true;}
            else if (movement == "right down diagonal" && ((this.position + this.direction*2 == opponent.position && this.board.board[this.position + this.direction*2 - this.direction*17 - 1] == 0 && this.board.board[this.position + this.direction - 1] == 0) || (this.position - this.direction*34 == opponent.position && this.board.board[this.position - this.direction*34 + this.direction - 1] == 0 && this.board.board[this.position - this.direction*17 - 1] == 0)))
                {return true;}
            else if (movement == "left down diagonal" && ((this.position - this.direction*2 == opponent.position && this.board.board[this.position - this.direction*2 - this.direction*17 - 1] == 0 && this.board.board[this.position - this.direction - 1] == 0) || (this.position - this.direction*34 == opponent.position && this.board.board[this.position - this.direction*34 - this.direction - 1] == 0 && this.board.board[this.position - this.direction*17 - 1] == 0)))
                {return true;}
            else
                {return false;}
        }
        else if(movement_type == "fence placement"){
            var wrong = false;
            var corners = 0;
            movement.sort();
            for (let i=0; i < movement.length; i++){
                var position = movement[i];
                if ((((position-1) % 17)+1)%2 == 1 && Math.ceil(position/17)%2 == 1){
                    wrong = true;
                }
                else if ((((position-1) % 17)+1)%2 == 0 && Math.ceil(position/17)%2 == 0){
                    corners += 1;
                }
                if (this.board.board[position-1] == 1){
                    wrong = true;
                }
            }
            if ((!is_consecutive(movement, 1)) && (!is_consecutive(movement, 17))){
                wrong = true;
            }
            else if (corners > 1){
                wrong = true;
            }
            if (wrong){
                return false;
            }
            else{
                return true;
            }
        }
        
    }
}

class Fence{
    constructor(player, positions){
        this.player = player;
        this.positions = positions;
    }
}

function is_consecutive(numbers, steps){
    numbers.sort(function(a, b){return a - b});
    var start_num = numbers[0];
    var counter = 0;
    for(let i=start_num; counter < numbers.length; i+=steps){
        if (numbers[counter]!=i){
            return false;
        }
        counter += 1;
    }
    return true;
}

function is_path(position, board, pre_position, direction){
    if (direction == -1){
        pre_position.push(position);
        var availables = [];
        if ((position-17) < 0){
            return true;
        }
        else if (position+17 > 17*17){
            availables.push(position-17);
        }
        else{
            availables.push(position-17);
            availables.push(position+17);
        }
        if (position%17 == 0){
            availables.push(position-1);
        }
        else if (position%17 == 1){
            availables.push(position+1);
        }
        else{
            availables.push(position+1);
            availables.push(position-1);
        }
        
        for (let i=0; i < availables.length; i++){
            var pos = availables[i];
            if (pre_position.indexOf((pos + (pos - position))) == -1){
                if (board[pos-1] == 0){
                    if (board[(pos+(pos-position))-1] < 0){
                        return true;
                    }
                    else{
                        if (is_path((pos + (pos - position)), board, pre_position, direction)){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    else if (direction == 1){
        pre_position.push(position);
        var availables = [];
        if ((position-17) < 0){
            availables.push(position+17);
        }
        else if (position+17 > 17*17){
            return true;
        }
        else{
            availables.push(position-17);
            availables.push(position+17);
        }
        if (position%17 == 0){
            availables.push(position-1);
        }
        else if (position%17 == 1){
            availables.push(position+1);
        }
        else{
            availables.push(position+1);
            availables.push(position-1);
        }
        
        for (let i=0; i < availables.length; i++){
            var pos = availables[i];
            if (pre_position.indexOf((pos + (pos - position))) == -1){
                if (board[pos-1] == 0){
                    if (board[(pos+(pos-position))-1] > 17*17){
                        return true;
                    }
                    else{
                        if (is_path((pos + (pos - position)), board, pre_position, direction)){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}