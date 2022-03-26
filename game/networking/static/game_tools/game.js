var socket = io();

window.tile_height = 50;
window.screen_width = 9*tile_height+8*tile_height*0.2;
window.screen_height = 9*tile_height+8*tile_height*0.2;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.screen_width;
canvas.height = window.screen_height;


window.client_code = 0;
window.this_player = new Player("", 0, 1, null);
window.this_opponent = new Player("", 0, -1, null);
window.fences = [];

window.fence_mode = false;
window.horizontal = true;
window.turn = false;

window.winner = null;
window.game_status = "starting ig"


// clearing the screen
function clear(){
    // clear screen 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// NETWORKING

// sending messages
function send(entery){
    socket.send(JSON.stringify(entery));
}

// on server commands
socket.on('message', function(msg) {
    var msg = JSON.parse(msg);
    console.log(msg);
    if (msg["command"] == "setup"){
        // storing the information from server's message
        window.client_code = msg["client code"];
        window.this_player.direction = msg["direction"];
        if (window.this_player.direction == 1){
            // setting up this player's position
            window.this_player.position = 9;

            // setting up the opponent's position and direction
            window.this_opponent.position = 281;
            window.this_opponent.direction = -1;
        }
        else if (window.this_player.direction == -1){
            // setting up this player's position 
            window.this_player.position = 281;

            // setting up the opponent's position and direction
            window.this_opponent.position = 9;
            window.this_opponent.direction = 1;
        }

        window.board = new Board(window.this_player, window.this_opponent, window.fences, [], ctx);
        window.this_player.board = window.board;
        window.this_opponent.board = window.board;
        window.board.board = msg["board"];
        window.board.create_board_shapes();
        
        window.board.draw_board();

        document.getElementById("game_status").innerHTML = "STATUS: Waiting for the opponent impatiently :\\";

        // sending the needed information to the server
        send({"command":"setup reply", "nickname": nickname});
    }
    else if (msg["command"] == "begin game"){
        // setting up the opponent's nickname
        if (msg["players nickname"][0] == window.this_player.nickname){
            window.this_opponent.nickname = msg["players nickname"][1];
        }
        else {
            window.this_opponent.nickname = msg["players nickname"][0];
        }
        document.getElementById("game_status").innerHTML = "STATUS: Playing";
    }
    else if (msg["command"] == "turn to move"){
        // setting the turn
        if (msg["turn"] == window.client_code){
            window.turn = true;
            document.getElementById("turn").innerHTML = "TURN: You";
        }
        else{
            window.turn = false;
            document.getElementById("turn").innerHTML = "TURN: Opponent";
        }
    }
    else if (msg["command"] == "moved"){
        // moving this player
        if (msg["player_code"] == window.client_code){
            window.this_player.move(msg["movement"]["type"], msg["movement"]["movement"]);
            if (msg["movement"]["type"] == "fence placement"){
                document.getElementById("fences_left").innerHTML = "FENCES LEFT: "+window.this_player.fences;
            }
        }
        // moving the opponent
        else{
            window.this_opponent.move(msg["movement"]["type"], msg["movement"]["movement"]);
        }
        window.board.draw_board();
    }
    else if (msg["command"] == "invalid reply"){
        window.turn = true;
        console.log(msg["problem"]);
        if (msg["problem"] == "invalid movement"){
            window.turn = true;
        }
    }
    else if (msg["command"] == "winner"){
        window.turn = false;
        if (msg["winner"] == window.client_code){
            window.winner = window.this_player;
            document.getElementById("game_status").innerHTML = "STATUS: You won :)";
            window.game_status = "over";
        }
        else {
            window.winner = window.this_opponent;
            document.getElementById("game_status").innerHTML = "STATUS: You lost :(";
            window.game_status = "over";
        }
    }

});


// Event listeners
canvas.addEventListener("mousemove", function(e) {
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var x = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
    var y = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make
    if (window.turn){
        var x_position = Math.ceil(x/(window.tile_height+window.tile_height*0.2));
        var y_position = Math.ceil(y/(window.tile_height+window.tile_height*0.2));
        var position = x_position+x_position-1+17*(y_position+y_position-2);
        if (window.fence_mode){
            var poses = [];
            if (position%17 == 0 && position/17 > 16){
                if (window.horizontal){
                    poses.push(position-19);                
                    poses.push(position-18);
                    poses.push(position-17);
                }
                else{
                    poses.push(position-1);
                    poses.push(position-18);
                    poses.push(position-35);
                }
            }
            else if (position%17 == 0){  
                if (window.horizontal){
                    poses.push(position+15);                
                    poses.push(position+16);
                    poses.push(position+17);
                }
                else{
                    poses.push(position-1);
                    poses.push(position+16);
                    poses.push(position+33);
                }
                
            }
            else if (position/17 > 16){
                if (window.horizontal){
                    poses.push(position-17);
                    poses.push(position-16);
                    poses.push(position-15);
                }
                else{
                    poses.push(position-33);
                    poses.push(position-16);
                    poses.push(position+1);
                }
            }
            else{
                if (window.horizontal){
                    poses.push(position+17);
                    poses.push(position+18);
                    poses.push(position+19);
                }
                else{
                    poses.push(position+1);
                    poses.push(position+18);
                    poses.push(position+35);
                }
            }
            if (window.board.option_fence_pos != poses){
                window.board.draw_option_fence = true;
                var color = [255, 0, 0];
                if (window.this_player.check_movement("fence placement", poses)){
                    color = [0, 255, 0];
                }
                window.board.option_fence_pos = poses;
                window.board.option_fence_shape.color = rgbToColor(color);
                window.board.draw_board();
            }
        }
        else if (window.board.option_player_pos != position && !window.fence_mode){
            window.board.draw_option_player = true;
            window.board.option_player_pos = position;
            var movement = "";
            var color = [0, 255, 0];
            if (position == window.this_player.position + window.this_player.direction*34){
                movement = "forward";
            }
            else if (position == window.this_player.position - window.this_player.direction*34){
                movement = "backward";
            }
            else if (position == window.this_player.position + window.this_player.direction*2){
                movement = "right";
            }
            else if (position == window.this_player.position - window.this_player.direction*2){
                movement = "left";
            }
            else if (position == window.this_player.position + window.this_player.direction*68){
                movement = "jump forward";
            }
            else if (position == window.this_player.position - window.this_player.direction*68){
                movement = "jump backward";
            }
            else if (position == window.this_player.position + window.this_player.direction*4){
                movement = "jump right";
            }
            else if (position == window.this_player.position - window.this_player.direction*4){
                movement = "jump left";
            }
            else if (position == window.this_player.position + window.this_player.direction*36){
                movement = "right top diagonal";
            }
            else if (position == window.this_player.position + window.this_player.direction*32){
                movement = "left top diagonal";
            }
            else if (position == window.this_player.position - window.this_player.direction*36){
                movement = "left down diagonal";
            }
            else if (position == window.this_player.position - window.this_player.direction*32){
                movement = "right down diagonal";
            }
            else {
                color = [255, 0, 0];
            }
            // console.log(window.this_player.position + window.this_player.direction*35);
            // console.log(position);
            // console.log(movement);
            if (!window.this_player.check_movement("piece move", movement)){
                color = [255, 0, 0];
            }
            window.board.option_player_shape.color = rgbToColor(color);
            window.board.draw_board();
        }
        // console.log(position);
    }
});

canvas.addEventListener("mouseup", function(e){
    var cRect = canvas.getBoundingClientRect();        
    var x = Math.round(e.clientX - cRect.left);  
    var y = Math.round(e.clientY - cRect.top);   
    if (window.turn){
        var x_position = Math.ceil(x/(window.tile_height+window.tile_height*0.2));
        var y_position = Math.ceil(y/(window.tile_height+window.tile_height*0.2));
        var position = x_position+x_position-1+17*(y_position+y_position-2);
        if (window.fence_mode){
            var poses = [];
            if (position%17 == 0 && position/17 > 16){
                if (window.horizontal){
                    poses.push(position-19);                
                    poses.push(position-18);
                    poses.push(position-17);
                }
                else{
                    poses.push(position-1);
                    poses.push(position-18);
                    poses.push(position-35);
                }
            }
            else if (position%17 == 0){  
                if (window.horizontal){
                    poses.push(position+15);                
                    poses.push(position+16);
                    poses.push(position+17);
                }
                else{
                    poses.push(position-1);
                    poses.push(position+16);
                    poses.push(position+33);
                }
                
            }
            else if (position/17 > 16){
                if (window.horizontal){
                    poses.push(position-17);
                    poses.push(position-16);
                    poses.push(position-15);
                }
                else{
                    poses.push(position-33);
                    poses.push(position-16);
                    poses.push(position+1);
                }
            }
            else{
                if (window.horizontal){
                    poses.push(position+17);
                    poses.push(position+18);
                    poses.push(position+19);
                }
                else{
                    poses.push(position+1);
                    poses.push(position+18);
                    poses.push(position+35);
                }
            }
            if (window.this_player.check_movement("fence placement", poses)){
                window.turn = false;
                send({"command": "moved", "movement":{"type": "fence placement", "movement": poses}});
                window.turn = false;
            }
            
        }
        else if (!window.fence_mode){
            var movement = "";
            if (position == window.this_player.position + window.this_player.direction*34){
                movement = "forward";
            }
            else if (position == window.this_player.position - window.this_player.direction*34){
                movement = "backward";
            }
            else if (position == window.this_player.position + window.this_player.direction*2){
                movement = "right";
            }
            else if (position == window.this_player.position - window.this_player.direction*2){
                movement = "left";
            }
            else if (position == window.this_player.position + window.this_player.direction*68){
                movement = "jump forward";
            }
            else if (position == window.this_player.position - window.this_player.direction*68){
                movement = "jump backward";
            }
            else if (position == window.this_player.position + window.this_player.direction*4){
                movement = "jump right";
            }
            else if (position == window.this_player.position - window.this_player.direction*4){
                movement = "jump left";
            }
            else if (position == window.this_player.position + window.this_player.direction*36){
                movement = "right top diagonal";
            }
            else if (position == window.this_player.position + window.this_player.direction*32){
                movement = "left top diagonal";
            }
            else if (position == window.this_player.position - window.this_player.direction*36){
                movement = "left down diagonal";
            }
            else if (position == window.this_player.position - window.this_player.direction*32){
                movement = "right down diagonal";
            }
            if (window.this_player.check_movement("piece move", movement)){
                window.turn = false;
                send({"command":"moved", "movement": {"type": "piece move", "movement": movement}});
            }
        }
        // console.log(position);
    }
})

document.addEventListener("keydown", function(e){
    // console.log(e.keyCode);
    if (e.keyCode == 70){
        window.fence_mode = !window.fence_mode;
        if (window.fence_mode){
            document.getElementById("fence_mode").innerHTML = "FENCE MODE: ON";
        }
        else{
            document.getElementById("fence_mode").innerHTML = "FENCE MODE: OFF";
        }
    }
    else if (e.keyCode == 72){
        window.horizontal = !horizontal;
    }
});


