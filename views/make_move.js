var adj = [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1]];//the possible directions of the adjacent tiles
var N = 5;//the size of the board
var steps_forward = 3;
var board = new Array(N);
for(var i = 0 ; i < N ; i++){
    board[i] = [];
    for(var j = 0 ; j < N ; j++) board[i].push('0');
}

function is_on_board(a,b){
	if(0 > a || 0 > b || a >= N || b >= N) return false;
	return true;
}

function won_player(player){ //player == True if I want to know if my rival won
    var q = [];//I'm going to store the tiles I can reach from the border
    var been_there = new Array(N);
    for(var i = 0 ; i < N ; i++){
        been_there[i] = [];
        for(var j = 0 ; j < N ; j++) been_there[i].push(false);
    }
    if(player){
        for(var i = 0 ; i < N ; i++){//I start from the border, and push all the useful tiles to the queue
            if(board[0][i] == 'R'){ 
                q.push([0,i]);
                been_there[0][i] = true;
            }
        }
    }
    else{
        for(var i = 0 ; i < N ; i++){
            if(board[i][0] == 'B'){ 
                q.push([i,0]);
                been_there[i][0] = true;
            }
        }
    }
    while(q.length != 0){//If I can reach a tile, I must look at its adjacents
        var i = q[0][0], j = q[0][1];//I'm in tile (i,j) right now
        q.shift();
        for(var d = 0 ; d < 6 ; d++){
			var a = adj[d][0], b = adj[d][1];//Move to tile (i+a,j+b)
            if(player){
                if(is_on_board(i+a,j+b) && (board[i+a][j+b] == 'R') && (! been_there[i+a][j+b])){
                    if(a+i == N-1) return true;//If I reached the other border, return true
                    been_there[i+a][j+b] = true;
                    q.push([i+a,j+b]);//If I can reach it, push it to the queue
                }
            }
            else{
                if(is_on_board(i+a,j+b) && (board[i+a][j+b] == 'B') && (! been_there[i+a][j+b])){
                    if(b+j == N-1) return true;
                    been_there[i+a][j+b] = true;
                    q.push([i+a,j+b]);
                }
            }
        }             
    }
    return false;
}

function take_distance(player){ //the minimum number of tiles needed to win when playing alone
    //player == True, then I'm measuring my tiles, player == False for rival's tiles
    var distance = new Array(N);//Initialize a matrix 'distance' that tells me the distance from the initial border to that tile
    for(var i = 0 ; i < N ; i++){
        distance[i] = [];
        for(var j = 0 ; j < N ; j++) distance[i].push(N*N+2);
    }
    var q = new Array(N*N);//I'm going to store all the tiles at a distance k in q[k]. That is, q is an array of queues
    for(var i = 0 ; i < N*N ; i++) q[i] = [];
    
    for(var i = 0 ; i < N ; i++){//Start from the border and see which tiles I can reach with 0 distance and with 1 distance
        if(player){
            if(board[i][0] == 'B'){
                distance[i][0] = 0;
                q[0].push([i,0]);
            }
            else if(board[i][0] == '0'){
                distance[i][0] = 1;
                q[1].push([i,0]);
            }
        }
        else{
            if(board[0][i] == 'R'){
                distance[0][i] = 0;
                (q[0]).push([0,i]);
            }
            else if(board[0][i] == '0'){
                distance[0][i] = 1;
                q[1].push([0,i]);
            }
        }
	}
    for(var k = 0 ; k < N*N ; k++){
        while(q[k].length != 0){//If a tile is at distance k, their adjacents are either the opposite color, or are at distance at most k+1
            p = q[k][0];
            var i = p[0], j = p[1];
            q[k].shift();
            for(var d = 0 ; d < 6 ; d++){
				var a = adj[d][0], b = adj[d][1];
				if(! is_on_board(i+a,j+b)) continue;
                if(distance[i+a][j+b] <= k) continue;
                if((player && (board[i+a][j+b] == 'R')) || ((!player) && (board[i+a][j+b] == 'B'))) continue;
                if(board[i+a][j+b] == '0'){
                    if(distance[i+a][j+b] > k+1){
						distance[i+a][j+b] = k+1;
						q[k+1].push([i+a,j+b]);
					}
                }
                if(player){
                    if(board[i+a][j+b] == 'B'){
                        distance[i+a][j+b] = k;
                        q[k].push([i+a,j+b]);
                    }
                }
                else{
                    if(board[i+a][j+b] == 'R'){
                        distance[i+a][j+b] = k;
                        q[k].push([i+a,j+b]);
                    }
                }
                if(player && (j+b == N-1)){ //If it's the first tile in the opposite side, return that distance
                    return distance[i+a][j+b];
                }
                if((! player) && (i+a == N-1)){
                    return distance[i+a][j+b];
                }
			}
		}
    }
    return N*N+2;//In this case, since no tile can be at distance exactly N*N+2, we use this number as a relative infinity
    //That is, if I'm at distance N*N+2, then there's no possible path
}

