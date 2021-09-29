var even=0;

function test(s){
  // var style = ".WhiteButton:hover { background-color: violet;}";
  // document.getElementById("change-color").innerHTML = style;
  
  document.getElementById(s).classList.add((even++%2)?"BlueButton":"RedButton");
}

function CreateButton(x,y){
  var ret = "<button class='WhiteButton' id='x";
  ret += String(x) + "y" + String(y) + "' onclick='test(\"x";
  ret += String(x) + "y" + String(y) + "\")' ></button>\n";
  return ret;
}

function gen(n){
  var answer = ""
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      answer += CreateButton(i,j);
    }
    answer += "<br/>"
  }
  document.getElementById('content').innerHTML = answer ;
}

gen(6);