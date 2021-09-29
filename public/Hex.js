function test(){
  // var style = ".WhiteButton:hover { background-color: violet;}";
  // document.getElementById("change-color").innerHTML = style;
  document.getElementById("w").classList.add("pressed");
}

function CreateButton(x,y){
  var ret = "<button class='WhiteButton' id='";
  ret += String(x) + "," + String(y) + "' onclick='test(";
  ret += String(x) + "," + String(y) + ")' ></button>\n";
  return ret;
}

function gen(n){
  var answer = ""
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      answer += CreateButton(i,j);
    }
    answer += "<br></br>"
  }
  document.getElementById('content').innerHTML = answer ;
}

gen(6);