function print_pretty(){
	for(var i = 0 ; i < N ; i++){
        var line = "";
        for(var j = 0 ; j < N-1-i ; j++){line += " ";}
        for(var j = 0 ; j < N ; j++){
            if(board[i][j] == 'B'){
                line += "\u001b[34mB ";//strange command that colors the character B in blue
            }
            else if(board[i][j] == 'R'){
                line += "\u001b[31mR ";
            }
            else line += "\u001b[0m0 ";
        }
        console.log(line);
    }
    console.log("\u001b[0m---------------");
    return;
}

function rate_move(x,y,step){//This is the function used to predict how good the moves are
	var I_play = (step+1)%2;
    board[x][y] = (I_play ? 'B' : 'R');//I paint the corresponding tile
    var answer = 0;
    if(step == steps_forward){//If I already made the desired number of moves, return the rating
        answer = take_distance(false) - take_distance(true);
        //The rating of a position is the number of tiles necessary for my rival to win minus the number of tiles I need to win
        //This makes sense because I want to maximize that value
        board[x][y] = '0';//Before returning, I set the board as it was before simulating the move
        return answer;
    }
    if(I_play){ //Then it means that my rival has the next, which will have the smaller rate possible
        answer = 2*N*N;
        for(var i = 0 ; i < N ; i++)for(var j = 0 ; j < N ; j++){
			if(board[i][j] == '0'){//I analyze all the possible moves
                var rate = rate_move(i,j,step+1);//Since I made a move, I advanced one step
                if(answer > rate){//I want the smaller rate
                    answer = rate;
                    if(answer == -(N*N+2)){//If I reacher a losing position (-N*N-2 is the worst I can get) I should stop searching
                        board[x][y] = '0';
                        return answer;
                    }
                }
			}
		}
        board[x][y] = '0';//Leave the board as it was before performing the move
        return answer;
    }
    //Now, if my rival is playing
    answer = -2*N*N;
    for(var i = 0 ; i < N ; i++)for(var j = 0 ; j < N ; j++){
        if(board[i][j] == '0'){
            var rate = rate_move(i,j,step+1);
            if(answer < rate){
                answer = rate;
                if(answer == N*N+2){//If I get a winning position, I don't need to keep searching
                    board[x][y] = '0';
                    return answer;
				}
			}
		}
	}
    board[x][y] = '0';
    return answer;
}

function parse_moves(history){//The moves are encoded as follows
    //If the history is x0y0x1y2x3y0, that means that the first move was painting the tile (0,0) red, then (1,2) blue and finally (3,0) red
    //If there's an 's' at the beginning, it means that blue started
	if(history[0]=='s') history = history.substring(1);
	var answer = [];
	var i = 1;
	while(i < history.length){
		var x = "";
		while(history[i] != 'y') x += history[i++];
		i++;
		var y = "";
		while(history[i] != 'x' && i < history.length) y += history[i++];
		i++;
		answer.push([x,y]);
	}
	return answer;
}

function make_move(history){
	for(var i = 0 ; i < N ; i++)for(var j = 0 ; j < N ; j++) board[i][j] = '0';
    var moves = parse_moves(history);//I recieve the history and get the moves played so far
    if(history[0] == 's'){
        for(var i = 0 ; i < moves.length ; i++){
            var x = moves[i][0];
            var y = moves[i][1];
            board[x][y] = (i%2 ? 'R' : 'B'); //I am Blue and I'm playing first
		}
    }
    else{
        for(var i = 0 ; i < moves.length ; i++){
            var x = moves[i][0];
            var y = moves[i][1];
            board[x][y] = (i%2 ? 'B' : 'R'); //I am Blue and I'm playing second
		}
    }
    if(won_player(true)){//If the machine lost, return an 'l'
        return "l\n";
    }
    var answer = "";
    var maximum_rate = -N*N*2;
    var move = [-1,-1];
    for(var i = 0 ; i < N ; i++){
        if(maximum_rate == N*N+2) break;
        for(var j = 0 ; j < N ; j++){
            if(board[i][j] == '0'){
                var rate = rate_move(i,j,0);
                if(maximum_rate < rate){//I want the best-rated move
                    maximum_rate = rate;
                    answer = "x" + String(i) + "y" + String(j);
                    move[0] = i;
                    move[1] = j;
                }
                if(maximum_rate == N*N+2) break;
			}
		}
    }
    board[move[0]][move[1]] = 'B';
    //print_pretty();
    if(won_player(false)){//If I won, return the move and a 'w'
        return answer+"w\n";
    }
    else{
        return answer + "\n";
    }
}