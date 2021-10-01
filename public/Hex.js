var even=0;
var moves = "";

function color(s){
  if(moves.length == 0) document.getElementById('start').remove();
  if(document.getElementById(s).className != "WhiteButton") return;
  moves += s;
  document.getElementById(s).className = "RedButton";
  
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
  });//aca es donde se escribe la funcion que colorea los botones con "this.responseText"
  oReq.open("GET","http://localhost:3000/algo/" + moves);
  oReq.send();

}

function CreateButton(x,y){
  var ret = "<button class='WhiteButton' id='x";
  ret += String(x) + "y" + String(y) + "' onclick='color(\"x";
  ret += String(x) + "y" + String(y) + "\")' ></button>\n";
  return ret;
}

function gen(n){ //
  var answer = ""
  for(var i=0;i<n;i++){
    for(var counter=0;counter<3*(n-1-i);counter++)answer += "&nbsp;";
    for(var j=0;j<n;j++){
      answer += CreateButton(i,j);
    }
    answer += "<br/>"
  }
  document.getElementById('content').innerHTML = answer ;
  document.getElementById('content').innerHTML += "</br> <button id='start' onclick=you_start()>Play second.</button>"
}

function you_start(){
  document.getElementById('start').remove();
  moves += 's';
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function() {
    var response = this.responseText.slice(0,-1);//I want to remove the last character because it's a line break
    moves += response;
    console.log(moves);
    // if(response[response.length-1] == 'w'){
    //   response = response.slice(0,-1);
    //   document.getElementById(response).className = "BlueButton";
    //   document.getElementById('content').innerHTML += "</br>Haha, you lost!";
    //   return;
    // }
    document.getElementById(response).className = "BlueButton";
  });//aca es donde se escribe la funcion que colorea los botones con "this.responseText"
  oReq.open("GET","http://localhost:3000/algo/" + moves);
  oReq.send();

}

gen(4);