var turn = true;
var moves = "";

function loadScript(url){
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  head.appendChild(script);
}

loadScript("make_move.js");

function color(s){//color the asked square, and call the make_move function
  if(moves.length == 0) document.getElementById('start').remove();
  if(document.getElementById(s).className != "WhiteButton") return;
  if(turn){
    turn = false;//I use this to stop the requests until the machine desided its move
  } else return;
  moves += s;
  document.getElementById(s).className = "RedButton";

  //This is for when you want to run javascript code
  
  // var response = make_move(moves).slice(0,-1);//I want to remove the last character because it's a line break
  // moves += response;
  // console.log(moves);
  // var last_char = response[response.length-1];
  // if(last_char == 'l'){//The 'l' response means that the machine lost
  //   document.getElementById('result').innerHTML = "Congratulations, you won!";
  //   return;
  // }
  // if(last_char == 'w'){//The 'w' at the end means that the machine won
  //   response = response.slice(0,-1);
  //   document.getElementById(response).className = "BlueButton";
  //   document.getElementById('result').innerHTML = "Haha, you lost!";
  //   return;
  // }
  // document.getElementById(response).className = "BlueButton";
  // turn = true;

  //This is for when you want to run c++ or python code

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function() {
    var response = this.responseText.slice(0,-1);//I want to remove the last character because it's a line break
    moves += response;
    console.log(moves);
    var last_char = response[response.length-1];
    if(last_char == 'l'){
      document.getElementById('content').innerHTML += "</br>Congratulations, you won!";
      return;
    }
    if(last_char == 'w'){
      response = response.slice(0,-1);
      document.getElementById(response).className = "BlueButton";
      document.getElementById('content').innerHTML += "</br>Haha, you lost!";
      return;
    }
    document.getElementById(response).className = "BlueButton";
    turn = true;
  });
  oReq.open("GET","http://localhost:3000/algo/" + moves);
  oReq.send();

}

function CreateButton(x,y){
  var ret = "<button class='WhiteButton' id='x";
  ret += String(x) + "y" + String(y) + "' onclick='color(\"x";
  ret += String(x) + "y" + String(y) + "\")' ></button>\n";
  return ret;
}

function gen(n){//I generate the board in the page
  var answer = "</br>";
  for(var counter=0;counter<3*(n-1);counter++) answer += "&nbsp;";
  answer += "<button class='RedBorder'></button></br>";
  //answer += "<button class='BlueBorder'></button>";
  for(var i=0;i<n;i++){
    for(var counter=0;counter<3*(n-1-i);counter++)answer += "&nbsp;";
    for(var j=0;j<n;j++){
      answer += CreateButton(i,j);
    }
    for(var counter=0;counter<3*(i);counter++)answer += "&nbsp;";
    answer += "<br/>";
  }
  answer += "<button class='RedBorder'></button>";
  for(var counter=0;counter<3*(n-1)+1;counter++)answer += "&nbsp;";
  answer += "</br>";
  document.getElementById('content').innerHTML = answer;
  document.getElementById('content').innerHTML += "</br> <button id='start' onclick=you_start()>Play second.</button>";
  document.getElementById('content').innerHTML += "<div id='result'></div>";
  var red_borders = document.getElementsByClassName("RedBorder");//esto hay que mirarlo
  for(var i=0; i<red_borders.length; i++){
    red_borders[i].style.padding = "10px " + String(62+13*(n-5)) + "px";
  }
}

function you_start(){//this is like the "color" function above but only for the case where the machine starts the game
  document.getElementById('start').remove();
  turn = false;
  moves += 's';//the 's' char at the beginning of 'moves' means that the machine stated
  
  var response = make_move(moves).slice(0,-1);//I want to remove the last character because it's a line break
  moves += response;
  console.log(moves);
  document.getElementById(response).className = "BlueButton";
  turn = true;

  //And the same here: this is if you want to run c++ or python code

  // var oReq = new XMLHttpRequest();
  // oReq.addEventListener("load", function() {
  //   var response = this.responseText.slice(0,-1);//I want to remove the last character because it's a line break
  //   moves += response;
  //   console.log(moves);
  //   document.getElementById(response).className = "BlueButton";
  //   turn = true;
  // });
  // oReq.open("GET","http://localhost:3000/algo/" + moves);
  // oReq.send();
}

gen(5);