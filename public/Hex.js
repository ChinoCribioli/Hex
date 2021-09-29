function test(){
  // var style = ".WhiteButton:hover { background-color: violet;}";
  // document.getElementById("change-color").innerHTML = style;
  document.getElementById("w").classList.add("pressed");
}

function CreateButton(x,y){
  var ret = "<button class='WhiteButton' id='";
  ret += String(x) + "," + String(y) + "' onclick='test(";
  ret += String(x) + "," + String(y) + ")' ></button>";
  return ret;
}