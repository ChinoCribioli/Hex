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

function color(s){
  if(moves.length == 0) document.getElementById('start').remove();
  if(!document.getElementById(s).classList.contains("WhiteButton")) return;
  if(turn){
    turn = false;
  } else return;
  moves += s;
  document.getElementById(s).classList.remove("WhiteButton");
  document.getElementById(s).classList.add("RedButton");
  
  
  var response = make_move(moves).slice(0,-1);//I want to remove the last character because it's a line break
  moves += response;
  console.log(moves);
  var last_char = response[response.length-1];
  if(last_char == 'l'){
    document.getElementById('content').innerHTML += "</br>Congratulations, you won!";
    return;
  }
  if(last_char == 'w'){
    response = response.slice(0,-1);
    document.getElementById(response).classList.remove("WhiteButton");
    document.getElementById(response).classList.add("BlueButton");
    document.getElementById('content').innerHTML += "</br>Haha, you lost!";
    return;
  }
  document.getElementById(response).classList.remove("WhiteButton");
  document.getElementById(response).classList.add("BlueButton");
  turn = true;

  //This is for when you want to run c++ or python code

  // var oReq = new XMLHttpRequest();
  // oReq.addEventListener("load", function() {
  //   var response = this.responseText.slice(0,-1);//I want to remove the last character because it's a line break
  //   moves += response;
  //   console.log(moves);
  //   var last_char = response[response.length-1];
  //   if(last_char == 'l'){
  //     document.getElementById('content').innerHTML += "</br>Congratulations, you won!";
  //     return;
  //   }
  //   if(last_char == 'w'){
  //     response = response.slice(0,-1);
  //     document.getElementById(response).className = "BlueButton";
  //     document.getElementById('content').innerHTML += "</br>Haha, you lost!";
  //     return;
  //   }
  //   document.getElementById(response).className = "BlueButton";
  //   turn = true;
  // });
  // oReq.open("GET","http://localhost:3000/algo/" + moves);
  // oReq.send();

}

function CreateButton(x,y,n){
  // hexagons are 173.2px horizontal, 200px vertical.
  // chino chose x and y opposite of svg :/
  var ypx = 0    + 150   * x;
  var xpx = 86.6 + 173.2 * y + 86.6 * (n-x-1);
  var ret = `
<path d="M ${xpx} ${ypx} l 86.6 50 l 0 100 l -86.6 50 l -86.6 -50 l 0 -100 z"
      class='WhiteButton'
      id='x${x}y${y}'
      onclick='color("x${x}y${y}");'
      />`

  return ret;
}

function CreateBorders(n){
  var ret = "";
  var width = 173.2 * n;
  var height= 150   * n;
  //top red
  ret += `<path d="M ${86.6 * (n-1)} 50 l ${width} 0 l 0 -50 l -${width} 0 z" class='RedBorder' />`
  //bottom red
  ret += `<path d="M 0 ${150 * n} l ${width} 0 l 0 50 l -${width} 0 z" class='RedBorder' />`
  //blue (it's actually a giant 4-sided polygon)
  ret += `<path d="M 0 ${150 * n - 100} L ${86.6 * (n-1)} 50 l ${width} 100 l ${-86.6 * (n-1)} ${150 * (n-1)} z" class='BlueBorder' />`
  return ret;
}

function gen(n){
  var answer = `<svg width="50%" viewBox="0 0 ${86.6*(3*n-1)} ${150*n+50}" >`;     
  answer+=CreateBorders(n);
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      answer += CreateButton(i,j,n);
    }
  }
  answer += "</svg> </br> <button id='start' onclick=you_start()>Play second.</button>"
  document.getElementById('content').innerHTML = answer ;
}

function you_start(){
  document.getElementById('start').remove();
  turn = false;
  moves += 's';
  
  var response = make_move(moves).slice(0,-1);//I want to remove the last character because it's a line break
  moves += response;
  console.log(moves);
  document.getElementById(response).classList.remove("WhiteButton");
  document.getElementById(response).classList.add("BlueButton");
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