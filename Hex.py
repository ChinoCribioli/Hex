from termcolor import colored
import queue
adj = [(-1,0),(1,0),(0,-1),(0,1),(1,1),(-1,-1)]
N = 8
global board
board = [[0 for j in range(N)]for i in range(N)]
global rates
rates = [[0 for j in range(N)]for i in range(N)]

def is_on_board(a,b):
    if (0 > a or 0 > b or a >= N or b >= N) : return False
    return True

def won_player(player): #player == True if I want to know if my rival won
    q = queue.Queue()
    been_there = [[False for i in range(N)] for j in range(N)]
    if player :
        for i in range(0,N) :
            if board[0][i] == 'R' : 
                q.put((0,i))
                been_there[0][i] = True
    else :
        for i in range(N) :
            if board[i][0] == 'B' : 
                q.put((i,0))
                been_there[i][0] = True
    while not q.empty():
        (i,j) = q.get()
        for (a,b) in adj:
            if player :
                if is_on_board(i+a,j+b) and board[i+a][j+b] == 'R' and (not been_there[i+a][j+b]):
                    if(a+i == N-1): return True
                    been_there[i+a][j+b] = True
                    q.put((i+a,j+b))
            else :
                if is_on_board(i+a,j+b) and board[i+a][j+b] == 'B' and (not been_there[i+a][j+b]):
                    been_there[i+a][j+b] = True
                    if(b+j == N-1): return True
                    q.put((i+a,j+b))             
    return False

def take_distance(player): #the minimum number of tiles needed to win when playing alone
    #player == True, then I'm measuring my tiles, player == False for rival's tiles
    distance = [[N+2 for i in range(N)] for j in range(N)]
    q = [ queue.Queue() for k in range(N)]
    
    for i in range(N):
        if player :
            if board[i][0] == 'B' :
                distance[i][0] = 0
                q[0].put((i,0))
            elif board[i][0] == 0 :
                distance[i][0] = 1
                q[1].put((i,0))
        else :
            if board[0][i] == 'R' :
                distance[0][i] = 0
                q[0].put((0,i))
            elif board[0][i] == 0 :
                distance[0][i] = 1
                q[1].put((0,i))

    for k in range(N):
        while not q[k].empty() :
            (i,j) = q[k].get()
            for (a,b) in adj :
                if not is_on_board(i+a,j+b) : continue
                if distance[i+a][j+b] <= k : continue
                if (player and board[i+a][j+b] == 'R') or (not player and board[i+a][j+b] == 'B') : continue
                if board[i+a][j+b] == 0 :
                    if distance[i+a][j+b] <= k+1 : continue
                    distance[i+a][j+b] = k+1
                    q[k+1].put((i+a,j+b))
                if player :
                    if board[i+a][j+b] == 'B':
                        distance[i+a][j+b] = k
                        q[k].put((i+a,j+b))
                else:
                    if board[i+a][j+b] == 'R':
                        distance[i+a][j+b] = k
                        q[k].put((i+a,j+b))
    answer = N+2
    for i in range(N) :
        if player :
            answer = min(answer,distance[i][N-1])
        else :
            answer = min(answer,distance[N-1][i])
    return answer
        

def print_pretty(something) :
    for i in range(N) :
        line = ""
        line += " "*(N-1-i)
        for j in range(N):
            if something[i][j] == 'B' :
                line += colored(something[i][j],'blue')
            elif something[i][j] == 'R' :
                line += colored(something[i][j],'red')
            else : line += str(something[i][j])
            if(j != N-1) : line += ' '
        print(line)
    print('---------------')
    return

def match(start): #returns -1 if I lost or 1 if I won.
    #I am blue, my rival is red
    if start :
        pass
        #aca si justo me toca empezar
    
    while True :
        x,y = map(int,input().split())
        x -= 1
        y -= 1
        board[x][y] = 'R'
        print_pretty(board)
        print(take_distance(False))
        if(won_player(True)):
            return -1
        #aca defino la jugada

def prueba(algo) :
    return algo+1

match(True)