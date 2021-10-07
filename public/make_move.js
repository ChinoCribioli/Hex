// function Queue() {

//     this.dataStore = Array.prototype.slice.call(arguments, 0);
//     this.enqueue = enqueue;
//     this.dequeue = dequeue;
//     this.empty = empty;
//     this.isEmpty = isEmpty;
//     this.front = front;
    
//     function enqueue(element) {
//         this.dataStore.push(element);
//     }

//     function dequeue() {
//         return this.dataStore.shift();
//     }

//     function empty() {
//         return this.dataStore = [];
//     }

//     function isEmpty() {
//         return this.dataStore == [];
//     }

//     function front() {
//         return this.dataStore[0];
//     }
// }

var adj = [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1]];
var N = 5;
var steps_forward = 3;
var board = new Array(N).fill(new Array(N).fill('0'));

function is_on_board(a,b){
	if(0 > a || 0 > b || a >= N || b >= N) return false;
	return true;
}

function won_player(player){ //player == True if I want to know if my rival won
    var q = new Array(0);
    var been_there = new Array(N).fill(new Array(N).fill(false));
    if(player){
        for(var i = 0 ; i < N ; i++){
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
    while(q.length != 0){
        var i = q[0][0], j = q[0][1];
        q.shift();
        for(var d = 0 ; d < 6 ; d++){
			var a = adj[d][0], b = adj[d][1];
            if(player){
                if(is_on_board(i+a,j+b) && (board[i+a][j+b] == 'R') && (! been_there[i+a][j+b])){
                    if(a+i == N-1) return true;
                    been_there[i+a][j+b] = true;
                    q.push([i+a,j+b]);
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
    var distance = new Array(N).fill(new Array(N).fill(N*N+2));
    var q = new Array(N*N).fill([]);
    
    for(var i = 0 ; i < N ; i++){
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
    //console.log(q[21].length);
    for(var k = 0 ; k < N*N ; k++){
        while(q[k].length != 0){
            p = q[k][0];
            //console.log(q[k]);
            var i = p[0], j = p[1];
            (q[k]).shift();
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
    return N*N+2;
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
        console.log(line + "\n");
    }
    console.log("\u001b[0m---------------\n");
    return;
}

function rate_move(x,y,step){
	var I_play = (step+1)%2;
    board[x][y] = (I_play ? 'B' : 'R');
    var answer = 0;
    if(step == steps_forward){
        answer = take_distance(false) - take_distance(true);
        board[x][y] = '0';
        return answer;
    }
    if(I_play){ //Then it means that my rival has the next, which will have the smaller rate possible
        answer = 2*N*N;
        for(var i = 0 ; i < N ; i++)for(var j = 0 ; j < N ; j++){
			if(board[i][j] == '0'){
                var rate = rate_move(i,j,step+1);
                if(answer > rate){
                    answer = rate;
                    if(answer == -(N*N+2)){
                        board[x][y] = '0';
                        return answer;
                    }
                }
			}
		}
        board[x][y] = '0';
        return answer;
    }
    //Now, if my rival is playing
    answer = -2*N*N;
    for(var i = 0 ; i < N ; i++)for(var j = 0 ; j < N ; j++){
        if(board[i][j] == '0'){
            var rate = rate_move(i,j,step+1);
            if(answer < rate){
                answer = rate;
                if(answer == N*N+2){
                    board[x][y] = '0';
                    return answer;
				}
			}
		}
	}
    board[x][y] = '0';
    return answer;
}

function parse_moves(history){
	if(history[0]=='s') history.erase(history.begin());
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
    var moves = parse_moves(history);
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
    if(won_player(true)){
        return "l\n";
    }
    var answer = "";
    var maximum_rate = -N*N*2;
    var move = new Array(2);
    for(var i = 0 ; i < N ; i++){
        if(maximum_rate == N*N+2) break;
        for(var j = 0 ; j < N ; j++){
            if(board[i][j] == '0'){
                var rate = rate_move(i,j,0);
                if(maximum_rate < rate){
                    maximum_rate = rate;
                    answer = "x" + String(i) + "y" + String(j);
                    move[0] = i;
                    move[1] = j;
                }
                if(maximum_rate == N*N+2) break;
			}
		}
    }
    //console.log(move);
    board[move[0]][move[1]] = 'B';
    //print_pretty();
    if(won_player(false)){
        return answer+"w\n";
    }
    else{
        return answer + "\n";
    }
}