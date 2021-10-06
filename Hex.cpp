#include <iostream>
#include <vector>
#include <queue>

using namespace std;

#define pb push_back
#define mp make_pair
#define F first
#define S second
#define forn(i,n) for(int i=0;i<(int)(n); i++)
#define forsn(i,s,n) for(int i=int(s);i<(int)(n); i++)


vector<pair<int,int>> adj = {mp(-1,0),mp(1,0),mp(0,-1),mp(0,1),mp(1,1),mp(-1,-1)};
const int N = 5;
const int steps_forward = 3;
char board[N][N];

bool is_on_board(int a, int b){
	if(0 > a || 0 > b || a >= N || b >= N) return false;
	return true;
}

bool won_player(bool player){ //player == True if I want to know if my rival won
    queue<pair<int,int>> q;
    bool been_there[N][N];
    forn(i,N)forn(j,N) been_there[i][j] = false;
    if(player){
        forn(i,N){
            if(board[0][i] == 'R'){ 
                q.push(mp(0,i));
                been_there[0][i] = true;
            }
        }
    }
    else{
        forn(i,N){
            if(board[i][0] == 'B'){ 
                q.push(mp(i,0));
                been_there[i][0] = true;
            }
        }
    }
    while(! q.empty()){
        int i = q.front().F, j = q.front().S;
        q.pop();
        for(pair<int,int> p : adj){
			int a = p.F, b = p.S;
            if(player){
                if(is_on_board(i+a,j+b) && (board[i+a][j+b] == 'R') && (! been_there[i+a][j+b])){
                    if(a+i == N-1) return true;
                    been_there[i+a][j+b] = true;
                    q.push(mp(i+a,j+b));
                }
            }
            else{
                if(is_on_board(i+a,j+b) && (board[i+a][j+b] == 'B') && (! been_there[i+a][j+b])){
                    if(b+j == N-1) return true;
                    been_there[i+a][j+b] = true;
                    q.push(mp(i+a,j+b));
                }
            }
        }             
    }
    return false;
}

int take_distance(bool player){ //the minimum number of tiles needed to win when playing alone
    //player == True, then I'm measuring my tiles, player == False for rival's tiles
    int distance[N][N];
    forn(i,N)forn(j,N) distance[i][j] = N*N+2;
    queue<pair<int,int>> t;
    vector<queue<pair<int,int>>> q(N*N);
    
    forn(i,N){
        if(player){
            if(board[i][0] == 'B'){
                distance[i][0] = 0;
                q[0].push(mp(i,0));
            }
            else if(board[i][0] == '0'){
                distance[i][0] = 1;
                q[1].push(mp(i,0));
            }
        }
        else{
            if(board[0][i] == 'R'){
                distance[0][i] = 0;
                q[0].push(mp(0,i));
            }
            else if(board[0][i] == '0'){
                distance[0][i] = 1;
                q[1].push(mp(0,i));
            }
        }
	}
    forn(k,N*N){
        while(! q[k].empty()){
            pair<int,int> p = q[k].front();
            int i = p.F, j = p.S;
            q[k].pop();
            for(pair<int,int> direction : adj){//
				int a = direction.F, b = direction.S;
				if(! is_on_board(i+a,j+b)) continue;
                if(distance[i+a][j+b] <= k) continue;
                if((player && (board[i+a][j+b] == 'R')) || ((!player) && (board[i+a][j+b] == 'B'))) continue;
                if(board[i+a][j+b] == '0'){
                    if(distance[i+a][j+b] > k+1){
						distance[i+a][j+b] = k+1;
						q[k+1].push(mp(i+a,j+b));
					}
                }
                if(player){
                    if(board[i+a][j+b] == 'B'){
                        distance[i+a][j+b] = k;
                        q[k].push(mp(i+a,j+b));
                    }
                }
                else{
                    if(board[i+a][j+b] == 'R'){
                        distance[i+a][j+b] = k;
                        q[k].push(mp(i+a,j+b));
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

//~ def print_pretty(something) :
    //~ for i in range(N) :
        //~ line = ""
        //~ line += " "*(N-1-i)
        //~ for j in range(N):
            //~ if something[i][j] == 'B' :
                //~ line += colored(something[i][j],'blue')
            //~ elif something[i][j] == 'R' :
                //~ line += colored(something[i][j],'red')
            //~ else : line += str(something[i][j])
            //~ if(j != N-1) : line += ' '
        //~ print(line)
    //~ print('---------------')
    //~ return

//~ def make_split(x) :
    //~ return x.split("y")

int rate_move(int x,int y,int step){
	bool I_play = (step+1)%2;
    board[x][y] = (I_play ? 'B' : 'R');
    int answer = 0;
    if(step == steps_forward){
        answer = take_distance(false) - take_distance(true);
        board[x][y] = '0';
        return answer;
    }
    if(I_play){ //Then it means that my rival has the next, which will have the smaller rate possible
        answer = 2*N*N;
        forn(i,N)forn(j,N){
			if(board[i][j] == '0'){
                int rate = rate_move(i,j,step+1);
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
    forn(i,N)forn(j,N){
        if(board[i][j] == '0'){
            int rate = rate_move(i,j,step+1);
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

vector<pair<int,int>> parse_moves(string history){
	if(history[0]=='s') history.erase(history.begin(),history.begin()+1);
	vector<pair<int,int>> answer(0);
	int i = 1;
	while(i < int(history.size())){
		string x = "";
		while(history[i] != 'y') x += history[i++];
		i++;
		string y = "";
		while(history[i] != 'x' && i < int(history.size())) y += history[i++];
		i++;
		answer.pb(mp(stoi(x),stoi(y)));//stoi returns the integer representation of the given string
	}
	return answer;
}

void make_move(){
	forn(i,N)forn(j,N) board[i][j] = '0';
    string history;
    cin >> history;
    vector<pair<int,int>> moves = parse_moves(history);
    if(history[0] == 's'){
        forn(i,moves.size()){
            int x = moves[i].F;
            int y = moves[i].S;
            board[x][y] = (i%2 ? 'R' : 'B'); //I am Blue and I'm playing first
		}
    }
    else{
        forn(i,moves.size()){
            int x = moves[i].F;
            int y = moves[i].S;
            board[x][y] = (i%2 ? 'B' : 'R'); //I am Blue and I'm playing second
		}
    }
    if(won_player(true)){
        cout << "l\n";
        return;
    }
    string answer = "";
    int maximum_rate = -N*N*2;
    pair<int,int> move;
    forn(i,N){
        if(maximum_rate == N*N+2) break;
        forn(j,N){
            if(board[i][j] == '0'){
                int rate = rate_move(i,j,0);
                if(maximum_rate < rate){
                    maximum_rate = rate;
                    answer = "x" + to_string(i) + "y" + to_string(j);
                    move.F = i;
                    move.S = j;
                }
                if(maximum_rate == N*N+2) break;
			}
		}
    }
    board[move.F][move.S] = 'B';
    //print_pretty(board)
    if(won_player(false)){
        cout << answer+"w\n";
    }
    else{
        cout << answer + "\n";
    }
    return;
}

int main(){
	make_move();
	return 0;
}
