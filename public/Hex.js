var even=0;
var moves = "";

function color(s){
  if(document.getElementById(s).className != "WhiteButton") return;
  moves += s;
  // document.getElementById(s).className = ((even++%2)?"BlueButton":"RedButton");
  // if(even%2){
  //   document.getElementById("content").classList.add("odd");
  // } else {
  //   document.getElementById("content").classList.remove("odd");
  // }
  document.getElementById(s).className = "RedButton";
  
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function() {
    var response = this.responseText.slice(0,-1);
    console.log(response);
    moves += response;
    document.getElementById(response).className = "BlueButton";
    console.log(moves);
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
}

gen(2);